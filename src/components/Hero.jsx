import { motion } from "framer-motion";
import { ArrowRight, Star, Truck, Shield, Leaf } from "lucide-react";
import heroBedroom from "@/assets/hero-bedroom.jpg";
import { Link } from "react-router-dom";

const Hero = () => {
    const features = [
        { icon: Truck, text: "Free Delivery", color: "text-secondary", bg: "bg-secondary/10" },
        { icon: Shield, text: "Premium Quality", color: "text-accent", bg: "bg-accent/15" },
        { icon: Leaf, text: "100% Cotton", color: "text-secondary", bg: "bg-secondary/10" },
    ];

    return (
      <section className="relative min-h-screen pt-20 overflow-hidden bg-gradient-to-br from-cream via-background to-muted">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-20 right-10 w-72 h-72 rounded-full bg-secondary/10 blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-20 left-10 w-96 h-96 rounded-full bg-accent/10 blur-3xl"
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full bg-secondary/5 blur-3xl"
            animate={{ x: [-50, 50, -50], y: [-30, 30, -30] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <div className="container mx-auto px-4 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[calc(100vh-5rem)] py-12">
            {/* Content */}
            <div className="order-2 lg:order-1 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/15 rounded-full mb-6 border border-secondary/30"
              >
                <Star className="w-4 h-4 text-accent fill-accent" />
                <span className="text-sm font-medium text-foreground/80">Premium Home Textiles</span>
              </motion.div>

              <motion.h1
                className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-primary leading-tight mb-6"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
              >
                Transform Your{" "}
                <span className="relative">
                  <span className="relative z-10 text-secondary">Sleep</span>
                  <motion.span
                    className="absolute bottom-2 left-0 right-0 h-3 bg-accent/30 -z-0"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                  />
                </span>
                <br />
                Experience
              </motion.h1>

              <motion.p
                className="text-lg lg:text-xl text-muted-foreground max-w-lg mx-auto lg:mx-0 mb-8"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                Discover our curated collection of premium bedsheets, quilts, mattresses, and pillows crafted for ultimate comfort.
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Link
                  to="/products"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent text-accent-foreground rounded-full font-semibold text-lg shadow-card hover:shadow-hover hover:brightness-110 transition-all duration-300 group"
                >
                  Shop Now
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
                <Link
                  to="/about"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-secondary text-secondary-foreground rounded-full font-semibold text-lg shadow-card hover:shadow-hover hover:brightness-110 transition-all duration-300"
                >
                  Learn More
                </Link>
              </motion.div>

              {/* Features */}
              <motion.div
                className="flex flex-wrap gap-6 justify-center lg:justify-start"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center gap-2 text-muted-foreground"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className={`w-8 h-8 rounded-full ${feature.bg} flex items-center justify-center`}>
                      <feature.icon className={`w-4 h-4 ${feature.color}`} />
                    </div>
                    <span className="text-sm font-medium">{feature.text}</span>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Image */}
            <motion.div
              className="order-1 lg:order-2 relative"
              initial={{ opacity: 0, scale: 0.9, x: 50 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="relative">
                {/* Main image */}
                <motion.div
                  className="relative rounded-3xl overflow-hidden shadow-hover border-2 border-secondary/10"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <img
                    src={heroBedroom}
                    alt="Luxury bedroom with premium bedding"
                    className="w-full h-auto object-cover aspect-[4/3]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-secondary/5" />
                </motion.div>

                {/* Floating badge - Rating */}
                <motion.div
                  className="absolute -bottom-4 -left-4 lg:-left-8 bg-card p-4 rounded-2xl shadow-card border border-accent/20"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                      <Star className="w-6 h-6 text-accent fill-accent" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">4.9 Rating</p>
                      <p className="text-xs text-muted-foreground">2000+ Reviews</p>
                    </div>
                  </div>
                </motion.div>

                {/* Discount badge */}
                <motion.div
                  className="absolute -top-4 -right-4 lg:-right-8 bg-secondary text-secondary-foreground px-6 py-3 rounded-full shadow-card font-bold"
                  initial={{ opacity: 0, rotate: -10, scale: 0.8 }}
                  animate={{ opacity: 1, rotate: 12, scale: 1 }}
                  transition={{ duration: 0.6, delay: 1 }}
                  whileHover={{ scale: 1.1, rotate: 0 }}
                >
                  10% OFF
                </motion.div>

                {/* Quality badge */}
                <motion.div
                  className="absolute top-1/2 -right-3 lg:-right-6 bg-accent text-accent-foreground px-4 py-2 rounded-full shadow-card text-xs font-bold"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 1.2 }}
                  whileHover={{ scale: 1.05 }}
                >
                  100% Cotton
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scrolling marquee */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-primary via-primary to-primary py-3 overflow-hidden">
          <motion.div
            className="flex gap-8 whitespace-nowrap"
            animate={{ x: [0, -1000] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            {[...Array(10)].map((_, i) => (
              <div key={i} className="flex items-center gap-8 text-primary-foreground text-sm font-medium">
                <span className="flex items-center gap-2">
                  <Star className="w-4 h-4 fill-secondary text-secondary" />
                  MODULAR, EASY TO MOVE DESIGN
                </span>
                <span className="flex items-center gap-2">
                  <Star className="w-4 h-4 fill-accent text-accent" />
                  DURABLE, PREMIUM MATERIALS
                </span>
                <span className="flex items-center gap-2">
                  <Star className="w-4 h-4 fill-secondary text-secondary" />
                  10% OFF YOUR FIRST ORDER
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>
    );
};

export default Hero;
