import { fetchAuthSession, getCurrentUser } from 'aws-amplify/auth';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { insertNewUser } from '@/lib/handlers';
import { Manager, Property, Tenant } from '@/types/prisma';
import { cleanParams } from '@/lib/utils';
import { FiltersState } from '.';

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
  tagTypes: ['Tenant', 'Manager', 'Properties'],
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
      invalidatesTags: (result) => [{ type: 'Tenant', id: result?.id }],
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
      invalidatesTags: (result) => [{ type: 'Manager', id: result?.id }],
    }),
    // property endpoints
    getProperties: build.query<
      Property[],
      Partial<FiltersState & { favoriteIds?: number[] }>
    >({
      query: (filters) => {
        const params = cleanParams({
          location: filters.location,
          priceMin: filters.priceRange?.[0],
          priceMax: filters.priceRange?.[1],
          beds: filters.beds,
          baths: filters.baths,
          propertyType: filters.propertyType,
          squareFeetMin: filters.squareFeet?.[0],
          squareFeetMax: filters.squareFeet?.[1],
          amenities: filters.amenities?.join(','),
          latitude: filters.coordinates?.[1],
          longitude: filters.coordinates?.[0],
        });

        return {
          url: 'properties',
          params,
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Properties' as const, id })),
              { type: 'Properties', id: 'LIST' },
            ]
          : [{ type: 'Properties', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetAuthUserQuery,
  useUpdateTenantSettingsMutation,
  useUpdateManagerSettingsMutation,
  useGetPropertiesQuery,
} = api;
