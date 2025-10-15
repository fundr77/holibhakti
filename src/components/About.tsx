import { Card, CardContent } from "@/components/ui/card";
import { Award, BookOpen, Users, TrendingUp } from "lucide-react";

const About = () => {
  const credentials = [
    {
      icon: Award,
      title: "Certified Health Coach",
      description: "Advanced certifications in holistic wellness and nutrition"
    },
    {
      icon: BookOpen,
      title: "Evidence-Based",
      description: "Science-backed methodologies for lasting transformation"
    },
    {
      icon: Users,
      title: "500+ Clients",
      description: "Successfully guided clients to their wellness goals"
    },
    {
      icon: TrendingUp,
      title: "Proven Results",
      description: "95% client satisfaction and goal achievement rate"
    }
  ];

  return (
    <section id="about" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Your Partner in
            <span className="block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Holistic Wellness
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            With a deep commitment to personalized, science-backed wellness coaching, 
            I help you navigate your unique journey to optimal health across all dimensions of wellbeing.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {credentials.map((cred, index) => (
            <Card 
              key={index}
              className="border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg"
              style={{ background: "var(--gradient-card)" }}
            >
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center">
                  <cred.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">{cred.title}</h3>
                <p className="text-sm text-muted-foreground">{cred.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="max-w-4xl mx-auto border-border/50">
          <CardContent className="p-8 lg:p-12">
            <div className="prose prose-lg max-w-none">
              <h3 className="text-2xl font-bold mb-4 text-foreground">My Philosophy</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                True wellness isn't just about physical health—it's about nurturing every dimension 
                of your being. Through my <strong className="text-foreground">7D Wellness approach</strong>, 
                I integrate physical fitness, nutrition, mental clarity, emotional balance, 
                spiritual growth, gut health, and stress management into a personalized program 
                designed uniquely for you.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Every client is different, and your wellness journey should reflect that. 
                I combine evidence-based practices with compassionate guidance to help you 
                achieve sustainable, lasting transformation that aligns with your values and lifestyle.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default About;
