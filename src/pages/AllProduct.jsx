import axios from "axios";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

function AllProduct() {
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const product = await axios("http://localhost:8000/all-products");
      setProducts(product.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <section className="mb-20 px-6 lg:px-12">
      {/* Section Heading */}
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-bold text-gray-800 text-center mb-12"
      >
        Shop Our Collection
      </motion.h2>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {products.length > 0 ? (
          products.map((product, index) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-md overflow-hidden group hover:shadow-xl transition-all duration-500"
            >
              {/* Image */}
              <div className="overflow-hidden">
                <img
                  src={
                    product.image ||
                    "https://source.unsplash.com/600x600/?product"
                  }
                  alt={product.name}
                  className="w-full h-72 object-cover transform group-hover:scale-105 transition-transform duration-500 ease-out"
                />
              </div>

              {/* Details */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-indigo-600 transition-colors duration-300">
                  {product.name}
                </h3>
                <p className="text-lg font-medium text-gray-700 mb-1">
                  ${product.price}
                </p>
                <p className="text-sm text-gray-500 mb-1">
                  Category:{" "}
                  <span className="font-medium">
                    {product.category?.name || "N/A"}
                  </span>
                </p>
                <p className="text-sm text-gray-500 mb-6">
                  Brand: <span className="font-medium">{product.brand}</span>
                </p>

                {/* Button */}
                <button className="w-full bg-indigo-600 text-white font-semibold py-2 rounded-lg hover:bg-indigo-700 transform hover:scale-[1.02] transition-all duration-300 ease-out">
                  Add to Cart
                </button>
              </div>
            </motion.div>
          ))
        ) : (
          <p className="text-center col-span-3 text-gray-600">
            No products found.
          </p>
        )}
      </div>
    </section>
  );
}

export default AllProduct;
