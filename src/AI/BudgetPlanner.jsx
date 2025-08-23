export const BudgetPlanner = () => {
  const [budget, setBudget] = useState(10000);
  const [duration, setDuration] = useState("month");
  const [household, setHousehold] = useState(3);
  const [plan, setPlan] = useState([]);
  const [loading, setLoading] = useState(false);

  const handlePlan = async () => {
    setLoading(true);
    try {
      // Expect your backend endpoint to return an array of { productId, name, qty, unitPrice, image }
      const { data } = await axios.post(`${API_BASE}/api/grocery-plan`, { budget, duration, household });
      setPlan(data?.items || []);
    } catch (e) {
      // Fallback demo logic if API not ready
      setPlan([
        { name: "Rice (5kg)", qty: 1, unitPrice: 2600, image: "https://images.unsplash.com/photo-1582515073492-50b1dbcd6ee1" },
        { name: "Flour (2kg)", qty: 2, unitPrice: 780, image: "https://images.unsplash.com/photo-1561043433-aaf687c4cf4b" },
        { name: "Cooking Oil (1L)", qty: 2, unitPrice: 900, image: "https://images.unsplash.com/photo-1589308078059-b29a36e4f3c2" },
        { name: "Masoor Daal (1kg)", qty: 1, unitPrice: 450, image: "https://images.unsplash.com/photo-1598514982454-828c486b8370" },
        { name: "Milk (1L)", qty: 10, unitPrice: 165, image: "https://images.unsplash.com/photo-1589919913743-8c5c0ba53786" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const total = useMemo(() => plan.reduce((s, i) => s + i.unitPrice * i.qty, 0), [plan]);

  const addAllToCart = async () => {
    try {
      const payload = plan.map((i) => ({ productName: i.name, qty: i.qty }));
      await axios.post(`${API_BASE}/cart/bulk`, { items: payload }, { withCredentials: true });
      // toast success
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <section id="planner" className="px-4 sm:px-6 lg:px-8 py-10 max-w-7xl mx-auto">
      <motion.h2 variants={sectionFade} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-2xl md:text-3xl font-bold mb-6 text-gray-900">
        Budget-based Grocery Planner
      </motion.h2>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1 rounded-2xl border bg-white p-4 shadow-sm">
          <label className="block text-sm font-medium">Budget (PKR)</label>
          <input type="number" value={budget} onChange={(e) => setBudget(e.target.value)} className="mt-1 w-full border rounded-xl px-4 py-2.5" />

          <label className="block text-sm font-medium mt-4">Duration</label>
          <select value={duration} onChange={(e) => setDuration(e.target.value)} className="mt-1 w-full border rounded-xl px-4 py-2.5">
            <option value="half-month">Half Month (15 days)</option>
            <option value="month">Full Month (30 days)</option>
          </select>

          <label className="block text-sm font-medium mt-4">Household Size</label>
          <input type="number" min={1} value={household} onChange={(e) => setHousehold(e.target.value)} className="mt-1 w-full border rounded-xl px-4 py-2.5" />

          <button onClick={handlePlan} disabled={loading} className="mt-5 w-full px-4 py-3 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700">
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
                <button onClick={addAllToCart} className="px-4 py-2.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700">Add all to cart</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};