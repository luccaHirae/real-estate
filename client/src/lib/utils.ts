import { clsx, type ClassValue } from 'clsx';
import { toast } from 'sonner';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function cleanParams(params: Record<string, any>) {
  return Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) =>
        value !== undefined &&
        value !== 'any' &&
        value !== '' &&
        (Array.isArray(value) ? value.some((v) => v !== null) : value !== null)
    )
  );
}

export function formatPriceValue(value: number | null, isMin: boolean) {
  if (value === null || value === 0)
    return isMin ? 'Any Min Price' : 'Any Max Price';

  if (value >= 1000) {
    const kValue = value / 1000;
    return isMin ? `$${kValue}K+` : `<$${kValue}K`;
  }

  return isMin ? `$${value}+` : `<$${value}`;
}

export function formatEnumString(str: string) {
  return str.replace(/([A-Z])/g, ' $1').trim();
}

type MutationMessages = {
  success?: string;
  error?: string;
};

export async function withToast<T>(
  mutation: Promise<T>,
  messages: Partial<MutationMessages>
) {
  const { success, error } = messages;

  try {
    const result = await mutation;
    if (success) toast.success(success);
    return result;
  } catch (err) {
    if (error) toast.error(error);
    throw err;
  }
}
