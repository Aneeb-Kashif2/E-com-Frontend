import React from "react";
import { motion } from "framer-motion";

// Reusable animation variants
const fadeUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

const About = () => {
  return (
    <div className="w-full">
      {/* Section 1 - Hero */}
      <section className="relative h-screen flex items-center justify-center bg-gray-900 text-white">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="text-center px-6"
        >
          <h1 className="text-5xl font-bold mb-6">About Our AI-Powered Grocery Store</h1>
          <p className="max-w-2xl mx-auto text-lg text-gray-300">
            We combine AI with a modern shopping experience, delivering fresh groceries
            and personalized recommendations right to your home.
          </p>
        </motion.div>
        <img
          src="https://images.unsplash.com/photo-1600891964599-f61ba0e24092"
          alt="Groceries"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
      </section>

      {/* Section 2 - Mission */}
      <section className="py-20 bg-white text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="max-w-4xl mx-auto px-6"
        >
          <h2 className="text-4xl font-bold mb-6">Our Mission</h2>
          <p className="text-gray-600 text-lg">
            Our mission is to make grocery shopping seamless, smart, and sustainable.
            Using AI, we predict your needs and optimize delivery, ensuring you never
            run out of essentials.
          </p>
        </motion.div>
      </section>

      {/* Section 3 - AI Features */}
      <section className="py-20 bg-gray-100">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="grid md:grid-cols-2 gap-10 items-center max-w-6xl mx-auto px-6"
        >
          <img
            src="https://images.unsplash.com/photo-1586201375761-83865001e17a"
            alt="AI Features"
            className="rounded-2xl shadow-lg"
          />
          <div>
            <h2 className="text-3xl font-bold mb-4">AI-Powered Recommendations</h2>
            <p className="text-gray-600 text-lg mb-4">
              Our system learns your buying habits and suggests the right products
              at the right time. Save time, money, and energy.
            </p>
            <ul className="list-disc text-gray-600 pl-6">
              <li>Personalized grocery lists</li>
              <li>Expiry & restock reminders</li>
              <li>Seasonal and healthy suggestions</li>
            </ul>
          </div>
        </motion.div>
      </section>

      {/* Section 4 - Stripe Payments */}
      <section className="py-20 bg-white">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="grid md:grid-cols-2 gap-10 items-center max-w-6xl mx-auto px-6"
        >
          <div>
            <h2 className="text-3xl font-bold mb-4">Secure Payments with Stripe</h2>
            <p className="text-gray-600 text-lg">
              We use Stripe to process all payments, ensuring safety, reliability,
              and instant checkout experiences.
            </p>
            <p className="mt-4 text-gray-600">
              Whether you’re paying with a card, wallet, or subscription — your
              transactions are 100% secure.
            </p>
          </div>
          <img
            src="https://images.unsplash.com/photo-1612815154858-60aa4c3d20d2"
            alt="Stripe Payment"
            className="rounded-2xl shadow-lg"
          />
        </motion.div>
      </section>

      {/* Section 5 - Sustainability */}
      <section className="py-20 bg-green-100">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="grid md:grid-cols-2 gap-10 items-center max-w-6xl mx-auto px-6"
        >
          <img
            src="https://images.unsplash.com/photo-1524594154908-edd1f1dfd1d6"
            alt="Sustainable"
            className="rounded-2xl shadow-lg"
          />
          <div>
            <h2 className="text-3xl font-bold mb-4">Sustainability First</h2>
            <p className="text-gray-700 text-lg">
              From eco-friendly packaging to optimized delivery routes, we’re committed
              to reducing waste and carbon footprint while providing top-quality groceries.
            </p>
          </div>
        </motion.div>
      </section>

      {/* Section 6 - Team */}
      
    </div>
  );
};

export default About;
