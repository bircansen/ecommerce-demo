import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addToBasket, decreaseQuantity, removeFromBasket, clearBasket } from '../redux/BasketSlice';
import Badge from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';

function BasketComp() {
  const dispatch = useDispatch();
  const addedToBasket = useSelector(store => store.basket.addedToBasket || []);

  // Sepetteki toplam adet (badge için)
  const totalItems = addedToBasket.reduce((acc, item) => acc + item.quantity, 0);

  // Sepetteki tüm ürünlerin toplam fiyatı
  const totalPrice = addedToBasket.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const handleClearBasket = () => {
    dispatch(clearBasket());
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>
        Sepetim{' '}
        <Badge badgeContent={totalItems} color="primary">
          <ShoppingCartIcon fontSize="large" />
        </Badge>
      </h2>

      {addedToBasket.length === 0 && <p>Sepet boş.</p>}

      {addedToBasket.map(item => (
        <div
          key={item.id}
          style={{
            marginBottom: 20,
            border: '1px solid #ddd',
            padding: 10,
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            maxWidth: 700,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <img
              src={item.image}
              alt={item.title}
              style={{ width: 100, height: 100, objectFit: 'contain' }}
            />
            <div>
              <h3>{item.title}</h3>
              <p>Fiyat: {item.price} ₺</p> {/* Her ürünün kendi fiyatı */}
            </div>
          </div>

          {/* Adet kontrol */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <IconButton
              onClick={() => dispatch(decreaseQuantity(item))}
              style={{
                backgroundColor: '#f0f0f0',
                borderRadius: '50%',
                width: 35,
                height: 35,
              }}
              size="small"
            >
              <RemoveIcon fontSize="small" />
            </IconButton>

            <span style={{ minWidth: 20, textAlign: 'center', fontWeight: 'bold' }}>
              {item.quantity}
            </span>

            <IconButton
              onClick={() => dispatch(addToBasket(item))}
              style={{
                backgroundColor: '#007fff',
                color: 'white',
                borderRadius: '50%',
                width: 35,
                height: 35,
              }}
              size="small"
            >
              <AddIcon fontSize="small" />
            </IconButton>

            <IconButton
              onClick={() => dispatch(removeFromBasket(item))}
              style={{
                backgroundColor: '#ff4d4f',
                color: 'white',
                borderRadius: '50%',
                width: 35,
                height: 35,
                marginLeft: 10
              }}
              size="small"
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </div>
        </div>
      ))}

      {addedToBasket.length > 0 && (
        <>
          {/* Toplam Fiyat */}
          <div
            style={{
              padding: '15px 20px',
              borderRadius: 8,
              backgroundColor: '#f5f5f5',
              fontWeight: 'bold',
              fontSize: '1.2rem',
              maxWidth: 700,
              marginBottom: 10,
              boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
              color: 'black'
            }}
          >
            Toplam Fiyat: {totalPrice} ₺
          </div>

          {/* Sepeti Boşalt Butonu */}
          <button
            onClick={handleClearBasket}
            style={{
              marginTop: 0,
              padding: '10px 20px',
              borderRadius: 6,
              border: 'none',
              background: '#007fff',
              color: 'white',
              cursor: 'pointer',
              fontWeight: 'bold',
              maxWidth: 700
            }}
          >
            Sepeti Boşalt
          </button>
        </>
      )}
    </div>
  );
}

export default BasketComp;
