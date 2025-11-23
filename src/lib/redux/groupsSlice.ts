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

export const deleteGroup = createAsyncThunk(
  "groups/deleteGroup",
  async (groupId: string) => {
    const response = await fetch(`/api/groups/${groupId}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Failed to delete group");
    }
    return { groupId };
  }
);

interface GroupsState {
  groups: GroupWithMembers[];
  pendingAction: { groupId: string; type: "join" | "leave" } | null;
}

const initialState: GroupsState = {
  groups: [],
  pendingAction: null,
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
        state.pendingAction = {
          groupId: action.meta.arg.groupId,
          type: "join",
        };
        const group = state.groups.find(
          (g) => g.id === action.meta.arg.groupId
        );
        if (group) {
          group.members.push({
            user: { id: action.meta.arg.userId, name: "...", image: null },
          });
        }
      })
      .addCase(joinGroup.fulfilled, (state) => {
        state.pendingAction = null;
      })
      .addCase(joinGroup.rejected, (state, action) => {
        state.pendingAction = null;
        const group = state.groups.find(
          (g) => g.id === action.meta.arg.groupId
        );
        if (group) {
          group.members = group.members.filter(
            (m) => m.user.id !== action.meta.arg.userId
          );
        }
      })
      .addCase(leaveGroup.pending, (state, action) => {
        state.pendingAction = {
          groupId: action.meta.arg.groupId,
          type: "leave",
        };
        const group = state.groups.find(
          (g) => g.id === action.meta.arg.groupId
        );
        if (group) {
          group.members = group.members.filter(
            (m) => m.user.id !== action.meta.arg.userId
          );
        }
      })
      .addCase(deleteGroup.pending, (state, action) => {
        state.groups = state.groups.filter((g) => g.id !== action.meta.arg);
      })
      .addCase(leaveGroup.fulfilled, (state) => {
        state.pendingAction = null;
      })
      .addCase(leaveGroup.rejected, (state, action) => {
        state.pendingAction = null;
        const group = state.groups.find(
          (g) => g.id === action.meta.arg.groupId
        );
        if (group) {
          group.members.push({
            user: { id: action.meta.arg.userId, name: "...", image: null },
          });
        }
      });
  },
});

export const { setGroups } = groupsSlice.actions;
export default groupsSlice.reducer;
