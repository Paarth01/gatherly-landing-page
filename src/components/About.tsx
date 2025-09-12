import { Calendar, Users, BookOpen } from "lucide-react";

const About = () => {
  const features = [
    {
      icon: Calendar,
      title: "Discover Events",
      description: "Find exciting events and activities happening in your area"
    },
    {
      icon: Users,
      title: "Join Communities",
      description: "Connect with people who share your interests and passions"
    },
    {
      icon: BookOpen,
      title: "Book & RSVP Easily",
      description: "Simple booking and RSVP system for seamless planning"
    }
  ];

  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Your city's events and hobby clubs,{" "}
            <span className="gradient-text">all in one place</span>
          </h2>
        </div>
        
        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="feature-card text-center group cursor-pointer"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-hero rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="h-8 w-8 text-primary-foreground" />
              </div>
              
              <h3 className="text-xl font-semibold text-foreground mb-4">
                {feature.title}
              </h3>
              
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;