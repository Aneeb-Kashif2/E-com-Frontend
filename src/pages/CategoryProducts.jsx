import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const API_BASE = "http://localhost:8000";
const currency = (n) =>
  new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(Number(n || 0));

const CategoryProducts = () => {
  const { categoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${API_BASE}/category/${categoryId}`);
        setProducts(res.data.products || []);
        setCategoryName(res.data.category || "");
      } catch (err) {
        console.error("Error fetching category products", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [categoryId]);

  const handleAddToCart = async (product) => {
    try {
      await axios.post(
        `${API_BASE}/cart/add`,
        { productId: product._id, qty: 1 },
        { withCredentials: true }
      );
      alert(`${product.name} added to cart!`);
    } catch (err) {
      console.error(err);
      alert("Failed to add to cart");
    }
  };

  if (loading)
    return <p className="text-center text-lg text-gray-600 mt-10">Loading...</p>;

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-3xl font-bold mb-8 text-gray-900 text-center">
        {categoryName ? `${categoryName} Products` : "Products"}
      </h2>

      {products.length === 0 ? (
        <p className="text-center text-gray-600">No products found in this category.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden flex flex-col"
            >
              <div className="relative w-full h-48">
                <img
                  src={product.images?.[0] || "/images/placeholder.jpg"}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-semibold text-lg line-clamp-1">{product.name}</h3>
                  <p className="text-gray-500 mt-1 line-clamp-2">{product.description || "High-quality product"}</p>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="font-bold text-blue-600 text-lg">{currency(product.price)}</span>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryProducts;
