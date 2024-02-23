import { Container } from '@mui/material'
import React from 'react'
import Header from './Header'
import backImg from '../images/why.jpg';
function HomePage() {
  return (
    <div
    style={{
      backgroundImage: `url(${backImg})`,
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      height: '100vh',
    }}>
      <Header />
    </div>
  )
}

export default HomePage