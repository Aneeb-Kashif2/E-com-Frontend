// CartContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

export const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [] });

  // Fetch cart from backend
  const fetchCart = async () => {
    try {
      const res = await axios.get("http://localhost:8000/cart", {
        withCredentials: true,
      });
      setCart(res.data);
    } catch (err) {
      setCart({ items: [] });
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // Add to cart
  const addToCart = async (productId, quantity = 1) => {
    try {
      await axios.post(
        "http://localhost:8000/cart/add",
        { productId, quantity },
        { withCredentials: true }
      );

      // Optimistic UI update
      setCart((prev) => {
        const existing = prev.items.find((i) => i.productId === productId);
        if (existing) {
          return {
            ...prev,
            items: prev.items.map((i) =>
              i.productId === productId
                ? { ...i, quantity: i.quantity + quantity }
                : i
            ),
          };
        } else {
          return {
            ...prev,
            items: [...prev.items, { productId, quantity }],
          };
        }
      });

      fetchCart(); // sync backend
    } catch (err) {}
  };

  // Remove from cart
  const removeFromCart = async (productId) => {
    try {
      await axios.delete(`http://localhost:8000/cart/${productId}`, {
        withCredentials: true,
      });

      // Optimistic UI update
      setCart((prev) => ({
        ...prev,
        items: prev.items.filter((i) => i.productId !== productId),
      }));

      fetchCart();
    } catch (err) {}
  };

  // Update quantity
  const updateQuantity = async (productId, quantity) => {
    try {
      await axios.put(
        "http://localhost:8000/cart/update",
        { productId, quantity },
        { withCredentials: true }
      );

      // Optimistic UI update
      setCart((prev) => ({
        ...prev,
        items: prev.items.map((i) =>
          i.productId === productId ? { ...i, quantity } : i
        ),
      }));

      fetchCart();
    } catch (err) {}
  };

  // Cart count
  const cartCount =
    cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        addToCart,
        removeFromCart,
        updateQuantity,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
