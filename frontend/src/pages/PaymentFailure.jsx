// FailurePage.jsx
import React from "react";
import { Typography, Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function FailurePage() {
  const navigate = useNavigate();
  return (
    <Box sx={{ textAlign: "center", mt: 10 }}>
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 2 }}>
        Ödeme Başarısız
      </Typography>
      <Typography sx={{ mb: 3 }}>
        Ödeme işlemi gerçekleşmedi. Lütfen tekrar deneyin.
      </Typography>
      <Button variant="contained" onClick={() => navigate("/checkout")}>
        Tekrar Deneyin
      </Button>
    </Box>
  );
}