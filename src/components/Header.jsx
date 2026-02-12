import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingBag, Search } from "lucide-react";
import logoSapta from "@/assets/logo1.webp";
import { Link } from "react-router-dom";
const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navLinks = [
        { name: "Home", href: "/" },
        { name: "About", href: "/about" },
        { name: "Products", href: "/products" },
        { name: "Contact", href: "/contact" },
    ];
    return (<header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <motion.a href="#" className="flex items-center gap-3" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <div className="h-15 lg:h-15  p-3">
              <img src={logoSapta} alt="Sapta Home Textiles logo" className="w-full h-full object-contain"/>
            </div>
            {/* <div className="flex flex-col">
              <span className="font-display font-bold text-lg lg:text-xl text-primary tracking-wide">SAPTA</span>
              <span className="text-[10px] text-muted-foreground tracking-widest uppercase">Home Textiles</span>
            </div> */}
          </motion.a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link, index) => (<motion.div key={link.name} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }}>
                <Link to={link.href} className="relative text-foreground/80 hover:text-secondary font-medium transition-colors duration-300 group">
                  {link.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-secondary transition-all duration-300 group-hover:w-full"/>
                </Link>
              </motion.div>))}
          </nav>

          {/* Desktop Actions */}
          <motion.div className="hidden lg:flex items-center gap-4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            {/* <button className="p-2 text-foreground/70 hover:text-primary transition-colors duration-300">
              <Search className="w-5 h-5"/>
            </button>
            <button className="p-2 text-foreground/70 hover:text-primary transition-colors duration-300 relative">
              <ShoppingBag className="w-5 h-5"/>
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full text-[10px] font-bold flex items-center justify-center text-accent-foreground">
                0
              </span>
            </button> */}
            <Link to="/contact" className="ml-2 px-5 py-2.5 bg-gradient-to-r from-secondary to-secondary/90 text-secondary-foreground rounded-full font-medium text-sm hover:from-secondary/90 hover:to-secondary transition-all duration-300 shadow-soft hover:shadow-hover">
              Get Quote
            </Link>
          </motion.div>

          {/* Mobile Menu Button */}
          <button className="lg:hidden p-2 text-foreground" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="w-6 h-6"/> : <Menu className="w-6 h-6"/>}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (<motion.div className="lg:hidden absolute top-full left-0 right-0 bg-background border-b border-border" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }}>
            <nav className="container mx-auto px-4 py-6 flex flex-col gap-4">
              {navLinks.map((link) => (<Link key={link.name} to={link.href} className="text-foreground/80 hover:text-secondary font-medium py-2 transition-colors duration-300" onClick={() => setIsMenuOpen(false)}>
                  {link.name}
                </Link>))}
              <Link to="/contact" className="mt-4 px-5 py-3 bg-gradient-to-r from-secondary to-secondary/90 text-secondary-foreground rounded-full font-medium text-center hover:from-secondary/90 hover:to-secondary transition-all duration-300" onClick={() => setIsMenuOpen(false)}>
                Get Quote
              </Link>
            </nav>
          </motion.div>)}
      </AnimatePresence>
    </header>);
};
export default Header;
