import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Dr. Anand",
      role: "High Blood Pressure client",
      content:
        "Bhakti Health and Wellness helped me lose 15 kg, control my blood pressure, and reduce liver fat. More than weight loss, it transformed my lifestyle for the better!",
      rating: 5,
      transformation: "Lost 15kg in 4 months",
    },
    {
      name: "Priya Iyer",
      role: "Postpartum Client",
      content:
        "The postpartum program was exactly what I needed. They understood my challenges and helped me regain my strength and balance.",
      rating: 5,
      transformation: "Regain my strength",
    },
    {
      name: "Rag Verma",
      role: "Teen Client",
      content:
        "As a teenager, I used to struggle with acne, low energy, and stress from school. After following a customized wellness plan that included healthy eating, skincare tips, and mindfulness exercises, my skin has cleared up, and I feel more confident and active. I’ve learned how to take care of my body the right way!",
      rating: 5,
      transformation: "Complete lifestyle transformation",
    },
  ];

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Real Stories,
            <span className="block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Real Transformations
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Join hundreds of clients who've transformed their health and happiness through the 7D Wellness approach.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-xl relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500" />

              <CardContent className="p-8 relative">
                <Quote className="w-10 h-10 text-primary/20 mb-4" />

                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>

                <p className="text-muted-foreground mb-6 leading-relaxed">"{testimonial.content}"</p>

                <div className="pt-4 border-t border-border/50">
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground mb-2">{testimonial.role}</p>
                  <div className="inline-block px-3 py-1 bg-primary/10 rounded-full">
                    <p className="text-xs font-medium text-primary">{testimonial.transformation}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="max-w-2xl mx-auto mt-16 text-center">
          <div className="bg-muted/50 rounded-2xl p-8 border border-border/50">
            <div className="flex items-center justify-center gap-12 flex-wrap">
              <div className="text-center">
                <p className="text-4xl font-bold text-primary mb-2">500+</p>
                <p className="text-sm text-muted-foreground">Happy Clients</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-accent mb-2">95%</p>
                <p className="text-sm text-muted-foreground">Success Rate</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-primary mb-2">5+</p>
                <p className="text-sm text-muted-foreground">Years Experience</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
