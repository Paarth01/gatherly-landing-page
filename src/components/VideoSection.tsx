import { useState } from "react";
import { Play, Pause, Users, Star, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";

const VideoSection = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Community Manager",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b775?w=64&h=64&fit=crop&crop=face",
      rating: 5,
      text: "Gatherly has transformed how I discover events in my city. I've met so many amazing people!"
    },
    {
      name: "Marcus Johnson",
      role: "Event Organizer",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face",
      rating: 5,
      text: "The platform makes event management effortless. Our attendance rates have doubled since joining!"
    },
    {
      name: "Emma Rodriguez",
      role: "Hobbyist",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face",
      rating: 5,
      text: "Finally found my photography community through Gatherly. The app is intuitive and beautiful!"
    }
  ];

  const handleVideoPlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <section className="py-24 px-6 bg-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            See Gatherly in <span className="gradient-text">Action</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Watch how thousands of people are discovering amazing events and building meaningful connections
          </p>
        </div>

        {/* Video Demo Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <div className="order-2 lg:order-1">
            <div className="relative group">
              <div className="aspect-video bg-gradient-hero/10 rounded-3xl overflow-hidden shadow-elegant">
                {/* Video Placeholder */}
                <div className="relative w-full h-full bg-black/20 flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20" />
                  
                  {/* Play Button */}
                  <button
                    onClick={handleVideoPlay}
                    className="group flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm border-2 border-white/30 rounded-full hover:bg-white/20 hover:scale-110 transition-all duration-300 shadow-glow"
                  >
                    {isPlaying ? (
                      <Pause className="h-8 w-8 text-white group-hover:scale-110 transition-transform" />
                    ) : (
                      <Play className="h-8 w-8 text-white ml-1 group-hover:scale-110 transition-transform" />
                    )}
                  </button>

                  {/* Video Overlay Text */}
                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <h3 className="text-xl font-bold mb-2">Discover Events Near You</h3>
                    <p className="text-white/80 text-sm">2:30 min demo walkthrough</p>
                  </div>
                </div>
              </div>

              {/* Video Stats */}
              <div className="absolute -bottom-6 left-6 right-6 flex justify-between">
                <div className="bg-card/90 backdrop-blur-sm border border-border/50 rounded-xl px-4 py-3 shadow-lg">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">10K+ views</span>
                  </div>
                </div>
                <div className="bg-card/90 backdrop-blur-sm border border-border/50 rounded-xl px-4 py-3 shadow-lg">
                  <div className="flex items-center space-x-2">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium">4.9/5 rating</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2 space-y-8">
            <div>
              <h3 className="text-3xl font-bold text-foreground mb-4">
                Join 10,000+ happy users
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Our community is growing every day with people discovering new passions, 
                making lasting friendships, and creating unforgettable memories.
              </p>
            </div>

            {/* Interactive Stats */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: "250+", label: "Events Weekly", color: "text-primary" },
                { value: "95%", label: "User Satisfaction", color: "text-accent" },
                { value: "50+", label: "Cities", color: "text-secondary" },
                { value: "24/7", label: "Support", color: "text-primary" }
              ].map((stat, index) => (
                <div key={index} className="group p-4 rounded-2xl bg-card/50 border border-border/50 hover:bg-card hover:shadow-lg transition-all duration-300 cursor-pointer">
                  <div className={`text-2xl font-bold ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            <Button 
              size="lg" 
              className="btn-hero group w-full sm:w-auto hover:shadow-glow"
            >
              Get Started Today
              <Play className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>

        {/* Testimonials Carousel */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="group bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 hover:bg-card hover:shadow-elegant hover:scale-105 transition-all duration-300"
            >
              {/* Quote Icon */}
              <Quote className="h-8 w-8 text-primary/40 mb-4 group-hover:text-primary/60 transition-colors" />
              
              {/* Testimonial Text */}
              <p className="text-muted-foreground italic mb-6 leading-relaxed group-hover:text-foreground/80 transition-colors">
                "{testimonial.text}"
              </p>

              {/* User Info */}
              <div className="flex items-center space-x-4">
                <img 
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-border group-hover:border-primary/30 transition-colors"
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground group-hover:gradient-text transition-all duration-300">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role}
                  </p>
                </div>
                <div className="flex space-x-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-500 fill-current" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VideoSection;