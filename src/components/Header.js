import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Avatar, Button, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import React from "react";
import { useHistory} from "react-router-dom";
import "./Header.css";

const Header = ({ children, hasHiddenAuthButtons, page }) => {
  let navigate = useHistory()
  const handleLogin = () => {
      navigate.push("/login")
  }

  const handleRegister= () => {
    navigate.push("/register")
}

const handleExplore= () => {
  navigate.push("/")
}

const handleLogout= () => {
  localStorage.clear();

  navigate.push("/")
}

if (hasHiddenAuthButtons) {
  return (
    <Box className="header">
      <Box className="header-title">
        <img src="logo_light.svg" alt="QKart-icon"></img>
      </Box>
      <Button
        className="explore-button"
        startIcon={<ArrowBackIcon />}
        variant="text"
        onClick={handleExplore}
      >
        Back to explore
      </Button>
    </Box>
  );
}
    return (
      <Box className="header">
        
      <Box className="header-title">
        <img src="logo_light.svg" alt="QKart-icon"></img>
      </Box>

     {localStorage.getItem("username") && children}

      <Stack direction="row" spacing={1} alignItems="center">
        {localStorage.getItem("username") ? (
          <>
            <Avatar
              src="avtar.png"
              alt={localStorage.getItem("username") || "profile"}
            />
            <p className="username-text"> {localStorage.getItem("username")}</p>

            <Button type="primary" onClick={handleLogout}>
              {" "}
              Logout{" "} 
            </Button>
          </>
        ) : (
          <>
            <Button onClick={handleLogin}> Login </Button>
            <Button variant="contained"  onClick={handleRegister}>
              Register
            </Button>
          </>
        )}
      </Stack>
    </Box>
    );
};

export default Header;
