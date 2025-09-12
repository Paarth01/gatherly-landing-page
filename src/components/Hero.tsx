import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-bg.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center hero-bg overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        {/* Logo placeholder */}
        <div className="mb-8">
          <h1 className="text-6xl md:text-8xl font-bold gradient-text mb-4">
            Gatherly
          </h1>
        </div>
        
        {/* Tagline */}
        <h2 className="text-2xl md:text-4xl font-semibold text-foreground mb-6">
          Discover. Connect. Gather.
        </h2>
        
        {/* Subtext */}
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed">
          Gatherly helps you find events, hobbies, and communities near you. 
          Connect with like-minded people and discover your next adventure.
        </p>
        
        {/* CTA Button */}
        <Button 
          size="lg" 
          className="btn-hero group"
          onClick={() => document.getElementById('signup')?.scrollIntoView({ behavior: 'smooth' })}
        >
          Join Waitlist
          <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-primary/20 rounded-full blur-xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-accent/20 rounded-full blur-2xl animate-pulse delay-1000" />
    </section>
  );
};

export default Hero;