"use client";
import {
  Box,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Paper,
} from "@mui/material";
import { useState, useEffect, useRef } from "react";
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
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const fetchMessages = async () => {
      const res = await fetch(`/api/groups/${groupId}/messages`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
        setIsLoading(false);
        setTimeout(scrollToBottom, 100);
      }
    };
    fetchMessages();
  }, [groupId]);

  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
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
    if (!newMessage.trim()) return;

    const tempContent = newMessage;
    setNewMessage("");

    await fetch(`/api/groups/${groupId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: tempContent }),
    });
  };

  return (
    <Paper sx={{ p: 2, mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Tablica ekipy (Live Chat)
      </Typography>
      <Box
        sx={{
          maxHeight: 300,
          overflowY: "auto",
          mb: 2,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <List>
          {messages.map((msg) => (
            <Link
              href={`/profile/${msg.author.id}`}
              key={msg.id}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar src={msg.author.image || undefined} />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box
                      component="span"
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography variant="subtitle2" component="span">
                        {msg.author.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </Typography>
                    </Box>
                  }
                  secondary={msg.content}
                />
              </ListItem>
            </Link>
          ))}
          {isLoading && (
            <Typography sx={{ p: 2, textAlign: "center" }}>
              Ładowanie wiadomości...
            </Typography>
          )}
          <div ref={messagesEndRef} />
        </List>
      </Box>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex" }}>
        <TextField
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          label="Napisz wiadomość..."
          variant="outlined"
          size="small"
          fullWidth
        />
        <Button type="submit" variant="contained" sx={{ ml: 1 }}>
          Wyślij
        </Button>
      </Box>
    </Paper>
  );
}
