import { useState } from "react";
import { updateProfile } from "../authApi";
import {
  TextField,
  Button,
  Typography,
  Box,
  Avatar,
  Grid,
} from "@mui/material";

// Hazır avatar linkleri
const AVATARS = [
  "https://api.dicebear.com/9.x/adventurer/svg?seed=Alex",
  "https://api.dicebear.com/9.x/adventurer/svg?seed=Emma",
  "https://api.dicebear.com/9.x/adventurer/svg?seed=Lucas",
  "https://api.dicebear.com/9.x/adventurer/svg?seed=Olivia",
  "https://api.dicebear.com/9.x/adventurer/svg?seed=Noah",
  "https://api.dicebear.com/9.x/adventurer/svg?seed=Sophia",
];

export default function ProfileForm({ user, onProfileUpdate, onAvatarChange }) {
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    profileImage: user?.profileImage || AVATARS[0],
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Avatar seçildiğinde anlık olarak üstteki Profile komponentine de bildir
  const handleAvatarSelect = (avatar) => {
    setFormData({ ...formData, profileImage: avatar });
    if (onAvatarChange) onAvatarChange(avatar);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await updateProfile(formData);
      const updatedUser = res.data.user;

      // Güncellenen kullanıcıyı localStorage'a kaydet
      localStorage.setItem("user", JSON.stringify(updatedUser));

      // Üst componente bildir (anında ekranda güncellenmesi için)
      if (onProfileUpdate) onProfileUpdate(updatedUser);

      setMessage("Profil başarıyla güncellendi");
    } catch (err) {
      setMessage(err.response?.data?.message || "Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        maxWidth: 400,
        mx: "auto",
      }}
    >
      <Typography variant="h5" textAlign="center" sx={{ mb: 2 }}>
        Profil Bilgileri
      </Typography>

      <TextField
        label="Ad Soyad"
        name="name"
        value={formData.name}
        onChange={handleChange}
        fullWidth
      />

     <TextField
  label="E-posta"
  value={formData.email}
  fullWidth
  disabled
/>



      <Typography variant="subtitle1" sx={{ mt: 1 }}>
        Avatar Seç:
      </Typography>

      <Grid container spacing={1} justifyContent="center">
        {AVATARS.map((avatar, index) => (
          <Grid item key={index}>
            <Avatar
              src={avatar}
              alt={`avatar-${index}`}
              sx={{
                width: 64,
                height: 64,
                border:
                  formData.profileImage === avatar
                    ? "3px solid #1976d2"
                    : "2px solid transparent",
                cursor: "pointer",
                transition: "0.2s",
                "&:hover": {
                  border: "3px solid #90caf9",
                  transform: "scale(1.05)",
                },
              }}
              onClick={() => handleAvatarSelect(avatar)}
            />
          </Grid>
        ))}
      </Grid>

      <Button
        variant="contained"
        type="submit"
        sx={{ mt: 2 }}
        disabled={loading}
      >
        {loading ? "Güncelleniyor..." : "Güncelle"}
      </Button>

      {message && (
        <Typography color="success.main" textAlign="center" sx={{ mt: 1 }}>
          {message}
        </Typography>
      )}
    </Box>
  );
}
