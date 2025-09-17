import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import homepageBackground from "@/assets/homepage-bg.jpg";

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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Enhanced Background Image with Multiple Layers */}
      <div className="absolute inset-0">
        {/* Main Background Image */}
        <div 
          className="absolute inset-0 animate-fade-in"
          style={{
            backgroundImage: `url(${homepageBackground})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
          }}
        />
        
        {/* Gradient Overlays for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-accent/20" />
        
        {/* Animated Overlay Pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 hero-bg opacity-50" />
        </div>
      </div>
      
      {/* Floating Interactive Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse backdrop-blur-sm" />
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-pulse delay-1000 backdrop-blur-sm" />
        <div className="absolute top-1/3 right-20 w-16 h-16 bg-white/10 rounded-full blur-lg animate-pulse delay-500 backdrop-blur-sm" />
        <div className="absolute bottom-1/3 left-20 w-24 h-24 bg-white/10 rounded-full blur-xl animate-pulse delay-700 backdrop-blur-sm" />
        
        {/* Floating Interactive Dots */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/60 rounded-full animate-pulse backdrop-blur-sm"
            style={{
              top: `${15 + (i * 6)}%`,
              left: `${5 + (i * 8)}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: '4s'
            }}
          />
        ))}
      </div>
      
      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center animate-fade-in">
        {/* Logo with Enhanced Styling */}
        <div className="mb-8 group">
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-4 group-hover:scale-105 transition-transform duration-300 cursor-default drop-shadow-2xl">
            <span className="gradient-text bg-clip-text text-transparent bg-gradient-to-r from-white via-primary-foreground to-accent-foreground">
              Gatherly
            </span>
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-white to-transparent mx-auto rounded-full group-hover:w-32 transition-all duration-300 opacity-80" />
        </div>
        
        {/* Tagline */}
        <h2 className="text-2xl md:text-4xl font-semibold text-white mb-6 animate-fade-in delay-200 drop-shadow-lg">
          Discover. Connect. Gather.
        </h2>
        
        {/* Subtext */}
        <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-12 leading-relaxed animate-fade-in delay-300 drop-shadow-md">
          Gatherly helps you find events, hobbies, and communities near you. 
          Connect with like-minded people and discover your next adventure.
        </p>
        
        {/* CTA Button with Enhanced Animation */}
        <div className="animate-fade-in delay-500">
          <Button 
            size="lg" 
            className="btn-hero group hover:shadow-glow hover:scale-105 transition-all duration-300 shadow-xl"
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
              className="group bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:bg-white/20 hover:scale-105 transition-all duration-300 cursor-pointer shadow-xl"
            >
              <div className="text-2xl mb-2">{item.icon}</div>
              <div className="text-2xl font-bold text-white group-hover:text-primary-foreground transition-all duration-300">
                {item.count}
              </div>
              <div className="text-sm text-white/80 group-hover:text-white transition-colors duration-300">
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