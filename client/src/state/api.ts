import { fetchAuthSession, getCurrentUser } from 'aws-amplify/auth';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { insertNewUser } from '@/lib/handlers';
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
          const userRole = idToken?.payload['custom:role'] as string;
          const endpoint =
            userRole === 'manager'
              ? `/managers/${user.userId}`
              : `/tenants/${user.userId}`;
          let userDetailsResponse = await fetchWithBQ(endpoint);

          // if user doesn't exist, create a new user
          if (
            userDetailsResponse.error &&
            userDetailsResponse.error.status === 404
          ) {
            userDetailsResponse = await insertNewUser(
              user,
              userRole,
              fetchWithBQ
            );
          }

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
    updateTenantSettings: build.mutation<
      Tenant,
      { cognitoId: string } & Partial<Tenant>
    >({
      query: ({ cognitoId, ...updatedTenant }) => ({
        url: `/tenants/${cognitoId}`,
        method: 'PUT',
        body: updatedTenant,
      }),
      invalidatesTags: (result) => [
        { type: 'Tenant' as never, id: result?.id },
      ],
    }),
    updateManagerSettings: build.mutation<
      Manager,
      { cognitoId: string } & Partial<Manager>
    >({
      query: ({ cognitoId, ...updatedManager }) => ({
        url: `/managers/${cognitoId}`,
        method: 'PUT',
        body: updatedManager,
      }),
      invalidatesTags: (result) => [
        { type: 'Manager' as never, id: result?.id },
      ],
    }),
  }),
});

export const {
  useGetAuthUserQuery,
  useUpdateTenantSettingsMutation,
  useUpdateManagerSettingsMutation,
} = api;
