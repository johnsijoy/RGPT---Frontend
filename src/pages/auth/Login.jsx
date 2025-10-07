// File: src/pages/auth/Login.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Link,
  TextField,
  Typography,
  CssBaseline,
} from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import backgroundImage from "../../assets/images/login-page-bg.jpg";

const Login = () => {
  const { login } = useAuth();   // ✅ use login from context
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
      remember: false,
    },
    validationSchema: Yup.object({
      username: Yup.string()
      .required("Username is required"),
      password: Yup.string()
        .min(4, "Password must be at least 4 characters")
        .required("Password is required"),
    }),
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        // ✅ Call AuthContext login
        await login(values.username, values.password);

        // ✅ Redirect on success
        navigate("/");
      } catch (error) {
        setErrors({
          username: "Invalid credentials",
          password: "Invalid credentials",
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <Grid container component="main" sx={{ height: "100vh", width: "100vw", margin: 0, margin: 0, overflow: "hidden" }}>
      <CssBaseline />

      {/* Left Side Background */}
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          height: '100vh',
          display: { xs: "none", sm: "flex" },
          alignItems: "center",
          justifyContent: "center",
          overflow: 'hidden',
        }}
      >
        <Box
          component="img"
          src={backgroundImage}
          alt="Login Background"
          sx={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </Grid>

      {/* Right Side Form */}
      <Grid item xs={12} sm={8} md={5} elevation={6}  square 
      sx={{
          height: '100vh',
          overflow: 'auto',
          backgroundColor: (theme) =>
            theme.palette.mode === 'light' ? '#ffffff' : '#121212',
        }}
      >
        <Box sx={{ my: 8, mx: 4, display: "flex", flexDirection: "column", alignItems: "center" }}>

          {/* Logo */}
          <Box
            component="img"
            src={require("../../assets/images/rgpt-logo.jpeg")}
            alt="ERP AI Admin Logo"
            sx={{ height: 120, width: "auto",maxWidth:'300px', mb: 4, objectFit: 'contain'}}
          />
          <Typography component="h1" variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
            Welcome to RGPT ERP AI
          </Typography>

          {/* Form */}
          <Box component="form" noValidate onSubmit={formik.handleSubmit} sx={{ mt: 1, width: "100%" }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              value={formik.values.username}
              onChange={formik.handleChange}
              error={formik.touched.username && Boolean(formik.errors.username)}
              helperText={formik.touched.username && formik.errors.username}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              sx={{ mb: 2 }}
            />

            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="remember"
                    color="primary"
                    checked={formik.values.remember}
                    onChange={formik.handleChange}
                  />
                }
                label="Remember me"
              />
              <Link href="#" variant="body2" sx={{ textDecoration: 'none' }}>
                Forgot password?
              </Link>
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, py: 1.5, fontSize: "1rem", background: 'linear-gradient(135deg, #204c9e 0%, #132a58 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #132a58 0%, #204c9e 100%)'
                } }}
              disabled={formik.isSubmitting}
            >
              Sign In
            </Button>
             <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
             Don't have an account?{' '}
              <Link href="#" variant="body2" sx={{ fontWeight: 600 }}>
                Request Access
              </Link>
            </Typography>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Login;
