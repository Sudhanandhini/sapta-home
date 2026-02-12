import { motion } from "framer-motion";
import { Sparkles, Tag, ShieldCheck, Shapes, HeartHandshake } from "lucide-react";

const Categories = () => {
  const highlights = [
    {
      title: "Best-in-Class Quality",
      description: "Every product is made with carefully chosen materials and strict quality checks.",
      icon: ShieldCheck,
    },
    {
      title: "Fair Pricing",
      description: "Premium designs and comfort, offered at honest, affordable prices.",
      icon: Tag,
    },
    {
      title: "Timeless Style",
      description: "Designs that look good today, tomorrow, and for years to come.",
      icon: Sparkles,
    },
    {
      title: "Everyday Practicality",
      description: "Products crafted for real-life use, combining beauty with function.",
      icon: Shapes,
    },
    {
      title: "Customer-Centric Approach",
      description: "We listen, we care, and we create with your comfort in mind.",
      icon: HeartHandshake,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section id="about" className="py-20 lg:py-20 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-4 py-1.5 bg-accent/20 text-foreground rounded-full text-sm font-medium mb-4">
            About Us
          </span>
          <h2 className="font-display text-3xl lg:text-5xl font-bold text-primary mb-6">
            What Makes Us Different
          </h2>
          <p className="text-lg text-muted-foreground">
            Thoughtfully made home essentials that balance quality, comfort, and value.
          </p>
        </motion.div>

        <motion.div
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {highlights.map((item, index) => (
            <motion.div key={index} variants={itemVariants} className="group relative">
              <div className="relative bg-card rounded-2xl overflow-hidden shadow-soft hover:shadow-hover transition-all duration-500 p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                    {item.title}
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground">{item.description}</p>
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-accent rounded-2xl transition-all duration-300 pointer-events-none" />
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="grid lg:grid-cols-2 gap-8 mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="bg-card rounded-2xl shadow-soft p-8">
            <h3 className="font-display text-2xl font-bold text-primary mb-4">Our Mission</h3>
            <p className="text-muted-foreground leading-relaxed">
              To combine top-quality craftsmanship with unbeatable value for every household. To reach every household
              in India and contribute at most ease as possible, through our products. To bring home joy, comfort and
              elegance and quality, helping every household feel cozy, cared for, and truly at home. To bring everyday
              functionality into every home through thoughtfully designed, high-quality furnishings.
            </p>
          </div>
          <div className="bg-card rounded-2xl shadow-soft p-8">
            <h3 className="font-display text-2xl font-bold text-primary mb-4">Our Vision</h3>
            <p className="text-muted-foreground leading-relaxed">
              To be India’s most trusted home furnishings brand, known for blending quality, unique style, and
              affordability in every home.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Categories;
