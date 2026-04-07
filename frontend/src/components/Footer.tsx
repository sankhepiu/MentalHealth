import { Heart, Phone, Mail, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-foreground text-primary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Heart className="h-6 w-6 text-primary" fill="currentColor" />
              <span className="font-heading text-xl font-semibold">MindWell</span>
            </div>
            <p className="text-sm opacity-70 leading-relaxed">
              Your journey to mental wellness starts here. We provide compassionate, evidence-based care.
            </p>
          </div>
          <div>
            <h4 className="font-heading font-semibold mb-4">Quick Links</h4>
            <div className="space-y-2 text-sm opacity-70">
              <Link to="/" className="block hover:opacity-100 transition-opacity">Home</Link>
              <Link to="/about" className="block hover:opacity-100 transition-opacity">About</Link>
              <Link to="/services" className="block hover:opacity-100 transition-opacity">Services</Link>
              <Link to="/questionnaire" className="block hover:opacity-100 transition-opacity">Self-Assessment</Link>
            </div>
          </div>
          <div>
            <h4 className="font-heading font-semibold mb-4">Services</h4>
            <div className="space-y-2 text-sm opacity-70">
              <p>Individual Therapy</p>
              <p>Couples Counseling</p>
              <p>Group Sessions</p>
              <p>Online Therapy</p>
            </div>
          </div>
          <div>
            <h4 className="font-heading font-semibold mb-4">Contact</h4>
            <div className="space-y-3 text-sm opacity-70">
              <div className="flex items-center gap-2"><Phone className="h-4 w-4" /> +91 1234567890</div>
              <div className="flex items-center gap-2"><Mail className="h-4 w-4" /> hello@mindwell.com</div>
              <div className="flex items-center gap-2"><MapPin className="h-4 w-4" /> 123 Wellness Ave</div>
            </div>
          </div>
        </div>
        <div className="border-t border-primary-foreground/20 mt-12 pt-8 text-center text-sm opacity-50">
          <p>© 2026 MindWell. All rights reserved. | If you're in crisis, call 988 Suicide & Crisis Lifeline.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
