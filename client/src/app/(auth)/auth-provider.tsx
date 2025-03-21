import React from 'react';
import { Amplify } from 'aws-amplify';
import {
  Authenticator,
  Heading,
  Radio,
  RadioGroupField,
  useAuthenticator,
  View,
} from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_AWS_COGNITO_USER_POOL_ID!,
      userPoolClientId:
        process.env.NEXT_PUBLIC_AWS_COGNITO_USER_POOL_CLIENT_ID!,
    },
  },
});

const components = {
  Header() {
    return (
      <View className='mt-4 mb-7'>
        <Heading level={3} className='!text-2xl !font-bold'>
          RENT
          <span className='text-secondary-500 font-light hover:!text-primary-300'>
            IFUL
          </span>
        </Heading>

        <p className='text-muted-foreground mt-2'>
          <span className='font-bold'>Welcome!</span> Please sign in to
          continue.
        </p>
      </View>
    );
  },
  SignIn: {
    Footer() {
      const { toSignUp } = useAuthenticator();

      return (
        <View className='text-center mt-4'>
          <p className='text-muted-foreground'>
            Don&apos;t have an account?{' '}
            <button
              onClick={toSignUp}
              className='text-primary-500 hover:underline bg-transparent border-none p-0 cursor-pointer'
            >
              Sign up here
            </button>
          </p>
        </View>
      );
    },
  },
  SignUp: {
    FormFields() {
      const { validationErrors } = useAuthenticator();

      return (
        <>
          <Authenticator.SignUp.FormFields />

          <RadioGroupField
            legend='Role'
            name='custom:role'
            errorMessage={validationErrors?.['custom:role']}
            hasError={!!validationErrors?.['custom:role']}
            isRequired
          >
            <Radio value='tenant'>Tenant</Radio>
            <Radio value='manager'>Manager</Radio>
          </RadioGroupField>
        </>
      );
    },
    Footer() {
      const { toSignIn } = useAuthenticator();

      return (
        <View className='text-center mt-4'>
          <p className='text-muted-foreground'>
            Already have an account?{' '}
            <button
              onClick={toSignIn}
              className='text-primary-500 hover:underline bg-transparent border-none p-0 cursor-pointer'
            >
              Sign in
            </button>
          </p>
        </View>
      );
    },
  },
};

const formFields = {
  signIn: {
    username: {
      placeholder: 'Enter your email',
      label: 'Email',
      isRequired: true,
    },
    password: {
      placeholder: 'Enter your password',
      label: 'Password',
      isRequired: true,
    },
  },
  signUp: {
    username: {
      order: 1,
      placeholder: 'Choose a username',
      label: 'Username',
      isRequired: true,
    },
    email: {
      order: 2,
      placeholder: 'Enter your email address',
      label: 'Email',
      isRequired: true,
    },
    password: {
      order: 3,
      placeholder: 'Create a password',
      label: 'Password',
      isRequired: true,
    },
  },
};

export default function Auth({ children }: { children: React.ReactNode }) {
  return (
    <div className='h-full'>
      <Authenticator components={components} formFields={formFields}>
        {() => <>{children}</>}
      </Authenticator>
    </div>
  );
}
