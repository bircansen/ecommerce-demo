// src/components/Product.jsx
import React from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  Box,
  Tooltip,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { useDispatch, useSelector } from "react-redux";
import { toggleFavorite } from "../redux/FavoritesSlice";
import { addToBasket } from "../redux/BasketSlice";
import { useNavigate } from "react-router-dom";

export default function Product({
  productId,
  title,
  price,
  description,
  image,
  images,
  all_images,
  asin,
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const favorites = useSelector((s) => s.favorites.items);
  const isFavorite = favorites.some(
    (f) => String(f._id || f.id || f.asin) === String(productId)
  );

  // ✅ Görsel seçimi
  let finalImage = image;

  if (!finalImage) {
    if (Array.isArray(images) && images.length > 0) {
      finalImage = images[0];
    } else if (typeof all_images === "string") {
      try {
        finalImage = JSON.parse(all_images.replace(/'/g, '"'))[0];
      } catch {}
    } else if (Array.isArray(all_images) && all_images.length > 0) {
      finalImage = all_images[0];
    }
  }

  if (!finalImage && asin) {
    finalImage = `https://m.media-amazon.com/images/I/${asin}.jpg`;
  }

  finalImage = finalImage || "/placeholder.png";

  const handleNavigate = () => navigate(`/product/${productId}`);

  const handleFavorite = (e) => {
    e.stopPropagation();
    dispatch(toggleFavorite(productId));
  };

  const handleAddBasket = (e) => {
    e.stopPropagation();
    dispatch(addToBasket({ id: productId, title, price, image: finalImage }));
  };

  return (
    <Card
      onClick={handleNavigate}
      sx={{
        width: 260,
        borderRadius: 3,
        boxShadow: 3,
        cursor: "pointer",
        position: "relative",
        transition: "0.2s",
        "&:hover": { transform: "translateY(-4px)", boxShadow: 6 },
      }}
    >
      {/* Üst ikonlar */}
      <Box
        sx={{
          position: "absolute",
          top: 6,
          left: 6,
          right: 6,
          zIndex: 10,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Tooltip title="Sepete ekle">
          <IconButton
            onClick={handleAddBasket}
            sx={{
              background: "rgba(255,255,255,0.8)",
              "&:hover": { background: "white" },
            }}
          >
            <AddShoppingCartIcon color="primary" />
          </IconButton>
        </Tooltip>

        <Tooltip title={isFavorite ? "Favoriden çıkar" : "Favoriye ekle"}>
          <IconButton
            onClick={handleFavorite}
            sx={{
              background: "rgba(255,255,255,0.8)",
              "&:hover": { background: "white" },
            }}
          >
            {isFavorite ? (
              <FavoriteIcon color="error" />
            ) : (
              <FavoriteBorderIcon color="secondary" />
            )}
          </IconButton>
        </Tooltip>
      </Box>

      <CardMedia
        component="img"
        image={finalImage}
        alt={title}
        sx={{
          height: 200,
          objectFit: "contain",
          background: "#f8f8f8",
        }}
        onError={(e) => {
          e.target.src = "/placeholder.png";
        }}
      />

      <CardContent>
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 600,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {title}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {description || "Açıklama bulunmuyor."}
        </Typography>

        <Typography
          variant="subtitle1"
          sx={{ fontWeight: "bold", mt: 1 }}
        >
          {price ? `${price} ₺` : "Fiyat yok"}
        </Typography>
      </CardContent>
    </Card>
  );
}
