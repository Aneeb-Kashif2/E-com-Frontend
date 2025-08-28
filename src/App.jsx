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
import Checkout from "./pages/Checkout";
import Success from "./pages/Success";
import AdminPanel from "./pages/admin/AdminAllFeatures";
import SubAdmin from "./pages/admin/SubAdmin";

import { CartProvider } from "./context/CartContext";
import ProtectedRoute from "./components/ProtectedRoute";
import About from "./components/About";
import Contact from "./components/Contact";
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
      <CartProvider>
        <Nav user={user} onLogout={handleLogout} />

        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          
          <Route path="/shop" element={<ShowAllProductsAndCartLogic />} />
          <Route path="/shop/all-products" element={<AllProduct />} />
          <Route path="/category/:categoryId" element={<CategoryProducts />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/success" element={<Success />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login setUser={setUser} />} />

          {/* ✅ Protected Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute user={user} allowedRoles={["admin", "subadmin"]}>
                <AdminPanel />
              </ProtectedRoute>
            }
          />

          <Route
            path="/subadmin"
            element={
              <ProtectedRoute user={user} allowedRoles={["subadmin"]}>
                <SubAdmin />
              </ProtectedRoute>
            }
          />
        </Routes>

        <Footer />
      </CartProvider>
    </Router>
  );
}

export default App;
