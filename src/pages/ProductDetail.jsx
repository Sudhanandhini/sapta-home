import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Heart, ArrowLeft, ArrowRight } from "lucide-react";

const tabOptions = ["Description", "Dimensions", "Additional Information"];

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [activeTab, setActiveTab] = useState("Description");
  const [loading, setLoading] = useState(true);
  const [galleryIndex, setGalleryIndex] = useState(0);

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
  }, [id]);

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
          <p className="text-sm text-foreground/60">Loading product...</p>
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
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="pt-20">
        <section className="relative">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1600&auto=format&fit=crop')] bg-cover bg-center" />
          <div className="absolute inset-0 bg-black/55" />
          <div className="container mx-auto px-4 lg:px-8 relative z-10 py-14 lg:py-20">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <p className="text-primary-foreground/70 text-sm flex items-center gap-2">
                <Link to="/" className="hover:text-primary-foreground">Home</Link>
                <span>•</span>
                <Link to="/products" className="hover:text-primary-foreground">Products</Link>
                <span>•</span>
                <span className="text-primary-foreground">{product.name}</span>
              </p>
            </motion.div>
          </div>
        </section>

        <section className="container mx-auto px-4 lg:px-8 py-12">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr]">
            <div>
              <div className="rounded-3xl border border-border bg-card p-6 shadow-card">
                <div className="relative overflow-hidden rounded-2xl bg-muted">
                  <img src={currentImage} alt={product.name} className="h-[380px] w-full object-cover transition-transform duration-500" />
                  {gallery.length > 1 && (
                    <div className="absolute right-4 top-4 flex items-center gap-2">
                      <button
                        type="button"
                        className="h-8 w-8 rounded-full bg-white/90 text-primary shadow"
                        onClick={() => setGalleryIndex((prev) => (prev - 1 + gallery.length) % gallery.length)}
                      >
                        <ArrowLeft className="h-4 w-4 mx-auto" />
                      </button>
                      <button
                        type="button"
                        className="h-8 w-8 rounded-full bg-white/90 text-primary shadow"
                        onClick={() => setGalleryIndex((prev) => (prev + 1) % gallery.length)}
                      >
                        <ArrowRight className="h-4 w-4 mx-auto" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {gallery.length > 1 && (
                <div className="mt-6 flex flex-wrap gap-3">
                  {gallery.map((img, idx) => (
                    <button
                      key={`${img}-${idx}`}
                      type="button"
                      onClick={() => setGalleryIndex(idx)}
                      className={`h-16 w-20 overflow-hidden rounded-2xl border ${idx === galleryIndex ? "border-accent" : "border-border"}`}
                    >
                      <img src={img} alt="" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between">
                <h1 className="font-display text-3xl font-bold text-foreground">{product.name}</h1>
                <button type="button" className="rounded-full border border-border p-2 text-foreground/70 hover:text-primary">
                  <Heart className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-4 text-sm text-foreground/70">{product.description}</p>
              <div className="mt-6 grid gap-3 text-sm text-foreground/70">
                <div className="flex items-center justify-between border-b border-border pb-2">
                  <span>Sizes Available</span>
                  <span>{product?.meta?.sizes?.join(", ") || "30\" x 72\", 36\" x 72\", 48\" x 72\""}</span>
                </div>
                <div className="flex items-center justify-between border-b border-border pb-2">
                  <span>Design, Color Variants</span>
                  <span>{product?.meta?.colors || "Miscellaneous"}</span>
                </div>
              </div>
              <div className="mt-6 flex items-center gap-4 text-sm text-foreground/70">
                <button className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 hover:bg-muted">
                  Compare
                </button>
                <button className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 hover:bg-muted">
                  Add to wishlist
                </button>
              </div>
              <div className="mt-6 text-sm text-foreground/70">
                <p><span className="font-semibold text-foreground">SKU:</span> {product.meta?.sku || `A00${product.id}`}</p>
                <p><span className="font-semibold text-foreground">Category:</span> {product.category}</p>
              </div>
              <div className="mt-6 flex items-center gap-4">
                <button className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-navy-light">
                  Enquire Now
                </button>
              </div>
            </div>
          </div>

          <div className="mt-12 border-t border-border pt-8">
            <div className="flex flex-wrap gap-3">
              {tabOptions.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-full border px-4 py-2 text-sm ${
                    activeTab === tab ? "bg-accent text-accent-foreground border-accent" : "border-border text-foreground/70"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="mt-6 text-sm text-foreground/70 leading-relaxed">
              {activeTab === "Description" && (
                <p>{product.description || "Add a detailed product description here."}</p>
              )}
              {activeTab === "Dimensions" && (
                <p>{product?.meta?.dimensions || "30\" x 72\", 36\" x 72\", 48\" x 72\""}</p>
              )}
              {activeTab === "Additional Information" && (
                <p>{product?.meta?.additional || "Fabric care, material details, and usage notes."}</p>
              )}
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 lg:px-8 pb-16">
          <h2 className="text-center font-display text-2xl font-bold text-primary">Related Products</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((item) => (
              <Link
                key={item.id}
                to={`/products/${item.id}`}
                className="group rounded-2xl border border-border bg-card p-4 shadow-soft hover:shadow-hover transition"
              >
                <div className="overflow-hidden rounded-xl bg-muted">
                  <img src={item.image_url} alt={item.name} className="h-36 w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <p className="mt-3 text-sm font-medium text-foreground">{item.name}</p>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;
