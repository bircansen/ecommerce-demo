// src/pages/ProductDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedProduct } from "../redux/ProductsSlice";
import {
  addToBasketLocal,
  addToBasketServer,
} from "../redux/BasketSlice";
import { toggleFavorite } from "../redux/FavoritesSlice";
import {
  IconButton,
  Box,
  Typography,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import axios from "axios";

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { products, selectedProduct, loading } = useSelector(
    (s) => s.products
  );
  const favorites = useSelector((s) => s.favorites.items);

  const user = useSelector((s) => s.user?.user); // ✅ kullanıcı bilgisi

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");

  const closeAlert = () => setAlertOpen(false);

  const normalizeId = (p) => p?._id || p?.id || p?.asin;

  // ✅ Store boşsa backend'den çek
  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get(`/api/products/${id}`);
        dispatch(setSelectedProduct(res.data));
      } catch (err) {
        console.error("Tek ürün hatası:", err);
      }
    };
    if (!products.length) fetch();
  }, [id, products.length, dispatch]);

  // ✅ Store doluysa içinden bul
  useEffect(() => {
    if (products.length) {
      const found = products.find(
        (p) => String(normalizeId(p)) === String(id)
      );
      if (found) dispatch(setSelectedProduct(found));
    }
  }, [products, id, dispatch]);

  if (loading || !selectedProduct || !normalizeId(selectedProduct)) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  const productId = normalizeId(selectedProduct);

  // ✅ Görsel seçimi
  let img = selectedProduct.image;

  if (!img) {
    if (typeof selectedProduct.all_images === "string") {
      try {
        img = JSON.parse(selectedProduct.all_images.replace(/'/g, '"'))[0];
      } catch {}
    } else if (Array.isArray(selectedProduct.all_images)) {
      img = selectedProduct.all_images[0];
    }
  }

  if (!img && selectedProduct.asin) {
    img = `https://m.media-amazon.com/images/I/${selectedProduct.asin}.jpg`;
  }

  const imageSrc = img || "/placeholder.png";

  const isFavorite = favorites.some(
    (f) => String(normalizeId(f)) === String(productId)
  );

  const title =
    selectedProduct.title ||
    selectedProduct.name ||
    selectedProduct.product_title ||
    "Ürün adı yok";

  const price =
    selectedProduct.price ||
    selectedProduct.price_value ||
    selectedProduct.cost ||
    "Belirtilmemiş";

  const description =
    selectedProduct.description ||
    selectedProduct.about_item ||
    selectedProduct.product_description ||
    "Açıklama yok.";

  // ✅ DÜZELTİLMİŞ SEPET EKLEME
  const addBasket = () => {
    const userId = user?._id ?? user?.id; // ✅ aynı düzeltme

    if (userId) {
      dispatch(addToBasketServer({ userId, productId }));
    } else {
      dispatch(
        addToBasketLocal({
          id: productId,
          title,
          price,
          image: imageSrc,
        })
      );
    }

    setAlertMsg("Sepete eklendi");
    setAlertOpen(true);
  };

  const toggleFav = async () => {
    try {
      const updated = await dispatch(toggleFavorite(productId)).unwrap();
      const nowFav = updated.some(
        (f) => String(normalizeId(f)) === String(productId)
      );
      setAlertMsg(nowFav ? "Favorilere eklendi" : "Favoriden çıkarıldı");
      setAlertOpen(true);
    } catch {
      setAlertMsg("Favori işlemi hata verdi");
      setAlertOpen(true);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        {title}
      </Typography>

      <Box
        component="img"
        src={imageSrc}
        alt={title}
        sx={{ width: 300, mb: 3, objectFit: "contain" }}
      />

      <Typography variant="h6">Fiyat: {price} ₺</Typography>

      <Typography sx={{ mt: 2 }}>{description}</Typography>

      <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
        <IconButton onClick={addBasket}>
          <ShoppingCartIcon htmlColor="#062936" />
        </IconButton>

        <IconButton onClick={toggleFav}>
          {isFavorite ? (
            <FavoriteIcon htmlColor="#ff0000" />
          ) : (
            <FavoriteBorderIcon htmlColor="#ff0000" />
          )}
        </IconButton>
      </Box>

      <Snackbar
        open={alertOpen}
        autoHideDuration={2000}
        onClose={closeAlert}
      >
        <Alert severity="success">{alertMsg}</Alert>
      </Snackbar>
    </Box>
  );
};

export default ProductDetails;
