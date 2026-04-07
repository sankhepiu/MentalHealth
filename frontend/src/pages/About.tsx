import { Heart, Award, Clock, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const stats = [
  { icon: Users, value: "10,000+", label: "Clients Helped" },
  { icon: Award, value: "15+", label: "Years Experience" },
  { icon: Clock, value: "24/7", label: "Support Available" },
  { icon: Heart, value: "98%", label: "Satisfaction Rate" },
];

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-28 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <p className="text-primary font-medium text-sm uppercase tracking-widest mb-2">About Us</p>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6">We Believe in Healing</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
              MindWell was founded on the belief that everyone deserves access to quality mental health care. Our team of compassionate, licensed professionals is here to walk alongside you on your journey to wellness.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {stats.map((s, i) => (
              <Card key={i} className="border-none shadow-[var(--shadow-soft)] text-center">
                <CardContent className="p-6">
                  <s.icon className="h-8 w-8 text-primary mx-auto mb-3" />
                  <p className="font-heading text-2xl font-bold text-foreground">{s.value}</p>
                  <p className="text-muted-foreground text-sm">{s.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-heading text-2xl font-bold text-foreground mb-4">Our Approach</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We use evidence-based therapies including Cognitive Behavioral Therapy (CBT), mindfulness-based approaches, and person-centered techniques tailored to each individual's needs.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Every person's experience is unique, and so is their path to healing. We meet you where you are, with empathy and without judgment.
              </p>
            </div>
            <div className="bg-primary/5 rounded-2xl p-10 text-center">
              <Heart className="h-16 w-16 text-primary mx-auto mb-4 animate-float" fill="currentColor" />
              <p className="font-heading text-xl font-semibold text-foreground mb-2">You Are Not Alone</p>
              <p className="text-muted-foreground text-sm">1 in 5 adults experience mental illness each year. Seeking help is a sign of strength.</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;
