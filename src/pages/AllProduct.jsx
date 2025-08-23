import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

function AllProduct() {
  
    const[products , setProducts] = useState("");

    const fetchProducts = async () =>{
        try{
            const product = await axios("http://localhost:8000/all-products");
        setProducts(product.data);
        }
        catch (err){
            console.error("Error fetching products:", err);
            setError("Failed to fetch products.");
        }
    }
    useEffect(() =>{
         fetchProducts();
    } , [])
 return (
  <section className="mb-12">
    <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">All Products</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.length > 0 ? (
        products.map((product) => (
          <div
            key={product._id}
            className="bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-xl transition-shadow duration-300"
          >
            <img
              src={product.image || "https://source.unsplash.com/400x400/?product"}
              alt={product.name}
              className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="p-5 text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{product.name}</h3>
              <p className="text-lg text-gray-600 mb-1">Price: ${product.price}</p>
              <p className="text-sm text-gray-500 mb-1">Category: {product.category?.name || "N/A"}</p>
              <p className="text-sm text-gray-500 mb-4">Brand: {product.brand}</p>
              <button className="bg-indigo-600 text-white font-bold py-2 px-6 rounded-full hover:bg-indigo-700 transition-colors duration-300">
                Add to Cart

              </button>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center col-span-3 text-gray-600">No products found.</p>
      )}
    </div>
  </section>
);

}

export default AllProduct;
