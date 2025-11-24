"use client";

import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Avatar,
  Paper,
  Alert,
  AlertTitle,
} from "@mui/material";
import toast from "react-hot-toast";
import { useUpdateUserMutation } from "@/lib/redux/userApi";
import { useSession } from "next-auth/react";
import InfoIcon from "@mui/icons-material/Info";

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
        {/* Sekcja Podglądu */}
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

        <Box>
          <TextField
            label="Link do Avatara (URL)"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            fullWidth
            placeholder="https://images.unsplash.com/photo-..."
            helperText={
              <Box component="span" sx={{ display: "block", mt: 0.5 }}>
                <strong>Wskazówka:</strong> Aby zdjęcie zadziałało, wejdź na
                Unsplash, kliknij na zdjęcie
                <strong> Prawym Przyciskiem Myszki</strong> i wybierz opcję{" "}
                <em>&quot;Kopiuj adres grafiki&quot;</em> (Copy Image Address).
                Link powinien kończyć się na .jpg, .png lub zawierać parametry
                obrazu.
              </Box>
            }
          />

          {/* Informacja o statusie funkcjonalności */}
          <Alert
            severity="info"
            variant="outlined"
            icon={<InfoIcon />}
            sx={{ mt: 2 }}
          >
            <AlertTitle>Informacja o przesyłaniu plików</AlertTitle>
            Obecnie wspieramy tylko linki zewnętrzne (zalecamy{" "}
            <strong>Unsplash</strong>).
            <br />
            Funkcja bezpośredniego przesyłania plików z komputera (Upload) jest
            w trakcie prac i zostanie dodana wkrótce.
          </Alert>
        </Box>

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
