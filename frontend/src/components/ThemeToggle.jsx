// src/components/ThemeToggle.jsx
import React, { useContext } from "react";
import IconButton from "@mui/material/IconButton";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { ThemeContext } from "../context/ThemeContext";

// ✅ forwardRef ile sarmalandı
const ThemeToggle = React.forwardRef((props, ref) => {
  const { mode, toggleMode } = useContext(ThemeContext);

  return (
    <IconButton
      ref={ref}                // Tooltip bu ref'i buraya geçebilir
      onClick={toggleMode}
      style={{ color: "grey" }}
      {...props}               // dıştan gelen diğer prop'ları da destekler
    >
      {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
    </IconButton>
  );
});

// 🧩 Bileşen ismini debug için koru (React devtools’ta düzgün görünür)
ThemeToggle.displayName = "ThemeToggle";

export default ThemeToggle;
