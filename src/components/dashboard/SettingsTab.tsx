"use client";
import { useUpdateUserMutation } from "@/lib/redux/userApi";
import {
  Box,
  TextField,
  Button,
  Typography,
  Avatar,
  Paper,
} from "@mui/material";
import { useSession } from "next-auth/react";
import { useState } from "react";
import ImageUpload from "@/components/ui/ImageUpload";
import toast from "react-hot-toast";

export default function SettingsTab() {
  const { data: session, update } = useSession();
  const [updateUser, { isLoading }] = useUpdateUserMutation();

  const [name, setName] = useState(session?.user?.name || "");
  const [image, setImage] = useState(session?.user?.image || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateUser({ name, image }).unwrap();
      await update({ name, image });
      toast.success("Profil zaktualizowany!");
    } catch {
      toast.error("Nie udało się zaktualizować profilu.");
    }
  };

  return (
    <Paper sx={{ p: 4, maxWidth: 700, mx: "auto" }}>
      <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
        Edytuj Profil
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: "flex", flexDirection: "column", gap: 3 }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 3, mb: 1 }}>
          <Avatar
            src={image}
            sx={{ width: 80, height: 80, border: "2px solid #E0E0E0" }}
          />
          <Box>
            <Typography variant="subtitle1" fontWeight="bold">
              Twoje zdjęcie profilowe
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Tak będą widzieć Cię inni w ekipach.
            </Typography>
          </Box>
        </Box>

        <TextField
          label="Twoje Imię"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          required
        />

        <ImageUpload
          value={image}
          onChange={setImage}
          label="Zdjęcie Profilowe"
        />

        <Button
          type="submit"
          variant="contained"
          disabled={isLoading}
          size="large"
          sx={{ mt: 1 }}
        >
          {isLoading ? "Zapisywanie..." : "Zapisz Zmiany"}
        </Button>
      </Box>
    </Paper>
  );
}
