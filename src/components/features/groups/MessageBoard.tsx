'use client';
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Avatar,
  Paper,
  CircularProgress,
  Tooltip,
  Skeleton,
  Button,
} from '@mui/material';
import { useSession, signIn } from 'next-auth/react';
import { useState, useEffect, useRef } from 'react';
import LockIcon from '@mui/icons-material/Lock';
import SendIcon from '@mui/icons-material/Send';
import Link from 'next/link';
import Pusher from 'pusher-js';

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

// Dodajemy isMember do propsów
export default function MessageBoard({ 
  groupId, 
  isMember 
}: { 
  groupId: string; 
  isMember: boolean; 
}) {
  const { data: session, status } = useSession();
  const currentUserId = session?.user?.id;
  const isAuthenticated = status === 'authenticated';

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (!isAuthenticated) return;

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
        console.error('Failed to load messages', error);
        setIsLoading(false);
      }
    };
    fetchMessages();
  }, [groupId, isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const pusherKey = process.env.NEXT_PUBLIC_PUSHER_KEY;
    const pusherCluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;

    if (!pusherKey || !pusherCluster) return;

    const pusher = new Pusher(pusherKey, {
      cluster: pusherCluster,
    });

    const channel = pusher.subscribe(`group-chat-${groupId}`);

    channel.bind('new-message', (data: Message) => {
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
  }, [groupId, isAuthenticated]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isSending || !isMember) return; // Blokada wysyłania

    setIsSending(true);
    const tempContent = newMessage;
    setNewMessage('');

    try {
      await fetch(`/api/groups/${groupId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: tempContent }),
      });
    } catch (error) {
      console.error('Failed to send message', error);
      setNewMessage(tempContent);
    } finally {
      setIsSending(false);
    }
  };

  if (!isAuthenticated && status !== 'loading') {
    return (
      <Paper 
        elevation={0} 
        sx={{ 
          p: 2, 
          mt: 2, 
          border: '1px solid', 
          borderColor: 'divider', 
          borderRadius: 3,
          bgcolor: 'white',
          position: 'relative',
          overflow: 'hidden',
          height: 380,
        }}
      >
        <Typography variant="subtitle2" gutterBottom sx={{ mb: 2, fontWeight: 600, color: 'text.secondary' }}>
          Czat ekipy
        </Typography>

        <Box sx={{ filter: 'blur(6px)', opacity: 0.5, userSelect: 'none', pointerEvents: 'none' }}>
           {[1, 2, 3, 4].map((i) => (
             <Box key={i} sx={{ display: 'flex', gap: 1.5, mb: 3 }}>
                <Skeleton variant="circular" width={32} height={32} />
                <Box sx={{ width: '70%' }}>
                   <Skeleton variant="text" width="30%" height={20} />
                   <Skeleton variant="rounded" width="100%" height={40} />
                </Box>
             </Box>
           ))}
        </Box>

        <Box
          sx={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            bgcolor: 'rgba(255, 255, 255, 0.4)',
            zIndex: 10,
          }}
        >
            <Paper elevation={3} sx={{ p: 4, textAlign: 'center', borderRadius: 4, bgcolor: 'rgba(255,255,255,0.95)' }}>
                <LockIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Czat jest zablokowany
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Zaloguj się i dołącz do ekipy, aby zobaczyć wiadomości.
                </Typography>
                <Button variant="contained" onClick={() => signIn('github')} sx={{ borderRadius: 2 }}>
                    Zaloguj się
                </Button>
            </Paper>
        </Box>
      </Paper>
    );
  }

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        p: 2, 
        mt: 2, 
        border: '1px solid', 
        borderColor: 'divider', 
        borderRadius: 3,
        bgcolor: 'white'
      }}
    >
      <Typography variant="subtitle2" gutterBottom sx={{ mb: 2, fontWeight: 600, color: 'text.secondary' }}>
        Czat ekipy
      </Typography>

      <Box sx={{ 
        height: 300, 
        overflowY: 'auto', 
        mb: 2, 
        display: 'flex', 
        flexDirection: 'column',
        gap: 2,
        pr: 1
      }}>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <CircularProgress size={24} />
          </Box>
        ) : messages.length === 0 ? (
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 4 }}>
            Brak wiadomości. Napisz coś pierwszy!
          </Typography>
        ) : (
          messages.map((msg) => {
            const isMe = msg.author.id === currentUserId;

            return (
              <Box
                key={msg.id}
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 1.5,
                  bgcolor: isMe ? 'action.hover' : 'transparent',
                  p: 1,
                  borderRadius: 2,
                  transition: 'background-color 0.2s',
                  '&:hover': { bgcolor: 'action.hover' }
                }}
              >
                <Link href={`/profile/${msg.author.id}`}>
                  <Tooltip title={msg.author.name || 'Użytkownik'}>
                    <Avatar 
                      src={msg.author.image || undefined} 
                      sx={{ width: 32, height: 32, cursor: 'pointer' }} 
                    />
                  </Tooltip>
                </Link>

                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                  <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 0.5 }}>
                    <Typography 
                        variant="subtitle2" 
                        component={Link} 
                        href={`/profile/${msg.author.id}`}
                        sx={{ 
                            fontWeight: 'bold', 
                            color: 'text.primary', 
                            textDecoration: 'none',
                            '&:hover': { textDecoration: 'underline' }
                        }}
                    >
                      {msg.author.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', color: 'text.primary' }}>
                    {msg.content}
                  </Typography>
                </Box>
              </Box>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </Box>

      {/* Pole tekstowe - zablokowane dla osób niebędących w grupie */}
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', gap: 1 }}>
        <TextField
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder={isMember ? "Napisz wiadomość..." : "Dołącz do grupy, aby pisać..."} // Zmienny placeholder
          variant="outlined"
          size="small"
          fullWidth
          disabled={isSending || !isMember} // Blokada inputa
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 3,
              bgcolor: isMember ? 'white' : 'action.hover'
            }
          }}
        />
        <IconButton 
          type="submit" 
          color="primary" 
          disabled={!newMessage.trim() || isSending || !isMember} // Blokada przycisku
          sx={{ 
            bgcolor: 'primary.main', 
            color: 'white',
            '&:hover': { bgcolor: 'primary.dark' },
            '&.Mui-disabled': { bgcolor: 'action.disabledBackground' }
          }}
        >
          {isSending ? <CircularProgress size={24} color="inherit" /> : <SendIcon />}
        </IconButton>
      </Box>
    </Paper>
  );
}