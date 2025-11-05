// src/context/AlertContext.jsx
import React, { createContext, useContext, useState } from "react";
import { Snackbar, Alert as MuiAlert } from "@mui/material";

const AlertContext = createContext();
export const useAlert = () => useContext(AlertContext);

export const AlertProvider = ({ children }) => {
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const showAlert = (message, severity = "info") => {
    setAlert({ open: true, message, severity });
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") return;
    setAlert({ ...alert, open: false });
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      <Snackbar
        open={alert.open}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }} // Üst sağ köşe
        sx={{ mt: 2 }} // üstten biraz boşluk
      >
        <MuiAlert
          onClose={handleClose}
          severity={alert.severity}
          elevation={3}
          variant="filled"
          sx={{
            minWidth: "200px",
            fontSize: "0.85rem",
          }}
        >
          {alert.message}
        </MuiAlert>
      </Snackbar>
    </AlertContext.Provider>
  );
};

