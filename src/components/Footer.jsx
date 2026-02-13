import { motion } from "framer-motion";
import { Phone, Mail, Clock, Facebook, Instagram, Twitter, Youtube, Linkedin, ArrowRight } from "lucide-react";
import logoSapta from "@/assets/logo-sapta.png";
const Footer = () => {
    const quickLinks = [
        { name: "Home", href: "#" },
        { name: "About", href: "about" },
        { name: "Products", href: "products" },
        { name: "Contact", href: "contact" },
    ];
    const categories = [
        { name: "Bedsheets", href: "#" },
        { name: "Quilts", href: "#" },
        { name: "Mattresses", href: "#" },
        { name: "Pillows", href: "#" },
        { name: "Bed Frames", href: "#" },
    ];
    const socialLinks = [
        { icon: Facebook, href: "#", label: "Facebook" },
        { icon: Instagram, href: "#", label: "Instagram" },
        { icon: Twitter, href: "#", label: "Twitter" },
        { icon: Youtube, href: "#", label: "Youtube" },
        { icon: Linkedin, href: "#", label: "LinkedIn" },
    ];
    return (<footer id="contact" className="bg-[#213073] text-primary-foreground">
      {/* Newsletter */}
      {/* <div className="border-b border-primary-foreground/10">
        <div className="container mx-auto px-4 lg:px-8 py-12">
          <motion.div className="flex flex-col lg:flex-row items-center justify-between gap-6" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="text-center lg:text-left">
              <h3 className="font-display text-2xl font-bold mb-2">Subscribe to Our Newsletter</h3>
              <p className="text-primary-foreground/70">Get updates on new arrivals and exclusive offers</p>
            </div>
            <div className="flex w-full max-w-md gap-3">
              <input type="email" placeholder="Enter your email" className="flex-1 px-5 py-3 rounded-full bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:border-accent transition-colors"/>
              <button className="px-6 py-3 bg-accent text-accent-foreground rounded-full font-semibold hover:brightness-110 transition-all flex items-center gap-2 group">
                Subscribe
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform"/>
              </button>
            </div>
          </motion.div>
        </div>
      </div> */}

      {/* Main Footer */}
      <div className="container mx-auto px-4 lg:px-8 py-12 lg:py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Brand */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg shadow-soft bg-white/70 p-1">
                <img src={logoSapta} alt="Sapta Home Textiles logo" className="w-full h-full object-contain"/>
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-lg tracking-wide">SAPTA</span>
                <span className="text-[10px] text-primary-foreground/60 tracking-widest uppercase">Home Textiles</span>
              </div>
            </div>
            <p className="text-primary-foreground/70 mb-6 text-sm leading-relaxed">
              Karumpudur,kandili M. Karur, Tamil Nadu, India - 639 002
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social, index) => (<motion.a key={index} href={social.href} aria-label={social.label} className="w-9 h-9 rounded-full bg-primary-foreground/10 flex items-center justify-center text-primary-foreground/70 hover:bg-secondary hover:text-secondary-foreground transition-all" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                  <social.icon className="w-4 h-4"/>
                </motion.a>))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
            <h4 className="font-semibold text-lg mb-6 text-secondary">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (<li key={index}>
                  <a href={link.href} className="text-primary-foreground/70 hover:text-secondary transition-colors">
                    {link.name}
                  </a>
                </li>))}
            </ul>
          </motion.div>

          {/* Categories */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
            <h4 className="font-semibold text-lg mb-6 text-accent">Categories</h4>
            <ul className="space-y-3">
              {categories.map((category, index) => (<li key={index}>
                  <a href={category.href} className="text-primary-foreground/70 hover:text-secondary transition-colors">
                    {category.name}
                  </a>
                </li>))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
            <h4 className="font-semibold text-lg mb-6 text-secondary">Need Help?</h4>
            <ul className="space-y-4">
              <li>
                <a href="tel:+918150011550" className="flex items-center gap-3 text-accent font-semibold hover:brightness-110 transition-all">
                  <Phone className="w-5 h-5"/>
                  +91 81500 11550
                </a>
              </li>
              <li>
                <a href="mailto:contact@sapta.com" className="flex items-center gap-3 text-primary-foreground/70 hover:text-secondary transition-colors">
                  <Mail className="w-5 h-5"/>
                  contact@sapta.com
                </a>
              </li>
              <li className="flex items-start gap-3 text-primary-foreground/70">
                <Clock className="w-5 h-5 flex-shrink-0 mt-0.5"/>
                <div className="text-sm">
                  <p>Monday - Saturday: 09:00 am - 6:00 pm</p>
                  <p>Sunday: 10:30 am - 4:00 pm</p>
                </div>
              </li>
            </ul>
          </motion.div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-foreground/10">
        <div className="container mx-auto px-4 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-primary-foreground/60">
            <p>© 2025 SAPTA - All Rights Reserved</p>
            <p>Developed with ❤️ Sunsys Technologies </p>
          </div>
        </div>
      </div>
    </footer>);
};
export default Footer;
