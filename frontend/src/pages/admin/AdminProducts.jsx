import { useEffect, useMemo, useState } from "react";
import { apiUrl } from "@/lib/api";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const emptyProduct = {
  name: "",
  category: "",
  image_url: "",
  description: "",
  price: 0,
  is_featured: false,
  dimensions: "",
  additional_info: "",
  sizes_available: "",
  sku: "",
  meta: "",
};

const emptyVariant = () => ({ name: "", images: [] });

const AdminProducts = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyProduct);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [uploading, setUploading] = useState(false);
  const [gallery, setGallery] = useState([]);
  const [colorVariants, setColorVariants] = useState([]); // [{name, images:[]}]
  const [variantUploading, setVariantUploading] = useState(null); // index being uploaded

  const fetchMe = async () => {
    const res = await fetch(apiUrl("/api/auth/me"), { credentials: "include" });
    if (!res.ok) {
      navigate("/admin");
      return null;
    }
    const data = await res.json();
    setUser(data);
    return data;
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch(apiUrl("/api/products"));
      const data = await res.json();
      if (!res.ok) {
        setMessage(data?.message || "Failed to load products");
        setProducts([]);
      } else {
        setProducts(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      setMessage(error?.message || "Failed to load products");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMe();
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    if (!search) return products;
    return products.filter((item) =>
      [item.name, item.category, item.description, item.sku].some((field) =>
        (field || "").toLowerCase().includes(search.toLowerCase()),
      ),
    );
  }, [products, search]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    const images = Array.isArray(item?.meta?.images) ? item.meta.images : [];
    const cvs = Array.isArray(item?.meta?.colorVariants) ? item.meta.colorVariants : [];
    setGallery(images);
    setColorVariants(cvs);
    setForm({
      name: item.name || "",
      category: item.category || "",
      image_url: item.image_url || "",
      description: item.description || "",
      price: Number(item.price || 0),
      is_featured: Boolean(item.is_featured),
      dimensions: item.dimensions || "",
      additional_info: item.additional_info || "",
      sizes_available: item.sizes_available || "",
      sku: item.sku || "",
      meta: item.meta ? JSON.stringify(item.meta, null, 2) : "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;
    const res = await fetch(apiUrl(`/api/products/${id}`), {
      method: "DELETE",
      credentials: "include",
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setMessage(data?.message || "Failed to delete product");
      return;
    }
    setProducts((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    let metaValue = null;
    if (form.meta) {
      try {
        metaValue = JSON.parse(form.meta);
      } catch {
        setMessage("Meta must be valid JSON");
        return;
      }
    }

    const validVariants = colorVariants.filter((v) => v.name && v.images.length > 0);

    const payload = {
      ...form,
      price: Number(form.price || 0),
      is_featured: Boolean(form.is_featured),
      meta: {
        ...(metaValue || {}),
        images: gallery,
        colorVariants: validVariants,
      },
    };
    if (!payload.image_url && gallery.length > 0) {
      payload.image_url = gallery[0];
    }
    // Use first image of first color variant as main image if no other image
    if (!payload.image_url && validVariants.length > 0 && validVariants[0].images.length > 0) {
      payload.image_url = validVariants[0].images[0];
    }

    const endpoint = apiUrl(editingId ? `/api/products/${editingId}` : "/api/products");
    const method = editingId ? "PUT" : "POST";
    const res = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const details = data?.details ? ` (${data.details})` : "";
      setMessage(`${data?.message || "Failed to save product"}${details}`);
      return;
    }
    if (editingId) {
      setProducts((prev) => prev.map((item) => (item.id === editingId ? data : item)));
    } else {
      setProducts((prev) => [data, ...prev]);
    }
    setEditingId(null);
    setForm(emptyProduct);
    setGallery([]);
    setColorVariants([]);
    setMessage("Saved successfully");
  };

  // Upload images for general gallery
  const handleUpload = async (files) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    setMessage("");
    const maxFileSize = 500 * 1024;
    const validFiles = [];
    const invalidFiles = [];
    Array.from(files).forEach((file) => {
      if (file.size > maxFileSize) {
        invalidFiles.push(`${file.name} (${(file.size / 1024).toFixed(0)}KB > 500KB)`);
      } else {
        validFiles.push(file);
      }
    });
    if (invalidFiles.length > 0) {
      setUploading(false);
      setMessage(`❌ Files too large: ${invalidFiles.join(", ")}`);
      return;
    }
    if (validFiles.length === 0) { setUploading(false); return; }
    const formData = new FormData();
    validFiles.forEach((file) => formData.append("images", file));
    try {
      const res = await fetch(apiUrl("/api/uploads"), { method: "POST", credentials: "include", body: formData });
      const data = await res.json();
      if (!res.ok) { setMessage(data?.message || "Upload failed"); setUploading(false); return; }
      const urls = data?.urls || [];
      if (urls.length > 0) {
        setGallery((prev) => [...prev, ...urls]);
        if (!form.image_url) setForm((prev) => ({ ...prev, image_url: urls[0] }));
        setMessage(`✅ Uploaded ${urls.length} image(s)`);
      }
    } catch { setMessage("Upload failed."); }
    setUploading(false);
  };

  // Upload images for a specific color variant
  const handleVariantUpload = async (variantIdx, files) => {
    if (!files || files.length === 0) return;
    setVariantUploading(variantIdx);
    const maxFileSize = 500 * 1024;
    const validFiles = [];
    const invalidFiles = [];
    Array.from(files).forEach((file) => {
      if (file.size > maxFileSize) {
        invalidFiles.push(`${file.name}`);
      } else {
        validFiles.push(file);
      }
    });
    if (invalidFiles.length > 0) {
      setVariantUploading(null);
      setMessage(`❌ Files too large (max 500KB): ${invalidFiles.join(", ")}`);
      return;
    }
    if (validFiles.length === 0) { setVariantUploading(null); return; }
    const formData = new FormData();
    validFiles.forEach((file) => formData.append("images", file));
    try {
      const res = await fetch(apiUrl("/api/uploads"), { method: "POST", credentials: "include", body: formData });
      const data = await res.json();
      if (!res.ok) { setMessage(data?.message || "Upload failed"); setVariantUploading(null); return; }
      const urls = data?.urls || [];
      if (urls.length > 0) {
        setColorVariants((prev) =>
          prev.map((v, i) => i === variantIdx ? { ...v, images: [...v.images, ...urls] } : v)
        );
      }
    } catch { setMessage("Variant upload failed."); }
    setVariantUploading(null);
  };

  const addColorVariant = () => {
    setColorVariants((prev) => [...prev, emptyVariant()]);
  };

  const removeColorVariant = (idx) => {
    setColorVariants((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateVariantName = (idx, name) => {
    setColorVariants((prev) => prev.map((v, i) => i === idx ? { ...v, name } : v));
  };

  const removeVariantImage = (variantIdx, imgUrl) => {
    setColorVariants((prev) =>
      prev.map((v, i) => i === variantIdx ? { ...v, images: v.images.filter((u) => u !== imgUrl) } : v)
    );
  };

  const handleLogout = async () => {
    await fetch(apiUrl("/api/auth/logout"), { method: "POST", credentials: "include" });
    navigate("/admin");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-primary">Admin Products</h1>
            <p className="text-sm text-foreground/60">Signed in as {user?.email}</p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-full border border-border px-4 py-2 text-sm hover:bg-muted"
          >
            Logout
          </button>
        </div>
      </div>

      <main className="container mx-auto px-4 lg:px-8 py-10 grid gap-10 lg:grid-cols-[400px_1fr]">
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-3xl border border-border bg-card p-6 shadow-card space-y-4 h-fit"
        >
          <h2 className="text-lg font-semibold text-primary">
            {editingId ? "Edit Product" : "Add New Product"}
          </h2>

          {/* Basic Info */}
          <input
            type="text"
            placeholder="Product name"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className="w-full rounded-xl border border-border bg-background px-4 py-2 text-sm"
            required
          />
          <input
            type="text"
            placeholder="Category"
            value={form.category}
            onChange={(e) => handleChange("category", e.target.value)}
            className="w-full rounded-xl border border-border bg-background px-4 py-2 text-sm"
            required
          />

          {/* Main Image */}
          <div className="space-y-2">
            <label className="text-sm text-foreground/70">Main Image</label>
            {form.image_url ? (
              <div className="flex items-center gap-3">
                <img src={form.image_url} alt="" className="h-16 w-16 rounded-xl object-cover" />
                <button
                  type="button"
                  onClick={() => handleChange("image_url", "")}
                  className="rounded-full border border-border px-3 py-1.5 text-xs"
                >
                  Remove
                </button>
              </div>
            ) : (
              <p className="text-xs text-foreground/60">Auto-set from first uploaded image or first color variant.</p>
            )}
          </div>

          {/* General Gallery Upload */}
          <div className="space-y-2">
            <label className="text-sm text-foreground/70">General Gallery (max 500KB each)</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handleUpload(e.target.files)}
              className="w-full rounded-xl border border-border bg-background px-4 py-2 text-sm"
            />
            {uploading && <p className="text-xs text-foreground/60">Uploading...</p>}
            {message && (
              <p className={`text-xs ${message.includes("❌") ? "text-red-500" : "text-green-500"}`}>
                {message}
              </p>
            )}
            {gallery.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {gallery.map((url) => (
                  <div key={url} className="relative">
                    <img src={url} alt="" className="h-12 w-12 rounded-lg object-cover" />
                    <button
                      type="button"
                      onClick={() => setGallery((prev) => prev.filter((img) => img !== url))}
                      className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Color Variants ── */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-foreground/80">
                Color Variants
                <span className="ml-1.5 text-xs font-normal text-foreground/50">(each color: 2–4 images)</span>
              </label>
              <button
                type="button"
                onClick={addColorVariant}
                className="rounded-full bg-primary px-3 py-1 text-xs text-primary-foreground hover:opacity-90"
              >
                + Add Color
              </button>
            </div>

            {colorVariants.length === 0 && (
              <p className="text-xs text-foreground/40 italic">No color variants yet. Click "+ Add Color" to start.</p>
            )}

            {colorVariants.map((variant, idx) => (
              <div key={idx} className="rounded-xl border border-border bg-background p-3 space-y-2">
                {/* Color name row */}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder={`Color name (e.g. Red, Blue, Checks)`}
                    value={variant.name}
                    onChange={(e) => updateVariantName(idx, e.target.value)}
                    className="flex-1 rounded-lg border border-border bg-card px-3 py-1.5 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => removeColorVariant(idx)}
                    className="rounded-full bg-red-100 px-2.5 py-1 text-xs text-red-600 hover:bg-red-200"
                  >
                    Remove
                  </button>
                </div>

                {/* Image upload for this variant */}
                <div>
                  <label className="text-xs text-foreground/50 mb-1 block">
                    Upload images for "{variant.name || `Color ${idx + 1}`}" (max 4, 500KB each)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleVariantUpload(idx, e.target.files)}
                    className="w-full text-xs rounded-lg border border-border bg-card px-3 py-1.5"
                  />
                  {variantUploading === idx && (
                    <p className="text-xs text-foreground/50 mt-1">Uploading...</p>
                  )}
                </div>

                {/* Variant image previews */}
                {variant.images.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {variant.images.map((url) => (
                      <div key={url} className="relative group">
                        <img src={url} alt="" className="h-14 w-14 rounded-lg object-cover border border-border" />
                        <button
                          type="button"
                          onClick={() => removeVariantImage(idx, url)}
                          className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    <span className="self-end text-xs text-foreground/40">
                      {variant.images.length} image{variant.images.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Price */}
          <input
            type="number"
            placeholder="Price"
            step="0.01"
            value={form.price}
            onChange={(e) => handleChange("price", e.target.value)}
            className="w-full rounded-xl border border-border bg-background px-4 py-2 text-sm"
          />

          {/* Description */}
          <textarea
            rows={3}
            placeholder="Description"
            value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
            className="w-full rounded-xl border border-border bg-background px-4 py-2 text-sm"
          />

          {/* Dimensions */}
          <textarea
            rows={2}
            placeholder='Dimensions (e.g. 30" x 72", 36" x 72", 48" x 72")'
            value={form.dimensions}
            onChange={(e) => handleChange("dimensions", e.target.value)}
            className="w-full rounded-xl border border-border bg-background px-4 py-2 text-sm"
          />

          {/* Sizes Available */}
          <textarea
            rows={2}
            placeholder="Sizes Available (comma-separated, e.g. S, M, L, XL)"
            value={form.sizes_available}
            onChange={(e) => handleChange("sizes_available", e.target.value)}
            className="w-full rounded-xl border border-border bg-background px-4 py-2 text-sm"
          />

          {/* Additional Info */}
          <textarea
            rows={3}
            placeholder="Additional Information (Design & Quality, Materials, Care Instructions, etc.)"
            value={form.additional_info}
            onChange={(e) => handleChange("additional_info", e.target.value)}
            className="w-full rounded-xl border border-border bg-background px-4 py-2 text-sm"
          />

          {/* Meta JSON */}
          <textarea
            rows={3}
            placeholder='Meta JSON (e.g. {"sku":"A001","sizes":["30x72","36x72"]})'
            value={form.meta}
            onChange={(e) => handleChange("meta", e.target.value)}
            className="w-full rounded-xl border border-border bg-background px-4 py-2 text-sm font-mono text-xs"
          />

          {/* Featured */}
          <label className="flex items-center gap-2 text-sm text-foreground/70">
            <input
              type="checkbox"
              checked={form.is_featured}
              onChange={(e) => handleChange("is_featured", e.target.checked)}
            />
            Featured product
          </label>

          {/* Submit */}
          <button
            type="submit"
            className="w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-navy-light"
          >
            {editingId ? "Update Product" : "Create Product"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setForm(emptyProduct);
                setGallery([]);
                setColorVariants([]);
              }}
              className="w-full rounded-full border border-border px-6 py-3 text-sm"
            >
              Cancel Edit
            </button>
          )}
          {message && (
            <p className={`text-sm ${message.startsWith("Saved") ? "text-green-600" : "text-foreground/70"}`}>
              {message}
            </p>
          )}
        </motion.form>

        <div className="space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg font-semibold text-primary">Product List</h2>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full sm:w-64 rounded-full border border-border bg-background px-4 py-2 text-sm"
            />
          </div>

          {loading && <p className="text-sm text-foreground/60">Loading...</p>}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((item) => (
              <div key={item.id} className="rounded-2xl border border-border bg-card p-4 shadow-soft">
                <img src={item.image_url} alt={item.name} className="h-36 w-full rounded-xl object-cover" />
                <div className="mt-3">
                  <p className="text-xs uppercase tracking-widest text-foreground/60">{item.category}</p>
                  <h3 className="text-base font-semibold">{item.name}</h3>
                  {item.sku && <p className="text-xs text-foreground/50">SKU: {item.sku}</p>}
                  <p className="text-sm text-foreground/70 line-clamp-2">{item.description}</p>
                  {/* Show color variant count if any */}
                  {Array.isArray(item?.meta?.colorVariants) && item.meta.colorVariants.length > 0 && (
                    <p className="text-xs text-pink-500 mt-1">
                      {item.meta.colorVariants.length} color variant{item.meta.colorVariants.length !== 1 ? "s" : ""}:{" "}
                      {item.meta.colorVariants.map((v) => v.name).join(", ")}
                    </p>
                  )}
                  {item.dimensions && (
                    <p className="text-xs text-foreground/60 mt-1">Dimensions: {item.dimensions}</p>
                  )}
                  {item.sizes_available && (
                    <p className="text-xs text-foreground/60">Sizes: {item.sizes_available}</p>
                  )}
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-sm font-semibold text-primary">
                      ₹{Number(item.price || 0).toFixed(2)}
                    </span>
                    <span className="text-xs text-foreground/60">
                      {item.is_featured ? "Featured" : "Standard"}
                    </span>
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleEdit(item)}
                      className="flex-1 rounded-full border border-border px-3 py-1.5 text-xs hover:bg-muted"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      className="flex-1 rounded-full bg-accent px-3 py-1.5 text-xs font-semibold text-accent-foreground hover:brightness-110"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {!loading && filteredProducts.length === 0 && (
              <p className="text-sm text-foreground/60">No products found.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminProducts;
