"use client";
import {
  IconButton,
  Badge,
  Popover,
  List,
  ListItem,
  ListItemText,
  Typography,
  Box,
} from "@mui/material";
import { useState, useEffect } from "react";
import NotificationsIcon from "@mui/icons-material/Notifications";

type Notification = {
  id: string;
  message: string;
};

export default function NotificationsBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const fetchNotifications = async () => {
    const res = await fetch("/api/notifications");
    if (res.ok) {
      setNotifications(await res.json());
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    if (notifications.length > 0) {
      fetch("/api/notifications", { method: "PATCH" });
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
    setNotifications([]); 
  };

  const open = Boolean(anchorEl);
  const id = open ? "notifications-popover" : undefined;

  return (
    <div>
      <IconButton color="inherit" onClick={handleClick}>
        <Badge badgeContent={notifications.length} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        disableScrollLock
      >
        <Box sx={{ width: 300 }}>
          {notifications.length > 0 ? (
            <List dense>
              {notifications.map((notif) => (
                <ListItem key={notif.id}>
                  <ListItemText primary={notif.message} />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography sx={{ p: 2 }}>Brak nowych powiadomień.</Typography>
          )}
        </Box>
      </Popover>
    </div>
  );
}
