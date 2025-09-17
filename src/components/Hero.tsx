import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import heroImage from "@/assets/hero-bg.jpg";

const Hero = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  const handleCTA = () => {
    if (user && profile) {
      navigate(profile.role === 'organizer' ? '/organizer-dashboard' : '/dashboard');
    } else {
      document.getElementById('signup')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center hero-bg overflow-hidden">
      {/* Background Image with Parallax Effect */}
      <div 
        className="absolute inset-0 opacity-10 animate-fade-in"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-20 h-20 bg-primary/20 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-accent/20 rounded-full blur-2xl animate-pulse delay-1000" />
        <div className="absolute top-1/3 right-20 w-16 h-16 bg-secondary/20 rounded-full blur-lg animate-pulse delay-500" />
        <div className="absolute bottom-1/3 left-20 w-24 h-24 bg-primary/15 rounded-full blur-xl animate-pulse delay-700" />
        
        {/* Floating Interactive Dots */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-primary/40 rounded-full animate-pulse"
            style={{
              top: `${20 + (i * 12)}%`,
              left: `${10 + (i * 15)}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: '3s'
            }}
          />
        ))}
      </div>
      
      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center animate-fade-in">
        {/* Logo with Animation */}
        <div className="mb-8 group">
          <h1 className="text-6xl md:text-8xl font-bold gradient-text mb-4 group-hover:scale-105 transition-transform duration-300 cursor-default">
            Gatherly
          </h1>
          <div className="w-24 h-1 bg-gradient-hero mx-auto rounded-full group-hover:w-32 transition-all duration-300" />
        </div>
        
        {/* Tagline */}
        <h2 className="text-2xl md:text-4xl font-semibold text-foreground mb-6 animate-fade-in delay-200">
          Discover. Connect. Gather.
        </h2>
        
        {/* Subtext */}
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed animate-fade-in delay-300">
          Gatherly helps you find events, hobbies, and communities near you. 
          Connect with like-minded people and discover your next adventure.
        </p>
        
        {/* CTA Button with Enhanced Animation */}
        <div className="animate-fade-in delay-500">
          <Button 
            size="lg" 
            className="btn-hero group hover:shadow-glow hover:scale-105 transition-all duration-300"
            onClick={handleCTA}
          >
            {user && profile 
              ? `Go to ${profile.role === 'organizer' ? 'Organizer' : 'Your'} Dashboard`
              : 'Join Waitlist'
            }
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

        {/* Interactive Preview Cards */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in delay-700">
          {[
            { title: "Live Events", count: "250+", icon: "📅" },
            { title: "Active Members", count: "10K+", icon: "👥" },
            { title: "Cities", count: "50+", icon: "🏙️" }
          ].map((item, index) => (
            <div 
              key={index}
              className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:scale-105 transition-all duration-300 cursor-pointer"
            >
              <div className="text-2xl mb-2">{item.icon}</div>
              <div className="text-2xl font-bold text-white group-hover:gradient-text transition-all duration-300">
                {item.count}
              </div>
              <div className="text-sm text-white/70 group-hover:text-white transition-colors duration-300">
                {item.title}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;