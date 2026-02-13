import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Mail, Phone, MapPin, Clock, Send, ArrowRight, Sparkles, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

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

const contactInfo = [
  {
    icon: MapPin,
    title: "Visit Us",
    lines: ["Karumpudur, Kandili M.", "Karur, Tamil Nadu, India - 639 002"],
    href: null,
    color: "secondary",
  },
  {
    icon: Phone,
    title: "Call Us",
    lines: ["+91 81500 11550"],
    href: "tel:+918150011550",
    color: "accent",
  },
  {
    icon: Mail,
    title: "Email Us",
    lines: ["contact@sapta.com"],
    href: "mailto:contact@sapta.com",
    color: "secondary",
  },
  {
    icon: Clock,
    title: "Working Hours",
    lines: ["Mon - Sat: 09:00 am - 6:00 pm", "Sunday: 10:30 am - 4:00 pm"],
    href: null,
    color: "accent",
  },
];

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", place: "", message: "" });
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, subject: form.place }),
      });
      if (res.ok) {
        setStatus("sent");
        setForm({ name: "", email: "", phone: "", place: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="pt-20">
        {/* Hero Banner */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1600&auto=format&fit=crop')] bg-cover bg-center" />
          <div className="absolute inset-0 bg-primary/75" />
          {/* Floating decorative elements */}
          <motion.div
            className="absolute top-20 right-20 w-32 h-32 rounded-full bg-secondary/10 blur-2xl"
            animate={{ y: [-10, 10, -10], scale: [1, 1.1, 1] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-10 left-10 w-24 h-24 rounded-full bg-accent/10 blur-2xl"
            animate={{ y: [10, -10, 10], scale: [1.1, 1, 1.1] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute top-1/2 left-1/3 w-20 h-20 rounded-full bg-accent/8 blur-2xl"
            animate={{ x: [-15, 15, -15], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="container mx-auto px-4 lg:px-8 relative z-10 py-20 lg:py-28">
            <motion.div
              initial="hidden"
              animate="visible"
              className="max-w-2xl"
            >
              <motion.span
                variants={fadeUp}
                custom={0}
                className="inline-flex items-center gap-2 rounded-full bg-secondary/20 backdrop-blur-sm px-4 py-1.5 text-sm font-semibold text-primary-foreground border border-secondary/30"
              >
                <Sparkles className="w-4 h-4 text-accent" />
                Get In Touch
              </motion.span>
              <motion.h1
                variants={fadeUp}
                custom={1}
                className="mt-6 font-display text-4xl font-bold text-primary-foreground sm:text-5xl lg:text-6xl leading-tight"
              >
                Let's Get You <br />
                <span className="text-secondary">Cozy</span> & <span className="text-accent">Connected</span>
              </motion.h1>
              <motion.p
                variants={fadeUp}
                custom={2}
                className="mt-5 text-lg text-primary-foreground/80 max-w-lg"
              >
                We'd love to hear from you. Reach out with questions, bulk orders, or product inquiries.
              </motion.p>
              <motion.p
                variants={fadeUp}
                custom={2}
                className="mt-2 text-sm text-primary-foreground/60"
              >
                Home &bull; Contact
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* Contact Cards */}
        <section className="container mx-auto px-4 lg:px-8 -mt-10 relative z-20">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {contactInfo.map((item, index) => {
              const isPink = item.color === "secondary";
              return (
                <motion.div
                  key={item.title}
                  variants={scaleIn}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={index}
                  whileHover={{ y: -6, transition: { duration: 0.25 } }}
                  className="rounded-2xl border border-border bg-card p-6 shadow-card group cursor-default"
                >
                  <motion.span
                    className={`flex h-12 w-12 items-center justify-center rounded-xl transition-colors duration-300 ${
                      isPink
                        ? "bg-secondary/10 text-secondary group-hover:bg-secondary group-hover:text-secondary-foreground"
                        : "bg-accent/15 text-accent group-hover:bg-accent group-hover:text-accent-foreground"
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                  </motion.span>
                  <h3 className={`mt-4 text-base font-semibold ${isPink ? "text-secondary" : "text-accent"}`}>
                    {item.title}
                  </h3>
                  {item.lines.map((line, i) =>
                    item.href && i === 0 ? (
                      <a
                        key={i}
                        href={item.href}
                        className="mt-1 block text-sm text-foreground/70 hover:text-primary transition-colors"
                      >
                        {line}
                      </a>
                    ) : (
                      <p key={i} className={`${i === 0 ? "mt-2" : "mt-0.5"} text-sm text-foreground/70`}>
                        {line}
                      </p>
                    )
                  )}
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Form + Map */}
        <section className="container mx-auto px-4 lg:px-8 py-16 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] items-start">
            {/* Contact Form */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="rounded-3xl border border-border bg-card p-8 lg:p-10 shadow-card"
            >
              <motion.div variants={fadeUp} custom={0}>
                <h2 className="text-2xl font-semibold text-primary">Send a Message</h2>
                <p className="mt-2 text-foreground/70">
                  Share your requirements and we'll get back to you quickly.
                </p>
              </motion.div>
              {status === "sent" ? (
                <motion.div
                  className="mt-8 text-center py-10"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className="mx-auto h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  </div>
                  <h4 className="text-lg font-semibold text-foreground">Message Sent!</h4>
                  <p className="mt-2 text-sm text-foreground/60">Thank you for reaching out. We'll get back to you shortly.</p>
                  <button
                    type="button"
                    onClick={() => setStatus("idle")}
                    className="mt-6 rounded-full bg-secondary px-6 py-2.5 text-sm font-medium text-secondary-foreground hover:bg-secondary/90 transition-colors"
                  >
                    Send Another Message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                  <motion.div variants={fadeUp} custom={1} className="grid gap-5 sm:grid-cols-2">
                    <div className="group">
                      <label className="block text-xs font-medium text-foreground/60 mb-1.5 group-focus-within:text-secondary transition-colors">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                        placeholder="John Doe"
                        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all"
                      />
                    </div>
                    <div className="group">
                      <label className="block text-xs font-medium text-foreground/60 mb-1.5 group-focus-within:text-accent transition-colors">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                        placeholder="john@example.com"
                        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
                      />
                    </div>
                  </motion.div>
                  <motion.div variants={fadeUp} custom={2} className="grid gap-5 sm:grid-cols-2">
                    <div className="group">
                      <label className="block text-xs font-medium text-foreground/60 mb-1.5 group-focus-within:text-accent transition-colors">
                        Phone Number
                      </label>
                      <input
                        type="text"
                        value={form.phone}
                        onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                        placeholder="+91 00000 00000"
                        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
                      />
                    </div>
                    <div className="group">
                      <label className="block text-xs font-medium text-foreground/60 mb-1.5 group-focus-within:text-secondary transition-colors">
                        Place
                      </label>
                      <input
                        type="text"
                        value={form.place}
                        onChange={(e) => setForm((f) => ({ ...f, place: e.target.value }))}
                        placeholder="Your city / location"
                        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all"
                      />
                    </div>
                  </motion.div>
                  <motion.div variants={fadeUp} custom={3} className="group">
                    <label className="block text-xs font-medium text-foreground/60 mb-1.5 group-focus-within:text-secondary transition-colors">
                      Your Message *
                    </label>
                    <textarea
                      rows={5}
                      required
                      value={form.message}
                      onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                      placeholder="Tell us about your needs..."
                      className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all"
                    />
                  </motion.div>
                  {status === "error" && (
                    <p className="text-sm text-red-500">Failed to send. Please try again.</p>
                  )}
                  <motion.div variants={fadeUp} custom={4}>
                    <motion.button
                      type="submit"
                      disabled={status === "sending"}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full rounded-full bg-gradient-to-r from-secondary to-secondary/90 px-6 py-3.5 text-sm font-semibold text-secondary-foreground shadow-soft hover:shadow-hover hover:from-secondary/90 hover:to-secondary transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-60"
                    >
                      {status === "sending" ? (
                        <>
                          <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                          Submit Enquiry
                        </>
                      )}
                    </motion.button>
                  </motion.div>
                </form>
              )}
            </motion.div>

            {/* Right Column — Map + Quick CTA */}
            <div className="flex flex-col gap-6">
              {/* Map */}
              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={1}
                className="rounded-3xl overflow-hidden border border-border shadow-card h-[320px] lg:h-[380px]"
              >
                <iframe
                  title="Sapta Home Textiles Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.0!2d78.08!3d10.96!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTDCsDU3JzM2LjAiTiA3OMKwMDQnNDguMCJF!5e0!3m2!1sen!2sin!4v1700000000000"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="grayscale hover:grayscale-0 transition-all duration-500"
                />
              </motion.div>

              {/* Quick Contact CTA */}
              <motion.div
                variants={scaleIn}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={2}
                className="rounded-3xl bg-primary p-8 text-primary-foreground relative overflow-hidden"
              >
                {/* Decorative circles - pink & yellow */}
                <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-secondary/15" />
                <div className="absolute -bottom-8 -left-8 w-28 h-28 rounded-full bg-accent/12" />
                <div className="relative z-10">
                  <h3 className="font-display text-xl font-bold">Need Quick Help?</h3>
                  <p className="mt-2 text-sm text-primary-foreground/70">
                    Call us directly for immediate assistance with orders or inquiries.
                  </p>
                  <motion.a
                    href="tel:+918150011550"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="mt-5 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground shadow-soft hover:brightness-110 transition-all group"
                  >
                    <Phone className="w-4 h-4" />
                    +91 81500 11550
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </motion.a>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
