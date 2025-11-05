import React, { useState } from "react";
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  TextField,
  Typography,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

// cart prop'u üst parent'ten gelecek (Basket'ten)
export default function CheckoutStepper({ cart = [] }) {
  const [activeStep, setActiveStep] = useState(0);
  const [shipping, setShipping] = useState({ name: "", email: "", address: "" });
  const navigate = useNavigate();

  const steps = ["Teslimat Bilgileri", "Ödeme", "Özet"];

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  // ✅ Ödeme simülasyonu: başarılı veya başarısız
  const handlePaymentSuccess = () => {
    navigate("/checkout/success");
  };

  const handlePaymentFailure = () => {
    navigate("/checkout/failure");
  };

  return (
    <Box sx={{ maxWidth: 800, margin: "auto", padding: 2 }}>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
        Ödeme Adımları
      </Typography>

      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
        {steps.map((step) => (
          <Step key={step}>
            <StepLabel>{step}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {/* STEP 0 - TESLİMAT BİLGİLERİ */}
      {activeStep === 0 && (
        <Paper sx={{ padding: 3, borderRadius: 3 }}>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
            Teslimat Bilgileri
          </Typography>

          <TextField
            fullWidth
            label="Ad Soyad"
            sx={{ mb: 2 }}
            value={shipping.name}
            onChange={(e) => setShipping({ ...shipping, name: e.target.value })}
          />

          <TextField
            fullWidth
            label="E-posta"
            sx={{ mb: 2 }}
            value={shipping.email}
            onChange={(e) =>
              setShipping({ ...shipping, email: e.target.value })
            }
          />

          <TextField
            fullWidth
            label="Adres"
            multiline
            rows={3}
            sx={{ mb: 2 }}
            value={shipping.address}
            onChange={(e) =>
              setShipping({ ...shipping, address: e.target.value })
            }
          />

          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button variant="contained" onClick={handleNext}>
              Devam Et
            </Button>
          </Box>
        </Paper>
      )}

      {/* STEP 1 - ÖDEME ADIMI (Simülasyon) */}
      {activeStep === 1 && (
        <Paper sx={{ padding: 3, borderRadius: 3 }}>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
            Ödeme Bilgileri
          </Typography>

          <Typography sx={{ mb: 2, color: "gray" }}>
            Buraya daha sonra gerçek ödeme bileşenleri eklenecek.
          </Typography>

          <Box
            sx={{
              border: "1px dashed gray",
              padding: 2,
              borderRadius: 2,
              textAlign: "center",
              color: "gray",
              mb: 3,
            }}
          >
            Ödeme formu placeholder alanı
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Button variant="outlined" onClick={handleBack}>
              Geri
            </Button>

            <Box sx={{ display: "flex", gap: 1 }}>
              <Button variant="contained" onClick={handlePaymentSuccess}>
                Ödeme Başarılı (Simülasyon)
              </Button>
              <Button variant="contained" color="error" onClick={handlePaymentFailure}>
                Ödeme Başarısız (Simülasyon)
              </Button>
            </Box>
          </Box>
        </Paper>
      )}

      {/* STEP 2 - SİPARİŞ ÖZETİ */}
      {activeStep === 2 && (
        <Paper sx={{ padding: 3, borderRadius: 3 }}>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
            Sipariş Özeti
          </Typography>

          {cart.length === 0 ? (
            <Typography>Sepetiniz boş.</Typography>
          ) : (
            cart.map((item) => (
              <Box
                key={item.id || item._id}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 1,
                }}
              >
                <Typography>{item.title}</Typography>
                <Typography>
                  {item.quantity} x {item.price} ₺
                </Typography>
              </Box>
            ))
          )}

          <Typography variant="h6" fontWeight="bold" sx={{ mt: 2 }}>
            Toplam:{" "}
            {cart
              .reduce((acc, item) => acc + item.price * item.quantity, 0)
              .toFixed(2)}{" "}
            ₺
          </Typography>

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
            <Button variant="outlined" onClick={handleBack}>
              Geri
            </Button>

            <Button variant="contained">
              Siparişi Tamamla (Simülasyon)
            </Button>
          </Box>
        </Paper>
      )}
    </Box>
  );
}
