import { useState, useEffect, useCallback } from "react";
import { apiUrl } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ShoppingCart, Star, ChevronLeft, ChevronRight, ArrowRight, X, Layers } from "lucide-react";
import { Link } from "react-router-dom";

const Products = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [galleryIndex, setGalleryIndex] = useState(0);
    const [isAutoPlay, setIsAutoPlay] = useState(true);

    // Fetch products from API
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch(apiUrl("/api/products"));
                const data = await res.json();
                setProducts(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Failed to fetch products:", error);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const itemsPerSlide = 4;

    // Auto-slide one product at a time
    useEffect(() => {
        if (!isAutoPlay || products.length === 0) return;
        
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % products.length);
        }, 3000);
        
        return () => clearInterval(timer);
    }, [isAutoPlay, products.length]);

    // Calculate visible products
    const getVisibleProducts = () => {
        const visible = [];
        for (let i = 0; i < itemsPerSlide; i++) {
            visible.push(products[(currentIndex + i) % products.length]);
        }
        return visible;
    };

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % products.length);
        setIsAutoPlay(false);
        setTimeout(() => setIsAutoPlay(true), 5000);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + products.length) % products.length);
        setIsAutoPlay(false);
        setTimeout(() => setIsAutoPlay(true), 5000);
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.12 },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    };

    const handleQuickView = (product) => {
        setSelectedProduct(product);
        setGalleryIndex(0);
    };

    const getGalleryImages = (product) => {
        const metaImages = Array.isArray(product?.meta?.images) ? product.meta.images : [];
        return [product.image_url, ...metaImages].filter(Boolean);
    };

    const ProductCard = ({ product }) => (
        <motion.div variants={itemVariants} className="group">
            <div className="bg-card rounded-2xl overflow-hidden shadow-soft hover:shadow-hover transition-all duration-500 border border-transparent hover:border-secondary/20">
                {/* Image */}
                <div className="relative aspect-square overflow-hidden bg-muted">
                    <motion.img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.4 }}
                    />

                    {/* Badge */}
                    {product.is_featured && (
                        <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold bg-accent text-accent-foreground">
                            Featured
                        </span>
                    )}

                    {/* Quick View */}
                    <motion.div
                        className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        initial={{ y: 20 }}
                        whileHover={{ y: 0 }}
                    >
                        <button
                            onClick={() => handleQuickView(product)}
                            className="w-full py-2.5 bg-card/90 backdrop-blur-sm rounded-full text-sm font-medium text-foreground hover:bg-card transition-colors"
                        >
                            Quick View
                        </button>
                    </motion.div>
                </div>

                {/* Content */}
                <div className="p-4">
                    <span className="text-xs text-secondary font-medium uppercase tracking-wide">
                        {product.category}
                    </span>
                    <h3 className="font-medium text-foreground mt-1 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {product.name}
                    </h3>

                    {/* Price */}
                    {/* <div className="flex items-center gap-2 mb-3">
                        <span className="text-sm font-semibold text-primary">
                            ₹{Number(product.price || 0).toFixed(2)}
                        </span>
                    </div> */}

                    {/* Rating */}
                    <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                className={`w-3.5 h-3.5 ${
                                    i < Math.floor(4.5)
                                        ? "text-accent fill-accent"
                                        : "text-muted"
                                }`}
                            />
                        ))}
                        <span className="text-xs text-muted-foreground ml-1">(23)</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );

    // Quick View Modal
    const QuickViewModal = ({ product }) => {
        const gallery = getGalleryImages(product);
        const currentImage = gallery[galleryIndex] || product.image_url;

        return (
            <AnimatePresence>
                {product && (
                    <motion.div
                        key="modal-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedProduct(null)}
                        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                    >
                        <motion.div
                            key="modal-content"
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-card rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
                        >
                            {/* Header */}
                            <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-border bg-card/95 backdrop-blur-sm">
                                <h2 className="text-xl font-semibold text-primary">Quick View</h2>
                                <button
                                    onClick={() => setSelectedProduct(null)}
                                    className="p-2 hover:bg-muted rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-6 space-y-6">
                                {/* Gallery */}
                                <div className="space-y-4">
                                    <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted">
                                        <motion.img
                                            key={currentImage}
                                            src={currentImage}
                                            alt={product.name}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ duration: 0.3 }}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    {/* Thumbnail Gallery */}
                                    {gallery.length > 1 && (
                                        <div className="flex gap-2 overflow-x-auto">
                                            {gallery.map((image, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => setGalleryIndex(idx)}
                                                    className={`w-16 h-16 rounded-lg flex-shrink-0 overflow-hidden border-2 transition-all ${
                                                        galleryIndex === idx
                                                            ? "border-primary"
                                                            : "border-border hover:border-secondary"
                                                    }`}
                                                >
                                                    <img
                                                        src={image}
                                                        alt=""
                                                        className="w-full h-full object-cover"
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Product Details */}
                                <div className="space-y-4">
                                    <div>
                                        <span className="text-xs font-medium uppercase tracking-wide text-secondary">
                                            {product.category}
                                        </span>
                                        <h1 className="text-2xl font-bold text-primary mt-2">
                                            {product.name}
                                        </h1>
                                    </div>

                                    {/* Price */}
                                    {/* <div>
                                        <span className="text-3xl font-bold text-primary">
                                            ₹{Number(product.price || 0).toFixed(2)}
                                        </span>
                                    </div> */}

                                    {/* Rating */}
                                    <div className="flex items-center gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className="w-4 h-4 text-accent fill-accent"
                                            />
                                        ))}
                                        <span className="text-sm text-foreground/60 ml-2">(4.5 • 23 reviews)</span>
                                    </div>

                                    {/* SKU */}
                                    {product.sku && (
                                        <div className="text-sm">
                                            <span className="text-foreground/60">SKU: </span>
                                            <span className="font-medium">{product.sku}</span>
                                        </div>
                                    )}

                                    {/* Description */}
                                    {product.description && (
                                        <div>
                                            <h3 className="font-semibold text-primary mb-2">Description</h3>
                                            <p className="text-sm text-foreground/80">
                                                {product.description}
                                            </p>
                                        </div>
                                    )}

                                    {/* Sizes Available */}
                                    {product.sizes_available && (
                                        <div>
                                            <h3 className="font-semibold text-primary mb-2">Sizes Available</h3>
                                            <p className="text-sm text-foreground/80">
                                                {product.sizes_available}
                                            </p>
                                        </div>
                                    )}

                                    {/* Dimensions */}
                                    {product.dimensions && (
                                        <div>
                                            <h3 className="font-semibold text-primary mb-2">Dimensions</h3>
                                            <p className="text-sm text-foreground/80">
                                                {product.dimensions}
                                            </p>
                                        </div>
                                    )}

                                    {/* Additional Info */}
                                    {product.additional_info && (
                                        <div>
                                            <h3 className="font-semibold text-primary mb-2">Additional Information</h3>
                                            <p className="text-sm text-foreground/80 whitespace-pre-line">
                                                {product.additional_info}
                                            </p>
                                        </div>
                                    )}

                                    {/* CTA Buttons */}
                                    <div className="flex gap-3 pt-4">
                                        <Link
                                            to={`/products/${product.id}`}
                                            className="flex-1 py-3 bg-primary text-primary-foreground rounded-full font-semibold hover:bg-primary/90 transition-colors text-center"
                                        >
                                            View Full Details
                                        </Link>
                                        <button className="px-6 py-3 border border-border rounded-full hover:bg-muted transition-colors">
                                            <Heart className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        );
    };

    const visibleProducts = getVisibleProducts();

    return (
        <>
            <section id="products" className="py-20 lg:py-28 bg-muted/50 relative overflow-hidden">
                {/* Decorative background */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-secondary/5 blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-accent/5 blur-3xl" />
                </div>

                <div className="container mx-auto px-4 lg:px-8 relative">
                    {/* Featured Products */}
                    <div>
                        <motion.div
                            className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <div>
                                <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-accent/15 text-accent-foreground rounded-full text-sm font-medium mb-4 border border-accent/30">
                                    <Star className="w-3.5 h-3.5 fill-accent text-accent" />
                                    Featured Products
                                </span>
                                <h2 className="font-display text-3xl lg:text-4xl font-bold text-primary">
                                    Customer Favorites
                                </h2>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={prevSlide}
                                    className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-foreground hover:bg-secondary hover:text-secondary-foreground hover:border-secondary transition-all"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={nextSlide}
                                    className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-foreground hover:bg-accent hover:text-accent-foreground hover:border-accent transition-all"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </motion.div>

                        {loading ? (
                            <div className="flex items-center justify-center h-96">
                                <div className="relative">
                                    <div className="h-16 w-16 rounded-full border-4 border-pink-200 border-t-pink-500 animate-spin" />
                                </div>
                            </div>
                        ) : products.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-foreground/60">No products found</p>
                            </div>
                        ) : (
                            <>
                                <motion.div
                                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="visible"
                                >
                                    {visibleProducts.map((product) => (
                                        <ProductCard key={product.id} product={product} />
                                    ))}
                                </motion.div>

                                {/* Slide indicator dots */}
                               <div className="flex justify-center gap-2 mt-8">
  {products.slice(0, 3).map((_, i) => (
    <button
      key={i}
      onClick={() => {
        setCurrentIndex(i);
        setIsAutoPlay(false);
        setTimeout(() => setIsAutoPlay(true), 5000);
      }}
      className={`h-2 rounded-full transition-all duration-300 ${
        i === currentIndex
          ? "w-8 bg-secondary"
          : "w-2 bg-secondary/20 hover:bg-secondary/40"
      }`}
    />
  ))}
</div>

                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* Quick View Modal */}
            {selectedProduct && <QuickViewModal product={selectedProduct} />}
        </>
    );
};

export default Products;