import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Star, Truck, Shield, Leaf, ChevronLeft, ChevronRight } from "lucide-react";
import heroBedroom   from "@/assets/hero-bedroom.jpg";
import productBed    from "@/assets/product-bed.jpg";
import productSheet  from "@/assets/product-bedsheet.jpg";
import productQuilt  from "@/assets/product-quilt.jpg";
import productPillow from "@/assets/product-pillow.jpg";
import { Link } from "react-router-dom";

const SLIDES = [
  { src: heroBedroom,   label: "Luxury Bedroom",    tag: "New Arrival"   },
  { src: productBed,    label: "Premium Beds",       tag: "Best Seller"   },
  { src: productSheet,  label: "Soft Bedsheets",     tag: "100% Cotton"   },
  { src: productQuilt,  label: "Cozy Quilts",        tag: "Winter Special" },
  { src: productPillow, label: "Comfort Pillows",    tag: "Ergonomic"     },
];

const PARTICLES = [
  { x: 8,  y: 15, size: 6, duration: 5,  delay: 0   },
  { x: 22, y: 72, size: 4, duration: 7,  delay: 0.8 },
  { x: 55, y: 10, size: 8, duration: 6,  delay: 1.2 },
  { x: 78, y: 55, size: 5, duration: 4,  delay: 0.3 },
  { x: 90, y: 20, size: 7, duration: 8,  delay: 1.8 },
  { x: 35, y: 85, size: 4, duration: 5,  delay: 2.1 },
  { x: 65, y: 78, size: 6, duration: 6,  delay: 0.6 },
  { x: 12, y: 50, size: 3, duration: 7,  delay: 1.5 },
  { x: 48, y: 40, size: 5, duration: 5,  delay: 0.9 },
  { x: 82, y: 88, size: 4, duration: 4,  delay: 2.4 },
];

const slideVariants = {
  enter: (dir) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0   }),
  center:        ({ x: 0,              opacity: 1   }),
  exit:  (dir) => ({ x: dir > 0 ? "-100%" : "100%", opacity: 0   }),
};

const Hero = () => {
  const features = [
    { icon: Truck,  text: "Free Delivery",   color: "text-secondary", bg: "bg-secondary/15" },
    { icon: Shield, text: "Premium Quality", color: "text-accent",    bg: "bg-accent/20"    },
    { icon: Leaf,   text: "100% Cotton",     color: "text-secondary", bg: "bg-secondary/15" },
  ];

  const [current, setCurrent]   = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused]     = useState(false);

  const goTo = useCallback((idx, dir) => {
    setDirection(dir);
    setCurrent(idx);
  }, []);

  const next = useCallback(() => {
    goTo((current + 1) % SLIDES.length, 1);
  }, [current, goTo]);

  const prev = useCallback(() => {
    goTo((current - 1 + SLIDES.length) % SLIDES.length, -1);
  }, [current, goTo]);

  // Auto-play every 3.5 s, pause on hover
  useEffect(() => {
    if (paused) return;
    const id = setInterval(next, 3500);
    return () => clearInterval(id);
  }, [next, paused]);

  return (
    <section className="relative min-h-screen pt-20 overflow-hidden">

      {/* ── Animated background colour layers ─────────────────────────── */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-rose-50 via-pink-50 to-fuchsia-50"
        animate={{ opacity: [1, 0, 0, 1] }}
        transition={{ duration: 12, repeat: Infinity, times: [0, 0.33, 0.66, 1], ease: "easeInOut" }}
      />
      <motion.div
        className="absolute inset-0 bg-gradient-to-tr from-amber-50 via-yellow-50 to-orange-50"
        animate={{ opacity: [0, 1, 0, 0] }}
        transition={{ duration: 12, repeat: Infinity, times: [0, 0.33, 0.66, 1], ease: "easeInOut" }}
      />
      <motion.div
        className="absolute inset-0 bg-gradient-to-bl from-sky-50 via-teal-50 to-emerald-50"
        animate={{ opacity: [0, 0, 1, 0] }}
        transition={{ duration: 12, repeat: Infinity, times: [0, 0.33, 0.66, 1], ease: "easeInOut" }}
      />

      {/* ── Floating blobs ─────────────────────────────────────────────── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-10 right-0 w-[500px] h-[500px] rounded-full bg-secondary/20 blur-3xl"
          animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-20 -left-20 w-[550px] h-[550px] rounded-full bg-accent/20 blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/3 left-1/4 w-80 h-80 rounded-full bg-purple-200/25 blur-3xl"
          animate={{ x: [-60, 60, -60], y: [-40, 40, -40] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/3 right-1/4 w-72 h-72 rounded-full bg-pink-200/25 blur-3xl"
          animate={{ x: [40, -40, 40], y: [30, -30, 30], scale: [1, 1.2, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* ── Floating particles ─────────────────────────────────────────── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {PARTICLES.map((p, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-secondary/30"
            style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }}
            animate={{ y: [-18, 18, -18], x: [-10, 10, -10], opacity: [0.2, 0.7, 0.2], scale: [1, 1.4, 1] }}
            transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: "easeInOut" }}
          />
        ))}
      </div>

      {/* ── Main content ───────────────────────────────────────────────── */}
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[calc(100vh-5rem)] py-12">

          {/* Left — text */}
          <div className="order-2 lg:order-1 text-center lg:text-left">

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-white/70 backdrop-blur-md rounded-full mb-8 border border-secondary/30 shadow-md"
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              >
                <Star className="w-4 h-4 text-accent fill-accent" />
              </motion.div>
              <span className="text-sm font-semibold text-foreground/90 tracking-wide">Premium Home Textiles</span>
              <motion.span
                className="w-2 h-2 rounded-full bg-secondary inline-block"
                animate={{ scale: [1, 1.6, 1], opacity: [1, 0.4, 1] }}
                transition={{ duration: 1.4, repeat: Infinity }}
              />
            </motion.div>

            {/* Headline */}
            <motion.h1
              className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-primary leading-tight mb-6"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              Transform Your{" "}
              <motion.span
                className="relative inline-block"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.45 }}
              >
                <span className="relative z-10 text-secondary">Sleep</span>
                {/* <motion.span
                  className="absolute -bottom-1 left-0 right-0 h-3 bg-accent/35 rounded-full -z-10"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.6, delay: 0.9 }}
                /> */}
              </motion.span>
              <br />
              Experience
            </motion.h1>

            <motion.p
              className="text-lg lg:text-xl text-muted-foreground max-w-lg mx-auto lg:mx-0 mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Discover our curated collection of premium bedsheets, quilts,
              mattresses, and pillows crafted for ultimate comfort.
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Link
                to="/products"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent text-accent-foreground rounded-full font-semibold text-lg shadow-lg hover:shadow-xl hover:brightness-110 transition-all duration-300 group"
              >
                Shop Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/70 backdrop-blur-sm text-secondary border-2 border-secondary/40 rounded-full font-semibold text-lg shadow-md hover:bg-secondary hover:text-white hover:border-secondary transition-all duration-300"
              >
                Learn More
              </Link>
            </motion.div>

            {/* Feature pills */}
            <motion.div
              className="flex flex-wrap gap-3 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.55 }}
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="flex items-center gap-2 bg-white/65 backdrop-blur-sm px-4 py-2 rounded-full border border-white/80 shadow-sm cursor-default"
                  whileHover={{ scale: 1.06, y: -3, backgroundColor: "rgba(255,255,255,0.92)" }}
                  transition={{ duration: 0.2 }}
                >
                  <div className={`w-7 h-7 rounded-full ${feature.bg} flex items-center justify-center`}>
                    <feature.icon className={`w-3.5 h-3.5 ${feature.color}`} />
                  </div>
                  <span className="text-sm font-semibold text-foreground/80">{feature.text}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Right — Image Slider */}
          <motion.div
            className="order-1 lg:order-2 relative"
            initial={{ opacity: 0, scale: 0.88, x: 60 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.2, type: "spring", bounce: 0.25 }}
          >
            <div className="relative">

              {/* Animated glow ring */}
              <motion.div
                className="absolute inset-6 rounded-3xl bg-gradient-to-br from-secondary/40 via-accent/25 to-purple-200/30 blur-2xl"
                animate={{ opacity: [0.5, 0.85, 0.5], scale: [1, 1.06, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />

              {/* Slider card */}
              <div
                className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-white/60 aspect-[4/3]"
                onMouseEnter={() => setPaused(true)}
                onMouseLeave={() => setPaused(false)}
              >
                {/* Slides */}
                <AnimatePresence initial={false} custom={direction} mode="popLayout">
                  <motion.div
                    key={current}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
                    className="absolute inset-0"
                  >
                    <img
                      src={SLIDES[current].src}
                      alt={SLIDES[current].label}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/25 via-transparent to-secondary/5" />

                    {/* Slide label */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25, duration: 0.35 }}
                      className="absolute bottom-14 left-4 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold text-primary shadow"
                    >
                      {SLIDES[current].label}
                    </motion.div>
                  </motion.div>
                </AnimatePresence>

                {/* Prev / Next arrows */}
                {/* <button
                  onClick={prev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm shadow-lg flex items-center justify-center hover:bg-white hover:scale-110 transition-all duration-200"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="w-5 h-5 text-primary" />
                </button>
                <button
                  onClick={next}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm shadow-lg flex items-center justify-center hover:bg-white hover:scale-110 transition-all duration-200"
                  aria-label="Next slide"
                >
                  <ChevronRight className="w-5 h-5 text-primary" />
                </button> */}

                {/* Dot indicators */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                  {SLIDES.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => goTo(i, i > current ? 1 : -1)}
                      aria-label={`Go to slide ${i + 1}`}
                      className="transition-all duration-300"
                    >
                      <motion.div
                        animate={{
                          width:   i === current ? 24 : 8,
                          opacity: i === current ? 1  : 0.45,
                        }}
                        transition={{ duration: 0.35 }}
                        className={`h-2 rounded-full ${i === current ? "bg-secondary" : "bg-white"}`}
                        style={{ width: i === current ? 24 : 8 }}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Rating badge */}
              {/* <motion.div
                className="absolute -bottom-5 -left-4 lg:-left-8 bg-white/90 backdrop-blur-sm p-4 rounded-2xl shadow-xl border border-accent/20"
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.85, type: "spring", bounce: 0.4 }}
                whileHover={{ scale: 1.07, y: -4 }}
              >
                <div className="flex items-center gap-3">
                  <motion.div
                    className="w-12 h-12 rounded-full bg-accent/25 flex items-center justify-center"
                    animate={{ rotate: [0, 6, -6, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <Star className="w-6 h-6 text-accent fill-accent" />
                  </motion.div>
                  <div>
                    <p className="text-sm font-bold text-foreground">4.9 Rating</p>
                    <p className="text-xs text-muted-foreground">2000+ Reviews</p>
                  </div>
                </div>
              </motion.div> */}

              {/* Discount badge */}
              {/* <motion.div
                className="absolute -top-4 -right-4 lg:-right-8 bg-gradient-to-br from-secondary to-secondary/80 text-secondary-foreground px-6 py-3 rounded-full shadow-lg font-bold text-lg"
                initial={{ opacity: 0, rotate: -20, scale: 0.5 }}
                animate={{ opacity: 1, rotate: 12, scale: 1 }}
                transition={{ duration: 0.7, delay: 1, type: "spring", bounce: 0.55 }}
                whileHover={{ scale: 1.15, rotate: 0 }}
              >
                <motion.span
                  animate={{ scale: [1, 1.06, 1] }}
                  transition={{ duration: 1.6, repeat: Infinity }}
                  className="inline-block"
                >
                  10% OFF
                </motion.span>
              </motion.div> */}

              {/* Cotton badge — updates per slide */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={SLIDES[current].tag}
                  className="absolute top-1/2 -right-3 lg:-right-6 bg-gradient-to-r from-accent to-accent/85 text-accent-foreground px-4 py-2 rounded-full shadow-lg text-xs font-bold"
                  initial={{ opacity: 0, x: 16, scale: 0.85 }}
                  animate={{ opacity: 1, x: 0,  scale: 1     }}
                  exit={{    opacity: 0, x: 16, scale: 0.85  }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ scale: 1.1 }}
                >
                  {SLIDES[current].tag}
                </motion.div>
              </AnimatePresence>

              {/* Sparkle stars */}
              {[
                { top: "8%",  left: "8%",  delay: 0.5, cls: "w-5 h-5" },
                { top: "72%", left: "88%", delay: 1.1, cls: "w-4 h-4" },
                { top: "88%", left: "18%", delay: 1.7, cls: "w-3 h-3" },
              ].map((s, i) => (
                <motion.div
                  key={i}
                  className={`absolute ${s.cls} pointer-events-none`}
                  style={{ top: s.top, left: s.left }}
                  animate={{ scale: [0, 1.3, 0], rotate: [0, 180, 360], opacity: [0, 1, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: s.delay, repeatDelay: 1.2 }}
                >
                  <Star className="w-full h-full fill-accent text-accent" />
                </motion.div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>

      {/* ── Scrolling marquee ──────────────────────────────────────────── */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-primary via-primary/95 to-primary py-3 overflow-hidden">
        <motion.div
          className="flex gap-8 whitespace-nowrap"
          animate={{ x: [0, -1200] }}
          transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
        >
          {[...Array(12)].map((_, i) => (
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
