import '../logo1.css';
import { Button, Container } from '@mui/material'
import React from 'react'
import { Link } from 'react-router-dom';
import Header from './Header'
import backImg from '../images/heroPage.jpg';
function HomePage() {
  return (
    <div style={{ position: 'relative' }}
    >
      <Header />
      <div 
        style={{
          backgroundImage: `url(${backImg})`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          height: '100vh',
          
        }}
      >
          <div className="animated-text">
            <div>G<span></span>
              <div>Through </div>
            </div>
          </div>
          <Button href='/category' variant="contained" size='large' sx={{ position: 'absolute', right: '280px', bottom: '60px', backgroundColor: 'primary' }}>Explore</Button>
        </div>
      </div>
    
  )
}

export default HomePage