import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaBoxOpen, FaClipboardList, FaEdit, FaTrash } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";

export default function SubAdminPanel() {
  const token = localStorage.getItem("token");
  const authHeaders = { Authorization: `Bearer ${token}` };
  const [tab, setTab] = useState("products");
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [productForm, setProductForm] = useState({ name: "", description: "", price: "", category: "", brand: "", stock: "", images: "" });
  const [editingProduct, setEditingProduct] = useState(null);
  const [orders, setOrders] = useState([]);
  const [allSubadminOrders, setAllSubadminOrders] = useState([]);
  const [selectedCategoryForOrders, setSelectedCategoryForOrders] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [assignedCategories, setAssignedCategories] = useState([]);

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setAssignedCategories(decoded.assignedCategories || []);
      } catch (e) {}
    }
    fetchInitialData();
  }, [token]);

  const fetchInitialData = async () => {
    setLoading(true);
    await Promise.all([
      fetchCategories(),
      fetchProducts(),
      fetchOrdersForSubadmin(),
    ]).catch(() => {});
    setLoading(false);
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(import.meta.env.VITE_API_BASE_URL + "/categories", { headers: authHeaders });
      setCategories(res.data);
    } catch (err) {}
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get(import.meta.env.VITE_API_BASE_URL + "/products", { headers: authHeaders });
      setProducts(res.data);
    } catch (err) {}
  };

  const startEditProduct = (p) => {
    setEditingProduct(p);
    setProductForm({
      name: p.name || "",
      description: p.description || "",
      price: p.price || "",
      category: p.category?._id || p.category || "",
      brand: p.brand || "",
      stock: p.stock || "",
      images: (p.images || []).join(", "),
    });
    setTab("products");
  };

  const saveProduct = async () => {
    if (!productForm.name || !productForm.description || !productForm.price || !productForm.category) {
      return alert("Name, description, price, and category are required");
    }
    const payload = {
      name: productForm.name,
      description: productForm.description,
      price: Number(productForm.price),
      category: productForm.category,
      brand: productForm.brand,
      stock: Number(productForm.stock || 0),
      images: productForm.images ? productForm.images.split(",").map((s) => s.trim()) : [],
    };
    try {
      if (editingProduct) {
        await axios.put(`${import.meta.env.VITE_API_BASE_URL}/products/${editingProduct._id}`, payload, { headers: authHeaders });
        setMessage("Product updated");
        setEditingProduct(null);
      } else {
        await axios.post(`${import.meta.env.VITE_API_BASE_URL}/products`, payload, { headers: authHeaders });
        setMessage("Product created");
      }
      setProductForm({ name: "", description: "", price: "", category: "", brand: "", stock: "", images: "" });
      fetchProducts();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save product");
    }
  };

  const deleteProduct = async (id) => {
    if (!confirm("Delete this product?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/products/${id}`, { headers: authHeaders });
      setMessage("Product deleted");
      fetchProducts();
    } catch (err) {}
  };

  const fetchOrdersForSubadmin = async () => {
    try {
      if (assignedCategories.length === 0) {
        setOrders([]);
        setAllSubadminOrders([]);
        return;
      }
      const orderPromises = assignedCategories.map(catId => 
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/orders/category/${catId}`, { headers: authHeaders })
      );
      const responses = await Promise.all(orderPromises);
      const allFetchedOrders = responses.flatMap(res => res.data);
      const uniqueOrders = Array.from(new Set(allFetchedOrders.map(o => o._id)))
        .map(id => allFetchedOrders.find(o => o._id === id));
      setOrders(uniqueOrders);
      setAllSubadminOrders(uniqueOrders);
    } catch (err) {}
  };

  const handleOrderCategoryFilter = (catId) => {
    setSelectedCategoryForOrders(catId);
    if (catId) {
      const filtered = allSubadminOrders.filter((order) =>
        order.items.some((item) => item.product && item.product.category?._id === catId)
      );
      setOrders(filtered);
    } else {
      setOrders(allSubadminOrders);
    }
  };

  const renderTabs = () => (
    <div className="flex gap-2 flex-wrap">
      <button onClick={() => setTab("products")} className={`px-3 py-2 rounded ${tab === "products" ? "bg-indigo-600 text-white" : "bg-white"}`}>
        <FaBoxOpen className="inline-block mr-2" /> Products
      </button>
      <button onClick={() => setTab("orders")} className={`px-3 py-2 rounded ${tab === "orders" ? "bg-indigo-600 text-white" : "bg-white"}`}>
        <FaClipboardList className="inline-block mr-2" /> Orders
      </button>
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Sub-Admin Panel</h1>
          <div className="space-x-2">{renderTabs()}</div>
        </header>
        {message && (
          <div className="mb-4 p-3 bg-green-100 text-green-800 rounded">{message}</div>
        )}
        {loading && <div className="mb-4">Loading...</div>}
        {tab === "products" && (
          <div className="bg-white rounded p-4 shadow space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">Create / Edit Product</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input value={productForm.name} onChange={(e) => setProductForm((p) => ({ ...p, name: e.target.value }))} placeholder="Name" className="p-2 border rounded" />
                <select value={productForm.category} onChange={(e) => setProductForm((p) => ({ ...p, category: e.target.value }))} className="p-2 border rounded">
                  <option value="">Select Category</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
                <input value={productForm.price} onChange={(e) => setProductForm((p) => ({ ...p, price: e.target.value }))} placeholder="Price" type="number" className="p-2 border rounded" />
                <input value={productForm.stock} onChange={(e) => setProductForm((p) => ({ ...p, stock: e.target.value }))} placeholder="Stock" type="number" className="p-2 border rounded" />
                <input value={productForm.brand} onChange={(e) => setProductForm((p) => ({ ...p, brand: e.target.value }))} placeholder="Brand" className="p-2 border rounded" />
                <input value={productForm.images} onChange={(e) => setProductForm((p) => ({ ...p, images: e.target.value }))} placeholder="Images (comma separated URLs)" className="p-2 border rounded" />
                <textarea value={productForm.description} onChange={(e) => setProductForm((p) => ({ ...p, description: e.target.value }))} placeholder="Description" className="p-2 border rounded md:col-span-2" />
                <div>
                  <button onClick={saveProduct} className="bg-indigo-600 text-white px-4 py-2 rounded">{editingProduct ? 'Update' : 'Create'}</button>
                  {editingProduct && <button onClick={() => { setEditingProduct(null); setProductForm({ name: '', description: '', price: '', category: '', brand: '', stock: '', images: '' }); }} className="ml-2 px-3 py-2 border rounded">Cancel</button>}
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">All Products</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b">
                      <th className="py-2">Name</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p) => (
                      <tr key={p._id} className="border-b">
                        <td className="py-2">{p.name}</td>
                        <td>{p.category?.name || p.category}</td>
                        <td>${p.price}</td>
                        <td>{p.stock}</td>
                        <td className="flex gap-2 py-2">
                          <button onClick={() => startEditProduct(p)} className="text-indigo-600 flex items-center gap-2"><FaEdit /> Edit</button>
                          <button onClick={() => deleteProduct(p._id)} className="text-red-600 flex items-center gap-2"><FaTrash /> Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        {tab === "orders" && (
          <div className="bg-white rounded p-4 shadow space-y-6">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-semibold">Orders</h2>
              <select value={selectedCategoryForOrders} onChange={(e) => handleOrderCategoryFilter(e.target.value)} className="p-2 border rounded">
                <option value="">All assigned categories</option>
                {categories.filter(c => assignedCategories.includes(c._id)).map((c) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b">
                    <th className="py-2">Order ID</th>
                    <th>User</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Payment</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o._id} className="border-b align-top">
                      <td className="py-2">{o._id}</td>
                      <td>{o.user?.name || o.user}</td>
                      <td>
                        {o.items.map((it) => (
                          <div key={it._id} className="text-sm">{it.quantity} x {it.product?.name || it.product}</div>
                        ))}
                      </td>
                      <td>${o.totalPrice}</td>
                      <td>{o.status}</td>
                      <td>{o.paymentMethod}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}