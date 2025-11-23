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
  }),
});

export const { useGetUserDashboardQuery } = userApi;
