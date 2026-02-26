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
import WhatsAppButton from "./components/WhatsAppButton";


const queryClient = new QueryClient();

// const WhatsAppButton = () => {
//     const whatsappNumber = "919876543210"; // Replace with your WhatsApp number
//     const whatsappMessage = "Hi! I'm interested in your products.";
    
//     const handleWhatsAppClick = () => {
//         const encodedMessage = encodeURIComponent(whatsappMessage);
//         const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
//         window.open(whatsappUrl, "_blank");
//     };

//     return (
//         <button
//             onClick={handleWhatsAppClick}
//             className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 animate-bounce"
//             title="Chat with us on WhatsApp"
//         >
//             <svg
//                 className="w-7 h-7"
//                 fill="currentColor"
//                 viewBox="0 0 24 24"
//                 xmlns="http://www.w3.org/2000/svg"
//             >
//                 <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-4.255.949c-1.238.503-2.36 1.235-3.355 2.115-1.23 1.156-2.147 2.559-2.71 4.123-.564 1.565-.547 3.231.053 4.802.599 1.571 1.734 2.948 3.224 3.957 1.49 1.01 3.184 1.563 4.96 1.563 1.775 0 3.469-.553 4.96-1.563 1.49-1.009 2.625-2.386 3.224-3.957.6-1.571.617-3.237.053-4.802-.563-1.564-1.48-2.967-2.71-4.123-.995-.88-2.117-1.612-3.355-2.115-1.337-.545-2.73-.819-4.065-.819z" />
//             </svg>
//         </button>
//     );
// };

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

    return (
        <QueryClientProvider client={queryClient}>
            <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter basename="/sapta_home">
                    <Routes>
                        <Route path="/" element={<Index />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/products" element={<Products />} />
                        <Route path="/products/:id" element={<ProductDetail />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/admin" element={<AdminLogin />} />
                        <Route path="/admin/products" element={<AdminProducts />} />
                        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                    {/* WhatsApp Floating Button */}
                <WhatsAppButton />

                </BrowserRouter>
            </TooltipProvider>
        </QueryClientProvider>
    );
};

export default App;