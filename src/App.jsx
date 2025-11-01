// src/App.jsx
import './App.css'
import HeaderDisplay from './components/HeaderDisplay'
import ProducList from './components/ProducList'
import Loading from './components/Loading'
import ProductDetails from './components/ProductDetails'
import Contact from './pages/Contact'
// import { Routes, Route } from 'react-router-dom'
import ProductPage from './pages/ProductPage'
import Home from './pages/Home'
import Container from './components/Container'
import BasketComp from './components/BasketComp'
import Router from './components/Router'

function App() {
  return (
    <>
    <Container>
      <HeaderDisplay />
      <Router/>
      {/* <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/productpage" element={<ProductPage />} />
        <Route path="/product-details/:id" element={<ProductDetails />} />
        <Route path="/basket" element={<BasketComp />} />
      </Routes> */}
      <Loading />
      </Container>
      
    </>
  )
}

export default App
