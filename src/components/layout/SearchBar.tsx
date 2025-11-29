"use client";
import { Paper, InputBase, IconButton } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams.get("search") || "");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    router.push(`/?search=${query}`);
  };

  return (
    <Paper
      component="form"
      onSubmit={handleSearch}
      sx={{
        p: "2px 4px",
        display: "flex",
        alignItems: "center",
        width: "100%",
        mb: 4,
      }}
    >
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="Szukaj wydarzeń (np. artysta, miasto...)"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <IconButton type="submit" sx={{ p: "10px" }} aria-label="search">
        <SearchIcon />
      </IconButton>
    </Paper>
  );
}
