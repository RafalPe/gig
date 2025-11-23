import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { GroupWithMembers } from '@/types';

export const groupsApi = createApi({
  reducerPath: 'groupsApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Groups'],

  endpoints: (builder) => ({
    getGroups: builder.query<GroupWithMembers[], string>({
      query: (eventId) => `events/${eventId}/groups`,
      providesTags: (result, error, eventId) => [{ type: 'Groups', id: eventId }],
    }),

    createGroup: builder.mutation<GroupWithMembers, { eventId: string; name: string; description: string }>({
      query: ({ eventId, name, description }) => ({
        url: `events/${eventId}/groups`,
        method: 'POST',
        body: { name, description },
      }),
      invalidatesTags: (result, error, { eventId }) => [{ type: 'Groups', id: eventId }],
    }),

    joinGroup: builder.mutation<void, { groupId: string; eventId: string; userId: string }>({
      query: ({ groupId }) => ({
        url: `groups/${groupId}/join`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, { eventId }) => [{ type: 'Groups', id: eventId }],
      async onQueryStarted({ groupId, eventId, userId }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          groupsApi.util.updateQueryData('getGroups', eventId, (draft) => {
            const group = draft.find((g) => g.id === groupId);
            if (group) {
              group.members.push({
                user: { id: userId, name: '...', image: null },
              });
            }
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),

    leaveGroup: builder.mutation<void, { groupId: string; eventId: string; userId: string }>({
      query: ({ groupId }) => ({
        url: `groups/${groupId}/leave`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { eventId }) => [{ type: 'Groups', id: eventId }],
      async onQueryStarted({ groupId, eventId, userId }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          groupsApi.util.updateQueryData('getGroups', eventId, (draft) => {
            const group = draft.find((g) => g.id === groupId);
            if (group) {
              group.members = group.members.filter((m) => m.user.id !== userId);
            }
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),

    deleteGroup: builder.mutation<void, { groupId: string; eventId: string }>({
      query: ({ groupId }) => ({
        url: `groups/${groupId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { eventId }) => [{ type: 'Groups', id: eventId }],
      async onQueryStarted({ groupId, eventId }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          groupsApi.util.updateQueryData('getGroups', eventId, (draft) => {
            const index = draft.findIndex((g) => g.id === groupId);
            if (index !== -1) {
              draft.splice(index, 1);
            }
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
  }),
});

export const {
  useGetGroupsQuery,
  useJoinGroupMutation,
  useLeaveGroupMutation,
  useDeleteGroupMutation,
  useCreateGroupMutation,
} = groupsApi;