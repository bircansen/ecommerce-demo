import { Box, TextField, Button, Typography } from "@mui/material";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { loginUser } from "../redux/UserSlice";
import { useNavigate } from "react-router-dom";

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Geçerli bir e-posta giriniz").required("Zorunlu"),
  password: Yup.string().min(6, "Şifre en az 6 karakter olmalı").required("Zorunlu"),
});

function Login() {
  const { mode } = useContext(ThemeContext);
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
      <Box
        sx={{
          bgcolor: "background.paper",
          p: 4,
          borderRadius: 2,
          width: "100%",
          maxWidth: 400,
        }}
      >
        <Typography variant="h5" sx={{ mb: 2, textAlign: "center" }}>
          Giriş Yap
        </Typography>

        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={LoginSchema}
          onSubmit={(values) => {
            dispatch(loginUser(values))
              .unwrap()
              .then(() => {
                navigate("/");
              })
              .catch((err) => console.log("Login error:", err));
          }}
        >
          {({ errors, touched, handleChange, handleBlur, values }) => (
            <Form>
              <TextField
                fullWidth
                label="E-mail"
                name="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email && errors.email}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="Şifre"
                type="password"
                name="password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.password && Boolean(errors.password)}
                helperText={touched.password && errors.password}
                sx={{ mb: 2 }}
              />

              <Button fullWidth variant="contained" color="primary" type="submit">
                Giriş Yap
              </Button>
            </Form>
          )}
        </Formik>

        <Typography variant="body2" sx={{ textAlign: "center", mt: 2 }}>
          Hesabın yok mu? <a href="/register">Kayıt Ol</a>
        </Typography>
      </Box>
    </Box>
  );
}

export default Login;
