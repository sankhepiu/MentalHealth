import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, Heart, Users, Monitor, Flower2, Baby, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const services = [
  { icon: Brain, title: "Individual Therapy", desc: "One-on-one sessions tailored to your needs. Work through anxiety, depression, trauma, and more with a licensed therapist.", price: "$120/session" },
  { icon: Users, title: "Couples Counseling", desc: "Strengthen your relationship with guided sessions focused on communication, trust, and connection.", price: "$150/session" },
  { icon: Heart, title: "Group Therapy", desc: "Join a supportive community of people with shared experiences. Facilitated by licensed professionals.", price: "$60/session" },
  { icon: Monitor, title: "Online Therapy", desc: "Access therapy from anywhere with secure video sessions. Same quality care, more flexibility.", price: "$100/session" },
  { icon: Flower2, title: "Mindfulness & Meditation", desc: "Learn evidence-based techniques to manage stress, improve focus, and cultivate inner peace.", price: "$80/session" },
  { icon: Baby, title: "Youth Counseling", desc: "Specialized therapy for children and adolescents navigating the challenges of growing up.", price: "$110/session" },
];

const Services = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-28 pb-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <p className="text-primary font-medium text-sm uppercase tracking-widest mb-2">Our Services</p>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6">Care Tailored to You</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Every journey is different. We offer a range of services to support your unique path to wellness.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {services.map((s, i) => (
              <Card key={i} className="border-none shadow-[var(--shadow-card)] hover:-translate-y-1 transition-transform duration-300 group">
                <CardContent className="p-8">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                    <s.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-heading text-lg font-semibold text-foreground mb-2">{s.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">{s.desc}</p>
                  <p className="text-primary font-semibold text-sm">{s.price}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center bg-primary/5 rounded-2xl p-12">
            <h2 className="font-heading text-2xl font-bold text-foreground mb-3">Not sure which service is right for you?</h2>
            <p className="text-muted-foreground mb-6">Take our free self-assessment to get personalized recommendations.</p>
            <Link to="/questionnaire">
              <Button size="lg">Take Self-Assessment <ArrowRight className="ml-2 h-5 w-5" /></Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Services;
