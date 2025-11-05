import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from '../pages/Home'
import BasketComp from './BasketComp'
import Contact from '../pages/Contact'
import ProductDetails from './ProductDetails'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Favorites from '../pages/Favorites'
import Profile from '../pages/Profile'
import Settings from '../pages/Settings'
import Categories from '../pages/Categories'
import CheckoutStepper from "./CheckoutStepper";
import PaymentSuccess from "../pages/PaymentSuccess"
import PaymentFailure from "../pages/PaymentFailure"

function Router() {
  return (
    <div> 
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/categories" element={<Categories/>} />
       <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/basket" element={<BasketComp />} />
        <Route path="/login" element={<Login />} />
       <Route path="/register" element={<Register />} />
       <Route path="/favorites" element={<Favorites />} />
       <Route path="/profile" element={<Profile />} />
      <Route path="/settings" element={<Settings />} />
        <Route path="/checkout" element={<CheckoutStepper />} />
        <Route path='/checkout/success' element={<PaymentSuccess/>}/>
        <Route path='/checkout/failures' element={<PaymentFailure/>}/>
      </Routes>
      </div>
  
  )
}

export default Router
