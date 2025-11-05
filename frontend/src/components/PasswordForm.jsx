import { useState } from "react";
import { updatePassword } from "../authApi";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import KeyIcon from "@mui/icons-material/Key";
import { useAlert } from "../context/AlertContext";
import { useTheme } from "@mui/material/styles";

export default function PasswordForm() {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
  });

  const { showAlert } = useAlert();
  const theme = useTheme();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await updatePassword(formData);
      showAlert(res.data.message || "Şifre başarıyla güncellendi!", "success");
      setFormData({ currentPassword: "", newPassword: "" });
    } catch (err) {
      showAlert(err.response?.data?.message || "Bir hata oluştu", "error");
    }
  };

  return (
<Box
  sx={{
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor:
      theme.palette.mode === "dark" ? "#121212" : "#f5f6fa",
    p: 2,
  }}
>
  <Paper
    elevation={4}
    sx={{
      p: 4,
      width: "100%",
      maxWidth: 420,
      borderRadius: 3,
      backgroundColor:
        theme.palette.mode === "dark" ? "#1e1e1e" : "#fff",
      color: theme.palette.text.primary,
    }}
  >

        <Typography
          variant="h5"
          component="h2"
          align="center"
          fontWeight="600"
          color="primary"
          gutterBottom
        >
          Şifre Değiştir
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 2 }}
        >
          <TextField
            label="Mevcut Şifre"
            type="password"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
            required
            InputProps={{
              startAdornment: <LockIcon sx={{ mr: 1, color: "action.active" }} />,
            }}
          />

          <TextField
            label="Yeni Şifre"
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            required
            InputProps={{
              startAdornment: <KeyIcon sx={{ mr: 1, color: "action.active" }} />,
            }}
          />

          <Button
            variant="contained"
            color="primary"
            type="submit"
            sx={{
              borderRadius: 2,
              py: 1.2,
              fontWeight: 600,
              textTransform: "none",
            }}
          >
            Değiştir
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
