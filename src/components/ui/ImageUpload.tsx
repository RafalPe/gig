"use client";
import {
  Box,
  Button,
  CircularProgress,
  Typography,
  IconButton,
} from "@mui/material";
import { useState } from "react";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import Image from "next/image";

type Props = {
  value: string;
  onChange: (url: string) => void;
  label?: string;
};

export default function ImageUpload({
  value,
  onChange,
  label = "Zdjęcie",
}: Props) {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Proszę wybrać plik obrazkowy (JPG, PNG, WEBP)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Plik jest za duży (maksymalnie 5MB)");
      return;
    }

    setIsUploading(true);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: file.name, contentType: file.type }),
      });

      if (!res.ok) throw new Error("Błąd generowania linku");

      const { uploadUrl, fileUrl } = await res.json();

      const uploadRes = await fetch(uploadUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });

      if (!uploadRes.ok) throw new Error("Błąd przesyłania do S3");

      onChange(fileUrl);
    } catch (error) {
      console.error(error);
      alert("Wystąpił błąd podczas przesyłania zdjęcia.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        {label}
      </Typography>

      <Box
        sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}
      >
        {value ? (
          <Box
            sx={{
              position: "relative",
              width: 120,
              height: 120,
              borderRadius: 2,
              overflow: "hidden",
              border: "1px solid #e0e0e0",
            }}
          >
            {/* POPRAWKA: Używamy 'fill' i 'sizes' dla poprawnej optymalizacji */}
            <Image
              src={value}
              alt="Podgląd"
              fill
              sizes="120px" // Podpowiadamy Next.js, że obrazek będzie mały
              style={{ objectFit: "cover" }}
            />

            <Box
              sx={{
                position: "absolute",
                top: 4,
                right: 4,
                bgcolor: "rgba(255,255,255,0.8)",
                borderRadius: "50%",
                zIndex: 10,
              }}
            >
              <IconButton
                size="small"
                color="error"
                onClick={() => onChange("")}
                disabled={isUploading}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        ) : (
          <Box
            sx={{
              width: 120,
              height: 120,
              bgcolor: "grey.100",
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px dashed #bdbdbd",
            }}
          >
            <Typography variant="caption" color="text.secondary">
              Brak zdjęcia
            </Typography>
          </Box>
        )}

        <Box>
          <Button
            component="label"
            variant="outlined"
            startIcon={
              isUploading ? <CircularProgress size={20} /> : <CloudUploadIcon />
            }
            disabled={isUploading}
            sx={{ textTransform: "none" }}
          >
            {isUploading ? "Przesyłanie..." : "Wybierz plik"}
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleFileChange}
            />
          </Button>
          <Typography
            variant="caption"
            display="block"
            color="text.secondary"
            sx={{ mt: 1 }}
          >
            JPG, PNG, WEBP (max 5MB)
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
