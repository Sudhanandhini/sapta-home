import { motion } from "framer-motion";
import { ArrowRight, Phone, Truck, ShieldCheck, Award, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const CallToAction = () => {
  const highlights = [
    { icon: Truck, label: "Free Delivery", desc: "On all orders" },
    { icon: ShieldCheck, label: "Quality Assured", desc: "Premium materials" },
    { icon: Award, label: "2000+ Customers", desc: "Trust us daily" },
  ];

  return (
    <section className="relative py-20 lg:py-28 overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-secondary via-pink-500 to-accent" />

      {/* Animated decorative blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-white/10 blur-3xl"
          animate={{ scale: [1, 1.3, 1], x: [0, 40, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-yellow-300/20 blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], y: [0, -30, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-white/5 blur-2xl"
          animate={{ scale: [1, 1.4, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Pattern overlay */}
      <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "24px 24px" }} />

      <div className="container mx-auto px-4 lg:px-8 relative">
        {/* Top sparkle badge */}
        <motion.div
          className="flex justify-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-2 px-5 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-medium border border-white/30">
            <Sparkles className="w-4 h-4" />
            Limited Time Offer — 10% Off Your First Order
          </span>
        </motion.div>

        {/* Headline */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-5 leading-tight">
            Ready to Transform Your{" "}
            <span className="relative inline-block">
              Home
              <motion.span
                className="absolute -bottom-1 left-0 right-0 h-2 bg-yellow-300/50 rounded-full"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.6 }}
              />
            </span>
            ?
          </h2>
          <p className="text-lg lg:text-xl text-white/85 leading-relaxed">
            Experience the finest home textiles crafted with love in Karur. Premium comfort delivered right to your doorstep.
          </p>
        </motion.div>

        {/* Highlight cards */}
        <motion.div
          className="grid sm:grid-cols-3 gap-5 max-w-2xl mx-auto mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {highlights.map((item, i) => (
            <motion.div
              key={i}
              className="flex flex-col items-center text-center p-5 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-colors"
              whileHover={{ y: -4, scale: 1.03 }}
              transition={{ duration: 0.25 }}
            >
              <div className="w-12 h-12 rounded-full bg-yellow-400 flex items-center justify-center mb-3 shadow-lg">
                <item.icon className="w-6 h-6 text-primary" />
              </div>
              <p className="font-semibold text-white text-sm">{item.label}</p>
              <p className="text-white/70 text-xs mt-0.5">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.35 }}
        >
          <Link to="/products">
            <motion.span
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-secondary rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all group cursor-pointer"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              Shop Collection
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.span>
          </Link>
          <Link to="/contact">
            <motion.span
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent text-white rounded-full font-bold text-lg border-2 border-white/50 hover:bg-white/10 transition-all group cursor-pointer"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              <Phone className="w-5 h-5" />
              Get in Touch
            </motion.span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default CallToAction;
