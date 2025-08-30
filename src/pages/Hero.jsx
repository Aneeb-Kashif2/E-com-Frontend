import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

const API_BASE = import.meta?.env?.VITE_API_BASE || "http://localhost:8000";
const currency = (n) =>
  new Intl.NumberFormat("en-PK", { style: "currency", currency: "PKR", maximumFractionDigits: 0 }).format(
    Number(n || 0)
  );

const sectionFade = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

/***********************************
 * Hero Section
 ***********************************/
export const Hero = () => {
  const slides = [
    {
      id: 1,
      backgroundImage: "url('/hero.png')",
      title: "Fresh Groceries, Delivered to You",
      description: "Get vegetables, fruits, and daily essentials at the best prices.",
      buttonText: "Shop Fresh Produce",
      onClick: () => document.getElementById("categories")?.scrollIntoView({ behavior: "smooth" }),
    },
    {
      id: 2,
      backgroundImage: "url('/BudgetPlanner.png')",
      title: "Smart Grocery Planning",
      description: "Enter your budget and let AI plan your monthly groceries.",
      buttonText: "Try Budget Planner",
      onClick: () => document.getElementById("planner")?.scrollIntoView({ behavior: "smooth" }),
    },
    {
      id: 3,
      backgroundImage: "url('/hero.png')",
      title: "Household Essentials",
      description: "Cleaning supplies, oils, rice, and more — everything in one place.",
      buttonText: "Shop Essentials",
      onClick: () => document.getElementById("categories")?.scrollIntoView({ behavior: "smooth" }),
    },
  ];

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setCurrent((p) => (p + 1) % slides.length), 6000);
    return () => clearInterval(t);
  }, [slides.length]);

  return (
    <div className="relative w-full overflow-hidden rounded-xl shadow-lg mb-8">
      <div className="relative h-96 md:h-[520px] lg:h-[620px]">
        {slides.map((s, i) => (
          <div
            key={s.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${i === current ? "opacity-100" : "opacity-0"}`}
            style={{ backgroundImage: s.backgroundImage, backgroundSize: "cover", backgroundPosition: "center" }}
          >
            <div className="absolute inset-0 bg-black/40 flex items-center p-8">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-xl text-left"
              >
                <h2 className="text-white text-3xl md:text-5xl font-extrabold mb-4">{s.title}</h2>
                <p className="text-gray-200 text-lg md:text-xl mb-6">{s.description}</p>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={s.onClick}
                  className="bg-blue-500 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-blue-600 transition-colors duration-300"
                >
                  {s.buttonText}
                </motion.button>
              </motion.div>
            </div>
          </div>
        ))}
      </div>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-3 h-3 rounded-full ${i === current ? "bg-blue-500 scale-125" : "bg-white/70"} transition`}
          />
        ))}
      </div>
    </div>
  );
};

/***********************************
 * Featured Categories
 ***********************************/
export const FeaturedCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(`${VITE_API_BASE_URL}/categories`);
        setCategories(data || []);
      } catch (e) {
        setError("Failed to load categories");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <section id="categories" className="px-4 sm:px-6 lg:px-8 py-10 max-w-7xl mx-auto">
      <motion.h2 variants={sectionFade} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-2xl md:text-3xl font-bold mb-6 text-gray-900 text-center">
        Shop by Category
      </motion.h2>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-2xl overflow-hidden shadow bg-white">
              <div className="w-full h-40 bg-gray-200" />
              <div className="p-4 h-16">
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center text-red-600">{error}</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <motion.div
              key={cat._id}
              variants={sectionFade}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              onClick={() => navigate(`/category/${cat._id}`)}
              className="cursor-pointer group rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition bg-white"
            >
              <div className="relative w-full h-40">
                <img
                  src={cat.image || "https://images.unsplash.com/photo-1506806732259-39c2d0268443"}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition" />
              </div>
              <div className="p-4 text-center">
                <h3 className="text-lg font-semibold text-gray-900">{cat.name}</h3>
                <p className="text-sm text-gray-500">{cat.description || "Browse fresh items"}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
};

/***********************************
 * Budget Planner
 ***********************************/
export const BudgetPlanner = () => {
  const [budget, setBudget] = useState(10000);
  const [duration, setDuration] = useState("month");
  const [household, setHousehold] = useState(3);
  const [plan, setPlan] = useState([]);
  const [loading, setLoading] = useState(false);

  const handlePlan = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post(`${API_BASE}/api/grocery-plan`, { budget, duration, household });
      setPlan(data?.items || []);
    } catch (e) {
      setPlan([]);
    } finally {
      setLoading(false);
    }
  };

  const total = useMemo(() => plan.reduce((s, i) => s + i.unitPrice * i.qty, 0), [plan]);

  return (
    <section id="planner" className="px-4 sm:px-6 lg:px-8 py-10 max-w-7xl mx-auto">
      <motion.h2 variants={sectionFade} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-2xl md:text-3xl font-bold mb-6 text-gray-900">
        Budget-based Grocery Planner
      </motion.h2>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1 rounded-2xl border bg-white p-4 shadow-sm">
          <label className="block text-sm font-medium">Budget (PKR)</label>
          <input type="number" value={budget} onChange={(e) => setBudget(e.target.value)} className="mt-1 w-full border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />

          <label className="block text-sm font-medium mt-4">Duration</label>
          <select value={duration} onChange={(e) => setDuration(e.target.value)} className="mt-1 w-full border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition">
            <option value="half-month">Half Month (15 days)</option>
            <option value="month">Full Month (30 days)</option>
          </select>

          <label className="block text-sm font-medium mt-4">Household Size</label>
          <input type="number" min={1} value={household} onChange={(e) => setHousehold(e.target.value)} className="mt-1 w-full border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />

          <button onClick={handlePlan} disabled={loading} className="mt-5 w-full px-4 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition">
            {loading ? "Planning…" : "Generate Plan"}
          </button>
        </div>

        <div className="md:col-span-2 space-y-4">
          {!plan.length ? (
            <div className="rounded-2xl border bg-white p-6 text-gray-600 text-center">Enter budget & duration to see recommendations.</div>
          ) : (
            <div className="rounded-2xl border bg-white p-0 overflow-hidden">
              <div className="max-h-[440px] overflow-y-auto divide-y">
                {plan.map((i, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-3">
                    <img src={i.image} alt={i.name} className="w-16 h-16 rounded-lg object-cover" />
                    <div className="flex-1">
                      <div className="font-semibold">{i.name}</div>
                      <div className="text-sm text-gray-500">Qty: {i.qty}</div>
                    </div>
                    <div className="font-semibold">{currency(i.unitPrice * i.qty)}</div>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50">
                <div className="text-lg font-bold">Total: {currency(total)}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

/***********************************
 * FAQ
 ***********************************/
const FAQ = () => {
  const faqs = [
    { q: "Do you deliver across Pakistan?", a: "We currently deliver to major cities. Coverage is expanding every month." },
    { q: "How does the budget planner work?", a: "Enter budget, duration, and household size. Our algorithm allocates essentials while staying within budget." },
    { q: "Which payment methods are accepted?", a: "Cash on delivery, debit/credit cards, and popular wallets where available." },
  ];

  return (
    <section id="faq" className="px-4 sm:px-6 lg:px-8 py-12 max-w-5xl mx-auto">
      <motion.h2 variants={sectionFade} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-2xl md:text-3xl font-bold mb-6 text-gray-900 text-center">
        Frequently asked questions
      </motion.h2>
      <div className="divide-y rounded-2xl border bg-white">
        {faqs.map((f, i) => (
          <details key={i} className="group p-5">
            <summary className="flex items-center justify-between cursor-pointer list-none">
              <span className="font-semibold text-gray-900">{f.q}</span>
              <span className="transition group-open:rotate-180">⌄</span>
            </summary>
            <p className="text-gray-600 mt-2">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
};

/***********************************
 * Home Page
 ***********************************/
const GroceryHomePage = () => {
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(`${API_BASE}/all-products`);
        setProducts(data || []);
      } catch (e) {
        // ignore
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    if (!query) return [];
    return products.filter((p) => p.name?.toLowerCase().includes(query.toLowerCase()));
  }, [products, query]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <BudgetPlanner />

      <section className="px-4 sm:px-6 lg:px-8 py-10 max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900">Search Products</h2>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products…"
          className="w-full md:w-72 border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition mb-6"
        />

        {filtered.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {filtered.map((p) => (
              <div key={p._id} className="rounded-2xl border bg-white shadow-sm overflow-hidden">
                <img src={p.images?.[0] || "https://via.placeholder.com/400x300"} alt={p.name} className="w-full h-44 object-cover" />
                <div className="p-4">
                  <h4 className="font-semibold line-clamp-1">{p.name}</h4>
                  <p className="text-sm text-gray-500 line-clamp-2">{p.description}</p>
                  <div className="pt-2 font-bold">{currency(p.price)}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <FAQ />
    </div>
  );
};

export default GroceryHomePage;
