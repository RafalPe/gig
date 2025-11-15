"use client";
import { useState, useEffect } from "react";
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

type Message = {
  id: string;
  content: string;
  createdAt: string;
  author: {
    name: string | null;
    image: string | null;
  };
};

export default function MessageBoard({ groupId }: { groupId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      const res = await fetch(`/api/groups/${groupId}/messages`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
      setIsLoading(false);
    };
    fetchMessages();
  }, [groupId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const res = await fetch(`/api/groups/${groupId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: newMessage }),
    });

    if (res.ok) {
      const newlyCreatedMessage = await res.json();
      setMessages([...messages, newlyCreatedMessage]);
      setNewMessage("");
    }
  };

  return (
    <Paper sx={{ p: 2, mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Tablica ekipy
      </Typography>
      <Box sx={{ maxHeight: 300, overflowY: "auto", mb: 2 }}>
        <List>
          {messages.map((msg) => (
            <ListItem key={msg.id}>
              <ListItemAvatar>
                <Avatar src={msg.author.image || undefined} />
              </ListItemAvatar>
              <ListItemText primary={msg.author.name} secondary={msg.content} />
            </ListItem>
          ))}
          {isLoading && <Typography>Ładowanie...</Typography>}
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
