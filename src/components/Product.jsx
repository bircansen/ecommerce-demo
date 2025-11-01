// src/components/Product.jsx
import React from 'react'
import { useNavigate } from 'react-router-dom'
import '../css/Product.css'

function Product({ id, title, price, description, image }) {
  const navigate = useNavigate()

  return (
    <div className='card' style={{ cursor: 'pointer' }}>
      <h2>{title}</h2>
      <img src={image} alt={title} style={{ width: 100, height: 150 }} />
      <h3>FİYATI: {price} ₺</h3>
      <h5>{description}</h5>
      <button onClick={() => navigate(`/product-details/${id}`)}>Ürün Görüntüle</button>
    </div>
  )
}

export default Product
