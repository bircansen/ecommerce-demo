import { createContext, useState, useMemo } from "react";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";

export const ThemeContext = createContext();

export default function ThemeContextProvider({ children }) {
  const [mode, setMode] = useState("light");

  const theme = useMemo(() => {
    const basePalette = {
      primary: {
        main: mode === "light" ? "#00BFA6" : "#4DD0E1", // turkuaz ton
        contrastText: "#fff",
      },
      secondary: {
        main: mode === "light" ? "#1E88E5" : "#90CAF9",
      },
      background: {
        default: mode === "light" ? "#F9FAFB" : "#121212",
        paper: mode === "light" ? "#FFFFFF" : "#1E1E1E",
      },
      text: {
        primary: mode === "light" ? "#111827" : "#F3F4F6",
        secondary: mode === "light" ? "#6B7280" : "#A1A1AA",
      },
    };

    return createTheme({
      palette: {
        mode,
        ...basePalette,
      },
      typography: {
        fontFamily: "'Poppins', 'Roboto', sans-serif",
        h5: { fontWeight: 600 },
        button: { textTransform: "none", fontWeight: 600 },
      },
      shape: { borderRadius: 12 },
      components: {
        MuiCard: {
          styleOverrides: {
            root: {
              borderRadius: 12,
              boxShadow: mode === "light"
                ? "0 4px 14px rgba(0,0,0,0.06)"
                : "0 4px 16px rgba(0,0,0,0.4)",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow:
                  mode === "light"
                    ? "0 6px 18px rgba(0,0,0,0.08)"
                    : "0 6px 20px rgba(0,0,0,0.5)",
              },
            },
          },
        },
        MuiButton: {
          styleOverrides: {
            root: {
              borderRadius: 10,
              padding: "6px 16px",
              fontWeight: 600,
              transition: "all 0.2s ease",
              "&:hover": {
                transform: "scale(1.03)",
                boxShadow:
                  mode === "light"
                    ? "0 3px 10px rgba(0,0,0,0.1)"
                    : "0 3px 10px rgba(255,255,255,0.1)",
              },
            },
          },
        },
        MuiTextField: {
          styleOverrides: {
            root: {
              "& .MuiOutlinedInput-root": {
                borderRadius: 10,
                backgroundColor:
                  mode === "light" ? "#FFFFFF" : "#2A2A2A",
                "& fieldset": {
                  borderColor:
                    mode === "light" ? "#E5E7EB" : "#444",
                },
                "&:hover fieldset": {
                  borderColor:
                    mode === "light" ? "#00BFA6" : "#4DD0E1",
                },
              },
            },
          },
        },
      },
    });
  }, [mode]);

  const toggleMode = () => setMode((prev) => (prev === "dark" ? "light" : "dark"));

  return (
    <ThemeContext.Provider value={{ mode, toggleMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}
