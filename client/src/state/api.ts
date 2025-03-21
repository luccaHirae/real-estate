import { fetchAuthSession, getCurrentUser } from 'aws-amplify/auth';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Manager, Tenant } from '@/types/prisma';

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    prepareHeaders: async (headers) => {
      const session = await fetchAuthSession();
      const { idToken } = session.tokens || {};

      if (idToken) {
        headers.set('Authorization', `Bearer ${idToken}`);
      }

      return headers;
    },
  }),
  reducerPath: 'api',
  tagTypes: [],
  endpoints: (build) => ({
    getAuthUser: build.query<User, void>({
      queryFn: async (_, _queryApi, _extraOptions, fetchWithBQ) => {
        try {
          const session = await fetchAuthSession();
          const { idToken } = session.tokens || {};
          const user = await getCurrentUser();
          const userRole = idToken?.payload['custom:role'];
          const endpoint =
            userRole === 'manager'
              ? `/managers/${user.userId}`
              : `/tenants/${user.userId}`;
          const userDetailsResponse = await fetchWithBQ(endpoint);

          // TODO: if user doesn't exist, create a new user

          return {
            data: {
              cognitoInfo: user,
              userInfo: userDetailsResponse.data as Tenant | Manager,
              userRole: userRole,
            },
          };
        } catch (error) {
          return {
            error: {
              error:
                error instanceof Error
                  ? error.message
                  : 'Could not fetch user data',
              status: 500,
              data: null,
            },
          };
        }
      },
    }),
  }),
});

export const {} = api;
