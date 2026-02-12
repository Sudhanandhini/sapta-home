import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, ShoppingCart, Star, ChevronLeft, ChevronRight } from "lucide-react";
import productBedsheet from "@/assets/product-bedsheet.jpg";
import productQuilt from "@/assets/product-quilt.jpg";
import productMattress from "@/assets/product-mattress.jpg";
import productPillow from "@/assets/product-pillow.jpg";
import productBed from "@/assets/product-bed.jpg";
const Products = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const products = [
        {
            id: 1,
            name: "Premium Cotton Bedsheet Set",
            price: 2499,
            originalPrice: 3499,
            rating: 4.8,
            reviews: 128,
            image: productBedsheet,
            badge: "Best Seller",
            category: "Bedsheet",
        },
        {
            id: 2,
            name: "Quilted Comfort Blanket",
            price: 1899,
            originalPrice: 2599,
            rating: 4.7,
            reviews: 95,
            image: productQuilt,
            badge: "New",
            category: "Quilt",
        },
        {
            id: 3,
            name: "Memory Foam Mattress King",
            price: 18999,
            originalPrice: 24999,
            rating: 4.9,
            reviews: 256,
            image: productMattress,
            badge: "Popular",
            category: "Mattress",
        },
        {
            id: 4,
            name: "Luxury Fluffy Pillow Set",
            price: 999,
            originalPrice: 1499,
            rating: 4.6,
            reviews: 74,
            image: productPillow,
            badge: null,
            category: "Pillow",
        },
        {
            id: 5,
            name: "Modern Platform Bed Frame",
            price: 32999,
            originalPrice: 42999,
            rating: 4.9,
            reviews: 189,
            image: productBed,
            badge: "Premium",
            category: "Bed",
        },
        {
            id: 6,
            name: "Floral Print Bedsheet",
            price: 1799,
            originalPrice: 2299,
            rating: 4.5,
            reviews: 67,
            image: productBedsheet,
            badge: null,
            category: "Bedsheet",
        },
    ];
    const featuredProducts = products.slice(0, 4);
    const itemsPerSlide = 4;
    const maxSlide = Math.ceil(products.length / itemsPerSlide) - 1;
    const nextSlide = () => setCurrentSlide((prev) => Math.min(prev + 1, maxSlide));
    const prevSlide = () => setCurrentSlide((prev) => Math.max(prev - 1, 0));
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 },
        },
    };
    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    };
    const ProductCard = ({ product, index }) => (<motion.div variants={itemVariants} className="group">
      <div className="bg-card rounded-2xl overflow-hidden shadow-soft hover:shadow-hover transition-all duration-500">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-muted">
          <motion.img src={product.image} alt={product.name} className="w-full h-full object-cover" whileHover={{ scale: 1.05 }} transition={{ duration: 0.4 }}/>
          
          {/* Badge */}
          {product.badge && (<span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold ${product.badge === "Best Seller" ? "bg-accent text-accent-foreground" :
                product.badge === "New" ? "bg-green-500 text-white" :
                    product.badge === "Premium" ? "bg-primary text-primary-foreground" :
                        "bg-pink-500 text-white"}`}>
              {product.badge}
            </span>)}

          {/* Actions */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <motion.button className="w-9 h-9 rounded-full bg-card shadow-md flex items-center justify-center text-muted-foreground hover:text-red-500 transition-colors" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Heart className="w-4 h-4"/>
            </motion.button>
            <motion.button className="w-9 h-9 rounded-full bg-primary text-primary-foreground shadow-md flex items-center justify-center hover:bg-navy-light transition-colors" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <ShoppingCart className="w-4 h-4"/>
            </motion.button>
          </div>

          {/* Quick View */}
          <motion.div className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" initial={{ y: 20 }} whileHover={{ y: 0 }}>
            <button className="w-full py-2.5 bg-card/90 backdrop-blur-sm rounded-full text-sm font-medium text-foreground hover:bg-card transition-colors">
              Quick View
            </button>
          </motion.div>
        </div>

        {/* Content */}
        <div className="p-4">
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
            {product.category}
          </span>
          <h3 className="font-medium text-foreground mt-1 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          
          {/* Rating */}
          <div className="flex items-center gap-1 mb-3">
            {[...Array(5)].map((_, i) => (<Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(product.rating) ? "text-accent fill-accent" : "text-muted"}`}/>))}
            <span className="text-xs text-muted-foreground ml-1">
              ({product.reviews})
            </span>
          </div>

          <div className="text-sm font-semibold text-primary">Request a quote</div>
        </div>
      </div>
    </motion.div>);
    return (<section id="products" className="py-20 lg:py-28 bg-muted/50">
      <div className="container mx-auto px-4 lg:px-8">
        {/* New Arrivals */}
        <div className="mb-20">
          <motion.div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div>
              <span className="inline-block px-4 py-1.5 bg-accent/20 text-foreground rounded-full text-sm font-medium mb-4">
                New Arrivals
              </span>
              <h2 className="font-display text-3xl lg:text-4xl font-bold text-primary">
                Discover Fresh Styles
              </h2>
            </div>
            <a href="#" className="inline-flex items-center gap-2 text-primary font-medium hover:text-navy-light transition-colors group">
              View All Products
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform"/>
            </a>
          </motion.div>

          <motion.div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            {products.slice(0, 4).map((product, index) => (<ProductCard key={product.id} product={product} index={index}/>))}
          </motion.div>
        </div>

        {/* Featured Products Carousel */}
        <div>
          <motion.div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div>
              <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
                Featured Products
              </span>
              <h2 className="font-display text-3xl lg:text-4xl font-bold text-primary">
                Customer Favorites
              </h2>
            </div>
            <div className="flex gap-2">
              <button onClick={prevSlide} disabled={currentSlide === 0} className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                <ChevronLeft className="w-5 h-5"/>
              </button>
              <button onClick={nextSlide} disabled={currentSlide === maxSlide} className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                <ChevronRight className="w-5 h-5"/>
              </button>
            </div>
          </motion.div>

          <div className="overflow-hidden">
            <motion.div className="flex gap-6" animate={{ x: `-${currentSlide * 100}%` }} transition={{ duration: 0.5, ease: "easeInOut" }}>
              {products.map((product, index) => (<div key={product.id} className="w-full sm:w-1/2 lg:w-1/4 flex-shrink-0">
                  <ProductCard product={product} index={index}/>
                </div>))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>);
};
export default Products;
