import React from "react";
import { ShoppingCart, User, Search, AlignRight } from "lucide-react";

export const Navbar = () => {
  return (
    <header className="bg-white sticky top-0 z-50 shadow-sm rounded-b-xl">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo and site title */}
        <a href="#" className="text-2xl font-bold text-gray-800 tracking-wide">
          <span className="text-indigo-600">e</span>Shop
        </a>

        {/* Desktop navigation links */}
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors duration-300">Home</a>
          <a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors duration-300">Shop</a>
          <a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors duration-300">About</a>
          <a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors duration-300">Contact</a>
        </nav>

        {/* Icon links */}
        <div className="flex items-center space-x-4">
          <button aria-label="Search" className="text-gray-600 hover:text-indigo-600">
            <Search size={20} />
          </button>
          <button aria-label="User Account" className="text-gray-600 hover:text-indigo-600">
            <User size={20} />
          </button>
          <button aria-label="Shopping Cart" className="text-gray-600 hover:text-indigo-600 relative">
            <ShoppingCart size={20} />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center">
              3
            </span>
          </button>
          {/* Mobile menu button */}
          <button aria-label="Open Menu" className="md:hidden text-gray-600 hover:text-indigo-600">
            <AlignRight size={24} />
          </button>
        </div>
      </div>
    </header>
  );
};
