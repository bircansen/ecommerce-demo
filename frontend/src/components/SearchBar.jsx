import React from "react";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import "../css/SearchBar.css";

const SearchBar = ({
  searchQuery,
  onSearchChange,
  searchResults,
  searchLoading,
  onSelectProduct,
}) => {

  // 🔹 Görsel normalizasyon
  const getImageSrc = (item) => {
    if (!item) return "/placeholder.png";
    if (item.image && typeof item.image === "string") return item.image;
    if (Array.isArray(item.images) && item.images.length > 0) return item.images[0];
    if (Array.isArray(item.all_images) && item.all_images.length > 0) return item.all_images[0];
    return "/placeholder.png";
  };

  return (
    <div className="nav-search" style={{ position: "relative" }}>
      {/* Arama input */}
      <TextField
        fullWidth
        placeholder="Ürün ara..."
        variant="outlined"
        size="small"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />

      {/* Dropdown */}
      {searchQuery && (
        <div className="search-dropdown">
          {searchLoading && (
            <div className="search-loading">
              <CircularProgress size={24} />
            </div>
          )}

          {!searchLoading && searchResults.length > 0 && (
            searchResults.map((item) => (
              <div
                key={item.id}  // 🔹 id kullanıyoruz
                className="search-item"
                onClick={() => onSelectProduct(item.id)} // 🔹 navigate doğru id ile
              >
                <div className="search-item-text">
                  <span className="search-item-title">{item.title}</span>
                  <span className="search-item-price">
                    {item.price ? `${item.price} ₺` : "Fiyat Yok"}
                  </span>
                </div>
                <img
                  src={getImageSrc(item)}
                  alt={item.title}
                  className="search-item-img"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/placeholder.png";
                  }}
                />
              </div>
            ))
          )}

          {!searchLoading && searchResults.length === 0 && (
            <div className="search-empty">Sonuç bulunamadı.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
