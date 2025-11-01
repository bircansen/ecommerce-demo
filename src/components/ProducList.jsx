// src/components/ProducList.jsx
import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getAllProduct } from '../redux/ProductsSlice'
import Product from './Product'
import '../css/Product.css'

function ProducList() {
  const products = useSelector((store) => store.products.products)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getAllProduct())
  }, [dispatch])

  return (
    <div className='card-container'>
      {products && products.map((item) => (
        <Product key={item.id} {...item} />
      ))}
    </div>
  )
}

export default ProducList
