import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Alert,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function LoginScreen({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
  if (!username || !password) {
    setError("Please fill in both fields.");
    return;
  }

  try {
    const response = await axios.post(`http://localhost:3000/login`, {
      username,
      password,
    });

    const token = response.data.token;
    localStorage.setItem("authToken", token);

    // 🔔 App.js'deki state'i güncelle
    if (onLogin) onLogin();

    navigate("/chat");
  } catch (err) {
    console.error(err);
    setError("Login failed. Please check your credentials.");
  }
};


  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          marginTop: 10,
          padding: 4,
          borderRadius: 3,
          boxShadow: 3,
          bgcolor: "#fff",
        }}
      >
        <Typography variant="h5" align="center" gutterBottom>
          AI Agent Login
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}

        <TextField
          fullWidth
          margin="normal"
          label="Username"
          variant="outlined"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <TextField
          fullWidth
          margin="normal"
          label="Password"
          type="password"
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button
          fullWidth
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          onClick={handleLogin}
        >
          Login
        </Button>
      </Box>
    </Container>
  );
}

export default LoginScreen;
