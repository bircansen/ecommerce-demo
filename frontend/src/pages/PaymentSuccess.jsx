// SuccessPage.jsx
import React from "react";
import { Typography, Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function SuccessPage() {
  const navigate = useNavigate();
  return (
    <Box sx={{ textAlign: "center", mt: 10 }}>
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 2 }}>
        Ödeme Başarılı!
      </Typography>
      <Typography sx={{ mb: 3 }}>Siparişiniz alınmıştır.</Typography>
      <Button variant="contained" onClick={() => navigate("/")}>
        Anasayfaya Dön
      </Button>
    </Box>
  );
}