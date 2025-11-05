import { useEffect, useState } from "react";
import ProfileForm from "../components/ProfileForm";
import { Avatar, Typography } from "@mui/material";

export default function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setUser(storedUser);
  }, []);

  const handleProfileUpdate = (updatedUser) => {
    setUser(updatedUser);
  };

  if (!user) return <p>Giriş yapmanız gerekiyor.</p>;

  return (
    <div style={{ textAlign: "center", marginTop: "2rem" }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Profil
      </Typography>
      <Avatar
        src={user.profileImage}
        alt="Profil Fotoğrafı"
        sx={{ width: 100, height: 100, margin: "0 auto 16px" }}
      />
      <ProfileForm
        user={user}
        onProfileUpdate={handleProfileUpdate}
        onAvatarChange={(avatarUrl) =>
          setUser({ ...user, profileImage: avatarUrl })
        }
      />
    </div>
  );
}
