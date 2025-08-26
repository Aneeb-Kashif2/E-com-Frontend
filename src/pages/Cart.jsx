import React, { useEffect, useState } from "react";
import axios from "axios";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const navigate = useNavigate();
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
      fetchCartContext(); // ✅ update navbar dynamically
    } catch (error) {}
  };

  const removeItem = async (productId) => {
    try {
      const res = await axios.delete(
        `http://localhost:8000/cart/remove/${productId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCart(res.data.cart.items);
      fetchCartContext();
    } catch (error) {}
  };

  useEffect(() => {
    fetchCart();
  }, []);

  if (loading)
    return <p className="text-center text-xl mt-10">Loading cart... ⏳</p>;

  const subtotal = cart.reduce(
    (total, item) => total + (item.productId?.price || 0) * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-semibold border-b pb-4 mb-6">
            Shopping Cart
          </h1>

          {cart.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">
                Your cart is empty. Start shopping 🛒
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {cart.map((item) => (
                <li
                  key={item.productId._id}
                  className="flex gap-4 py-6 items-center"
                >
                  {/* Product Image */}
                  <div className="w-24 h-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                    <img
                      src={
                        item.productId?.imageUrl ||
                        "https://via.placeholder.com/96"
                      }
                      alt={item.productId?.name || "Product"}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 flex flex-col">
                    <h3 className="text-lg font-medium text-gray-900">
                      {item.productId?.name || "Unnamed Product"}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Rs.{" "}
                      <span className="font-semibold text-gray-900">
                        {item.productId?.price || 0}
                      </span>
                    </p>

                    {/* Quantity Controls + Remove */}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center">
                        <button
                          className="px-3 py-1 border rounded-l-md bg-gray-50 text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                          onClick={() =>
                            updateQuantity(item.productId._id, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1}
                        >
                          −
                        </button>
                        <span className="px-4 py-1 border-t border-b text-gray-900">
                          {item.quantity}
                        </span>
                        <button
                          className="px-3 py-1 border rounded-r-md bg-gray-50 text-gray-700 hover:bg-gray-100"
                          onClick={() =>
                            updateQuantity(item.productId._id, item.quantity + 1)
                          }
                        >
                          +
                        </button>
                      </div>

                      <button
                        className="text-red-600 hover:text-red-800 font-medium"
                        onClick={() => removeItem(item.productId._id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  {/* Total for item */}
                  <div className="text-lg font-semibold text-gray-900">
                    Rs. {(item.productId?.price || 0) * item.quantity}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-lg shadow-md p-6 h-fit sticky top-6">
          <h2 className="text-xl font-semibold mb-4 border-b pb-4">
            Order Summary
          </h2>

          <div className="space-y-3">
            <div className="flex justify-between text-gray-700">
              <span>Subtotal</span>
              <span className="font-medium text-gray-900">
                Rs. {subtotal.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between border-t pt-4">
              <span className="text-lg font-bold text-gray-900">
                Order Total
              </span>
              <span className="text-xl font-extrabold text-gray-900">
                Rs. {subtotal.toFixed(2)}
              </span>
            </div>
          </div>

          <button
            onClick={() => navigate("/checkout")}
            className="w-full mt-6 px-6 py-3 rounded-md text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition"
          >
            Proceed to Checkout
          </button>

          <p className="text-xs text-gray-500 mt-4 text-center">
            Prices include applicable taxes. Shipping calculated at checkout.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Cart;
