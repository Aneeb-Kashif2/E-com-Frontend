// src/pages/Success.jsx
import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const Success = () => {
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const location = useLocation();

  // Get token from localStorage
  const token = localStorage.getItem("token");

  // Backend URL from .env
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const sessionId = params.get("session_id");

    if (!sessionId) {
      setError("No session ID found in URL.");
      setLoading(false);
      return;
    }

    // Verify order with backend
    const verifyOrder = async () => {
      try {
        const res = await axios.post(
          `${API_BASE_URL}/verify-order`,
          { session_id: sessionId },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setOrder(res.data.order);
        setLoading(false);
      } catch (err) {
        console.error(
          "❌ Order verification failed:",
          err.response?.data || err.message
        );
        setError(err.response?.data?.message || "Order verification failed.");
        setLoading(false);
      }
    };

    verifyOrder();
  }, [location.search, token, API_BASE_URL]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-lg font-semibold text-gray-700 animate-pulse">
          ⏳ Verifying payment...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 text-center max-w-md w-full">
        {error ? (
          <>
            <FaTimesCircle className="text-red-600 text-6xl mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-red-700 mb-2">
              Payment Failed ❌
            </h1>
            <p className="text-gray-600 mb-6">{error}</p>
          </>
        ) : (
          <>
            <FaCheckCircle className="text-green-600 text-6xl mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-green-700 mb-2">
              Payment Successful 🎉
            </h1>
            {order ? (
              <>
                <p className="text-gray-600 mb-4">
                  Your order{" "}
                  <span className="font-semibold text-gray-800">
                    #{order._id}
                  </span>{" "}
                  has been placed successfully.
                </p>
                <p className="text-gray-700 mb-6">
                  Total Paid:{" "}
                  <span className="font-bold text-green-700">
                    ${order.totalPrice}
                  </span>
                </p>
              </>
            ) : (
              <p className="text-red-500">⚠️ Could not create order.</p>
            )}
          </>
        )}
        <Link
          to="/"
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition duration-300"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default Success;
