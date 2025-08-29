// src/pages/UserOrders.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaBoxOpen, FaSpinner } from "react-icons/fa";

const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserOrders = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You must be logged in to view your orders.");
        setLoading(false);
        return;
      }

      try {
        const authHeaders = { Authorization: `Bearer ${token}` };
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/orders/my-orders`,
          { headers: authHeaders }
        );
        setOrders(response.data);
      } catch (err) {
        setError("Failed to load your orders. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-xl text-gray-600">
        <FaSpinner className="animate-spin mr-2" /> Loading orders...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-600">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">My Orders</h1>
        {orders.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <FaBoxOpen className="mx-auto text-5xl mb-4" />
            <p className="text-lg">You haven't placed any orders yet.</p>
            <p className="text-sm mt-2">
              Go to the{" "}
              <a href="/shop" className="text-indigo-600 hover:underline">
                shop
              </a>{" "}
              to find something you'll love!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="border-b pb-4 last:border-b-0">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h2 className="text-lg font-semibold">
                      Order ID: {order._id}
                    </h2>
                    <p className="text-sm text-gray-600">
                      Date: {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-xl text-green-600">
                      ${order.totalPrice}
                    </p>
                    <span
                      className={`inline-block px-2 py-1 text-xs font-semibold rounded-full mt-1 ${
                        order.status === "Delivered"
                          ? "bg-green-200 text-green-800"
                          : "bg-yellow-200 text-yellow-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-gray-700">
                  <h3 className="font-medium text-gray-800">Items:</h3>
                  <ul className="list-disc pl-5">
                    {order.items.map((item) => (
                      <li key={item._id}>
                        {item.quantity} x {item.product?.name || item.product} - $
                        {item.product?.price || "N/A"} each
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserOrders;
