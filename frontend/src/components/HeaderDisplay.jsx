import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/Header.css";

import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import FavoriteTwoToneIcon from "@mui/icons-material/FavoriteTwoTone";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Avatar from "@mui/material/Avatar";

import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../redux/UserSlice";
import {
  clearSearchResults,
  searchLocalProducts,
  getAllProduct,
} from "../redux/ProductsSlice";

import ThemeToggle from "./ThemeToggle";
import { ThemeContext } from "../context/ThemeContext";
import BasketDrawer from "./BasketDrawer";
import SearchBar from "./SearchBar";
import { debounce } from "lodash";

function HeaderDisplay() {
  const { mode } = useContext(ThemeContext);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // 🧺 Sepet bilgisi
  const addedToBasket = useSelector((state) => state.basket.addToBasket || []);
  const totalItems = addedToBasket.length;

  // 👤 Kullanıcı bilgisi
  const reduxUser = useSelector((state) => state.user.user);
  const token = useSelector((state) => state.user.token);

  const [user, setUser] = useState(reduxUser || null);
  useEffect(() => {
    if (!reduxUser) {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser) setUser(storedUser);
    } else {
      setUser(reduxUser);
    }
  }, [reduxUser]);

  // 🔎 Arama
  const { searchResults, searchLoading } = useSelector((state) => state.products);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Ürünleri bir kez yükle
    dispatch(getAllProduct());
  }, [dispatch]);

  const [anchorEl, setAnchorEl] = useState(null);
  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    dispatch(logoutUser());
    handleMenuClose();
    navigate("/");
  };

  // 🔹 Debounce ile filtreleme (kullanıcı yazmayı bitirince çalışır)
  const debouncedSearch = debounce((query) => {
    if (!query.trim()) {
      dispatch(clearSearchResults());
      return;
    }
    dispatch(searchLocalProducts(query));
  }, 300);

  const handleSearch = (query) => {
    setSearchQuery(query);
    debouncedSearch(query);
  };

  const handleSelectProduct = (id) => {
    setSearchQuery("");
    dispatch(clearSearchResults());
    navigate(`/product/${id}`);
  };

  return (
    <div className={`header-wrapper ${mode}`}>
      <nav className="header-nav">
        {/* Sol Menü */}
        <div className="nav-left">
          <Link
  to="/"
  onClick={(e) => {
    e.preventDefault();        // Link'in kendi navigate etmesini engelle
   navigate("/"); // ✅ Tam sayfa yenile
  }}
>
  ANASAYFA
</Link>

          <Link to="/contact">İLETİŞİM</Link>
          <Link to="/categories">KATEGORİLER</Link>
        </div>

        {/* Arama */}
        <div className="nav-search">
          <SearchBar
            searchQuery={searchQuery}
            onSearchChange={handleSearch}
            searchResults={searchResults}
            searchLoading={searchLoading}
            onSelectProduct={handleSelectProduct}
          />
        </div>

        {/* Sağ Menü */}
        <div
          className="nav-right"
          style={{ display: "flex", alignItems: "center", gap: "10px" }}
        >
          {!token ? (
            <>
              <Button component={Link} to="/login">
                GİRİŞ YAP
              </Button>
              <Button component={Link} to="/register">
                KAYIT OL
              </Button>
            </>
          ) : (
            <>
              <Tooltip title="Favoriler">
                <IconButton onClick={() => navigate("/favorites")}>
                  <FavoriteTwoToneIcon color="error" />
                </IconButton>
              </Tooltip>

              {/* Kullanıcı menüsü */}
              <div style={{ display: "flex", alignItems: "center" }}>
                <Button
                  onClick={handleMenuOpen}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    textTransform: "none",
                    gap: "8px",
                    color: "#1976d2"
                  }}
                >
                  <Avatar
                    src={user?.profileImage || ""}
                    alt={user?.name || "User"}
                    sx={{
                      width: 32,
                      height: 32,
                      bgcolor: user?.profileImage ? "transparent" : "#1976d2",
                    }}
                  >
                    {!user?.profileImage && user?.name?.[0]?.toUpperCase()}
                  </Avatar>
                  {user?.name || "Kullanıcı"}
                </Button>

                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                >
                  <MenuItem component={Link} to="/profile" onClick={handleMenuClose}>
                    Profil
                  </MenuItem>
                  <MenuItem component={Link} to="/settings" onClick={handleMenuClose}>
                    Ayarlar
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>Çıkış Yap</MenuItem>
                </Menu>
              </div>
            </>
          )}

          <Tooltip title={mode === "dark" ? "Gündüz Modu" : "Gece Modu"}>
            <ThemeToggle />
          </Tooltip>

          <BasketDrawer itemCount={totalItems} />
        </div>
      </nav>
    </div>
  );
}

export default HeaderDisplay;