import Hero from "@/components/Hero";
import About from "@/components/About";
import EmailSignup from "@/components/EmailSignup";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <About />
      <EmailSignup />
      <Footer />
    </div>
  );
};

export default Index;
