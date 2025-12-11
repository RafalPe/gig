"use client";
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Avatar,
  Paper,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import { useSession } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import SendIcon from "@mui/icons-material/Send";
import Link from "next/link";
import Pusher from "pusher-js";

type Message = {
  id: string;
  content: string;
  createdAt: string;
  author: {
    id: string;
    name: string | null;
    image: string | null;
  };
};

export default function MessageBoard({ groupId }: { groupId: string }) {
  const { data: session } = useSession();
  const currentUserId = session?.user?.id;

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/groups/${groupId}/messages`);
        if (res.ok) {
          const data = await res.json();
          setMessages(data);
          setIsLoading(false);
          setTimeout(scrollToBottom, 100);
        }
      } catch (error) {
        console.error("Failed to load messages", error);
        setIsLoading(false);
      }
    };
    fetchMessages();
  }, [groupId]);

  useEffect(() => {
    const pusherKey = process.env.NEXT_PUBLIC_PUSHER_KEY;
    const pusherCluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;

    if (!pusherKey || !pusherCluster) return;

    const pusher = new Pusher(pusherKey, {
      cluster: pusherCluster,
    });

    const channel = pusher.subscribe(`group-chat-${groupId}`);

    channel.bind("new-message", (data: Message) => {
      setMessages((prev) => {
        if (prev.find((m) => m.id === data.id)) return prev;
        return [...prev, data];
      });
      setTimeout(scrollToBottom, 100);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [groupId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isSending) return;

    setIsSending(true);
    const tempContent = newMessage;
    setNewMessage("");

    try {
      await fetch(`/api/groups/${groupId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: tempContent }),
      });
    } catch (error) {
      console.error("Failed to send message", error);
      setNewMessage(tempContent);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        mt: 2,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 3,
        bgcolor: "white",
      }}
    >
      <Typography
        variant="subtitle2"
        gutterBottom
        sx={{ mb: 2, fontWeight: 600, color: "text.secondary" }}
      >
        Czat ekipy
      </Typography>

      <Box
        sx={{
          height: 300,
          overflowY: "auto",
          mb: 2,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          pr: 1,
        }}
      >
        {isLoading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <CircularProgress size={24} />
          </Box>
        ) : messages.length === 0 ? (
          <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            sx={{ mt: 4 }}
          >
            Brak wiadomości. Napisz coś pierwszy!
          </Typography>
        ) : (
          messages.map((msg) => {
            const isMe = msg.author.id === currentUserId;

            return (
              <Box
                key={msg.id}
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 1.5,
                  bgcolor: isMe ? "action.hover" : "transparent",
                  p: 1,
                  borderRadius: 2,
                  transition: "background-color 0.2s",
                  "&:hover": {
                    bgcolor: "action.hover",
                  },
                }}
              >
                <Link href={`/profile/${msg.author.id}`}>
                  <Tooltip title={msg.author.name || "Użytkownik"}>
                    <Avatar
                      src={msg.author.image || undefined}
                      sx={{ width: 32, height: 32, cursor: "pointer" }}
                    />
                  </Tooltip>
                </Link>

                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "baseline",
                      gap: 1,
                      mb: 0.5,
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      component={Link}
                      href={`/profile/${msg.author.id}`}
                      sx={{
                        fontWeight: "bold",
                        color: "text.primary",
                        textDecoration: "none",
                        "&:hover": { textDecoration: "underline" },
                      }}
                    >
                      {msg.author.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Typography>
                  </Box>

                  <Typography
                    variant="body2"
                    sx={{
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                      color: "text.primary",
                    }}
                  >
                    {msg.content}
                  </Typography>
                </Box>
              </Box>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </Box>

      {/* Pole tekstowe */}
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: "flex", gap: 1 }}
      >
        <TextField
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Napisz wiadomość..."
          variant="outlined"
          size="small"
          fullWidth
          disabled={isSending}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 3,
              bgcolor: "white",
            },
          }}
        />
        <IconButton
          type="submit"
          color="primary"
          disabled={!newMessage.trim() || isSending}
          sx={{
            bgcolor: "primary.main",
            color: "white",
            "&:hover": { bgcolor: "primary.dark" },
            "&.Mui-disabled": { bgcolor: "action.disabledBackground" },
          }}
        >
          {isSending ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            <SendIcon />
          )}
        </IconButton>
      </Box>
    </Paper>
  );
}
