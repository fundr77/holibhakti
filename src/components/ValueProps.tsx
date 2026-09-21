import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, HeartPulse, Leaf, Users, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ValueProps = () => {
  const values = [
    {
      icon: HeartPulse,
      title: "Truly Personalized",
      description: "No one-size-fits-all plans. Every program is built around your body, your condition, and your goals.",
    },
    {
      icon: Leaf,
      title: "Holistic by Design",
      description: "We treat you as a whole person — nutrition, movement, sleep, stress, and mindset working together.",
    },
    {
      icon: Sparkles,
      title: "Science-Backed",
      description: "Evidence-based protocols for conditions like diabetes, thyroid, PCOD, and high blood pressure.",
    },
    {
      icon: Users,
      title: "Coached, Not Left Alone",
      description: "Ongoing guidance through daily tracking, real-time chat, and regular check-ins — you're never on your own.",
    },
  ];

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="text-sm font-semibold tracking-wide uppercase text-primary">
            Why Bhakti Health & Wellness
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold mt-4 mb-6">
            Wellness That Works
            <span className="block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Around Your Life
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Most programs hand you a plan and disappear. We stay with you every step — 
            tracking, adjusting, and coaching until the change becomes who you are.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {values.map((value, index) => (
            <Card
              key={index}
              className="border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg"
              style={{ background: "var(--gradient-card)" }}
            >
              <CardContent className="p-8 flex gap-5 items-start">
                <div className="w-14 h-14 shrink-0 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <value.icon className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button
            size="lg"
            variant="hero"
            className="text-base px-8"
            onClick={() => navigate('/auth')}
          >
            Start Your Journey
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ValueProps;
