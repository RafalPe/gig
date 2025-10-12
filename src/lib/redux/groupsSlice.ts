import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type { GroupWithMembers } from "@/types";

export const joinGroup = createAsyncThunk(
  "groups/joinGroup",
  async ({ groupId, userId }: { groupId: string; userId: string }) => {
    const response = await fetch(`/api/groups/${groupId}/join`, {
      method: "POST",
    });
    if (!response.ok) {
      throw new Error("Failed to join group");
    }
    return { groupId, userId };
  }
);

export const leaveGroup = createAsyncThunk(
  "groups/leaveGroup",
  async ({ groupId, userId }: { groupId: string; userId: string }) => {
    const response = await fetch(`/api/groups/${groupId}/leave`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Failed to leave group");
    }
    return { groupId, userId };
  }
);

interface GroupsState {
  groups: GroupWithMembers[];
  status: "idle" | "loading" | "succeeded" | "failed";
}

const initialState: GroupsState = {
  groups: [],
  status: "idle",
};

const groupsSlice = createSlice({
  name: "groups",
  initialState,
  reducers: {
    setGroups: (state, action: PayloadAction<GroupWithMembers[]>) => {
      state.groups = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(joinGroup.pending, (state, action) => {
        const { groupId, userId } = action.meta.arg;
        const group = state.groups.find((g) => g.id === groupId);
        if (group) {
          group.members.push({
            user: { id: userId, name: "...", image: null },
          });
        }
      })
      .addCase(joinGroup.rejected, (state, action) => {
        const { groupId, userId } = action.meta.arg;
        const group = state.groups.find((g) => g.id === groupId);
        if (group) {
          group.members = group.members.filter((m) => m.user.id !== userId);
        }
      })
      .addCase(leaveGroup.pending, (state, action) => {
        const { groupId, userId } = action.meta.arg;
        const group = state.groups.find((g) => g.id === groupId);
        if (group) {
          group.members = group.members.filter((m) => m.user.id !== userId);
        }
      });
  },
});

export const { setGroups } = groupsSlice.actions;
export default groupsSlice.reducer;
