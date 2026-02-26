import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import {
  Sparkles, Tag, ShieldCheck, Shapes, HeartHandshake,
  Award, ChevronLeft, ChevronRight, Star, Target, Eye,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: "easeOut" },
  }),
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: (i = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, delay: i * 0.12, ease: "easeOut" },
  }),
};

const highlights = [
  {
    title: "Best-in-Class Quality",
    description: "Every product is made with carefully chosen materials and strict quality checks.",
    icon: ShieldCheck,
    iconColor: "text-secondary",
    iconBg: "bg-secondary/10",
    hoverBg: "hover:bg-secondary",
    hoverBorder: "group-hover:border-secondary",
    number: "01",
  },
  {
    title: "Fair Pricing",
    description: "Premium designs and comfort, offered at honest, affordable prices.",
    icon: Tag,
    iconColor: "text-accent",
    iconBg: "bg-accent/15",
    hoverBg: "hover:bg-accent",
    hoverBorder: "group-hover:border-accent",
    number: "02",
  },
  {
    title: "Timeless Style",
    description: "Designs that look good today, tomorrow, and for years to come.",
    icon: Sparkles,
    iconColor: "text-secondary",
    iconBg: "bg-secondary/10",
    hoverBg: "hover:bg-secondary",
    hoverBorder: "group-hover:border-secondary",
    number: "03",
  },
  {
    title: "Everyday Practicality",
    description: "Products crafted for real-life use, combining beauty with function.",
    icon: Shapes,
    iconColor: "text-accent",
    iconBg: "bg-accent/15",
    hoverBg: "hover:bg-accent",
    hoverBorder: "group-hover:border-accent",
    number: "04",
  },
  {
    title: "Customer-Centric Approach",
    description: "We listen, we care, and we create with your comfort in mind.",
    icon: HeartHandshake,
    iconColor: "text-secondary",
    iconBg: "bg-secondary/10",
    hoverBg: "hover:bg-secondary",
    hoverBorder: "group-hover:border-secondary",
    number: "05",
  },
  {
    title: "Trusted Nationwide",
    description: "Serving happy customers across India with reliable delivery and support.",
    icon: Award,
    iconColor: "text-accent",
    iconBg: "bg-accent/15",
    hoverBg: "hover:bg-accent",
    hoverBorder: "group-hover:border-accent",
    number: "06",
  },
];

const Categories = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    slidesToScroll: 1,
  });
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState([]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanPrev(emblaApi.canScrollPrev());
    setCanNext(emblaApi.canScrollNext());
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    setScrollSnaps(emblaApi.scrollSnapList());
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", () => {
      setScrollSnaps(emblaApi.scrollSnapList());
      onSelect();
    });
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  // Auto-play
  useEffect(() => {
    if (!emblaApi) return;
    const interval = setInterval(() => emblaApi.scrollNext(), 4000);
    return () => clearInterval(interval);
  }, [emblaApi]);

  return (
    <section id="about" className="py-20 lg:py-28 bg-background relative overflow-hidden">
      {/* Decorative backgrounds */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-10 left-10 w-72 h-72 rounded-full bg-secondary/5 blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-accent/5 blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-secondary/3 blur-3xl"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative">
        {/* Section Header */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-14"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.span
            variants={fadeUp}
            custom={0}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-secondary/15 text-secondary rounded-full text-sm font-medium border border-secondary/30"
          >
            <Star className="w-3.5 h-3.5 fill-accent text-accent" />
            About Us
          </motion.span>
          <motion.h2
            variants={fadeUp}
            custom={1}
            className="mt-4 font-display text-3xl lg:text-5xl font-bold text-primary"
          >
            What Makes Us <span className="bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">Different</span>
          </motion.h2>
          <motion.p
            variants={fadeUp}
            custom={2}
            className="mt-4 text-lg text-muted-foreground"
          >
            Thoughtfully made home essentials that balance quality, comfort, and value.
          </motion.p>
        </motion.div>

        {/* Slider */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex -ml-5">
              {highlights.map((item, index) => (
                <div
                  key={index}
                  className="min-w-0 flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_33.333%] pl-5"
                >
                  <div className={`group relative h-full rounded-2xl bg-card shadow-soft ${item.hoverBg} transition-all duration-400 p-7 cursor-default overflow-hidden`}>
                    {/* Number watermark */}
                    <span className="absolute top-3 right-4 text-6xl font-bold text-foreground/[0.03] group-hover:text-white/10 transition-colors duration-300 select-none pointer-events-none">
                      {item.number}
                    </span>
                    <div className={`w-10 h-10 rounded-xl ${item.iconBg} flex items-center justify-center ${item.iconColor} group-hover:bg-white/20 group-hover:text-white transition-colors duration-300 mb-5`}>
                      <item.icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-white transition-colors duration-300">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground group-hover:text-[#213073] transition-colors duration-300 leading-relaxed">
                      {item.description}
                    </p>
                    {/* Bottom accent line */}
                    <div className={`absolute bottom-0 left-0 right-0 h-1 bg-transparent ${item.hoverBorder === "group-hover:border-secondary" ? "group-hover:bg-white/30" : "group-hover:bg-white/30"} transition-all duration-300`} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <button
            type="button"
            onClick={() => emblaApi?.scrollPrev()}
            disabled={!canPrev}
            className="absolute -left-3 lg:-left-5 top-1/2 -translate-y-1/2 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-card border border-border shadow-card text-secondary hover:bg-secondary hover:text-secondary-foreground disabled:opacity-30 transition-all duration-300"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => emblaApi?.scrollNext()}
            disabled={!canNext}
            className="absolute -right-3 lg:-right-5 top-1/2 -translate-y-1/2 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-card border border-border shadow-card text-accent hover:bg-accent hover:text-accent-foreground disabled:opacity-30 transition-all duration-300"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </motion.div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => emblaApi?.scrollTo(index)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                selectedIndex === index
                  ? "w-8 bg-secondary"
                  : "w-2.5 bg-secondary/20 hover:bg-secondary/40"
              }`}
            />
          ))}
        </div>

        {/* Mission & Vision */}
        <div className="mt-20">
          <motion.div
            className="text-center max-w-2xl mx-auto mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.span
              variants={fadeUp}
              custom={0}
              className="inline-flex items-center gap-2 px-4 py-1.5 bg-accent/15 text-accent-foreground rounded-full text-sm font-medium border border-accent/30"
            >
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              Our Purpose
            </motion.span>
            <motion.h2
              variants={fadeUp}
              custom={1}
              className="mt-4 font-display text-3xl lg:text-4xl font-bold text-primary"
            >
              Mission & <span className="text-secondary">Vision</span>
            </motion.h2>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Mission - Pink */}
            <motion.div
              variants={scaleIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0}
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
              className="bg-card rounded-3xl shadow-card hover:shadow-hover p-8 lg:p-10 relative overflow-hidden group border-l-4 border-secondary transition-shadow duration-300"
            >
              <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-secondary/5 group-hover:bg-secondary/10 transition-colors duration-500" />
              <div className="relative z-10">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary/10 text-secondary group-hover:bg-secondary group-hover:text-secondary-foreground transition-colors duration-300">
                  <Target className="h-7 w-7" />
                </span>
                <h3 className="mt-5 font-display text-2xl font-bold text-primary">Our Mission</h3>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  To combine top-quality craftsmanship with unbeatable value for every household. To reach every household
                  in India and contribute at most ease as possible, through our products. To bring home joy, comfort and
                  elegance and quality, helping every household feel cozy, cared for, and truly at home.
                </p>
              </div>
            </motion.div>

            {/* Vision - Yellow */}
            <motion.div
              variants={scaleIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={1}
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
              className="bg-card rounded-3xl shadow-card hover:shadow-hover p-8 lg:p-10 relative overflow-hidden group border-l-4 border-accent transition-shadow duration-300"
            >
              <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-accent/5 group-hover:bg-accent/10 transition-colors duration-500" />
              <div className="relative z-10">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/15 text-accent group-hover:bg-accent group-hover:text-accent-foreground transition-colors duration-300">
                  <Eye className="h-7 w-7" />
                </span>
                <h3 className="mt-5 font-display text-2xl font-bold text-primary">Our Vision</h3>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  To be India's most trusted home furnishings brand, known for blending quality, unique style, and
                  affordability in every home. We aspire to set the standard for home textile excellence,
                  making premium comfort accessible to every family across the nation.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Categories;
