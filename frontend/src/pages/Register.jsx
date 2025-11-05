import { Box, Card, CardContent, Typography, TextField, Button, CircularProgress, Snackbar, Alert } from "@mui/material";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../redux/UserSlice";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useState } from "react";

export default function Register() {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((store) => store.user);

  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const RegisterSchema = Yup.object().shape({
    name: Yup.string().required("Ad Soyad zorunlu"),
    email: Yup.string().email("Geçerli bir e-posta giriniz").required("E-posta zorunlu"),
    password: Yup.string().min(6, "Şifre en az 6 karakter olmalı").required("Şifre zorunlu"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Şifreler eşleşmiyor")
      .required("Şifreyi tekrar giriniz"),
  });

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box
      sx={{
        bgcolor: "background.default",
        minHeight: "calc(100vh - 64px)",
        pt: "64px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Card sx={{ width: 380 }}>
        <CardContent>
          <Typography variant="h5" mb={2}>Kayıt Ol</Typography>

          <Formik
            initialValues={{ name: "", email: "", password: "", confirmPassword: "" }}
            validationSchema={RegisterSchema}
            onSubmit={(values, { resetForm }) => {
              const { name, email, password } = values;
              dispatch(registerUser({ name, email, password }))
                .unwrap() // RTK Query veya createAsyncThunk kullanıyorsan
                .then(() => {
                  setSnackbarOpen(true); // kayıt başarılı ise Snackbar aç
                  resetForm(); // formu temizle
                })
                .catch(() => {
                  // hata yönetimi zaten error ile gösteriliyor
                });
            }}
          >
            {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
              <Form onSubmit={handleSubmit}>
                <TextField
                  label="Ad Soyad"
                  fullWidth
                  margin="normal"
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.name && Boolean(errors.name)}
                  helperText={touched.name && errors.name}
                />

                <TextField
                  label="E-mail"
                  fullWidth
                  margin="normal"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.email && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                />

                <TextField
                  label="Şifre"
                  type="password"
                  fullWidth
                  margin="normal"
                  name="password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.password && Boolean(errors.password)}
                  helperText={touched.password && errors.password}
                />

                <TextField
                  label="Şifreyi Tekrar Gir"
                  type="password"
                  fullWidth
                  margin="normal"
                  name="confirmPassword"
                  value={values.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                  helperText={touched.confirmPassword && errors.confirmPassword}
                />

                {error && <Typography color="error">{error}</Typography>}

                <Button variant="contained" fullWidth sx={{ mt: 2 }} type="submit">
                  {loading ? <CircularProgress size={24} /> : "Kayıt Ol"}
                </Button>
              </Form>
            )}
          </Formik>

          <Typography mt={2} textAlign="center">
            Zaten hesabın var mı? <Link to="/login">Giriş Yap</Link>
          </Typography>
        </CardContent>
      </Card>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: "100%" }}>
          Kayıt başarılı!
        </Alert>
      </Snackbar>
    </Box>
  );
}
