'use client';
import { Button } from '@mui/material';
import { useJoinGroupMutation } from '@/lib/redux/groupsApi';

export default function JoinGroupButton({
  groupId,
  userId,
  eventId,
}: {
  groupId: string;
  userId: string;
  eventId: string;
}) {
  const [joinGroup, { isLoading }] = useJoinGroupMutation();

  const handleJoin = () => {
    joinGroup({ groupId, eventId, userId });
  };

  return (
    <Button size="small" variant="outlined" onClick={handleJoin} disabled={isLoading}>
      {isLoading ? 'Dołączanie...' : 'Dołącz'}
    </Button>
  );
}