// src/components/ProductList.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import Product from "./Product";
import "../css/Product.css";


function ProductList() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const limit = 24;

  const fetchProducts = async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const res = await axios.get(`/api/products?page=${page}&limit=${limit}`);
      const data = res.data.data || res.data;

      if (data.length < limit) setHasMore(false);

      setProducts((prev) => [...prev, ...data]);
    } catch (err) {
      console.error("ProductList Hatası:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page]);

  useEffect(() => {
    const onScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
          document.body.offsetHeight - 100 &&
        !loading &&
        hasMore
      ) {
        setPage((p) => p + 1);
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [hasMore, loading]);

  return (
    <div className="products-grid">
      {products.map((p) => {
        const productId = p._id || p.id || p.asin;
        return (
          <Product
            key={productId}
            productId={productId}
            {...p}
          />
        );
      })}

      {!hasMore && (
        <p style={{ textAlign: "center" }}>Tüm ürünler yüklendi.</p>
      )}
    </div>
  );
}

export default ProductList;
