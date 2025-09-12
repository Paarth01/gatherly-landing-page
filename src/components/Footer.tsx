import { Instagram, Linkedin, Twitter } from "lucide-react";

const Footer = () => {
  const socialLinks = [
    {
      icon: Instagram,
      href: "https://instagram.com/gatherly",
      label: "Instagram"
    },
    {
      icon: Linkedin,
      href: "https://linkedin.com/company/gatherly",
      label: "LinkedIn"
    },
    {
      icon: Twitter,
      href: "https://twitter.com/gatherly",
      label: "Twitter"
    }
  ];

  return (
    <footer className="py-16 px-6 border-t border-border/50">
      <div className="max-w-6xl mx-auto">
        {/* Main Footer Content */}
        <div className="text-center mb-12">
          <h3 className="text-2xl font-bold gradient-text mb-4">
            Gatherly
          </h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Discover. Connect. Gather.
          </p>
        </div>
        
        {/* Social Links */}
        <div className="flex justify-center space-x-6 mb-12">
          {socialLinks.map((link, index) => (
            <a
              key={index}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-12 h-12 bg-muted rounded-full hover:bg-primary hover:text-primary-foreground transition-colors duration-300 group"
              aria-label={link.label}
            >
              <link.icon className="h-5 w-5 group-hover:scale-110 transition-transform" />
            </a>
          ))}
        </div>
        
        {/* Copyright */}
        <div className="text-center pt-8 border-t border-border/30">
          <p className="text-sm text-muted-foreground">
            © 2025 Gatherly. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;