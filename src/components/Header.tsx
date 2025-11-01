import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-background/80 border-b border-border/50 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-3 transition-transform hover:scale-105"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-md">
              <Heart className="w-6 h-6 text-primary-foreground fill-primary-foreground" />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Bhakti Health
              </span>
              <span className="text-xs text-muted-foreground -mt-1">& Wellness</span>
            </div>
          </button>
          
          <nav className="hidden md:flex items-center gap-6">
            <button 
              onClick={() => {
                const aboutSection = document.getElementById('about');
                aboutSection?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
            >
              About
            </button>
            <button 
              onClick={() => {
                const servicesSection = document.getElementById('services');
                servicesSection?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
            >
              Services
            </button>
            <button 
              onClick={() => {
                const contactSection = document.getElementById('contact');
                contactSection?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
            >
              Contact
            </button>
            <button 
              onClick={() => navigate('/auth')}
              className="text-sm font-medium px-4 py-2 rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
            >
              Get Started
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
