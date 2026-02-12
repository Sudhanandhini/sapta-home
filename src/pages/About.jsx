import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useInView } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import {
  Sparkles, Tag, ShieldCheck, Shapes, HeartHandshake,
  Target, Eye, Award, Users, MapPin, Package, ArrowRight,
  ChevronLeft, ChevronRight,
} from "lucide-react";
import heroBedroom from "@/assets/hero-bedroom.jpg";

/* ── Animated Counter Hook ── */
const useCounter = (end, duration = 2000, startOnView = false) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const hasStarted = useRef(false);

  useEffect(() => {
    if (startOnView && !isInView) return;
    if (hasStarted.current) return;
    hasStarted.current = true;

    const startTime = performance.now();
    const tick = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutExpo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.round(eased * end));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [end, duration, isInView, startOnView]);

  return { count, ref };
};

const CounterStat = ({ numericValue, suffix, label, icon: Icon, index }) => {
  const { count, ref } = useCounter(numericValue, 2000, true);
  return (
    <motion.div
      ref={ref}
      variants={scaleIn}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      custom={index}
      whileHover={{ y: -4, transition: { duration: 0.25 } }}
      className="rounded-2xl border border-border bg-card p-5 shadow-card text-center group"
    >
      <motion.span className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
        <Icon className="h-5 w-5" />
      </motion.span>
      <p className="mt-3 text-2xl font-bold text-primary tabular-nums">
        {count}{suffix}
      </p>
      <p className="mt-1 text-xs text-foreground/60">{label}</p>
    </motion.div>
  );
};

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
    hoverBg: "hover:bg-primary",
  },
  {
    title: "Fair Pricing",
    description: "Premium designs and comfort, offered at honest, affordable prices.",
    icon: Tag,
    hoverBg: "hover:bg-navy-light",
  },
  {
    title: "Timeless Style",
    description: "Designs that look good today, tomorrow, and for years to come.",
    icon: Sparkles,
    hoverBg: "hover:bg-accent",
  },
  {
    title: "Everyday Practicality",
    description: "Products crafted for real-life use, combining beauty with function.",
    icon: Shapes,
    hoverBg: "hover:bg-primary",
  },
  {
    title: "Customer-Centric Approach",
    description: "We listen, we care, and we create with your comfort in mind.",
    icon: HeartHandshake,
    hoverBg: "hover:bg-navy-light",
  },
  {
    title: "Trusted Nationwide",
    description: "Serving happy customers across India with reliable delivery and support.",
    icon: Award,
    hoverBg: "hover:bg-accent",
  },
];

const stats = [
  { numericValue: 2000, suffix: "+", label: "Happy Customers", icon: Users },
  { numericValue: 150, suffix: "+", label: "Products", icon: Package },
  { numericValue: 10, suffix: "+", label: "Years Experience", icon: Award },
  { numericValue: 0, suffix: "", label: "Pan India Delivery", icon: MapPin, isText: true, textValue: "Pan India" },
];

/* ── Highlights Carousel ── */
const HighlightsSlider = () => {
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
    <section className="py-16 lg:py-20">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          className="text-center max-w-3xl mx-auto mb-14"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.span
            variants={fadeUp}
            custom={0}
            className="inline-block px-4 py-1.5 bg-accent/20 text-foreground rounded-full text-sm font-medium"
          >
            Why Choose Sapta
          </motion.span>
          <motion.h2
            variants={fadeUp}
            custom={1}
            className="mt-4 font-display text-3xl lg:text-5xl font-bold text-primary"
          >
            What Makes Us Different
          </motion.h2>
          <motion.p
            variants={fadeUp}
            custom={2}
            className="mt-4 text-lg text-muted-foreground"
          >
            Thoughtfully made home essentials that balance quality, comfort, and value.
          </motion.p>
        </motion.div>

        {/* Carousel */}
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
                  className="min-w-0 flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_25%] pl-5"
                >
                  <div className={`group relative h-full rounded-2xl bg-card shadow-soft hover:shadow-hover ${item.hoverBg} transition-all duration-400 p-6 cursor-default`}>
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-white/20 group-hover:text-white transition-colors duration-300 mb-4">
                      <item.icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-white transition-colors duration-300">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground group-hover:text-white/80 transition-colors duration-300">
                      {item.description}
                    </p>
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
            className="absolute -left-3 lg:-left-5 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-card border border-border shadow-card text-primary hover:bg-primary hover:text-primary-foreground disabled:opacity-30 transition-all duration-300"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => emblaApi?.scrollNext()}
            disabled={!canNext}
            className="absolute -right-3 lg:-right-5 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-card border border-border shadow-card text-primary hover:bg-primary hover:text-primary-foreground disabled:opacity-30 transition-all duration-300"
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
                  ? "w-8 bg-primary"
                  : "w-2.5 bg-primary/20 hover:bg-primary/40"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

const About = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="pt-20">
        {/* Hero Banner */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1600&auto=format&fit=crop')] bg-cover bg-center" />
          <div className="absolute inset-0 bg-primary/75" />
          <motion.div
            className="absolute top-16 right-16 w-40 h-40 rounded-full bg-accent/10 blur-3xl"
            animate={{ y: [-10, 10, -10], scale: [1, 1.15, 1] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-10 left-10 w-28 h-28 rounded-full bg-secondary/10 blur-2xl"
            animate={{ y: [10, -10, 10], scale: [1.1, 1, 1.1] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="container mx-auto px-4 lg:px-8 relative z-10 py-20 lg:py-28">
            <motion.div initial="hidden" animate="visible" className="max-w-2xl">
              <motion.span
                variants={fadeUp}
                custom={0}
                className="inline-flex items-center gap-2 rounded-full bg-accent/20 backdrop-blur-sm px-4 py-1.5 text-sm font-semibold text-primary-foreground border border-accent/30"
              >
                <Sparkles className="w-4 h-4" />
                About Us
              </motion.span>
              <motion.h1
                variants={fadeUp}
                custom={1}
                className="mt-6 font-display text-4xl font-bold text-primary-foreground sm:text-5xl lg:text-6xl leading-tight"
              >
                A Brand Built on <br />
                <span className="text-accent">Comfort & Trust</span>
              </motion.h1>
              <motion.p
                variants={fadeUp}
                custom={2}
                className="mt-5 text-lg text-primary-foreground/80 max-w-lg"
              >
                Learn what makes Sapta different and how our mission and vision guide every product we create.
              </motion.p>
              <motion.p
                variants={fadeUp}
                custom={2}
                className="mt-2 text-sm text-primary-foreground/60"
              >
                Home &bull; About
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* Stats Bar with Animated Counters */}
        <section className="container mx-auto px-4 lg:px-8 -mt-10 relative z-20">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) =>
              stat.isText ? (
                <motion.div
                  key={stat.label}
                  variants={scaleIn}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={index}
                  whileHover={{ y: -4, transition: { duration: 0.25 } }}
                  className="rounded-2xl border border-border bg-card p-5 shadow-card text-center group"
                >
                  <motion.span className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                    <stat.icon className="h-5 w-5" />
                  </motion.span>
                  <p className="mt-3 text-2xl font-bold text-primary">{stat.textValue}</p>
                  <p className="mt-1 text-xs text-foreground/60">{stat.label}</p>
                </motion.div>
              ) : (
                <CounterStat
                  key={stat.label}
                  numericValue={stat.numericValue}
                  suffix={stat.suffix}
                  label={stat.label}
                  icon={stat.icon}
                  index={index}
                />
              )
            )}
          </div>
        </section>

        {/* Our Story */}
        <section className="container mx-auto px-4 lg:px-8 py-16 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-2 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <motion.span
                variants={fadeUp}
                custom={0}
                className="inline-block px-4 py-1.5 bg-accent/20 text-foreground rounded-full text-sm font-medium"
              >
                Our Story
              </motion.span>
              <motion.h2
                variants={fadeUp}
                custom={1}
                className="mt-4 font-display text-3xl lg:text-4xl font-bold text-primary"
              >
                From Karur to Every Home in India
              </motion.h2>
              <motion.p
                variants={fadeUp}
                custom={2}
                className="mt-5 text-foreground/70 leading-relaxed"
              >
                Born in the heart of Karur, Tamil Nadu — India's textile capital — Sapta Home Textiles brings
                generations of weaving expertise to modern homes. We believe that every household deserves
                premium quality home furnishings without the premium price tag.
              </motion.p>
              <motion.p
                variants={fadeUp}
                custom={3}
                className="mt-4 text-foreground/70 leading-relaxed"
              >
                From carefully sourced 100% cotton fabrics to our meticulous finishing processes, every Sapta
                product is a testament to the craft and care that goes into making your home feel truly special.
              </motion.p>
              <motion.a
                variants={fadeUp}
                custom={4}
                href="/products"
                className="mt-6 inline-flex items-center gap-2 text-primary font-semibold hover:text-navy-light transition-colors group"
              >
                Explore Our Products
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.92, x: 40 }}
              whileInView={{ opacity: 1, scale: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative"
            >
              <motion.div
                className="rounded-3xl overflow-hidden shadow-hover"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <img
                  src={heroBedroom}
                  alt="Sapta Home Textiles craftsmanship"
                  className="w-full h-auto object-cover aspect-[4/3]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent rounded-3xl" />
              </motion.div>
              {/* Floating badge */}
              <motion.div
                className="absolute -bottom-5 -left-5 bg-card p-4 rounded-2xl shadow-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-accent/20 flex items-center justify-center">
                    <Award className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">10+ Years</p>
                    <p className="text-xs text-muted-foreground">of Excellence</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="bg-muted/50 py-16 lg:py-20">
          <div className="container mx-auto px-4 lg:px-8">
            <motion.div
              className="text-center max-w-2xl mx-auto mb-12"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <motion.span
                variants={fadeUp}
                custom={0}
                className="inline-block px-4 py-1.5 bg-accent/20 text-foreground rounded-full text-sm font-medium"
              >
                Our Purpose
              </motion.span>
              <motion.h2
                variants={fadeUp}
                custom={1}
                className="mt-4 font-display text-3xl lg:text-4xl font-bold text-primary"
              >
                Mission & Vision
              </motion.h2>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-8">
              <motion.div
                variants={scaleIn}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={0}
                whileHover={{ y: -4, transition: { duration: 0.25 } }}
                className="bg-card rounded-3xl shadow-card p-8 lg:p-10 relative overflow-hidden group"
              >
                <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-accent/5 group-hover:bg-accent/10 transition-colors duration-500" />
                <div className="relative z-10">
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                    <Target className="h-7 w-7" />
                  </span>
                  <h3 className="mt-5 font-display text-2xl font-bold text-primary">Our Mission</h3>
                  <p className="mt-4 text-foreground/70 leading-relaxed">
                    To combine top-quality craftsmanship with unbeatable value for every household. To reach every
                    household in India and contribute at most ease as possible, through our products. To bring home
                    joy, comfort and elegance and quality, helping every household feel cozy, cared for, and truly
                    at home. To bring everyday functionality into every home through thoughtfully designed,
                    high-quality furnishings.
                  </p>
                </div>
              </motion.div>

              <motion.div
                variants={scaleIn}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={1}
                whileHover={{ y: -4, transition: { duration: 0.25 } }}
                className="bg-card rounded-3xl shadow-card p-8 lg:p-10 relative overflow-hidden group"
              >
                <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-secondary/5 group-hover:bg-secondary/10 transition-colors duration-500" />
                <div className="relative z-10">
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                    <Eye className="h-7 w-7" />
                  </span>
                  <h3 className="mt-5 font-display text-2xl font-bold text-primary">Our Vision</h3>
                  <p className="mt-4 text-foreground/70 leading-relaxed">
                    To be India's most trusted home furnishings brand, known for blending quality, unique style,
                    and affordability in every home. We aspire to set the standard for home textile excellence,
                    making premium comfort accessible to every family across the nation.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* What Makes Us Different — Slider */}
        <HighlightsSlider />

        {/* CTA Banner */}
        <section className="container mx-auto px-4 lg:px-8 pb-16 lg:pb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl bg-primary p-10 lg:p-14 text-primary-foreground relative overflow-hidden text-center"
          >
            <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-accent/10" />
            <div className="absolute -bottom-12 -left-12 w-40 h-40 rounded-full bg-secondary/10" />
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="font-display text-3xl lg:text-4xl font-bold">
                Ready to Transform Your Home?
              </h2>
              <p className="mt-4 text-primary-foreground/70 text-lg">
                Explore our complete range of premium home furnishings crafted with love in Karur.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <motion.a
                  href="/products"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-accent text-accent-foreground rounded-full font-semibold shadow-soft hover:brightness-110 transition-all group"
                >
                  Shop Now
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </motion.a>
                <motion.a
                  href="/contact"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 border-2 border-primary-foreground/30 text-primary-foreground rounded-full font-semibold hover:bg-primary-foreground/10 transition-all"
                >
                  Contact Us
                </motion.a>
              </div>
            </div>
          </motion.div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
