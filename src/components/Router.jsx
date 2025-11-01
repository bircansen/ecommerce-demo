import React from 'react'
import { Routes, Route } from 'react-router-dom'
import ProductPage from '../pages/ProductPage'
import Home from '../pages/Home'
import BasketComp from './BasketComp'
import Contact from '../pages/Contact'
import ProductDetails from './ProductDetails'

function Router() {
  return (
    <div> 
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/productpage" element={<ProductPage />} />
        <Route path="/product-details/:id" element={<ProductDetails />} />
        <Route path="/basket" element={<BasketComp />} />
      </Routes>
      </div>
  
  )
}

export default Router
