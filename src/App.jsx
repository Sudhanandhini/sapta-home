import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Contact from "./pages/Contact";
import About from "./pages/About";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminProducts from "./pages/admin/AdminProducts";
import NotFound from "./pages/NotFound";
import Loader from "@/components/Loader";
const queryClient = new QueryClient();
const App = () => {
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(0);
    useEffect(() => {
        const duration = 1200;
        const intervalMs = 30;
        const steps = Math.ceil(duration / intervalMs);
        let currentStep = 0;
        const interval = setInterval(() => {
            currentStep += 1;
            const nextProgress = Math.min(100, Math.round((currentStep / steps) * 100));
            setProgress(nextProgress);
            if (nextProgress >= 100) {
                clearInterval(interval);
                setTimeout(() => setLoading(false), 200);
            }
        }, intervalMs);
        return () => clearInterval(interval);
    }, []);
    if (loading) {
        return <Loader progress={progress} />;
    }
    return (<QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />}/>
          <Route path="/about" element={<About />}/>
          <Route path="/products" element={<Products />}/>
          <Route path="/products/:id" element={<ProductDetail />}/>
          <Route path="/contact" element={<Contact />}/>
          <Route path="/admin" element={<AdminLogin />}/>
          <Route path="/admin/products" element={<AdminProducts />}/>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />}/>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>);
};
export default App;
