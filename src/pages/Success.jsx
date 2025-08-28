import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";
import { FaCheckCircle } from "react-icons/fa";

const Success = () => {
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);
  const location = useLocation();

  const token = localStorage.getItem("token");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const sessionId = params.get("session_id");

    if (sessionId) {
      axios
        .post(
          "http://localhost:8000/verify-order",
          { session_id: sessionId },
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then((res) => {
          setOrder(res.data.order);
          setLoading(false);
        })
        .catch((err) => {
          console.error("❌ Order verification failed:", err.response?.data);
          setLoading(false);
        });
    }
  }, [location.search, token]);

  if (loading) {
    return <p className="text-center mt-20">⏳ Verifying payment...</p>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="bg-white shadow-lg rounded-2xl p-8 text-center">
        <FaCheckCircle className="text-green-600 text-6xl mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-green-700 mb-2">
          Payment Successful 🎉
        </h1>
        {order ? (
          <>
            <p className="text-gray-600 mb-4">
              Your order <span className="font-semibold">#{order._id}</span> has
              been placed successfully.
            </p>
            <p className="text-gray-700 mb-6">
              Total Paid:{" "}
              <span className="font-bold">${order.totalPrice}</span>
            </p>
          </>
        ) : (
          <p className="text-red-500">⚠️ Could not create order.</p>
        )}
        <Link
          to="/"
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default Success;
