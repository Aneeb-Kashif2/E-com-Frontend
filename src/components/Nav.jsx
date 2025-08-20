import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, User, Search, AlignRight } from "lucide-react";

const Nav = ({ user, onLogout }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const isLoggedIn = !!user;
  const isAdmin = user?.role === "admin";

  const handleLogout = () => {
    onLogout();
    navigate("/login");
  };

  return (
    <header className="bg-white sticky top-0 z-50 shadow-sm rounded-b-xl">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold text-gray-800 tracking-wide"
          onClick={() => setMenuOpen(false)}
        >
          <span className="text-indigo-600">e</span>Shop
        </Link>

        {/* Desktop nav links */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-gray-600 hover:text-indigo-600">Home</Link>
          <Link to="/shop" className="text-gray-600 hover:text-indigo-600">Shop</Link>
          <Link to="/about" className="text-gray-600 hover:text-indigo-600">About</Link>
          <Link to="/contact" className="text-gray-600 hover:text-indigo-600">Contact</Link>

          {isLoggedIn && (
            <>
              <Link to="/orders" className="text-gray-600 hover:text-indigo-600">
                My Orders
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  className="text-red-600 font-semibold hover:text-red-700"
                >
                  Admin
                </Link>
              )}
            </>
          )}
        </nav>

        {/* Icons + Auth */}
        <div className="flex items-center space-x-4">
          <button aria-label="Search" className="text-gray-600 hover:text-indigo-600">
            <Search size={20} />
          </button>

          {isLoggedIn ? (
            <>
              <span className="hidden md:inline text-sm text-gray-500">
                Hi, {user?.username || user?.email}
              </span>
              <button
                onClick={handleLogout}
                className="py-2 px-4 bg-red-600 text-white rounded-md shadow hover:bg-red-700"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="py-2 px-4 text-indigo-600 hover:text-indigo-800">
                Log In
              </Link>
              <Link
                to="/signup"
                className="py-2 px-4 bg-indigo-600 text-white rounded-md shadow hover:bg-indigo-700"
              >
                Sign Up
              </Link>
            </>
          )}

          {/* Cart */}
          <button
            aria-label="Shopping Cart"
            className="text-gray-600 hover:text-indigo-600 relative"
          >
            <ShoppingCart size={20} />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center">
              3
            </span>
          </button>

          {/* Mobile menu */}
          <button
            aria-label="Open Menu"
            className="md:hidden text-gray-600 hover:text-indigo-600"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <AlignRight size={24} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-md">
          <Link to="/" className="block px-4 py-3 text-gray-600 hover:text-indigo-600">Home</Link>
          <Link to="/shop" className="block px-4 py-3 text-gray-600 hover:text-indigo-600">Shop</Link>
          <Link to="/about" className="block px-4 py-3 text-gray-600 hover:text-indigo-600">About</Link>
          <Link to="/contact" className="block px-4 py-3 text-gray-600 hover:text-indigo-600">Contact</Link>

          {isLoggedIn ? (
            <>
              <Link to="/orders" className="block px-4 py-3 text-gray-600 hover:text-indigo-600">
                My Orders
              </Link>
              {isAdmin && (
                <Link to="/admin" className="block px-4 py-3 text-red-600 font-semibold hover:text-red-700">
                  Admin
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-3 bg-red-600 text-white hover:bg-red-700"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="block px-4 py-3 text-indigo-600 hover:text-indigo-800">
                Log In
              </Link>
              <Link
                to="/signup"
                className="block px-4 py-3 bg-indigo-600 text-white rounded-md shadow hover:bg-indigo-700 text-center"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Nav;
