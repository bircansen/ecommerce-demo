// src/App.jsx
import './App.css';
import HeaderDisplay from './components/HeaderDisplay';
import Router from './components/Router';
import Loading from './components/Loading';
import ThemeContextProvider from './context/ThemeContext';
import { AlertProvider } from "./context/AlertContext";
import { Box, useTheme } from '@mui/material';

function AppContent() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
        transition: 'background-color 0.3s ease, color 0.3s ease',
        pt: 10, // Navbar'dan boşluk (yaklaşık 80px)
        px: { xs: 1, sm: 2, md: 4 }, // responsive padding
        display: 'flex',
        flexDirection: 'column',
        alignItems: "stretch"
      }}
    >
      <HeaderDisplay />
      <Router />
      <Loading />
    </Box>
  );
}

function App() {
  return (
    <AlertProvider >
    <ThemeContextProvider>
      <AppContent />
    </ThemeContextProvider>
    </AlertProvider>
  );
}

export default App;

