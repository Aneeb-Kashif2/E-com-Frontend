import React from 'react'
import { Hero } from '../pages/Hero'
import { FeaturedCategories } from '../pages/Hero';
import AllProduct from '../pages/AllProduct';

function Home() {
  return (
    <div>
      <Hero />
      <FeaturedCategories />
      <AllProduct />
    </div>
  )
}

export default Home
