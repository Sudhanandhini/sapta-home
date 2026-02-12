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
    return (<section className="py-20 lg:py-28 bg-primary text-primary-foreground overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <span className="inline-block px-4 py-1.5 bg-accent/20 text-accent rounded-full text-sm font-medium mb-6">
              Testimonials
            </span>
            <h2 className="font-display text-3xl lg:text-5xl font-bold mb-8">
              What Our Customers Say
            </h2>

            <div className="relative min-h-[280px]">
              <AnimatePresence mode="wait">
                <motion.div key={currentIndex} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }} className="bg-card text-card-foreground rounded-2xl p-6 lg:p-8 shadow-card">
                  <Quote className="w-10 h-10 text-accent mb-4"/>
                  
                  {/* Rating */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonials[currentIndex].rating)].map((_, i) => (<Star key={i} className="w-5 h-5 text-accent fill-accent"/>))}
                  </div>

                  <p className="text-lg text-muted-foreground mb-6 italic">
                    "{testimonials[currentIndex].text}"
                  </p>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
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
                <button onClick={prevTestimonial} className="w-10 h-10 rounded-full border border-primary-foreground/30 flex items-center justify-center text-primary-foreground hover:bg-primary-foreground hover:text-primary transition-all">
                  <ChevronLeft className="w-5 h-5"/>
                </button>
                <button onClick={nextTestimonial} className="w-10 h-10 rounded-full border border-primary-foreground/30 flex items-center justify-center text-primary-foreground hover:bg-primary-foreground hover:text-primary transition-all">
                  <ChevronRight className="w-5 h-5"/>
                </button>
              </div>
              <div className="flex gap-2">
                {testimonials.map((_, index) => (<button key={index} onClick={() => setCurrentIndex(index)} className={`w-2 h-2 rounded-full transition-all ${index === currentIndex
                ? "w-8 bg-accent"
                : "bg-primary-foreground/30 hover:bg-primary-foreground/50"}`}/>))}
              </div>
            </div>
          </motion.div>

          {/* Image */}
          <motion.div className="relative" initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}>
            <div className="relative">
              <motion.div className="rounded-3xl overflow-hidden shadow-hover" whileHover={{ scale: 1.02 }} transition={{ duration: 0.3 }}>
                <img src={productBedsheet} alt="Premium bedding products" className="w-full h-auto object-cover aspect-square"/>
              </motion.div>

              {/* Stats card */}
              <motion.div className="absolute -bottom-6 -left-6 bg-accent text-accent-foreground p-6 rounded-2xl shadow-card" initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.4 }}>
                <div className="text-3xl font-bold mb-1">2000+</div>
                <div className="text-sm font-medium">Happy Customers</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>);
};
export default Testimonials;
