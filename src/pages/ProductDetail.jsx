import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Heart, ArrowLeft, ArrowRight, Share2, ShoppingBag, Layers, X, Send, CheckCircle } from "lucide-react";

const tabOptions = ["Description", "Dimensions", "Additional Information"];

/** Decode HTML entities and split bullet-style text into structured sections */
const parseDescription = (raw) => {
  if (!raw) return null;
  const text = raw
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

  // Split on section headers like "Design & Quality:", "Functional Features:", etc.
  const sectionRegex = /([A-Z][A-Za-z &]+):\s*●/g;
  const sections = [];
  let lastIndex = 0;
  let match;

  while ((match = sectionRegex.exec(text)) !== null) {
    if (lastIndex < match.index) {
      const preceding = text.slice(lastIndex, match.index).trim();
      if (preceding) {
        sections.push({ title: null, content: preceding });
      }
    }
    lastIndex = match.index;
  }

  if (lastIndex === 0) {
    // No sections found — check for simple bullet list
    const bullets = text.split("●").map((s) => s.trim()).filter(Boolean);
    if (bullets.length > 1) {
      return { type: "bullets", items: bullets };
    }
    return { type: "text", content: text };
  }

  // Parse remaining text into sections
  const remaining = text.slice(lastIndex);
  const fullSections = remaining.split(/(?=[A-Z][A-Za-z &]+:\s*●)/).filter(Boolean);

  const parsed = fullSections.map((sec) => {
    const headerMatch = sec.match(/^([A-Z][A-Za-z &]+):\s*/);
    const title = headerMatch ? headerMatch[1].trim() : null;
    const body = headerMatch ? sec.slice(headerMatch[0].length) : sec;
    const bullets = body.split("●").map((s) => s.trim()).filter(Boolean);
    return { title, bullets };
  });

  return { type: "sections", sections: parsed };
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [activeTab, setActiveTab] = useState("Description");
  const [loading, setLoading] = useState(true);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showEnquiry, setShowEnquiry] = useState(false);
  const [enquiryForm, setEnquiryForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [enquiryStatus, setEnquiryStatus] = useState("idle"); // idle | sending | sent | error

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      const res = await fetch(`/api/products/${id}`);
      const data = await res.json();
      setProduct(res.ok ? data : null);
      setLoading(false);
    };
    const fetchRelated = async () => {
      const res = await fetch(`/api/products/${id}/related`);
      const data = await res.json();
      setRelated(Array.isArray(data) ? data : []);
    };
    fetchProduct();
    fetchRelated();
    setGalleryIndex(0);
    setImageLoaded(false);
  }, [id]);

  const handleEnquirySubmit = async (e) => {
    e.preventDefault();
    setEnquiryStatus("sending");
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...enquiryForm,
          productName: product?.name,
          productSku: product?.meta?.sku || `A00${product?.id}`,
        }),
      });
      if (res.ok) {
        setEnquiryStatus("sent");
        setEnquiryForm({ name: "", email: "", phone: "", message: "" });
      } else {
        setEnquiryStatus("error");
      }
    } catch {
      setEnquiryStatus("error");
    }
  };

  const gallery = useMemo(() => {
    if (!product) return [];
    const metaImages = Array.isArray(product?.meta?.images) ? product.meta.images : [];
    return [product.image_url, ...metaImages].filter(Boolean);
  }, [product]);

  const currentImage = gallery[galleryIndex] || product?.image_url;

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <main className="pt-24 lg:pt-28 container mx-auto px-4 lg:px-8">
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <div className="relative">
              <div className="h-16 w-16 rounded-full border-4 border-pink-200 border-t-pink-500 animate-spin" />
              <div className="absolute inset-0 h-16 w-16 rounded-full border-4 border-transparent border-b-yellow-400 animate-spin" style={{ animationDirection: "reverse", animationDuration: "1.5s" }} />
            </div>
            <p className="text-sm text-foreground/60 animate-pulse">Loading product...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <main className="pt-24 lg:pt-28 container mx-auto px-4 lg:px-8">
          <p className="text-sm text-foreground/60">Product not found.</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Header />
      <main className="pt-20">
        {/* Hero Banner — original image style */}
        <section className="relative">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1600&auto=format&fit=crop')] bg-cover bg-center" />
          <div className="absolute inset-0 bg-black/55" />
          <div className="container mx-auto px-4 lg:px-8 relative z-10 py-14 lg:py-20">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <p className="text-primary-foreground/70 text-sm flex items-center gap-2">
                <Link to="/" className="hover:text-primary-foreground transition-colors">Home</Link>
                <span>•</span>
                <Link to="/products" className="hover:text-primary-foreground transition-colors">Products</Link>
                <span>•</span>
                <span className="text-primary-foreground">{product.name}</span>
              </p>
            </motion.div>
          </div>
        </section>

        {/* Main Product Section */}
        <section className="relative container mx-auto px-4 lg:px-8 py-12">
          {/* Decorative background blobs */}
          <div className="absolute top-20 -left-32 w-64 h-64 blob-pink opacity-30 pointer-events-none blur-2xl" />
          <div className="absolute bottom-20 -right-32 w-80 h-80 blob-yellow opacity-20 pointer-events-none blur-2xl" />

          <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] relative z-10">
            {/* Image Gallery */}
            <motion.div variants={scaleIn} initial="hidden" animate="visible">
              <div className="rounded-3xl border border-pink-100 bg-white p-4 shadow-card hover:shadow-hover transition-shadow duration-500 relative overflow-hidden group">
                {/* Pink accent corner */}
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-pink-400/20 to-yellow-300/20 rounded-full blur-xl pointer-events-none" />

                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-pink-50 to-yellow-50">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={currentImage}
                      src={currentImage}
                      alt={product.name}
                      className="h-[420px] w-full object-cover"
                      initial={{ opacity: 0, scale: 1.05 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.4 }}
                      onLoad={() => setImageLoaded(true)}
                    />
                  </AnimatePresence>

                  {/* Hover zoom overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-pink-900/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {gallery.length > 1 && (
                    <div className="absolute right-4 top-4 flex items-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        type="button"
                        className="h-9 w-9 rounded-full bg-white/90 backdrop-blur-sm text-pink-600 shadow-lg hover:bg-pink-500 hover:text-white transition-colors duration-300 flex items-center justify-center"
                        onClick={() => setGalleryIndex((prev) => (prev - 1 + gallery.length) % gallery.length)}
                      >
                        <ArrowLeft className="h-4 w-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        type="button"
                        className="h-9 w-9 rounded-full bg-white/90 backdrop-blur-sm text-pink-600 shadow-lg hover:bg-pink-500 hover:text-white transition-colors duration-300 flex items-center justify-center"
                        onClick={() => setGalleryIndex((prev) => (prev + 1) % gallery.length)}
                      >
                        <ArrowRight className="h-4 w-4" />
                      </motion.button>
                    </div>
                  )}

                  {/* Image counter badge */}
                  {gallery.length > 1 && (
                    <div className="absolute left-4 bottom-4 px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-xs font-medium text-pink-600 shadow-md">
                      {galleryIndex + 1} / {gallery.length}
                    </div>
                  )}
                </div>
              </div>

              {/* Thumbnails */}
              {gallery.length > 1 && (
                <motion.div
                  className="mt-5 flex flex-wrap gap-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {gallery.map((img, idx) => (
                    <motion.button
                      key={`${img}-${idx}`}
                      type="button"
                      whileHover={{ scale: 1.08, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setGalleryIndex(idx)}
                      className={`h-16 w-20 overflow-hidden rounded-xl border-2 transition-all duration-300 shadow-sm hover:shadow-md ${
                        idx === galleryIndex
                          ? "border-pink-500 ring-2 ring-pink-200 shadow-md"
                          : "border-gray-200 hover:border-yellow-400"
                      }`}
                    >
                      <img src={img} alt="" className="h-full w-full object-cover" />
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </motion.div>

            {/* Product Details */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
            >
              {/* Product Title & Wishlist */}
              <motion.div variants={fadeUp} className="flex items-start justify-between gap-4">
                <div>
                  <motion.span
                    className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-pink-100 to-yellow-100 text-pink-600 mb-3"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    {product.category}
                  </motion.span>
                  <h1 className="font-display text-3xl lg:text-4xl font-bold text-foreground leading-tight">
                    {product.name}
                  </h1>
                </div>
                <motion.button
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  type="button"
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={`mt-2 rounded-full p-3 transition-all duration-300 shadow-sm ${
                    isWishlisted
                      ? "bg-pink-500 text-white shadow-pink-200 shadow-md"
                      : "bg-pink-50 text-pink-400 hover:bg-pink-100 hover:text-pink-600"
                  }`}
                >
                  <Heart className={`h-5 w-5 ${isWishlisted ? "fill-current" : ""}`} />
                </motion.button>
              </motion.div>

              {/* Short Description */}
              <motion.p variants={fadeUp} custom={1} className="mt-4 text-sm leading-relaxed text-foreground/70">
                {(product.description || "").replace(/&amp;/g, "&").split("●")[0]?.trim() || product.description}
              </motion.p>

              {/* Decorative divider */}
              <motion.div variants={fadeUp} custom={2} className="my-6 h-px bg-gradient-to-r from-pink-300 via-yellow-300 to-pink-300 opacity-50" />

              {/* Product Meta */}
              <motion.div variants={fadeUp} custom={2} className="grid gap-3 text-sm">
                <div className="flex items-center justify-between rounded-xl bg-gradient-to-r from-pink-50 to-yellow-50 px-4 py-3 border border-pink-100/50">
                  <span className="font-medium text-foreground/80">Sizes Available</span>
                  <span className="text-foreground/70 font-medium">{product?.meta?.sizes?.join(", ") || '30" x 72", 36" x 72", 48" x 72"'}</span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-gradient-to-r from-yellow-50 to-pink-50 px-4 py-3 border border-yellow-100/50">
                  <span className="font-medium text-foreground/80">Design, Color Variants</span>
                  <span className="text-foreground/70 font-medium">{product?.meta?.colors || "Miscellaneous"}</span>
                </div>
              </motion.div>

              {/* Action Buttons */}
              {/* <motion.div variants={fadeUp} custom={3} className="mt-6 flex flex-wrap items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.03, y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 rounded-full border border-pink-200 px-5 py-2.5 text-sm text-pink-600 hover:bg-pink-50 hover:border-pink-300 transition-all duration-300"
                >
                  <Layers className="h-4 w-4" />
                  Compare
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03, y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 rounded-full border border-yellow-300 px-5 py-2.5 text-sm text-yellow-600 hover:bg-yellow-50 hover:border-yellow-400 transition-all duration-300"
                >
                  <Heart className="h-4 w-4" />
                  Add to wishlist
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03, y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-5 py-2.5 text-sm text-foreground/60 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300"
                >
                  <Share2 className="h-4 w-4" />
                  Share
                </motion.button>
              </motion.div> */}

              {/* SKU & Category */}
              <motion.div variants={fadeUp} custom={4} className="mt-6 space-y-1 text-sm text-foreground/70">
                <p>
                  <span className="font-semibold text-foreground">SKU:</span>{" "}
                  <span className="px-2 py-0.5 rounded bg-pink-50 text-pink-600 text-xs font-medium">{product.meta?.sku || `A00${product.id}`}</span>
                </p>
                <p>
                  <span className="font-semibold text-foreground">Category:</span>{" "}
                  <Link to="/products" className="text-pink-500 hover:text-pink-600 hover:underline transition-colors">{product.category}</Link>
                </p>
              </motion.div>

              {/* Enquire Button */}
              <motion.div variants={fadeUp} custom={5} className="mt-8">
                <motion.button
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  type="button"
                  onClick={() => { setShowEnquiry(true); setEnquiryStatus("idle"); }}
                  className="relative rounded-full bg-gradient-to-r from-pink-500 to-pink-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-pink-200 hover:shadow-xl hover:shadow-pink-300 transition-all duration-300 overflow-hidden group"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <span className="relative flex items-center gap-2">
                    <ShoppingBag className="h-4 w-4" />
                    Enquire Now
                  </span>
                </motion.button>
              </motion.div>
            </motion.div>
          </div>

          {/* Tabs Section */}
          <motion.div
            className="mt-14 rounded-2xl border border-pink-100/60 bg-white p-6 lg:p-8 shadow-soft relative overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Decorative corner gradient */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-br from-pink-200/30 to-yellow-200/30 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-gradient-to-tr from-yellow-200/30 to-pink-200/30 rounded-full blur-2xl pointer-events-none" />

            <div className="flex flex-wrap gap-3 relative z-10">
              {tabOptions.map((tab) => (
                <motion.button
                  key={tab}
                  type="button"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-300 ${
                    activeTab === tab
                      ? "bg-gradient-to-r from-pink-500 to-yellow-400 text-white shadow-md shadow-pink-200"
                      : "border border-pink-100 text-foreground/70 hover:border-pink-300 hover:text-pink-600 hover:bg-pink-50"
                  }`}
                >
                  {tab}
                </motion.button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="mt-6 text-sm text-foreground/70 leading-relaxed relative z-10"
              >
                {activeTab === "Description" && (() => {
                  const parsed = parseDescription(product.description);
                  if (!parsed) return <p>Add a detailed product description here.</p>;

                  if (parsed.type === "text") return <p>{parsed.content}</p>;

                  if (parsed.type === "bullets") {
                    return (
                      <ul className="space-y-2">
                        {parsed.items.map((item, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-r from-pink-400 to-yellow-400" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    );
                  }

                  return (
                    <div className="space-y-5">
                      {parsed.sections.map((sec, i) => (
                        <div key={i}>
                          {sec.title && (
                            <h4 className="mb-2 text-sm font-semibold text-foreground flex items-center gap-2">
                              <span className="h-4 w-1 rounded-full bg-gradient-to-b from-pink-400 to-yellow-400" />
                              {sec.title}
                            </h4>
                          )}
                          <ul className="space-y-1.5 pl-3">
                            {sec.bullets.map((bullet, j) => (
                              <li key={j} className="flex items-start gap-2">
                                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-pink-300" />
                                <span>{bullet}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  );
                })()}
                {activeTab === "Dimensions" && (
                  <p>{product?.meta?.dimensions || '30" x 72", 36" x 72", 48" x 72"'}</p>
                )}
                {activeTab === "Additional Information" && (
                  <p>{(product?.meta?.additional || "Fabric care, material details, and usage notes.").replace(/&amp;/g, "&")}</p>
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </section>

        {/* Related Products */}
        {related.length > 0 && (
          <section className="relative overflow-hidden pb-16">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-pink-50/50 to-yellow-50/30 pointer-events-none" />

            <div className="container mx-auto px-4 lg:px-8 relative z-10">
              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-pink-100 to-yellow-100 text-pink-600 mb-3">
                  You May Also Like
                </span>
                <h2 className="font-display text-2xl lg:text-3xl font-bold bg-gradient-to-r from-pink-600 via-pink-500 to-yellow-500 bg-clip-text text-transparent">
                  Related Products
                </h2>
                <div className="mt-3 mx-auto h-1 w-20 rounded-full bg-gradient-to-r from-pink-400 to-yellow-400" />
              </motion.div>

              <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {related.map((item, idx) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                  >
                    <Link
                      to={`/products/${item.id}`}
                      className="group block rounded-2xl border border-pink-100/60 bg-white p-4 shadow-soft hover:shadow-hover transition-all duration-500 hover:-translate-y-1"
                    >
                      <div className="overflow-hidden rounded-xl bg-gradient-to-br from-pink-50 to-yellow-50">
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="h-40 w-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <p className="text-sm font-medium text-foreground group-hover:text-pink-600 transition-colors duration-300">
                          {item.name}
                        </p>
                        <ArrowRight className="h-4 w-4 text-pink-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Enquiry Modal */}
      <AnimatePresence>
        {showEnquiry && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowEnquiry(false)}
            />

            {/* Modal */}
            <motion.div
              className="relative w-full max-w-lg rounded-3xl bg-white shadow-2xl overflow-hidden"
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Header */}
              <div className="relative bg-gradient-to-r from-pink-500 to-yellow-400 px-6 py-5">
                <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full bg-white/10 blur-xl" />
                <h3 className="text-lg font-display font-bold text-white">Enquire About This Product</h3>
                <p className="text-sm text-white/80 mt-1">{product.name} — {product.meta?.sku || `A00${product.id}`}</p>
                <button
                  type="button"
                  onClick={() => setShowEnquiry(false)}
                  className="absolute top-4 right-4 rounded-full bg-white/20 p-1.5 text-white hover:bg-white/30 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Body */}
              <div className="px-6 py-6">
                {enquiryStatus === "sent" ? (
                  <motion.div
                    className="text-center py-8"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <div className="mx-auto h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                      <CheckCircle className="h-8 w-8 text-green-500" />
                    </div>
                    <h4 className="text-lg font-semibold text-foreground">Enquiry Sent!</h4>
                    <p className="mt-2 text-sm text-foreground/60">We'll get back to you shortly.</p>
                    <button
                      type="button"
                      onClick={() => setShowEnquiry(false)}
                      className="mt-6 rounded-full bg-pink-500 px-6 py-2.5 text-sm font-medium text-white hover:bg-pink-600 transition-colors"
                    >
                      Close
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleEnquirySubmit} className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-xs font-medium text-foreground/60 mb-1.5">Your Name *</label>
                        <input
                          type="text"
                          required
                          value={enquiryForm.name}
                          onChange={(e) => setEnquiryForm((f) => ({ ...f, name: e.target.value }))}
                          placeholder="John Doe"
                          className="w-full rounded-xl border border-pink-100 bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-400 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-foreground/60 mb-1.5">Email *</label>
                        <input
                          type="email"
                          required
                          value={enquiryForm.email}
                          onChange={(e) => setEnquiryForm((f) => ({ ...f, email: e.target.value }))}
                          placeholder="john@example.com"
                          className="w-full rounded-xl border border-pink-100 bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-200 focus:border-yellow-400 transition-all"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-foreground/60 mb-1.5">Phone Number</label>
                      <input
                        type="text"
                        value={enquiryForm.phone}
                        onChange={(e) => setEnquiryForm((f) => ({ ...f, phone: e.target.value }))}
                        placeholder="+91 00000 00000"
                        className="w-full rounded-xl border border-pink-100 bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-400 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-foreground/60 mb-1.5">Message *</label>
                      <textarea
                        required
                        rows={3}
                        value={enquiryForm.message}
                        onChange={(e) => setEnquiryForm((f) => ({ ...f, message: e.target.value }))}
                        placeholder={`I'm interested in ${product.name}...`}
                        className="w-full resize-none rounded-xl border border-pink-100 bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-200 focus:border-yellow-400 transition-all"
                      />
                    </div>

                    {enquiryStatus === "error" && (
                      <p className="text-sm text-red-500">Failed to send. Please try again.</p>
                    )}

                    <motion.button
                      type="submit"
                      disabled={enquiryStatus === "sending"}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full rounded-full bg-gradient-to-r from-pink-500 to-pink-600 py-3 text-sm font-semibold text-white shadow-md shadow-pink-200 hover:shadow-lg hover:shadow-pink-300 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-60"
                    >
                      {enquiryStatus === "sending" ? (
                        <>
                          <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          Submit Enquiry
                        </>
                      )}
                    </motion.button>
                  </form>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default ProductDetail;
