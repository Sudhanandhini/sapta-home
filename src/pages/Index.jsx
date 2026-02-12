import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Categories from "@/components/Categories";
import Products from "@/components/Products";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
const Index = () => {
    return (<div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
         <Products />
        <Categories />
       
        <Testimonials />
      </main>
      <Footer />
    </div>);
};
export default Index;
