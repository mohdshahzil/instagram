"use client";
import React, { useEffect, useState } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { auth } from "../firebase";
import { styled } from "@mui/material/styles";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Modal,
  Input,
  Box,
} from "@mui/material";
import InstagramIcon from "@mui/icons-material/Instagram";

const InstagramLogo = styled(InstagramIcon)({
  marginRight: "8px",
});

const RightAlignedButtons = styled("div")({
  marginLeft: "auto",
  display: "flex",
  alignItems: "center",
});

const Home = () => {
  const [openSignup, setOpenSignup] = useState(false);
  const [openSignin, setOpenSignin] = useState(false);

  const [username, setusername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [user, setuser] = useState(null);

  const signin = (e) => {
    e.preventDefault();
    auth
      .signInWithEmailAndPassword(email, password)
      .catch((e) => alert(e.message));
    setOpenSignin(false);
  };
  const signup = (e) => {
    e.preventDefault();
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username,
        });
      })
      .catch((e) => alert(e.message));
    setOpenSignup(false);
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authuser) => {
      if (authuser) {
        setuser(authuser);
      } else {
        setuser(null);
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <>
      <Modal
        open={openSignup}
        onClose={() => setOpenSignup(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            borderRadius: "12px",
            boxShadow: "0px 4px 16px rgba(0, 0, 0, 0.1)",
            maxWidth: "400px",
            width: "90%",
            padding: "20px",
          }}
        >
          <form action="">
            <Input
              placeholder="Name"
              type="text"
              value={username}
              onChange={(e) => {
                setusername(e.target.value);
              }}
              fullWidth
              sx={{ marginBottom: "16px" }}
            />
            <Input
              placeholder="Email"
              type="text"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              fullWidth
              sx={{ marginBottom: "16px" }}
            />
            <Input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              fullWidth
              sx={{ marginBottom: "16px" }}
            />
            <Button variant="contained" type="submit" onClick={signup}>
              Sign Up
            </Button>
          </form>
        </Box>
      </Modal>

      <Modal
        open={openSignin}
        onClose={() => setOpenSignin(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            borderRadius: "12px",
            boxShadow: "0px 4px 16px rgba(0, 0, 0, 0.1)",
            maxWidth: "400px",
            width: "90%",
            padding: "20px",
          }}
        >
          <form action="">
            <Input
              placeholder="Email"
              type="text"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              fullWidth
              sx={{ marginBottom: "16px" }}
            />
            <Input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              fullWidth
              sx={{ marginBottom: "16px" }}
            />
            <Button variant="contained" type="submit" onClick={signin}>
              Sign In
            </Button>
          </form>
        </Box>
      </Modal>

      <AppBar position="static" sx={{ backgroundColor: "#405DE6" }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="instagram">
            <InstagramLogo />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, color: "#FFFFFF" }}
          >
            Instagram
          </Typography>
          <RightAlignedButtons>
            {user ? (
              <Button
                variant="contained"
                sx={{
                  backgroundImage: "linear-gradient(45deg, #405DE6, #5851DB)",
                  color: "#FFFFFF",
                  marginRight: "8px",
                }}
                onClick={() => {
                  auth.signOut();
                }}
              >
                Logout
              </Button>
            ) : (
              <>
                <Button
                  variant="contained"
                  sx={{
                    backgroundImage: "linear-gradient(45deg, #405DE6, #5851DB)",
                    color: "#FFFFFF",
                    marginRight: "8px",
                  }}
                  onClick={() => setOpenSignin(true)}
                >
                  SignIn
                </Button>
                <Button
                  variant="contained"
                  sx={{
                    backgroundImage: "linear-gradient(45deg, #405DE6, #5851DB)",
                    color: "#FFFFFF",
                  }}
                  onClick={() => setOpenSignup(true)}
                >
                  SignUp
                </Button>
              </>
            )}
          </RightAlignedButtons>
        </Toolbar>
      </AppBar>
      {user ? (
        <>
        
        </>
      ) : (
        <>
          <Typography variant="h4" className="m-2">
            Wanna share memories? Get onboard by clicking on SignUp
          </Typography>
        </>
      )}
    </>
  );
};

export default Home;