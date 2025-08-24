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

  if (loading) return <p className="text-center text-xl mt-10">Loading cart... ⏳</p>;

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Your Shopping Cart 🛍️</h1>
        {cart.length === 0 ? (
          <div className="text-center p-8 bg-white rounded-xl shadow-lg">
            <p className="text-gray-600 text-lg">Your cart is currently empty. Start shopping to add some amazing products! 🛒</p>
          </div>
        ) : (
          <div className="lg:grid lg:grid-cols-3 lg:gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Items in Your Cart</h2>
                {cart.map((item) => (
                  <div
                    key={item.productId._id}
                    className="flex items-center py-4 border-b last:border-b-0"
                  >
                    <div className="w-24 h-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                      <img
                        src={item.productId?.imageUrl || "https://via.placeholder.com/96"}
                        alt={item.productId?.name || "Product image"}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>
                    <div className="ml-4 flex flex-1 flex-col">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{item.productId?.name || "Unnamed Product"}</h3>
                        <p className="mt-1 text-sm text-gray-500">Price: <span className="font-semibold text-gray-900">Rs .{item.productId?.price || 0}</span></p>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center space-x-2">
                          <label htmlFor={`quantity-${item.productId._id}`} className="text-sm font-medium text-gray-700">Quantity</label>
                          <div className="flex items-center border border-gray-300 rounded-md">
                            <button
                              className="px-2 py-1 text-gray-500 hover:text-gray-800"
                              onClick={() => updateQuantity(item.productId._id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                            >
                              -
                            </button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <button
                              className="px-2 py-1 text-gray-500 hover:text-gray-800"
                              onClick={() => updateQuantity(item.productId._id, item.quantity + 1)}
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <div className="ml-4">
                          <button
                            className="font-medium text-red-600 hover:text-red-800"
                            onClick={() => removeItem(item.productId._id)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Order Summary Section */}
            <div className="mt-8 lg:mt-0 lg:col-span-1">
              <div className="bg-gray-50 rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Summary</h2>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <p className="text-gray-700">Subtotal</p>
                    <p className="font-medium text-gray-900">
                      Rs .{cart.reduce(
                        (total, item) =>
                          total + (item.productId?.price || 0) * item.quantity,
                        0
                      ).toFixed(2)}
                    </p>
                  </div>
                  <div className="flex justify-between border-t border-gray-200 pt-4">
                    <p className="text-lg font-bold text-gray-900">Order Total</p>
                    <p className="text-xl font-extrabold text-gray-900">
                      Rs . {cart.reduce(
                        (total, item) =>
                          total + (item.productId?.price || 0) * item.quantity,
                        0
                      ).toFixed(2)}
                    </p>
                  </div>
                </div>
                <button className="w-full mt-6 px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;