import React from 'react'
import Header from './Header'
import { Container } from '@mui/material'
import Sam from './Sam.js'
import ListItemComp from './ListItemComp.js'
function CategoryPage() {
    const cats = ['Education','Health','Business']
  return (
    <div>
        <Header />
        <Container>
            <ListItemComp  />
            
            {/* <Sam /> */}
            {/* <Vegs /> */}
            {/* <Vegs /> */}
        </Container>
    </div>
  )
}

export default CategoryPage