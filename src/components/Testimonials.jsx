import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import productBedsheet from "@/assets/product-bedsheet.jpg";

const Testimonials = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const testimonials = [
        {
            id: 1,
            name: "Naveen Kumar",
            location: "Bangalore",
            rating: 5,
            text: "I've always loved great upholstery, and think that a great bed is one of the most important things for a good sleep. SAPTA bedsheets are incredibly soft and comfortable!",
            avatar: "NK",
        },
        {
            id: 2,
            name: "Priya Sharma",
            location: "Mumbai",
            rating: 5,
            text: "The quality of the quilts is exceptional. My family loves the cozy warmth they provide. Will definitely order more products!",
            avatar: "PS",
        },
        {
            id: 3,
            name: "Rahul Verma",
            location: "Delhi",
            rating: 5,
            text: "Best mattress I've ever purchased. The memory foam provides perfect support and I wake up refreshed every morning. Highly recommended!",
            avatar: "RV",
        },
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % testimonials.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [testimonials.length]);

    const nextTestimonial = () => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    };

    const prevTestimonial = () => {
        setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    return (
      <section className="py-20 lg:py-28 bg-primary text-primary-foreground overflow-hidden relative">
        {/* Decorative elements */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute top-10 right-10 w-64 h-64 rounded-full bg-secondary/10 blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-10 left-10 w-48 h-48 rounded-full bg-accent/10 blur-3xl"
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <div className="container mx-auto px-4 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-accent/20 text-accent rounded-full text-sm font-medium mb-6 border border-accent/30">
                <Star className="w-3.5 h-3.5 fill-secondary" />
                Testimonials
              </span>
              <h2 className="font-display text-3xl lg:text-5xl font-bold mb-8">
                What Our Customers <span className="text-accent">Say</span>
              </h2>

              <div className="relative min-h-[280px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4 }}
                    className="bg-card text-card-foreground rounded-2xl p-6 lg:p-8 shadow-card border border-secondary/10"
                  >
                    <Quote className="w-10 h-10 text-secondary mb-4" />

                    {/* Rating */}
                    <div className="flex gap-1 mb-4">
                      {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-accent fill-accent" />
                      ))}
                    </div>

                    <p className="text-lg text-muted-foreground mb-6 italic">
                      "{testimonials[currentIndex].text}"
                    </p>

                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-secondary to-accent flex items-center justify-center text-white font-semibold">
                        {testimonials[currentIndex].avatar}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{testimonials[currentIndex].name}</p>
                        <p className="text-sm text-muted-foreground">{testimonials[currentIndex].location}</p>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Navigation */}
              <div className="flex items-center gap-4 mt-6">
                <div className="flex gap-2">
                  <motion.button
                    onClick={prevTestimonial}
                    className="w-10 h-10 rounded-full border border-secondary/30 flex items-center justify-center text-primary-foreground hover:bg-secondary hover:text-secondary-foreground hover:border-secondary transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </motion.button>
                  <motion.button
                    onClick={nextTestimonial}
                    className="w-10 h-10 rounded-full border border-accent/30 flex items-center justify-center text-primary-foreground hover:bg-accent hover:text-accent-foreground hover:border-accent transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </motion.button>
                </div>
                <div className="flex gap-2">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={`h-2.5 rounded-full transition-all duration-300 ${
                        index === currentIndex
                          ? "w-8 bg-secondary"
                          : "w-2.5 bg-primary-foreground/30 hover:bg-primary-foreground/50"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Image */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="relative">
                <motion.div
                  className="rounded-3xl overflow-hidden shadow-hover border-2 border-secondary/10"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <img
                    src={productBedsheet}
                    alt="Premium bedding products"
                    className="w-full h-auto object-cover aspect-square"
                  />
                </motion.div>

                {/* Stats card - Pink */}
                <motion.div
                  className="absolute -bottom-6 -left-6 bg-secondary text-secondary-foreground p-6 rounded-2xl shadow-card"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="text-3xl font-bold mb-1">2000+</div>
                  <div className="text-sm font-medium">Happy Customers</div>
                </motion.div>

                {/* Quality badge - Yellow */}
                <motion.div
                  className="absolute -top-4 -right-4 bg-accent text-accent-foreground px-5 py-2.5 rounded-full shadow-card font-bold text-sm"
                  initial={{ opacity: 0, rotate: -10, scale: 0.8 }}
                  whileInView={{ opacity: 1, rotate: 8, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  whileHover={{ scale: 1.1, rotate: 0 }}
                >
                  4.9 Rating
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    );
};

export default Testimonials;
