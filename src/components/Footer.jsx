import React from "react";

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-10">
      {/* Back to top */}
      <div className="text-center pb-6 border-b border-gray-700">
        <a
          href="#"
          className="text-sm font-medium text-gray-400 hover:text-white transition"
        >
          Back to top
        </a>
      </div>

      {/* Main footer sections */}
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-8 border-b border-gray-700">
        {/* Get to Know Us */}
        <div>
          <h3 className="text-white font-semibold mb-4">Get to Know Us</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-white">About Us</a></li>
            <li><a href="#" className="hover:text-white">Careers</a></li>
            <li><a href="#" className="hover:text-white">Press Releases</a></li>
            <li><a href="#" className="hover:text-white">Our Blog</a></li>
          </ul>
        </div>

        {/* Make Money with Us */}
        <div>
          <h3 className="text-white font-semibold mb-4">Make Money with Us</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-white">Sell on eShop</a></li>
            <li><a href="#" className="hover:text-white">Affiliate Program</a></li>
            <li><a href="#" className="hover:text-white">Advertise Your Products</a></li>
            <li><a href="#" className="hover:text-white">Become a Supplier</a></li>
          </ul>
        </div>

        {/* Customer Service */}
        <div>
          <h3 className="text-white font-semibold mb-4">Customer Service</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-white">Your Account</a></li>
            <li><a href="#" className="hover:text-white">Returns Centre</a></li>
            <li><a href="#" className="hover:text-white">Shipping Rates</a></li>
            <li><a href="#" className="hover:text-white">Help</a></li>
          </ul>
        </div>

        {/* Connect with Us */}
        <div>
          <h3 className="text-white font-semibold mb-4">Connect with Us</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-white">Facebook</a></li>
            <li><a href="#" className="hover:text-white">Twitter</a></li>
            <li><a href="#" className="hover:text-white">Instagram</a></li>
            <li><a href="#" className="hover:text-white">LinkedIn</a></li>
          </ul>
        </div>
      </div>

      {/* Payment and Logo Section */}
      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between">
        {/* Logo */}
        <a href="#" className="text-2xl font-bold text-white tracking-wide mb-4 md:mb-0">
          <span className="text-indigo-500">e</span>Shop
        </a>

        {/* Payment Icons (can replace with real images later) */}
        <div className="flex space-x-4">
          <span className="px-3 py-1 bg-gray-800 rounded text-xs">Visa</span>
          <span className="px-3 py-1 bg-gray-800 rounded text-xs">MasterCard</span>
          <span className="px-3 py-1 bg-gray-800 rounded text-xs">PayPal</span>
          <span className="px-3 py-1 bg-gray-800 rounded text-xs">Stripe</span>
        </div>
      </div>

      {/* Copyright */}
      <div className="bg-gray-800 py-4 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} eShop. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
