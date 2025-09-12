import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Mail, CheckCircle } from "lucide-react";

const EmailSignup = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    // Simulate API call - in real app, connect to Mailchimp/backend
    setTimeout(() => {
      setIsSubmitted(true);
      toast({
        title: "Welcome to the waitlist! 🎉",
        description: "We'll notify you when Gatherly launches in your area.",
      });
      setEmail("");
    }, 500);
  };

  if (isSubmitted) {
    return (
      <section id="signup" className="py-24 px-6 bg-gradient-subtle">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-hero rounded-full mb-8">
            <CheckCircle className="h-10 w-10 text-primary-foreground" />
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            You're on the list! 🎉
          </h2>
          
          <p className="text-lg text-muted-foreground">
            Thanks for joining! We'll keep you updated on our launch.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="signup" className="py-24 px-6 bg-gradient-subtle">
      <div className="max-w-2xl mx-auto text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-accent rounded-2xl mb-8">
          <Mail className="h-8 w-8 text-accent-foreground" />
        </div>
        
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          Be the first to know
        </h2>
        
        <p className="text-lg text-muted-foreground mb-12">
          Join our waitlist and get early access when we launch in your city.
        </p>
        
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 px-4 py-3 text-base rounded-xl border-2 focus:ring-2 focus:ring-primary/20"
          />
          <Button 
            type="submit" 
            className="btn-accent whitespace-nowrap"
          >
            Join Waitlist
          </Button>
        </form>
        
        <p className="text-sm text-muted-foreground mt-6">
          No spam, ever. We respect your privacy.
        </p>
      </div>
    </section>
  );
};

export default EmailSignup;