import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const emptyProduct = {
  name: "",
  category: "",
  image_url: "",
  description: "",
  price: 0,
  is_featured: false,
  meta: "",
};

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

  const fetchMe = async () => {
    const res = await fetch("/api/auth/me", { credentials: "include" });
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
      const res = await fetch("/api/products");
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
      [item.name, item.category, item.description].some((field) =>
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
    setGallery(images);
    setForm({
      name: item.name || "",
      category: item.category || "",
      image_url: item.image_url || "",
      description: item.description || "",
      price: Number(item.price || 0),
      is_featured: Boolean(item.is_featured),
      meta: item.meta ? JSON.stringify(item.meta, null, 2) : "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;
    const res = await fetch(`/api/products/${id}`, {
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

    const payload = {
      ...form,
      price: Number(form.price || 0),
      is_featured: Boolean(form.is_featured),
      meta: {
        ...(metaValue || {}),
        images: gallery,
      },
    };
    if (!payload.image_url && gallery.length > 0) {
      payload.image_url = gallery[0];
    }

    const endpoint = editingId ? `/api/products/${editingId}` : "/api/products";
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
    setMessage("Saved successfully");
  };

  const handleUpload = async (files) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    setMessage("");
    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append("images", file));
    const res = await fetch("/api/uploads", {
      method: "POST",
      credentials: "include",
      body: formData,
    });
    const data = await res.json();
    setUploading(false);
    if (!res.ok) {
      setMessage(data?.message || "Image upload failed");
      return;
    }
    const urls = data?.urls || [];
    if (urls.length > 0) {
      setGallery((prev) => [...prev, ...urls]);
      if (!form.image_url) {
        setForm((prev) => ({ ...prev, image_url: urls[0] }));
      }
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
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

      <main className="container mx-auto px-4 lg:px-8 py-10 grid gap-10 lg:grid-cols-[360px_1fr]">
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-3xl border border-border bg-card p-6 shadow-card space-y-4"
        >
          <h2 className="text-lg font-semibold text-primary">
            {editingId ? "Edit Product" : "Add New Product"}
          </h2>
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
                  Remove main image
                </button>
              </div>
            ) : (
              <p className="text-xs text-foreground/60">Main image will use the first uploaded image.</p>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm text-foreground/70">Upload Images (max 6)</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handleUpload(e.target.files)}
              className="w-full rounded-xl border border-border bg-background px-4 py-2 text-sm"
            />
            {uploading && <p className="text-xs text-foreground/60">Uploading...</p>}
            {gallery.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {gallery.map((url) => (
                  <div key={url} className="relative">
                    <img src={url} alt="" className="h-12 w-12 rounded-lg object-cover" />
                    <button
                      type="button"
                      onClick={() => setGallery((prev) => prev.filter((img) => img !== url))}
                      className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <textarea
            rows={4}
            placeholder="Description"
            value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
            className="w-full rounded-xl border border-border bg-background px-4 py-2 text-sm"
          />
          <input
            type="number"
            placeholder="Price"
            value={form.price}
            onChange={(e) => handleChange("price", e.target.value)}
            className="w-full rounded-xl border border-border bg-background px-4 py-2 text-sm"
          />
          <textarea
            rows={4}
            placeholder='Meta JSON (e.g. {"size":"L","material":"Cotton"})'
            value={form.meta}
            onChange={(e) => handleChange("meta", e.target.value)}
            className="w-full rounded-xl border border-border bg-background px-4 py-2 text-sm font-mono"
          />
          <label className="flex items-center gap-2 text-sm text-foreground/70">
            <input
              type="checkbox"
              checked={form.is_featured}
              onChange={(e) => handleChange("is_featured", e.target.checked)}
            />
            Featured product
          </label>
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
              }}
              className="w-full rounded-full border border-border px-6 py-3 text-sm"
            >
              Cancel Edit
            </button>
          )}
          {message && <p className="text-sm text-foreground/70">{message}</p>}
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
                  <p className="text-sm text-foreground/70 line-clamp-2">{item.description}</p>
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
