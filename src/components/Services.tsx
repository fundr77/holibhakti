import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Activity, 
  Apple, 
  Brain, 
  Sparkles, 
  Heart, 
  Wind, 
  Moon,
  ArrowRight 
} from "lucide-react";

const Services = () => {
  const services = [
    {
      icon: Activity,
      title: "Physical Wellness",
      description: "Customized fitness programs tailored to your body, goals, and lifestyle. Build strength, flexibility, and vitality.",
      color: "text-primary",
      benefits: ["Personalized exercise plans", "Progress tracking", "Sustainable routines"]
    },
    {
      icon: Apple,
      title: "Nutritional Wellness",
      description: "Science-backed nutrition guidance that nourishes your body and supports your unique health goals.",
      color: "text-accent",
      benefits: ["Custom meal plans", "Nutritional counseling", "Healthy habits"]
    },
    {
      icon: Brain,
      title: "Mental & Emotional Wellness",
      description: "Develop mental clarity, emotional resilience, and healthy coping strategies for life's challenges.",
      color: "text-primary",
      benefits: ["Stress management", "Emotional balance", "Mental clarity"]
    },
    {
      icon: Sparkles,
      title: "Mindfulness & Spirituality",
      description: "Cultivate inner peace, purpose, and connection through mindfulness and spiritual practices.",
      color: "text-accent",
      benefits: ["Meditation guidance", "Spiritual growth", "Inner peace"]
    },
    {
      icon: Heart,
      title: "Gut Health",
      description: "Optimize your digestive health and microbiome for better immunity, energy, and overall wellness.",
      color: "text-primary",
      benefits: ["Gut health optimization", "Digestive wellness", "Microbiome support"]
    },
    {
      icon: Wind,
      title: "Stress Management",
      description: "Learn powerful techniques to manage stress, prevent burnout, and maintain balance in your daily life.",
      color: "text-accent",
      benefits: ["Stress reduction", "Burnout prevention", "Work-life balance"]
    },
    {
      icon: Moon,
      title: "Sleep & Recovery",
      description: "Improve sleep quality and recovery patterns for enhanced energy, focus, and overall health.",
      color: "text-primary",
      benefits: ["Sleep optimization", "Recovery protocols", "Energy enhancement"]
    }
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      <div 
        className="absolute inset-0 z-0 opacity-50"
        style={{ background: "var(--gradient-hero)" }}
      />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            The 7D Wellness
            <span className="block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Approach
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            A comprehensive, holistic framework that addresses every dimension of your wellbeing. 
            Each pillar works together to create lasting, transformative change.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {services.map((service, index) => (
            <Card 
              key={index}
              className="border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-xl bg-card/90 backdrop-blur-sm group"
            >
              <CardHeader>
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <service.icon className={`w-7 h-7 ${service.color}`} />
                </div>
                <CardTitle className="text-xl">{service.title}</CardTitle>
                <CardDescription className="text-base">
                  {service.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  {service.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                      {benefit}
                    </li>
                  ))}
                </ul>
                <Button 
                  variant="ghost" 
                  className="w-full group/btn"
                  onClick={() => {
                    const contactSection = document.getElementById('contact');
                    contactSection?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Learn More
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="max-w-4xl mx-auto mt-16 text-center">
          <Card className="border-primary/20 bg-card/80 backdrop-blur-sm">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">Ready to Transform Your Life?</h3>
              <p className="text-muted-foreground mb-6">
                Book a free discovery call to explore how the 7D Wellness approach can work for you.
              </p>
              <Button 
                size="lg" 
                variant="hero"
                onClick={() => {
                  const contactSection = document.getElementById('contact');
                  contactSection?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Book Discovery Call
                <ArrowRight className="w-5 h-5" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Services;
