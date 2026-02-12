import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Search, SlidersHorizontal, Star } from "lucide-react";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("latest");
  const [page, setPage] = useState(1);
  const pageSize = 9;

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (selectedCategory) params.append("category", selectedCategory);
        if (search) params.append("search", search);
        const res = await fetch(`/api/products?${params.toString()}`);
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [selectedCategory, search]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        const filtered = Array.isArray(data)
          ? data.filter((cat) => (cat.category || "").toLowerCase() !== "uncategorized")
          : [];
        setCategories(filtered);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [selectedCategory, search, sort]);

  const sortedProducts = useMemo(() => {
    const list = [...products].filter(
      (item) => (item.category || "").toLowerCase() !== "uncategorized",
    );
    if (sort === "latest") {
      list.sort((a, b) => (b.id || 0) - (a.id || 0));
    }
    return list;
  }, [products, sort]);

  const total = sortedProducts.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const pagedProducts = sortedProducts.slice((page - 1) * pageSize, page * pageSize);
  const featuredProducts = sortedProducts.filter((item) => item.is_featured).slice(0, 4);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="pt-20">
        <section className="relative">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1600&auto=format&fit=crop')] bg-cover bg-center" />
          <div className="absolute inset-0 bg-primary/70" />
          <div className="container mx-auto px-4 lg:px-8 relative z-10 py-16 lg:py-24">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <p className="text-primary-foreground/80 text-sm">Home • Products</p>
              <h1 className="mt-3 text-4xl lg:text-5xl font-display font-bold text-primary-foreground">
                Shop
              </h1>
            </motion.div>
          </div>
        </section>

        <section className="container mx-auto px-4 lg:px-8 py-12">
          <div className="grid gap-10 lg:grid-cols-[280px_1fr]">
            <aside className="space-y-8">
              <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
                <h3 className="text-lg font-semibold text-secondary">Categories</h3>
                <ul className="mt-4 space-y-3 text-sm">
                  <li>
                    <button
                      type="button"
                      onClick={() => setSelectedCategory("")}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left transition ${
                        selectedCategory === "" ? "bg-secondary/10 text-secondary font-medium" : "hover:bg-muted"
                      }`}
                    >
                      <span>All</span>
                      <span className="text-xs text-foreground/60">{total}</span>
                    </button>
                  </li>
                  {categories.map((cat) => (
                    <li key={cat.category}>
                      <button
                        type="button"
                        onClick={() => setSelectedCategory(cat.category)}
                        className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left transition ${
                          selectedCategory === cat.category ? "bg-secondary/10 text-secondary font-medium" : "hover:bg-muted"
                        }`}
                      >
                        <span>{cat.category}</span>
                        <span className="text-xs text-foreground/60">{cat.count}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
                <h3 className="text-lg font-semibold text-secondary">Featured Products</h3>
                <div className="mt-4 space-y-4">
                  {featuredProducts.length === 0 && (
                    <p className="text-sm text-foreground/60">No featured items yet.</p>
                  )}
                  {featuredProducts.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <img src={item.image_url} alt={item.name} className="h-12 w-12 rounded-xl object-cover" />
                      <div>
                        <p className="text-sm font-medium text-foreground">{item.name}</p>
                        <p className="text-xs text-foreground/60">{item.category}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </aside>

            <div>
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="text-sm text-foreground/60">
                  Showing {total === 0 ? 0 : (page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)} of {total}
                  {" "}results
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-foreground/60" />
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search products..."
                      className="w-full rounded-full border border-border bg-background py-2 pl-9 pr-3 text-sm"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="h-4 w-4 text-foreground/60" />
                    <select
                      value={sort}
                      onChange={(e) => setSort(e.target.value)}
                      className="rounded-full border border-border bg-background px-4 py-2 text-sm"
                    >
                      <option value="latest">Default Sorting</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {loading && (
                  <div className="col-span-full text-center text-sm text-foreground/60">Loading products...</div>
                )}
                {!loading && pagedProducts.length === 0 && (
                  <div className="col-span-full text-center text-sm text-foreground/60">No products found.</div>
                )}
                {pagedProducts.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4 }}
                  >
                    <Link
                      to={`/products/${item.id}`}
                      className="group block rounded-2xl border border-border bg-card p-4 shadow-soft hover:shadow-hover transition"
                    >
                      <div className="relative overflow-hidden rounded-xl bg-muted">
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        {/* {item.is_featured && (
                          <span className="absolute left-3 top-3 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
                            Featured
                          </span>
                        )} */}
                      </div>
                      <div className="mt-4">
                        <p className="text-xs uppercase tracking-widest text-foreground/60">{item.category}</p>
                        <h3 className="mt-1 text-lg font-semibold text-foreground">{item.name}</h3>
                        <p className="mt-2 text-sm text-foreground/70 line-clamp-2">{item.description}</p>
                        <div className="mt-4 flex items-center justify-between">
                          <span className="text-sm font-semibold text-secondary">View Details</span>
                          <span className="rounded-full bg-secondary px-4 py-2 text-xs font-semibold text-secondary-foreground">
                            View
                          </span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className="mt-10 flex items-center justify-center gap-2">
                {Array.from({ length: totalPages }).map((_, idx) => {
                  const pageNumber = idx + 1;
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => setPage(pageNumber)}
                      className={`h-8 w-8 rounded-full text-sm font-medium ${
                        page === pageNumber
                          ? "bg-secondary text-secondary-foreground"
                          : "border border-border text-foreground/70 hover:bg-muted"
                      }`}
                      type="button"
                    >
                      {pageNumber}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Products;
