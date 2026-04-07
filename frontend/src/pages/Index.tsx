import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, Heart, Users, Shield, Sparkles, ArrowRight } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const features = [
  { icon: Brain, title: "Expert Therapists", desc: "Licensed professionals with years of experience in mental health care." },
  { icon: Heart, title: "Compassionate Care", desc: "A safe, non-judgmental space where you can be yourself fully." },
  { icon: Users, title: "Group Support", desc: "Connect with others on similar journeys through guided group sessions." },
  { icon: Shield, title: "Complete Privacy", desc: "Your sessions and data are fully confidential and protected." },
];

const testimonials = [
  { name: "Sarah M.", text: "MindWell changed my life. I finally feel like myself again after years of struggling.", role: "Anxiety Recovery" },
  { name: "James L.", text: "The therapists here truly listen. I've made more progress in 3 months than in 3 years.", role: "Depression Management" },
  { name: "Priya K.", text: "The online sessions made it so accessible. I could heal from the comfort of my home.", role: "Stress & Burnout" },
];

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <img src={heroBg} alt="Peaceful landscape" className="absolute inset-0 w-full h-full object-cover" width={1920} height={1080} />
        <div className="absolute inset-0 bg-foreground/40" />
        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto" style={{ animation: "fade-in-up 0.8s ease-out" }}>
          <p className="text-primary-foreground/80 font-body text-sm uppercase tracking-widest mb-4">Your mental health matters</p>
          <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground leading-tight mb-6">
            Find Your Inner <span className="text-primary">Peace</span>
          </h1>
          <p className="text-primary-foreground/80 text-lg md:text-xl max-w-xl mx-auto mb-8 leading-relaxed font-body">
            Professional, compassionate mental health support to help you live a more balanced and fulfilling life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/questionnaire">
              <Button size="lg" className="text-base px-8 py-6">
                Take Self-Assessment <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/services">
              <Button variant="hero-outline" size="lg" className="text-base px-8 py-6">
                Our Services
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <p className="text-primary font-medium text-sm uppercase tracking-widest mb-2">Why MindWell</p>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">Healing Starts Here</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <Card key={i} className="border-none shadow-[var(--shadow-card)] hover:-translate-y-1 transition-transform duration-300">
                <CardContent className="p-8 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
                    <f.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="font-heading text-lg font-semibold text-foreground mb-2">{f.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 px-4 bg-primary">
        <div className="container mx-auto text-center">
          <Sparkles className="h-10 w-10 text-primary-foreground/80 mx-auto mb-4" />
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary-foreground mb-4">Not Sure Where to Start?</h2>
          <p className="text-primary-foreground/80 max-w-lg mx-auto mb-8 text-lg">
            Take our quick self-assessment to better understand your mental well-being.
          </p>
          <Link to="/questionnaire">
            <Button size="lg" variant="secondary" className="text-base px-8 py-6">
              Start the Questionnaire <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4 bg-secondary/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <p className="text-primary font-medium text-sm uppercase tracking-widest mb-2">Testimonials</p>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">Stories of Healing</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <Card key={i} className="border-none shadow-[var(--shadow-soft)]">
                <CardContent className="p-8">
                  <p className="text-muted-foreground italic mb-6 leading-relaxed">"{t.text}"</p>
                  <div>
                    <p className="font-heading font-semibold text-foreground">{t.name}</p>
                    <p className="text-primary text-sm">{t.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
