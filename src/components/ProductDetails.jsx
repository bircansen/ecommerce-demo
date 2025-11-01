import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedProduct } from '../redux/ProductsSlice';
import { addToBasket } from '../redux/BasketSlice';

function ProductDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products, selectedProduct } = useSelector((store) => store.products);

  // Ürünü seç
  React.useEffect(() => {
    const product = products.find(p => String(p.id) === String(id));
    if (product) dispatch(setSelectedProduct(product));
  }, [id, products, dispatch]);

  if (!selectedProduct || !selectedProduct.id) return <div>Ürün yükleniyor veya bulunamadı.</div>;

  // Sepete ekleme fonksiyonu
  const handleAddToBasket = () => {
    dispatch(addToBasket(selectedProduct));
    // navigate('/basket'); // istersen sepete gidilebilir
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>{selectedProduct.title}</h1>
      <img src={selectedProduct.image} alt={selectedProduct.title} style={{ width: 200 }} />
      <p>Fiyat: {selectedProduct.price} ₺</p>
      <p>{selectedProduct.description}</p>
      <button onClick={handleAddToBasket}>Sepete Ekle</button>
    </div>
  );
}

export default ProductDetails;
