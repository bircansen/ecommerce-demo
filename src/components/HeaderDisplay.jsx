import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../css/Header.css'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import Badge from '@mui/material/Badge';
import { useSelector } from 'react-redux'
import { store } from '../redux/Store'

function HeaderDisplay() {
  const navigate = useNavigate();
  const addedToBasket = useSelector((store) => store.basket.addedToBasket || []);
const totalItems = addedToBasket.length;


  return (
    <div className="header-wrapper">
      <nav className="header-nav">
        <Link to="/">ANASAYFA</Link>
        <Link to="/contact">İLETİŞİM</Link>
        <Link to="/productpage">ÜRÜNLERİMİZ</Link>
         <Badge badgeContent={totalItems} color="primary">
     <Tooltip title="Sepet">
          <IconButton
            onClick={() => navigate('/basket')}
            style={{ color: 'white' }}
          >
            <ShoppingCartIcon />
          </IconButton>
        </Tooltip>
    </Badge>
        
      </nav>
      </div>
  )
}

export default HeaderDisplay
