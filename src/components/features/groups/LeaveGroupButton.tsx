'use client';
import { useLeaveGroupMutation } from '@/lib/redux/groupsApi';
import { Button } from '@mui/material';
export default function LeaveGroupButton({
  groupId,
  userId,
  eventId,
}: {
  groupId: string;
  userId: string;
  eventId: string;
}) {
  const [leaveGroup, { isLoading }] = useLeaveGroupMutation();

  const handleLeave = () => {
    leaveGroup({ groupId, eventId, userId });
  };

  return (
    <Button size="small" variant="outlined" color="error" onClick={handleLeave} disabled={isLoading}>
      {isLoading ? 'Opuszczanie...' : 'Opuść'}
    </Button>
  );
}