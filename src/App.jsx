// App.js
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import Home from "./components/Home";
import Footer from "./components/Footer";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Nav from "./components/Nav";
import AllProduct from "./pages/AllProduct";
import CategoryProducts from "./pages/CategoryProducts";
import ShowAllProductsAndCartLogic from "./components/ShowAllProductsAndCartLogic";
import Cart from "./pages/Cart";

// ✅ import CartProvider
import { CartProvider } from "./context/CartContext";

function App() {
  const [user, setUser] = useState(null);

  // ✅ Check token on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch (err) {
        console.error("Invalid token", err);
        setUser(null);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <Router>
      {/* ✅ Wrap everything inside CartProvider */}
      <CartProvider>
        <Nav user={user} onLogout={handleLogout} />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/shop" element={<ShowAllProductsAndCartLogic />} />
          <Route path="/shop/all-products" element={<AllProduct />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/category/:categoryId" element={<CategoryProducts />} />
        </Routes>

        <Footer />
      </CartProvider>
    </Router>
  );
}

export default App;
