import React, { useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

function Login({ setUser }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
   const { fetchCart } = useCart(); 

  const UserLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8000/login", 
        { email, password },
        { withCredentials: true }
      );

      setMessage(response.data.message || "Login successful 🎉");
      
      // Store token in localStorage as backup
      const token = response.data.token;
      if (token) {
        localStorage.setItem("token", token);
        const decoded = jwtDecode(token);
        setUser(decoded);
        await fetchCart();
      }
      
      navigate("/");
    } catch (err) {
      console.error("Error:", err);
      setMessage(err.response?.data?.message || "Login failed ❌");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <div className="w-full max-w-md bg-gray-800 rounded-2xl shadow-2xl p-8">
        <h1 className="text-3xl font-bold text-center text-white mb-6">Login</h1>
        <form onSubmit={UserLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300">Email</label>
            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 px-4 py-2 border border-gray-600 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Password</label>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 px-4 py-2 border border-gray-600 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-indigo-700 transition duration-300"
          >
            Login
          </button>
        </form>
        {message && (
          <p
            className={`mt-4 text-center font-medium ${
              message.includes("successful") ? "text-green-400" : "text-red-400"
            }`}
          >
            {message}
          </p>
        )}
        <p className="mt-4 text-center text-gray-400">
          Don't have an account?{" "}
          <a href="/signup" className="text-indigo-400 hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login;