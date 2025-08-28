import React, { useState } from "react";
import axios from "axios";
import { useCart } from "../context/CartContext";
import { FaCreditCard, FaTruck } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY); // your pk_test key

const Checkout = () => {
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const { cart } = useCart();

  const subtotal =
    cart?.items?.reduce(
      (sum, item) => sum + (item.productId?.price || 0) * item.quantity,
      0
    ) || 0;

  // ✅ Place order handler
const placeOrder = async () => {
  try {
    if (paymentMethod === "cod") {
      // 🟢 COD -> directly create order
      const res = await axios.post(
        "http://localhost:8000/order/place",
        { paymentMethod },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(`✅ Order placed successfully with COD`);
      console.log(res.data);

    } else if (paymentMethod === "stripe") {
      // 🟢 Stripe -> only create checkout session (❌ don't create order here)
      const stripe = await stripePromise;

      const res = await axios.post(
        "http://localhost:8000/create-checkout-session",
        {
          userId,
          cartItems: cart.items.map((item) => ({
            _id: item.productId._id,
            name: item.productId.name,
            price: item.productId.price,
            quantity: item.quantity,
          })),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { id: sessionId } = res.data;

      // Redirect to Stripe Checkout
      await stripe.redirectToCheckout({ sessionId });
    }
  } catch (err) {
    console.error("❌ Checkout error:", err.response?.data || err.message);
    alert("❌ Failed to place order");
  }
};


  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Cart Items */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold border-b pb-4 mb-6">
            Review your items
          </h2>
          <AnimatePresence>
            {cart?.items?.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {cart.items.map((item, idx) => (
                  <motion.li
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex gap-4 py-6"
                  >
                    {/* Product image */}
                    <div className="w-20 h-20 bg-gray-100 flex items-center justify-center rounded-md overflow-hidden">
                      {item.productId?.image ? (
                        <img
                          src={item.productId.image}
                          alt={item.productId?.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-gray-400 text-sm">No Image</span>
                      )}
                    </div>

                    {/* Product details */}
                    <div className="flex-1">
                      <p className="text-lg font-medium text-gray-900">
                        {item.productId?.name || "Product"}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Qty: {item.quantity}
                      </p>
                      <p className="text-sm text-gray-700 mt-2">
                        ${(item.productId?.price || 0).toFixed(2)} each
                      </p>
                    </div>

                    {/* Price */}
                    <div className="text-lg font-semibold text-gray-900">
                      ${(item.productId?.price || 0) * item.quantity}
                    </div>
                  </motion.li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-center py-10">
                Your cart is empty.
              </p>
            )}
          </AnimatePresence>
        </div>

        {/* Right: Payment + Summary */}
        <div className="bg-white rounded-lg shadow-md p-6 h-fit sticky top-6">
          <h2 className="text-xl font-semibold mb-6 border-b pb-4">
            Order Summary
          </h2>

          {/* Subtotal */}
          <div className="flex justify-between text-lg font-medium mb-6">
            <span>Subtotal</span>
            <span>Rs .{subtotal.toFixed(2)}</span>
          </div>

          {/* Payment Options */}
          <div className="space-y-4 mb-6">
            <label
              className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition ${
                paymentMethod === "stripe"
                  ? "border-indigo-600 bg-indigo-50"
                  : "border-gray-200 hover:border-indigo-400"
              }`}
            >
              <input
                type="radio"
                name="payment"
                value="stripe"
                checked={paymentMethod === "stripe"}
                onChange={() => setPaymentMethod("stripe")}
                className="h-5 w-5 text-indigo-600 accent-indigo-600"
              />
              <FaCreditCard className="text-indigo-600 text-xl" />
              <span className="text-gray-900 font-medium">Pay with Stripe</span>
            </label>

            <label
              className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition ${
                paymentMethod === "cod"
                  ? "border-indigo-600 bg-indigo-50"
                  : "border-gray-200 hover:border-indigo-400"
              }`}
            >
              <input
                type="radio"
                name="payment"
                value="cod"
                checked={paymentMethod === "cod"}
                onChange={() => setPaymentMethod("cod")}
                className="h-5 w-5 text-indigo-600 accent-indigo-600"
              />
              <FaTruck className="text-indigo-600 text-xl" />
              <span className="text-gray-900 font-medium">
                Cash on Delivery
              </span>
            </label>
          </div>

          {/* Place Order */}
          <button
            onClick={placeOrder}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition"
          >
            Place your order
          </button>

          {/* Disclaimer */}
          <p className="text-xs text-gray-500 mt-4 text-center">
            By placing your order, you agree to our{" "}
            <span className="text-indigo-600 cursor-pointer hover:underline">
              privacy notice
            </span>{" "}
            and{" "}
            <span className="text-indigo-600 cursor-pointer hover:underline">
              conditions of use
            </span>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
