import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Mail, CheckCircle, Sparkles } from "lucide-react";

const EmailSignup = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    const { error } = await supabase
      .from('waitlist')
      .insert([{ email }]);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setIsSubmitted(true);
      toast({
        title: "Welcome to the waitlist! 🎉",
        description: "We'll notify you when Gatherly launches in your area.",
      });
      setEmail("");
    }
    setIsLoading(false);
  };

  if (isSubmitted) {
    return (
      <section id="signup" className="py-24 px-6 bg-gradient-subtle relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-hero/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-gradient-accent/10 rounded-full blur-3xl animate-pulse delay-1000" />
          
          {/* Floating Icons */}
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute opacity-20 animate-pulse"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: '4s'
              }}
            >
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
          ))}
        </div>

        <div className="max-w-2xl mx-auto text-center relative z-10">
          {/* Success State with Enhanced Animation */}
          <div className="animate-scale-in">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-hero rounded-full mb-8 animate-pulse shadow-glow">
              <CheckCircle className="h-10 w-10 text-primary-foreground" />
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              You're on the list! 🎉
            </h2>
            
            <p className="text-lg text-muted-foreground mb-8">
              Thanks for joining! We'll keep you updated on our launch.
            </p>

            {/* Interactive Confirmation Card */}
            <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 max-w-md mx-auto">
              <div className="flex items-center justify-center space-x-2 text-success">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">Successfully added to waitlist</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="signup" className="py-24 px-6 bg-gradient-subtle relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-hero/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-gradient-accent/10 rounded-full blur-3xl animate-pulse delay-1000" />
        
        {/* Floating Icons */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute opacity-20 animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: '4s'
            }}
          >
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
        ))}
      </div>

      <div className="max-w-2xl mx-auto text-center relative z-10">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-accent rounded-2xl mb-8 hover:scale-110 transition-transform duration-300 shadow-elegant">
          <Mail className="h-8 w-8 text-accent-foreground" />
        </div>
        
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          Be the first to know
        </h2>
        
        <p className="text-lg text-muted-foreground mb-12">
          Join our waitlist and get early access when we launch in your city.
        </p>
        
        {/* Enhanced Form with Interactive Elements */}
        <div className="relative">
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <div className="relative flex-1">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="px-4 py-3 text-base rounded-xl border-2 focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all duration-300 bg-background/50 backdrop-blur-sm"
              />
              <div className="absolute inset-0 rounded-xl bg-gradient-hero/5 pointer-events-none opacity-0 hover:opacity-100 transition-opacity duration-300" />
            </div>
            <Button 
              type="submit" 
              className="btn-accent whitespace-nowrap hover:shadow-glow hover:scale-105 transition-all duration-300"
              disabled={isLoading}
            >
              {isLoading ? 'Joining...' : 'Join Waitlist'}
              {!isLoading && <Sparkles className="ml-2 h-4 w-4" />}
            </Button>
          </form>
          
          {/* Interactive Benefits */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: "🎯", text: "Early Access" },
              { icon: "🎁", text: "Exclusive Features" },
              { icon: "🔔", text: "Launch Updates" }
            ].map((benefit, index) => (
              <div key={index} className="group bg-card/30 backdrop-blur-sm border border-border/30 rounded-xl p-4 hover:bg-card/50 hover:scale-105 transition-all duration-300 cursor-pointer">
                <div className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-300">
                  {benefit.icon}
                </div>
                <div className="text-sm font-medium text-foreground group-hover:gradient-text transition-all duration-300">
                  {benefit.text}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground mt-8 opacity-80">
          No spam, ever. We respect your privacy. ✨
        </p>
      </div>
    </section>
  );
};

export default EmailSignup;