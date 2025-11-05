import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  addToBasket,
  decreaseQuantity,
  removeFromBasket,
  clearBasket,
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
import { Link } from 'react-router-dom';

import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from "react-router-dom";   // ✅ EKLENDİ

function BasketComp() {
  const dispatch = useDispatch();
  const navigate = useNavigate();                // ✅ EKLENDİ
  const theme = useTheme();

  const addedToBasket = useSelector((store) => store.basket.addedToBasket || []);
  const totalItems = addedToBasket.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = addedToBasket.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleClearBasket = () => dispatch(clearBasket());

  const getImageSrc = (item) => {
    if (!item) return '/placeholder.png';
    if (item.image) return item.image;
    if (Array.isArray(item.images) && item.images.length > 0) return item.images[0];
    return '/placeholder.png';
  };

  const goToProduct = (item) => {
    const productId = item._id || item.id || item.asin;   // ✅ doğru ürün ID’si
    if (productId) navigate(`/product/${productId}`);
  };

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

      {addedToBasket.length === 0 ? (
        <Typography sx={{ mt: 4 }} color={theme.palette.text.secondary}>
          Sepetiniz boş.
        </Typography>
      ) : (
        <>
          {addedToBasket.map((item) => (
            <Paper
              key={item._id || item.id}
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
              {/* ✅ Sol tarafı tıklanabilir yaptık */}
              <Box
                onClick={() => goToProduct(item)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  minWidth: 0,
                  flex: 1,
                  cursor: "pointer",
                  "&:hover": { opacity: 0.85 }, // küçük hover efekti
                }}
              >
                <img
                  src={getImageSrc(item)}
                  alt={item.title}
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
                    {item.title}
                  </Typography>

                  <Typography variant="body2" color={theme.palette.text.secondary}>
                    {item.price?.toFixed(2)} ₺
                  </Typography>
                </Box>
              </Box>

              {/* Sağ taraf (miktar + silme) */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconButton onClick={() => dispatch(decreaseQuantity(item))}>
                  <RemoveIcon />
                </IconButton>

                <Typography fontWeight="bold">{item.quantity}</Typography>

                <IconButton onClick={() => dispatch(addToBasket(item))}>
                  <AddIcon />
                </IconButton>

                <IconButton onClick={() => dispatch(removeFromBasket(item))}>
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
              onClick={handleClearBasket}
              fullWidth
              variant="contained"
              sx={{
                mt: 1,
                textTransform: "none",
              }}
            >
              Sepeti Boşalt
            </Button>
            {addedToBasket.length > 0 && (
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
