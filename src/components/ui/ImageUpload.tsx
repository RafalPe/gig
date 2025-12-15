"use client";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
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
      alert("Proszę wybrać plik obrazkowy");
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
    <Box sx={{ mb: 2 }}>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        {label}
      </Typography>

      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        {value ? (
          <Box
            sx={{
              position: "relative",
              width: 100,
              height: 100,
              borderRadius: 2,
              overflow: "hidden",
              border: "1px solid #ddd",
            }}
          >
            <Image
              src={value}
              alt="Podgląd"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </Box>
        ) : (
          <Box
            sx={{
              width: 100,
              height: 100,
              bgcolor: "grey.100",
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography variant="caption" color="text.secondary">
              Brak zdjęcia
            </Typography>
          </Box>
        )}

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Button
            component="label"
            variant="outlined"
            startIcon={
              isUploading ? <CircularProgress size={20} /> : <CloudUploadIcon />
            }
            disabled={isUploading}
          >
            {isUploading ? "Przesyłanie..." : "Wybierz plik"}
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleFileChange}
            />
          </Button>

          {value && (
            <Button
              size="small"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => onChange("")}
              disabled={isUploading}
            >
              Usuń zdjęcie
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
}
