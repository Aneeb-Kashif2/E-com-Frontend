import React, { useEffect, useState } from "react";
import axios from "axios";
import { useCart } from "../context/CartContext"; // ✅ import context

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  const { fetchCart: fetchCartContext } = useCart(); // ✅ get context fetchCart

  const fetchCart = async () => {
    try {
      const res = await axios.get("http://localhost:8000/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart(res.data.items || []);
    } catch (error) {
      setCart([]);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      const res = await axios.put(
        "http://localhost:8000/cart/update",
        { productId, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCart(res.data.cart.items);

      // ✅ Update navbar dynamically
      fetchCartContext();
    } catch (error) {}
  };

  const removeItem = async (productId) => {
    try {
      const res = await axios.delete(
        `http://localhost:8000/cart/remove/${productId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCart(res.data.cart.items);

      // ✅ Update navbar dynamically
      fetchCartContext();
    } catch (error) {}
  };

  useEffect(() => {
    fetchCart();
  }, []);

  if (loading) return <p className="text-center">Loading cart...</p>;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-5 bg-white shadow-lg rounded-2xl">
      <h1 className="text-2xl font-bold mb-5">🛒 Your Cart</h1>
      {cart.length === 0 ? (
        <p className="text-gray-600">Your cart is empty.</p>
      ) : (
        <div>
          {cart.map((item) => (
            <div
              key={item.productId._id}
              className="flex items-center justify-between border-b py-3"
            >
              <div>
                <h2 className="font-semibold">
                  {item.productId?.name || "Unnamed Product"}
                </h2>
                <p className="text-gray-500">
                  Price: ${item.productId?.price || 0}
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  className="px-2 py-1 bg-gray-300 rounded"
                  onClick={() =>
                    updateQuantity(item.productId._id, item.quantity - 1)
                  }
                  disabled={item.quantity <= 1}
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  className="px-2 py-1 bg-gray-300 rounded"
                  onClick={() =>
                    updateQuantity(item.productId._id, item.quantity + 1)
                  }
                >
                  +
                </button>

                <button
                  className="ml-3 px-3 py-1 bg-red-500 text-white rounded"
                  onClick={() => removeItem(item.productId._id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          <div className="text-right mt-5">
            <h2 className="text-xl font-bold">
              Total: $
              {cart.reduce(
                (total, item) =>
                  total + (item.productId?.price || 0) * item.quantity,
                0
              )}
            </h2>
            <button className="mt-3 px-5 py-2 bg-green-500 text-white rounded">
              Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
