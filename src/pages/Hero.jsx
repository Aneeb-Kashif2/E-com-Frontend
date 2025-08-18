import React, { useState, useEffect } from 'react';
 export const Hero = () => {
  const slides = [
    {
      id: 1,
      backgroundColor: 'bg-indigo-900',
      title: 'Elevate Your Style: Men\'s Fashion',
      description: 'Discover curated looks and premium quality apparel for the modern man.',
      buttonText: 'Shop Men',
    },
    {
      id: 2,
      backgroundColor: 'bg-slate-900',
      title: 'Next-Gen Tech is Here',
      description: 'Find the latest smartphones, laptops, and gadgets to power your life.',
      buttonText: 'Explore Electronics',
    },
    {
      id: 3,
      backgroundColor: 'bg-emerald-800',
      title: 'Effortless Chic: Women\'s Collection',
      description: 'Step into the new season with our collection of elegant and versatile pieces.',
      buttonText: 'Shop Women',
    },
    {
      id: 4,
      backgroundColor: 'bg-stone-800',
      title: 'Make Your House a Home',
      description: 'Browse our selection of stylish decor, furniture, and essentials for every room.',
      buttonText: 'Shop Home',
    },
    {
      id: 5,
      backgroundColor: 'bg-zinc-800',
      title: 'The Perfect Finishing Touch',
      description: 'Complete your look with our beautiful bags, watches, and jewelry.',
      buttonText: 'Shop Accessories',
    },
  ];

  // State to track the current slide index
  const [currentSlide, setCurrentSlide] = useState(0);
  // Interval time for automatic slide change (in milliseconds)
  const autoAdvanceInterval = 5000;

  // useEffect hook to handle the automatic slide change
  useEffect(() => {
    // Set up the interval timer
    const interval = setInterval(() => {
      // Advance to the next slide, or loop back to the first one
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, autoAdvanceInterval);

    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(interval);
  }, [slides.length]); // The dependency array ensures this effect runs only when the component mounts

  return (
    <div className="relative w-full overflow-hidden rounded-xl shadow-lg mb-8">
      {/* Container for all carousel slides */}
      <div className="relative h-96 md:h-[500px] lg:h-[600px]">
        {slides.map((slide, index) => (
          // Individual slide item
          <div
            key={slide.id}
            // Use CSS to transition the opacity for a smooth fade effect
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            } ${slide.backgroundColor}`}
          >
            {/* Content for the slide (title, description, button) */}
            <div
              className={`absolute inset-0 flex flex-col items-center justify-center text-center p-4 transition-all duration-1000 ease-in-out transform
                ${index === currentSlide ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            >
              <h2 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4">
                {slide.title}
              </h2>
              <p className="text-gray-200 text-base sm:text-lg md:text-xl lg:text-2xl mb-6 max-w-2xl">
                {slide.description}
              </p>
              <a
                href="#"
                className="bg-white text-gray-800 font-bold py-3 px-8 rounded-full shadow-lg hover:bg-gray-200 transition-colors duration-300"
              >
                {slide.buttonText}
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation dots at the bottom */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors duration-300 ${
              index === currentSlide ? 'bg-white scale-125' : 'bg-gray-400'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export const FeaturedCategories = () => {
  const categories = [
    { name: "Men's", image: "/images/mens-fashion.jpg", link: "/shop/mens" },
    { name: "Women's", image: "/images/womens-fashion.jpg", link: "/shop/womens" },
    { name: "Electronics", image: "/images/electronics.jpg", link: "/shop/electronics" },
    { name: "Home Goods", image: "/images/home.jpg", link: "/shop/home" },
  ];

  return (
    <section className="mb-12">
      <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
        Shop by Category
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {categories.map((category) => (
          <a
            key={category.name}
            href={category.link}
            className="relative overflow-hidden rounded-xl shadow-lg group"
          >
            <img
              src={category.image}
              alt={category.name}
              className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <h3 className="text-white text-lg sm:text-xl font-bold">
                {category.name}
              </h3>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};


export const FeaturedProducts = () => {
  const products = [
    { id: 1, name: 'Minimalist Sneaker', price: '$85.00', image: 'https://source.unsplash.com/400x400/?sneaker' },
    { id: 2, name: 'Smart Watch 2.0', price: '$199.99', image: 'https://source.unsplash.com/400x400/?smart-watch' },
    { id: 3, name: 'Classic Denim Jacket', price: '$60.00', image: 'https://source.unsplash.com/400x400/?denim-jacket' },
    { id: 4, name: 'Noise-Cancelling Headphones', price: '$249.00', image: 'https://source.unsplash.com/400x400/?headphones' },
    { id: 5, name: 'Vintage Leather Bag', price: '$120.00', image: 'https://source.unsplash.com/400x400/?leather-bag' },
    { id: 6, name: 'Portable Bluetooth Speaker', price: '$75.00', image: 'https://source.unsplash.com/400x400/?bluetooth-speaker' },
  ];

  return (
    <section className="mb-12">
      <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">Featured Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-xl transition-shadow duration-300">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="p-5 text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{product.name}</h3>
              <p className="text-lg text-gray-600 mb-4">{product.price}</p>
              <button className="bg-indigo-600 text-white font-bold py-2 px-6 rounded-full hover:bg-indigo-700 transition-colors duration-300">
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 rounded-t-xl">
      <div className="container mx-auto px-4 text-center text-sm">
        <p>&copy; 2024 eShop. All rights reserved.</p>
        <div className="flex justify-center space-x-4 mt-2">
          <a href="#" className="hover:underline">Privacy Policy</a>
          <a href="#" className="hover:underline">Terms of Service</a>
          <a href="#" className="hover:underline">Contact Us</a>
        </div>
      </div>
    </footer>
  );
};
