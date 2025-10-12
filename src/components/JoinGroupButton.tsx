"use client";

import { Button } from "@mui/material";
import { useRouter } from "next/navigation";

export default function JoinGroupButton({ groupId }: { groupId: string }) {
  const router = useRouter();

  const handleJoin = async () => {
    const response = await fetch(`/api/groups/${groupId}/join`, {
      method: "POST",
    });

    if (response.ok) {
      router.refresh();
    } else {
      alert("Nie udało się dołączyć do ekipy. Spróbuj ponownie.");
    }
  };

  return (
    <Button size="small" variant="outlined" onClick={handleJoin}>
      Dołącz
    </Button>
  );
}
