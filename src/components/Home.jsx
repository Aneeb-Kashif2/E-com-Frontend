import React from 'react'
import { Hero } from '../pages/Hero'
import { FeaturedCategories } from '../pages/Hero';
import { FeaturedProducts } from '../pages/Hero';

function Home() {
  return (
    <div>
      <Hero />
      <FeaturedCategories />
      <FeaturedProducts />
    </div>
  )
}

export default Home
