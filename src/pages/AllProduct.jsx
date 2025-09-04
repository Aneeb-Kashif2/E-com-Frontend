import axios from "axios";
import React, { useEffect, useState, useCallback, memo } from "react";
import { motion } from "framer-motion";
import { useCart } from "../context/CartContext.jsx";

// ✅ Memoized ProductCard to avoid unnecessary re-renders
const ProductCard = memo(({ product, addToCart, getQuantity }) => {
  return (
    <motion.div
      key={product._id}
      variants={{
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
      }}
      className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden group"
    >
      {/* Image */}
      <div className="overflow-hidden">
        <motion.img
          src={product.image || "https://source.unsplash.com/600x600/?product"}
          alt={product.name}
          loading="lazy" // ✅ Lazy load images
          decoding="async" // ✅ Faster rendering
          className="w-full h-72 object-cover transform group-hover:scale-105 transition-transform duration-500 ease-out"
          whileHover={{ scale: 1.05 }}
        />
      </div>

      {/* Product Info */}
      <div className="p-6 flex flex-col justify-between min-h-[220px]">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors duration-300">
            {product.name}
          </h3>
          <p className="text-lg font-semibold text-indigo-600 mb-1">
            Rs. {product.price}
          </p>
          <p className="text-sm text-gray-500">
            Category:{" "}
            <span className="font-medium">
              {product.category?.name || "N/A"}
            </span>
          </p>
          <p className="text-sm text-gray-500 mb-3">
            Brand: <span className="font-medium">{product.brand}</span>
          </p>
        </div>

        {/* Add to Cart */}
        <div className="flex items-center gap-2 mt-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => addToCart(product._id, 1)}
            className="flex-1 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-semibold py-2 rounded-xl shadow-md hover:from-indigo-700 hover:to-indigo-800 transition-all duration-300"
          >
            Add to Cart
          </motion.button>

          {getQuantity(product._id) > 0 && (
            <span className="px-3 py-1 bg-indigo-100 rounded-lg text-indigo-700 font-bold shadow-sm">
              {getQuantity(product._id)}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
});

function AllProduct() {
  const [products, setProducts] = useState([]);
  const { cart, addToCart, cartCount } = useCart();

  const fetchProducts = async () => {
    try {
      const res = await axios.get(
        import.meta.env.VITE_API_BASE_URL + "/all-products"
      );
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ✅ useCallback to prevent re-creation on every render
  const getQuantity = useCallback(
    (productId) => {
      const item = cart.items.find((i) => i.productId === productId);
      return item ? item.quantity : 0;
    },
    [cart.items]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-100 py-16 px-6 font-sans text-gray-800">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-extrabold text-gray-900 text-center mb-12"
      >
        Shop Our Collection
      </motion.h2>

      {/* Cart Count */}
      <div className="text-right mb-8 text-lg font-medium text-gray-700">
        Cart Items:{" "}
        <span className="font-bold text-indigo-600">{cartCount}</span>
      </div>

      {/* Products Grid */}
      <motion.div
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
        }}
        initial="hidden"
        animate="visible"
        viewport={{ once: true }} // ✅ Animate once, improves perf
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10"
      >
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              addToCart={addToCart}
              getQuantity={getQuantity}
            />
          ))
        ) : (
          <p className="text-center col-span-3 text-gray-600">
            No products found.
          </p>
        )}
      </motion.div>
    </div>
  );
}

export default AllProduct;
