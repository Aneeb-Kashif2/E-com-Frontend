// src/App.jsx

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
import SubAdminPanel from "./pages/admin/SubAdminPanel";
import { CartProvider } from "./context/CartContext";
import ProtectedRoute from "./components/ProtectedRoute";
import About from "./components/About";
import Contact from "./components/Contact";
import UserOrders from "./pages/UserOrders";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch (err) {
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <Router>
      <CartProvider>
        <Nav user={user} onLogout={handleLogout} />

        <Routes>
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

          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute user={user} allowedRoles={["admin"]}>
                <AdminPanel />
              </ProtectedRoute>
            }
          />
          <Route
            path="/subadmin"
            element={
              <ProtectedRoute user={user} allowedRoles={["subadmin"]}>
                <SubAdminPanel />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute user={user} allowedRoles={["user", "admin", "subadmin"]}>
                <UserOrders />
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
