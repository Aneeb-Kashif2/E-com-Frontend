import React from 'react'
import { Hero } from '../pages/Hero'
import { FeaturedCategories } from '../pages/Hero';
import AllProduct from '../pages/AllProduct';
import GroceryHomePage from '../pages/Hero';

function Home() {
  return (
    <div>
      <Hero />
      <FeaturedCategories />
      <GroceryHomePage />

    </div>
  )
}

export default Home
