// src/pages/Favorites.jsx

import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchFavorites, toggleFavorite } from "../redux/FavoritesSlice";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

function Favorites() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();

  const favorites = useSelector((state) => state.favorites.items);
  const token = useSelector((state) => state.user.token);
  const loading = useSelector((state) => state.favorites.loading);

  // ✅ Token yoksa fetch yapılmaz (hata engellenir)
  useEffect(() => {
    if (!token) return;
    dispatch(fetchFavorites());
  }, [dispatch, token]);

  // ✅ Favoriler boşsa
  if (!token) {
    return (
      <Typography
        variant="h6"
        sx={{ textAlign: "center", mt: 5, color: theme.palette.text.secondary }}
      >
        Favorilerinizi görebilmek için giriş yapmalısınız.
      </Typography>
    );
  }

  if (loading && !favorites.length) {
    return (
      <Typography
        variant="h6"
        sx={{ textAlign: "center", mt: 5 }}
      >
        Yükleniyor...
      </Typography>
    );
  }

  if (!favorites.length) {
    return (
      <Typography
        variant="h6"
        sx={{ textAlign: "center", mt: 5, color: theme.palette.text.secondary }}
      >
        Favorilerinizde ürün yok.
      </Typography>
    );
  }

  // ✅ Navigasyon
  const handleNavigate = (item) => {
    const productId = item.id || item.asin;
    if (productId) {
      navigate(`/product/${productId}`);
    } else {
      console.error("Ürün ID bulunamadı:", item);
    }
  };

  // ✅ Favoriden çıkarma
  const handleRemove = (e, productId) => {
    e.stopPropagation();
    dispatch(toggleFavorite(productId));
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        padding: 3,
        maxWidth: 900,
        margin: "0 auto",
      }}
    >
      {favorites.map((item) => {
        const productId = item.id || item.asin;

        // ✅ Doğru görsel seçimi
        const imageSrc =
          item.image ||
          (Array.isArray(item.images) && item.images.length > 0
            ? item.images[0]
            : "https://via.placeholder.com/100?text=No+Image");

        return (
          <Card
            key={productId}
            onClick={() => handleNavigate(item)}
            sx={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              borderRadius: 3,
              overflow: "hidden",
              boxShadow: 2,
              transition: "transform 0.2s, box-shadow 0.2s",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: 6,
              },
              backgroundColor:
                theme.palette.mode === "dark" ? "#2b2b2b" : "#fff",
              position: "relative",
            }}
          >
            {/* ✅ Favoriden kaldırma butonu */}
            <IconButton
              onClick={(e) => handleRemove(e, productId)}
              sx={{
                position: "absolute",
                top: 6,
                right: 6,
                backgroundColor: "rgba(0,0,0,0.4)",
                color: "#fff",
                "&:hover": { backgroundColor: "rgba(0,0,0,0.6)" },
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>

            {/* ✅ Ürün resmi */}
            <CardMedia
              component="img"
              image={imageSrc}
              alt={item.title}
              sx={{
                width: 100,
                height: 100,
                objectFit: "contain",
                p: 1,
                backgroundColor:
                  theme.palette.mode === "dark" ? "#1e1e1e" : "#f8f8f8",
                borderRight:
                  theme.palette.mode === "dark"
                    ? "1px solid #333"
                    : "1px solid #eee",
              }}
              onError={(e) =>
                (e.target.src =
                  "https://via.placeholder.com/100?text=No+Image")
              }
            />

            {/* ✅ İçerik */}
            <CardContent
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: 0.5,
                overflow: "hidden",
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 600,
                  fontSize: "1rem",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                }}
              >
                {item.title}
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.text.secondary,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {item.description}
              </Typography>

              <Typography
                variant="subtitle2"
                sx={{
                  mt: 0.5,
                  fontWeight: "bold",
                  color: theme.palette.primary.main,
                }}
              >
                {item.price} ₺
              </Typography>
            </CardContent>
          </Card>
        );
      })}
    </Box>
  );
}

export default Favorites;

