import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Search, SlidersHorizontal, ArrowRight } from "lucide-react";

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
        {/* Hero Banner */}
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
            {/* Sidebar */}
            <aside className="space-y-8">
              {/* Categories */}
              <div className="rounded-2xl border border-border bg-card p-6 shadow-soft relative overflow-hidden">
                <div className="absolute -top-8 -right-8 w-20 h-20 bg-gradient-to-br from-yellow-200/30 to-pink-200/20 rounded-full blur-xl pointer-events-none" />
                <h3 className="text-lg font-semibold bg-gradient-to-r from-secondary to-yellow-500 bg-clip-text text-transparent relative z-10">Categories</h3>
                <ul className="mt-4 space-y-2 text-sm relative z-10">
                  <li>
                    <button
                      type="button"
                      onClick={() => setSelectedCategory("")}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left transition-all duration-300 ${
                        selectedCategory === ""
                          ? "bg-gradient-to-r from-secondary/10 to-yellow-400/10 text-secondary font-medium border-l-2 border-secondary"
                          : "hover:bg-muted hover:pl-4"
                      }`}
                    >
                      <span>All</span>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${selectedCategory === "" ? "bg-yellow-100 text-yellow-700" : "text-foreground/60"}`}>{total}</span>
                    </button>
                  </li>
                  {categories.map((cat) => (
                    <li key={cat.category}>
                      <button
                        type="button"
                        onClick={() => setSelectedCategory(cat.category)}
                        className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left transition-all duration-300 ${
                          selectedCategory === cat.category
                            ? "bg-gradient-to-r from-secondary/10 to-yellow-400/10 text-secondary font-medium border-l-2 border-secondary"
                            : "hover:bg-muted hover:pl-4"
                        }`}
                      >
                        <span>{cat.category}</span>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${selectedCategory === cat.category ? "bg-yellow-100 text-yellow-700" : "text-foreground/60"}`}>{cat.count}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Featured Products */}
              <div className="rounded-2xl border border-border bg-card p-6 shadow-soft relative overflow-hidden">
                <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-gradient-to-tr from-pink-200/30 to-yellow-200/20 rounded-full blur-xl pointer-events-none" />
                <h3 className="text-lg font-semibold bg-gradient-to-r from-secondary to-yellow-500 bg-clip-text text-transparent relative z-10">Featured Products</h3>
                <div className="mt-4 space-y-4 relative z-10">
                  {featuredProducts.length === 0 && (
                    <p className="text-sm text-foreground/60">No featured items yet.</p>
                  )}
                  {featuredProducts.map((item) => (
                    <Link key={item.id} to={`/products/${item.id}`} className="flex items-center gap-3 group rounded-lg p-1.5 -mx-1.5 hover:bg-gradient-to-r hover:from-pink-50 hover:to-yellow-50 transition-all duration-300">
                      <img src={item.image_url} alt={item.name} className="h-12 w-12 rounded-xl object-cover ring-2 ring-transparent group-hover:ring-yellow-300 transition-all duration-300" />
                      <div>
                        <p className="text-sm font-medium text-foreground group-hover:text-secondary transition-colors">{item.name}</p>
                        <p className="text-xs text-foreground/60">{item.category}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </aside>

            {/* Main Product Grid */}
            <div>
              {/* Toolbar */}
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="text-sm text-foreground/60">
                  Showing {total === 0 ? 0 : (page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)} of {total}
                  {" "}results
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-pink-400" />
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search products..."
                      className="w-full rounded-full border border-pink-100 bg-background py-2 pl-9 pr-3 text-sm focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 focus:outline-none transition-all duration-300"
                    />
                  </div>
                  {/* <div className="flex items-center gap-2">
                    <SlidersHorizontal className="h-4 w-4 text-yellow-500" />
                    <select
                      value={sort}
                      onChange={(e) => setSort(e.target.value)}
                      className="rounded-full border border-pink-100 bg-background px-4 py-2 text-sm focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 focus:outline-none transition-all duration-300"
                    >
                      <option value="latest">Default Sorting</option>
                    </select>
                  </div> */}
                </div>
              </div>

              {/* Product Cards */}
              <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {loading && (
                  <div className="col-span-full flex justify-center py-16">
                    <div className="relative">
                      <div className="h-12 w-12 rounded-full border-4 border-pink-200 border-t-pink-500 animate-spin" />
                      <div className="absolute inset-0 h-12 w-12 rounded-full border-4 border-transparent border-b-yellow-400 animate-spin" style={{ animationDirection: "reverse", animationDuration: "1.5s" }} />
                    </div>
                  </div>
                )}
                {!loading && pagedProducts.length === 0 && (
                  <div className="col-span-full text-center text-sm text-foreground/60">No products found.</div>
                )}
                {pagedProducts.map((item, idx) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                  >
                    <Link
                      to={`/products/${item.id}`}
                      className="group block rounded-2xl border border-pink-100/60 bg-card p-4 shadow-soft hover:shadow-hover hover:-translate-y-1 transition-all duration-500"
                    >
                      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-pink-50 to-yellow-50">
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="h-48 w-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        {/* Category badge */}
                        <span className="absolute left-3 top-3 rounded-full bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-semibold text-pink-600 shadow-sm">
                          {item.category}
                        </span>
                      </div>
                      <div className="mt-4">
                        <p className="text-xs uppercase tracking-widest text-yellow-600 font-medium">{item.category}</p>
                        <h3 className="mt-1 text-lg font-semibold text-foreground group-hover:text-secondary transition-colors duration-300">{item.name}</h3>
                        <p className="mt-2 text-sm text-foreground/70 line-clamp-2">
                          {(item.description || "").replace(/&amp;/g, "&").split("●")[0]?.trim()}
                        </p>
                        <div className="mt-4 flex items-center justify-between">
                          <span className="text-sm font-semibold text-secondary group-hover:text-yellow-600 transition-colors duration-300">View Details</span>
                          <motion.span
                            className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-pink-500 to-pink-600 px-4 py-2 text-xs font-semibold text-white shadow-sm group-hover:from-yellow-400 group-hover:to-yellow-500 group-hover:text-yellow-900 transition-all duration-500"
                            whileHover={{ scale: 1.05 }}
                          >
                            View
                            <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                          </motion.span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Pagination */}
              <div className="mt-10 flex items-center justify-center gap-2">
                {Array.from({ length: totalPages }).map((_, idx) => {
                  const pageNumber = idx + 1;
                  return (
                    <motion.button
                      key={pageNumber}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setPage(pageNumber)}
                      className={`h-9 w-9 rounded-full text-sm font-medium transition-all duration-300 ${
                        page === pageNumber
                          ? "bg-gradient-to-r from-pink-500 to-yellow-400 text-white shadow-md shadow-pink-200"
                          : "border border-pink-100 text-foreground/70 hover:border-yellow-300 hover:bg-yellow-50"
                      }`}
                      type="button"
                    >
                      {pageNumber}
                    </motion.button>
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
