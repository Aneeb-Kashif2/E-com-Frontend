import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

export const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [] });

  const getToken = () => localStorage.getItem("token"); // JWT from localStorage

  const fetchCart = async () => {
    try {
      const token = getToken();
      if (!token) return setCart({ items: [] });

      const res = await axios.get(
        import.meta.env.VITE_API_BASE_URL + "/cart",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCart(res.data);
    } catch (err) {
      setCart({ items: [] });
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const addToCart = async (productId, quantity = 1) => {
    try {
      const token = getToken();
      if (!token) return;

      await axios.post(
        import.meta.env.VITE_API_BASE_URL + "/cart/add",
        { productId, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
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

      fetchCart();
    } catch (err) {}
  };

  const removeFromCart = async (productId) => {
    try {
      const token = getToken();
      if (!token) return;

      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/cart/${productId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCart((prev) => ({
        ...prev,
        items: prev.items.filter((i) => i.productId !== productId),
      }));

      fetchCart();
    } catch (err) {}
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      const token = getToken();
      if (!token) return;

      await axios.put(
        import.meta.env.VITE_API_BASE_URL + "/cart/update",
        { productId, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCart((prev) => ({
        ...prev,
        items: prev.items.map((i) =>
          i.productId === productId ? { ...i, quantity } : i
        ),
      }));

      fetchCart();
    } catch (err) {}
  };

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
