import {
  FetchArgs,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
  QueryReturnValue,
} from '@reduxjs/toolkit/query';
import { AuthUser } from 'aws-amplify/auth';

type MaybePromise<T> = T | PromiseLike<T>;

export const insertNewUser = async (
  user: AuthUser,
  userRole: string,
  fetchWithBQ: (
    arg: string | FetchArgs
  ) => MaybePromise<
    QueryReturnValue<unknown, FetchBaseQueryError, FetchBaseQueryMeta>
  >
) => {
  const createUserEndpoint =
    userRole.toLowerCase() === 'manager' ? '/managers' : '/tenants';

  const response = await fetchWithBQ({
    url: createUserEndpoint,
    method: 'POST',
    body: {
      cognitoId: user.userId,
      name: user.username,
      email: user.signInDetails?.loginId || '',
      phoneNumber: '',
    },
  });

  if (response.error) throw new Error('Failed to create user');

  return response;
};
