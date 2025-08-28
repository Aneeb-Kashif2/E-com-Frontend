import React from "react";
import { motion } from "framer-motion";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

const Contact = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white px-6 py-16">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-emerald-400 drop-shadow-lg">
          Contact Us
        </h1>
        <p className="text-slate-300 mt-4 max-w-2xl mx-auto">
          We’d love to hear from you! Whether you have a question about products,
          payments, or anything else, our team is ready to answer all your
          questions.
        </p>
      </motion.div>

      {/* Contact Details */}
      <div className="grid md:grid-cols-3 gap-8 mb-16">
        {[
          {
            icon: <FaPhoneAlt className="text-emerald-400 text-3xl mb-3" />,
            title: "Phone",
            detail: "+92 300 1234567",
          },
          {
            icon: <FaEnvelope className="text-emerald-400 text-3xl mb-3" />,
            title: "Email",
            detail: "support@groceryai.com",
          },
          {
            icon: <FaMapMarkerAlt className="text-emerald-400 text-3xl mb-3" />,
            title: "Office",
            detail: "Islamabad, Pakistan",
          },
        ].map((item, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            className="bg-slate-800 rounded-2xl shadow-xl p-6 text-center"
          >
            {item.icon}
            <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
            <p className="text-slate-400">{item.detail}</p>
          </motion.div>
        ))}
      </div>

      {/* Contact Form */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9 }}
        className="max-w-4xl mx-auto bg-slate-800 rounded-2xl shadow-lg p-10 grid md:grid-cols-2 gap-10"
      >
        {/* Left Side Image */}
        <div className="hidden md:block">
          <img
            src="https://images.unsplash.com/photo-1606788075761-013d6c7d17c5?auto=format&fit=crop&w=800&q=80"
            alt="Contact illustration"
            className="rounded-2xl shadow-lg h-full object-cover"
          />
        </div>

        {/* Right Side Form */}
        <form className="space-y-6">
          <div>
            <label className="block text-slate-300 mb-2">Your Name</label>
            <input
              type="text"
              placeholder="John Doe"
              className="w-full p-3 rounded-lg bg-slate-900 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-2">Email Address</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full p-3 rounded-lg bg-slate-900 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-2">Message</label>
            <textarea
              rows="4"
              placeholder="Write your message here..."
              className="w-full p-3 rounded-lg bg-slate-900 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            ></textarea>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 rounded-lg shadow-md transition duration-300"
          >
            Send Message
          </motion.button>
        </form>
      </motion.div>

      {/* Map Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="mt-16"
      >
        <iframe
          title="Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3311.541454612791!2d73.0551!3d33.6844"
          width="100%"
          height="400"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          className="rounded-2xl shadow-lg"
        ></iframe>
      </motion.div>
    </div>
  );
};

export default Contact;
