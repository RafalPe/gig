"use client";
import * as React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import NextAppDirEmotionCacheProvider from "./EmotionCache";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#758BFD",
    },
    secondary: {
      main: "#FF8600",
    },
    background: {
      default: "#F1F2F6",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#27187E",
      secondary: "#6c757d",
    },
    divider: "#AEB8FE",
  },
  typography: {
    fontFamily: inter.style.fontFamily,
    h1: { fontWeight: 700, color: "#27187E" },
    h2: { fontWeight: 700, color: "#27187E" },
    h3: { fontWeight: 700, color: "#27187E" },
    h4: { fontWeight: 600, color: "#27187E" },
    h5: { fontWeight: 600, color: "#27187E" },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: "1px solid #E0E0E0",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#27187E",
          color: "#FFFFFF",
        },
      },
    },
  },
});

export default function ThemeRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NextAppDirEmotionCacheProvider options={{ key: "mui" }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </NextAppDirEmotionCacheProvider>
  );
}
