'use client';

import { registerPlugin } from 'filepond';
import { FilePond } from 'react-filepond';
import { Edit, Plus, X } from 'lucide-react';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import {
  Control,
  ControllerRenderProps,
  FieldValues,
  useFieldArray,
  useFormContext,
} from 'react-hook-form';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

registerPlugin(FilePondPluginImagePreview, FilePondPluginImageExifOrientation);

interface ExtendedFormFieldProps {
  name: string;
  label: string;
  type?:
    | 'text'
    | 'email'
    | 'textarea'
    | 'number'
    | 'select'
    | 'switch'
    | 'password'
    | 'file'
    | 'multi-input';
  placeholder?: string;
  options?: { value: string; label: string }[];
  accept?: string;
  className?: string;
  labelClassName?: string;
  inputClassName?: string;
  value?: string;
  disabled?: boolean;
  multiple?: boolean;
  isIcon?: boolean;
  initialValue?: string | number | boolean | string[];
}

export function ExtendedFormField({
  name,
  label,
  type = 'text',
  placeholder,
  options,
  className,
  labelClassName,
  inputClassName,
  disabled,
  isIcon,
  initialValue,
}: ExtendedFormFieldProps) {
  const { control } = useFormContext();

  const renderFormControl = (
    field: ControllerRenderProps<FieldValues, string>
  ) => {
    switch (type) {
      case 'textarea':
        return (
          <Textarea
            placeholder={placeholder}
            rows={3}
            className={cn('border-gray-200', inputClassName)}
            {...field}
          />
        );
      case 'select':
        return (
          <Select
            value={field.value || initialValue}
            defaultValue={field.value || initialValue}
            onValueChange={field.onChange}
          >
            <SelectTrigger
              className={cn('w-full border-gray-200 p-4', inputClassName)}
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>

            <SelectContent className='w-full border-gray-200 shadow'>
              {options?.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className='cursor-pointer hover:bg-gray-100 hover:text-customgreys-darkgrey'
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case 'switch':
        return (
          <div className='flex items-center space-x-2'>
            <Switch
              checked={field.value}
              onCheckedChange={field.onChange}
              id={name}
              className={cn('text-customgreys-darkgrey', inputClassName)}
            />

            <FormLabel htmlFor={name} className={labelClassName}>
              {label}
            </FormLabel>
          </div>
        );
      case 'file':
        return (
          <FilePond
            className={inputClassName}
            onupdatefiles={(fileItems) => {
              const files = fileItems.map((fileItem) => fileItem.file);
              field.onChange(files);
            }}
            allowMultiple
            credits={false}
            labelIdle='Drag & Drop your images or <span class="filepond--label-action">Browse</span>'
          />
        );
      case 'number':
        return (
          <Input
            type='number'
            placeholder={placeholder}
            className={cn('border-gray-200', inputClassName)}
            disabled={disabled}
            {...field}
          />
        );
      case 'multi-input':
        return (
          <MultiInputField
            name={name}
            control={control}
            placeholder={placeholder}
            inputClassName={inputClassName}
          />
        );
      default:
        return (
          <Input
            type={type}
            placeholder={placeholder}
            className={cn('border-gray-200 p-4', inputClassName)}
            disabled={disabled}
            {...field}
          />
        );
    }
  };

  return (
    <FormField
      control={control}
      name={name}
      defaultValue={initialValue}
      render={({ field }) => (
        <FormItem
          className={cn(
            'relative',
            type !== 'switch' && 'rounded-md',
            className
          )}
        >
          {type !== 'switch' && (
            <div className='flex justify-between items-center'>
              <FormLabel className={cn('text-sm', labelClassName)}>
                {label}
              </FormLabel>

              {!disabled &&
                isIcon &&
                type !== 'file' &&
                type !== 'multi-input' && (
                  <Edit className='size-4 text-customgreys-dirtygrey' />
                )}
            </div>
          )}

          <FormControl>
            {renderFormControl({
              ...field,
              value: field.value !== undefined ? field.value : initialValue,
            })}
          </FormControl>

          <FormMessage className='text-red-400' />
        </FormItem>
      )}
    />
  );
}

interface MultiInputFieldProps {
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<FieldValues, any>;
  placeholder?: string;
  inputClassName?: string;
}

export function MultiInputField({
  name,
  control,
  placeholder,
  inputClassName,
}: MultiInputFieldProps) {
  const { fields, append, remove } = useFieldArray({ control, name });

  return (
    <div className='space-y-1'>
      {fields.map((field, index) => (
        <div key={field.id} className='flex items-center space-x-2'>
          <FormField
            control={control}
            name={`${name}.${index}`}
            render={({ field }) => (
              <FormControl>
                <Input
                  placeholder={placeholder}
                  className={cn(
                    'flex-1 border-none bg-customgreys-darkgrey p-4',
                    inputClassName
                  )}
                  {...field}
                />
              </FormControl>
            )}
          />

          <Button
            type='button'
            onClick={remove.bind(null, index)}
            variant='ghost'
            size='icon'
            className='text-customgreys-dirtygrey'
          >
            <X className='size-4' />
            <span className='sr-only'>Remove</span>
          </Button>
        </div>
      ))}

      <Button
        type='button'
        onClick={() => append('')}
        variant='outline'
        size='sm'
        className='mt-2 text-customgreys-dirtygrey'
      >
        <Plus className='size-4 mr-2' />
        <span>Add Item</span>
      </Button>
    </div>
  );
}
