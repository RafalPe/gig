import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { DashboardData } from "@/types";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Dashboard"],
  endpoints: (builder) => ({
    getUserDashboard: builder.query<DashboardData, void>({
      query: () => "user/dashboard",
      providesTags: ["Dashboard"],
    }),

    updateUser: builder.mutation<void, { name: string; image?: string }>({
      query: (body) => ({
        url: "user",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Dashboard"],
    }),
    deleteEvent: builder.mutation<void, string>({
      query: (id) => ({
        url: `events/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Dashboard"],
    }),
  }),
});

export const { useGetUserDashboardQuery, useUpdateUserMutation, useDeleteEventMutation } = userApi;