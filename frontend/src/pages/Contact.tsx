import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, Mail, MapPin, Clock, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Contact = () => {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Message Sent!", description: "We'll get back to you within 24 hours." });
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-28 pb-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <p className="text-primary font-medium text-sm uppercase tracking-widest mb-2">Get in Touch</p>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6">We're Here for You</h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">Reach out today. Taking the first step is often the hardest — and the most important.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              { icon: Phone, title: "Call Us", info: "+91 1234567890", sub: "Mon-Fri, 8am-8pm" },
              { icon: Mail, title: "Email Us", info: "hello@mindwell.com", sub: "Response within 24hrs" },
              { icon: MapPin, title: "Visit Us", info: "123 Wellness Ave", sub: "Suite 200, CA 90210" },
            ].map((item, i) => (
              <Card key={i} className="border-none shadow-[var(--shadow-soft)] text-center">
                <CardContent className="p-8">
                  <item.icon className="h-8 w-8 text-primary mx-auto mb-3" />
                  <h3 className="font-heading font-semibold text-foreground mb-1">{item.title}</h3>
                  <p className="text-foreground text-sm font-medium">{item.info}</p>
                  <p className="text-muted-foreground text-xs">{item.sub}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="border-none shadow-[var(--shadow-card)]">
            <CardContent className="p-8 md:p-12">
              <h2 className="font-heading text-2xl font-bold text-foreground mb-6">Send a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid md:grid-cols-2 gap-5">
                  <Input placeholder="Your Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                  <Input type="email" placeholder="Your Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                </div>
                <Input placeholder="Subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required />
                <Textarea placeholder="Your message..." rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required />
                <Button type="submit" size="lg">
                  <Send className="mr-2 h-4 w-4" /> Send Message
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="mt-8 bg-accent/10 border border-accent/20 rounded-lg p-6 flex items-start gap-3">
            <Clock className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">Crisis Support:</strong> If you or someone you know is in immediate danger, please call <strong className="text-foreground">911</strong> or the <strong className="text-foreground">988 Suicide & Crisis Lifeline</strong>.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
