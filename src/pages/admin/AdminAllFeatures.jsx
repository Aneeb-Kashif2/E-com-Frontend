import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaUserPlus, FaTags, FaBoxOpen, FaUsers, FaClipboardList, FaTrash, FaEdit } from "react-icons/fa";

export default function AdminPanel() {
  const token = localStorage.getItem("token");
  const authHeaders = { Authorization: `Bearer ${token}` };

  const [tab, setTab] = useState("dashboard");
  const [users, setUsers] = useState([]);
  const [subadmins, setSubadmins] = useState([]);
  const [newSubadmin, setNewSubadmin] = useState({ name: "", email: "", password: "", assignedCategories: [] });
  const [categories, setCategories] = useState([]);
  const [categoryForm, setCategoryForm] = useState({ name: "", description: "" });
  const [products, setProducts] = useState([]);
  const [productForm, setProductForm] = useState({ name: "", description: "", price: "", category: "", brand: "", stock: "", images: "" });
  const [editingProduct, setEditingProduct] = useState(null);
  const [orders, setOrders] = useState([]);
  const [selectedCategoryForOrders, setSelectedCategoryForOrders] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    await Promise.all([
      fetchUsers(),
      fetchCategories(),
      fetchProducts(),
      fetchOrders(),
      fetchSubadmins(),
    ]).catch(() => {});
    setLoading(false);
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get(import.meta.env.VITE_API_BASE_URL + "/users", { headers: authHeaders });
      setUsers(res.data);
    } catch (err) {}
  };

  const deleteUser = async (userId) => {
    if (!confirm("Delete this user permanently?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/users/${userId}`, { headers: authHeaders });
      setMessage("User deleted");
      fetchUsers();
    } catch (err) {}
  };

  const fetchSubadmins = async () => {
    try {
      const res = await axios.get(import.meta.env.VITE_API_BASE_URL + "/users", { headers: authHeaders });
      const subs = res.data.filter((u) => u.role === "subadmin");
      setSubadmins(subs);
    } catch (err) {}
  };

  const createSubadmin = async () => {
    if (!newSubadmin.name || !newSubadmin.email || !newSubadmin.password) {
      alert("Please fill name, email and password");
      return;
    }
    try {
      const payload = { ...newSubadmin };
      if (!Array.isArray(payload.assignedCategories)) payload.assignedCategories = [];
      await axios.post(import.meta.env.VITE_API_BASE_URL + "/subadmin", payload, { headers: authHeaders });
      setMessage("Subadmin created");
      setNewSubadmin({ name: "", email: "", password: "", assignedCategories: [] });
      fetchSubadmins();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create subadmin");
    }
  };

  const toggleAssignCategory = (catId) => {
    setNewSubadmin((prev) => {
      const exists = prev.assignedCategories.includes(catId);
      return {
        ...prev,
        assignedCategories: exists ? prev.assignedCategories.filter((c) => c !== catId) : [...prev.assignedCategories, catId],
      };
    });
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(import.meta.env.VITE_API_BASE_URL + "/categories", { headers: authHeaders });
      setCategories(res.data);
    } catch (err) {}
  };

  const createCategory = async () => {
    if (!categoryForm.name) return alert("Category name required");
    try {
      await axios.post(import.meta.env.VITE_API_BASE_URL + "/category", categoryForm, { headers: authHeaders });
      setCategoryForm({ name: "", description: "" });
      setMessage("Category created");
      fetchCategories();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create category");
    }
  };

  const deleteCategory = async (catId) => {
    if (!confirm("Delete category? This might affect products.")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/category/${catId}`, { headers: authHeaders });
      setMessage("Category deleted");
      fetchCategories();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete category");
    }
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
      return alert("Name, description, price and category are required");
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

  const fetchOrders = async () => {
    try {
      const res = await axios.get(import.meta.env.VITE_API_BASE_URL + "/orders", { headers: authHeaders });
      setOrders(res.data);
    } catch (err) {}
  };

  const fetchOrdersByCategory = async (catId) => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/orders/category/${catId}`, { headers: authHeaders });
      setOrders(res.data);
    } catch (err) {}
  };

  const renderTabs = () => (
    <div className="flex gap-2 flex-wrap">
      <button onClick={() => setTab("dashboard")} className={`px-3 py-2 rounded ${tab === "dashboard" ? "bg-indigo-600 text-white" : "bg-white"}`}>Dashboard</button>
      <button onClick={() => setTab("users")} className={`px-3 py-2 rounded ${tab === "users" ? "bg-indigo-600 text-white" : "bg-white"}`}>Users</button>
      <button onClick={() => setTab("subadmins")} className={`px-3 py-2 rounded ${tab === "subadmins" ? "bg-indigo-600 text-white" : "bg-white"}`}>Subadmins</button>
      <button onClick={() => setTab("categories")} className={`px-3 py-2 rounded ${tab === "categories" ? "bg-indigo-600 text-white" : "bg-white"}`}>Categories</button>
      <button onClick={() => setTab("products")} className={`px-3 py-2 rounded ${tab === "products" ? "bg-indigo-600 text-white" : "bg-white"}`}>Products</button>
      <button onClick={() => setTab("orders")} className={`px-3 py-2 rounded ${tab === "orders" ? "bg-indigo-600 text-white" : "bg-white"}`}>Orders</button>
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          <div className="space-x-2">{renderTabs()}</div>
        </header>
        {message && (
          <div className="mb-4 p-3 bg-green-100 text-green-800 rounded">{message}</div>
        )}
        {loading && <div className="mb-4">Loading...</div>}
        {tab === "dashboard" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded shadow">
              <div className="text-sm text-gray-500">Users</div>
              <div className="text-2xl font-bold">{users.length}</div>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <div className="text-sm text-gray-500">Products</div>
              <div className="text-2xl font-bold">{products.length}</div>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <div className="text-sm text-gray-500">Orders</div>
              <div className="text-2xl font-bold">{orders.length}</div>
            </div>
          </div>
        )}
        {tab === "users" && (
          <div className="bg-white rounded p-4 shadow">
            <h2 className="text-xl font-semibold mb-4">All Users</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b">
                    <th className="py-2">Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id} className="border-b">
                      <td className="py-2">{u.name}</td>
                      <td>{u.email}</td>
                      <td>{u.role}</td>
                      <td className="py-2">
                        <button onClick={() => deleteUser(u._id)} className="text-red-600 hover:underline flex items-center gap-2"><FaTrash /> Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {tab === "subadmins" && (
          <div className="bg-white rounded p-4 shadow space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">Create Subadmin</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input value={newSubadmin.name} onChange={(e) => setNewSubadmin((p) => ({ ...p, name: e.target.value }))} placeholder="Name" className="p-2 border rounded" />
                <input value={newSubadmin.email} onChange={(e) => setNewSubadmin((p) => ({ ...p, email: e.target.value }))} placeholder="Email" className="p-2 border rounded" />
                <input value={newSubadmin.password} onChange={(e) => setNewSubadmin((p) => ({ ...p, password: e.target.value }))} placeholder="Password" type="password" className="p-2 border rounded" />
                <div className="p-2 border rounded">
                  <div className="text-sm text-gray-600 mb-1">Assign Categories</div>
                  <div className="flex gap-2 flex-wrap">
                    {categories.map((c) => (
                      <button key={c._id} onClick={() => toggleAssignCategory(c._id)} className={`px-2 py-1 border rounded ${newSubadmin.assignedCategories.includes(c._id) ? "bg-indigo-600 text-white" : "bg-white"}`}>{c.name}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <button onClick={createSubadmin} className="bg-indigo-600 text-white px-4 py-2 rounded">Create Subadmin</button>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">Subadmins</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b">
                      <th className="py-2">Name</th>
                      <th>Email</th>
                      <th>Assigned Categories</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subadmins.map((s) => (
                      <tr key={s._id} className="border-b">
                        <td className="py-2">{s.name}</td>
                        <td>{s.email}</td>
                        <td>{(s.assignedCategories || []).map((c) => c.name || c).join(", ")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        {tab === "categories" && (
          <div className="bg-white rounded p-4 shadow space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">Create Category</h2>
              <div className="flex gap-2">
                <input value={categoryForm.name} onChange={(e) => setCategoryForm((p) => ({ ...p, name: e.target.value }))} placeholder="Name" className="p-2 border rounded flex-1" />
                <input value={categoryForm.description} onChange={(e) => setCategoryForm((p) => ({ ...p, description: e.target.value }))} placeholder="Description" className="p-2 border rounded flex-1" />
                <button onClick={createCategory} className="bg-indigo-600 text-white px-4 py-2 rounded">Add</button>
              </div>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">All Categories</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b">
                      <th className="py-2">Name</th>
                      <th>Description</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((c) => (
                      <tr key={c._id} className="border-b">
                        <td className="py-2">{c.name}</td>
                        <td>{c.description}</td>
                        <td>
                          <button onClick={() => deleteCategory(c._id)} className="text-red-600 hover:underline flex items-center gap-2"><FaTrash /> Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
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
              <select value={selectedCategoryForOrders} onChange={(e) => { setSelectedCategoryForOrders(e.target.value); if (e.target.value) fetchOrdersByCategory(e.target.value); else fetchOrders(); }} className="p-2 border rounded">
                <option value="">All categories</option>
                {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
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