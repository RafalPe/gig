"use client";
import { useDebounce } from "@/hooks/useDebounce";
import {
  Paper,
  InputBase,
  IconButton,
  List,
  ListItemButton,
  Box,
  Typography,
  CircularProgress,
  ClickAwayListener,
  Divider,
  Avatar,
  ListItemAvatar,
} from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import EventIcon from "@mui/icons-material/Event";
import SearchIcon from "@mui/icons-material/Search";
import Image from 'next/image';

type SearchResult = {
  id: string;
  name: string;
  artist: string;
  date: string;
  location: string;
  imageUrl: string | null;
};

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams.get("search") || "");
  const debouncedQuery = useDebounce(query, 300);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchResults = async () => {
      if (debouncedQuery.length < 2) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const res = await fetch(
          `/api/events/search?q=${encodeURIComponent(debouncedQuery)}`
        );
        if (res.ok) {
          const data = await res.json();
          setResults(data);
          setShowSuggestions(true);
        }
      } catch (error) {
        console.error("Błąd wyszukiwania:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [debouncedQuery]);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    setShowSuggestions(false);
    router.push(`/?search=${encodeURIComponent(query)}`);
  };

  const handleResultClick = (eventId: string) => {
    setShowSuggestions(false);
    router.push(`/events/${eventId}`);
  };

  return (
    <ClickAwayListener onClickAway={() => setShowSuggestions(false)}>
      <Box
        sx={{ position: "relative", width: "100%", mb: 4 }}
        ref={containerRef}
      >
        <Paper
          component="form"
          onSubmit={handleSearchSubmit}
          sx={{
            p: "2px 4px",
            display: "flex",
            alignItems: "center",
            width: "100%",
            zIndex: 2,
            position: "relative",
          }}
        >
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Szukaj wydarzeń (np. artysta, miasto...)"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (e.target.value.length === 0) setShowSuggestions(false);
            }}
            onFocus={() => {
              if (results.length > 0) setShowSuggestions(true);
            }}
          />
          <IconButton type="submit" sx={{ p: "10px" }} aria-label="search">
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              <SearchIcon />
            )}
          </IconButton>
        </Paper>

        {showSuggestions && results.length > 0 && (
          <Paper
            sx={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              mt: 1,
              zIndex: 10,
              maxHeight: 400,
              overflowY: "auto",
              boxShadow: 6,
            }}
          >
            <List disablePadding>
              {results.map((event) => (
                <ListItemButton
                  key={event.id}
                  onClick={() => handleResultClick(event.id)}
                  sx={{ py: 1.5 }}
                >
                  <ListItemAvatar>
                    {event.imageUrl ? (
                      <Box
                        sx={{
                          position: "relative",
                          width: 40,
                          height: 40,
                          borderRadius: 1,
                          overflow: "hidden",
                          mr: 2,
                          flexShrink: 0,
                        }}
                      >
                        <Image
                          src={event.imageUrl}
                          alt={event.name}
                          fill
                          sizes="40px"
                          style={{ objectFit: "cover" }}
                        />
                      </Box>
                    ) : (
                      <Avatar
                        sx={{
                          width: 40,
                          height: 40,
                          mr: 2,
                          bgcolor: "primary.light",
                        }}
                      >
                        <EventIcon sx={{ color: "white" }} />
                      </Avatar>
                    )}
                  </ListItemAvatar>

                  <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                    <Typography variant="body1" fontWeight="medium" noWrap>
                      {event.name}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      noWrap
                      display="block"
                    >
                      {event.artist} •{" "} {event.location} •{" "}
                      {new Date(event.date).toLocaleDateString("pl-PL")}
                    </Typography>
                  </Box>
                </ListItemButton>
              ))}

              <Divider />

              <ListItemButton
                onClick={() => handleSearchSubmit()}
                sx={{ justifyContent: "center", py: 2 }}
              >
                <Typography variant="body2" color="primary" fontWeight="bold">
                  Pokaż wszystkie wyniki dla {query}
                </Typography>
              </ListItemButton>
            </List>
          </Paper>
        )}
      </Box>
    </ClickAwayListener>
  );
}
