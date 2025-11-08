import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  addToBasketLocal as addLocal,
  decreaseQuantityLocal as decLocal,
  removeFromBasketLocal as removeLocal,
  clearBasketLocal as clearLocal,
  addToBasketServer,
  decreaseQuantityServer,
  removeFromBasketServer,
  clearBasketServer
} from '../redux/BasketSlice';

import {
  Box,
  Typography,
  IconButton,
  Button,
  Divider,
  Paper,
  Badge,
  useTheme,
} from '@mui/material';

import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from "react-router-dom";

function BasketComp() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();

  const user = useSelector((store) => store.user?.user);
  const basketList = useSelector((store) => store.basket.addedToBasket || []);

  // ======= Helper: productId =======
  const getProductId = (item) => {
    if (!item) return null;
    if (item.productId && typeof item.productId === "object") {
      return item.productId._id || item.productId.id || null;
    }
    return item.productId || item.id || item._id || null;
  };

  // ======= Helper: title (Favorites tarzı formatla uyumlu) =======
  const getTitle = (item) => {
    if (!item) return "";
    return (
      item.title ||
      item.name ||
      item.productId?.title ||
      item.productId?.name ||
      item.productId?.productTitle ||
      ""
    );
  };

  // ======= Helper: image (Favorites tarzı formatla uyumlu) =======
  const getImageSrc = (item) => {
    if (!item) return '/placeholder.png';

    // Direkt image
    if (item.image) return item.image;

    // images array
    if (Array.isArray(item.images) && item.images.length > 0) return item.images[0];

    // productId populate içinden
    if (item.productId && typeof item.productId === "object") {
      if (item.productId.image) return item.productId.image;
      if (Array.isArray(item.productId.images) && item.productId.images.length > 0)
        return item.productId.images[0];
      // bazı backendlere göre farklı alanlar
      if (item.productId.imagesJson) {
        try {
          const arr = JSON.parse(item.productId.imagesJson);
          if (Array.isArray(arr) && arr.length) return arr[0];
        } catch {}
      }
    }

    return '/placeholder.png';
  };

  // ======= Helper: price (çoklu fallback — Favorites ile uyumlu) =======
  const getPrice = (item) => {
    if (!item) return 0;

    // 1) doğrudan item.price (string veya number)
    if (item.price !== undefined && item.price !== null) {
      const n = Number(item.price);
      if (!Number.isNaN(n)) return n;
    }

    // 2) productId içindeki yaygın alanlar
    const p = item.productId;
    if (p && typeof p === "object") {
      // birkaç yaygın alternatif:
      const candidates = [
        p.price,
        p.current_price,
        p.price_current,
        p.priceValue,
        p.price_value,
        p.amount,
        p.raw_price,
        p.price?.value,
        p.price?.amount,
      ];

      for (const c of candidates) {
        if (c !== undefined && c !== null) {
          const n = Number(c);
          if (!Number.isNaN(n)) return n;
        }
      }
    }

    // 3) diğer olası yerler (ör. nested object)
    if (item.priceDetails && typeof item.priceDetails === "object") {
      const n = Number(item.priceDetails.amount ?? item.priceDetails.value);
      if (!Number.isNaN(n)) return n;
    }

    // fallback
    return 0;
  };

  // ======= totals (NaN'ı engellemek için Number güvenli) =======
  const totalItems = basketList.reduce((acc, item) => acc + (Number(item.quantity) || 0), 0);
  const totalPrice = basketList.reduce((acc, item) => acc + getPrice(item) * (Number(item.quantity) || 0), 0);

  // ======= Handlers (hiçbirini değiştirmedim, sadece productId kullandım) =======
  const handleAdd = (item) => {
    const productId = getProductId(item);
    if (!productId) return;

    if (user?._id) {
      dispatch(addToBasketServer({ userId: user._id, productId }));
    } else {
      dispatch(addLocal(item));
    }
  };

  const handleDecrease = (item) => {
    const productId = getProductId(item);
    if (!productId) return;

    if (user?._id) {
      dispatch(decreaseQuantityServer({ userId: user._id, productId }));
    } else {
      dispatch(decLocal(item));
    }
  };

  const handleRemove = (item) => {
    const productId = getProductId(item);
    if (!productId) return;

    if (user?._id) {
      dispatch(removeFromBasketServer({ userId: user._id, productId }));
    } else {
      dispatch(removeLocal(item));
    }
  };

  const handleClear = () => {
    if (user?._id) {
      dispatch(clearBasketServer(user._id));
    } else {
      dispatch(clearLocal());
    }
  };

  const goToProduct = (item) => {
    const productId = getProductId(item);
    if (productId) navigate(`/product/${productId}`);
  };

  // ======= Render (UI'ya dokunulmadı, sadece getter'lar kullanıldı) =======
  return (
    <Box sx={{ padding: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="h5" fontWeight="bold" color={theme.palette.text.primary}>
          Sepetim
        </Typography>
        <Badge badgeContent={totalItems} color="primary">
          <ShoppingCartIcon htmlColor={theme.palette.text.primary} />
        </Badge>
      </Box>

      {basketList.length === 0 ? (
        <Typography sx={{ mt: 4 }} color={theme.palette.text.secondary}>
          Sepetiniz boş.
        </Typography>
      ) : (
        <>
          {basketList.map((item) => (
            <Paper
              key={getProductId(item) ?? JSON.stringify(item)}
              elevation={3}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 2,
                borderRadius: 3,
                width: "100%",
                backgroundColor: theme.palette.background.paper,
                color: theme.palette.text.primary,
              }}
            >
              <Box
                onClick={() => goToProduct(item)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  minWidth: 0,
                  flex: 1,
                  cursor: "pointer",
                  "&:hover": { opacity: 0.85 },
                }}
              >
                <img
                  src={getImageSrc(item)}
                  alt={getTitle(item)}
                  style={{
                    width: 70,
                    height: 70,
                    borderRadius: 8,
                    objectFit: 'contain',
                    background: theme.palette.background.default,
                    padding: 4,
                  }}
                />
                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    noWrap
                    sx={{ maxWidth: 160 }}
                  >
                    {getTitle(item)}
                  </Typography>

                  <Typography variant="body2" color={theme.palette.text.secondary}>
                    {getPrice(item).toFixed(2)} ₺
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconButton onClick={() => handleDecrease(item)}>
                  <RemoveIcon />
                </IconButton>

                <Typography fontWeight="bold">{Number(item.quantity) || 0}</Typography>

                <IconButton onClick={() => handleAdd(item)}>
                  <AddIcon />
                </IconButton>

                <IconButton onClick={() => handleRemove(item)}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Paper>
          ))}

          <Divider sx={{ my: 2 }} />

          <Paper
            elevation={2}
            sx={{
              padding: 2,
              borderRadius: 3,
              backgroundColor: theme.palette.background.paper,
              textAlign: 'center',
            }}
          >
            <Typography variant="h6" fontWeight="bold">
              Toplam: {totalPrice.toFixed(2)} ₺
            </Typography>

            <Button
              onClick={handleClear}
              fullWidth
              variant="contained"
              sx={{ mt: 1, textTransform: "none" }}
            >
              Sepeti Boşalt
            </Button>

            {basketList.length > 0 && (
              <Button
                onClick={() => navigate('/checkout')}
                fullWidth
                variant="contained"
                sx={{ mt: 1, textTransform: "none" }}
              >
                Ödeme Adımına Geç
              </Button>
            )}
          </Paper>
        </>
      )}
    </Box>
  );
}

export default BasketComp;
