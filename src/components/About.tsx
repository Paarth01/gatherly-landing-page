import { Calendar, Users, BookOpen, Play } from "lucide-react";
import featureDiscoverImage from "@/assets/feature-discover.jpg";
import featureCommunityImage from "@/assets/feature-community.jpg";
import featureBookingImage from "@/assets/feature-booking.jpg";
import eventsCollageImage from "@/assets/events-collage.jpg";

const About = () => {
  const features = [
    {
      icon: Calendar,
      title: "Discover Events",
      description: "Find exciting events and activities happening in your area",
      image: featureDiscoverImage
    },
    {
      icon: Users,
      title: "Join Communities",
      description: "Connect with people who share your interests and passions",
      image: featureCommunityImage
    },
    {
      icon: BookOpen,
      title: "Book & RSVP Easily",
      description: "Simple booking and RSVP system for seamless planning",
      image: featureBookingImage
    }
  ];

  return (
    <section className="py-24 px-6 bg-gradient-subtle">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Your city's events and hobby clubs,{" "}
            <span className="gradient-text">all in one place</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Experience the future of event discovery with our innovative platform
          </p>
        </div>
        
        {/* Interactive Demo Section */}
        <div className="relative mb-20 rounded-3xl overflow-hidden shadow-elegant bg-card">
          <div className="relative aspect-video">
            <img 
              src={eventsCollageImage} 
              alt="Events and activities collage"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <button className="group flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full hover:bg-white/20 hover:scale-110 transition-all duration-300">
                <Play className="h-8 w-8 text-white ml-1 group-hover:scale-110 transition-transform" />
              </button>
            </div>
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <h3 className="text-2xl font-bold mb-2">See Gatherly in Action</h3>
              <p className="text-white/80">Watch how easy it is to discover amazing events near you</p>
            </div>
          </div>
        </div>
        
        {/* Enhanced Features Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="group cursor-pointer"
            >
              <div className="feature-card text-center overflow-hidden">
                {/* Feature Image */}
                <div className="relative mb-6 rounded-2xl overflow-hidden aspect-video">
                  <img 
                    src={feature.image} 
                    alt={feature.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute top-4 left-4 inline-flex items-center justify-center w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl group-hover:bg-gradient-hero group-hover:scale-110 transition-all duration-300">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-foreground mb-4 group-hover:gradient-text transition-all duration-300">
                  {feature.title}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed group-hover:text-foreground/80 transition-colors duration-300">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Interactive Stats */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { number: "10K+", label: "Active Users" },
            { number: "500+", label: "Events Monthly" },
            { number: "50+", label: "Cities" },
            { number: "95%", label: "Satisfaction" }
          ].map((stat, index) => (
            <div key={index} className="text-center group cursor-pointer">
              <div className="inline-block p-6 rounded-2xl bg-gradient-hero/10 group-hover:bg-gradient-hero group-hover:shadow-glow transition-all duration-300">
                <div className="text-3xl font-bold gradient-text group-hover:text-white transition-colors duration-300">
                  {stat.number}
                </div>
                <div className="text-sm text-muted-foreground group-hover:text-white/80 transition-colors duration-300 mt-1">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;