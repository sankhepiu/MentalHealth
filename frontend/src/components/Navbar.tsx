import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Heart, MessageCircleHeart, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const links = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About" },
    { to: "/services", label: "Services" },
    { to: "/questionnaire", label: "Self-Assessment" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <Heart className="h-6 w-6 text-primary" fill="currentColor" />
          <span className="font-heading text-xl font-semibold text-foreground">
            MindWell
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location.pathname === link.to
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}

          {/* 🌿 Garden Link */}
          <Link
            to="/garden"
            className={`flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-primary ${
              location.pathname === "/garden"
                ? "text-primary"
                : "text-muted-foreground"
            }`}
          >
            <Leaf className="h-4 w-4" />
            Garden
          </Link>

          {/* 💬 AI Chat */}
          <Link
            to="/chatbot"
            className={`flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-primary ${
              location.pathname === "/chatbot"
                ? "text-primary"
                : "text-muted-foreground"
            }`}
          >
            <MessageCircleHeart className="h-4 w-4" />
            AI Chat
          </Link>

          <Link to="/questionnaire">
            <Button size="sm">Take Assessment</Button>
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden text-foreground"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden bg-background border-b border-border px-4 pb-4 space-y-3">

          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setIsOpen(false)}
              className={`block text-sm font-medium py-2 transition-colors hover:text-primary ${
                location.pathname === link.to
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}

          {/* 🌿 Garden (mobile) */}
          <Link
            to="/garden"
            onClick={() => setIsOpen(false)}
            className={`flex items-center gap-1.5 text-sm font-medium py-2 transition-colors hover:text-primary ${
              location.pathname === "/garden"
                ? "text-primary"
                : "text-muted-foreground"
            }`}
          >
            <Leaf className="h-4 w-4" />
            Garden
          </Link>

          {/* 💬 AI Chat (mobile) */}
          <Link
            to="/chatbot"
            onClick={() => setIsOpen(false)}
            className={`flex items-center gap-1.5 text-sm font-medium py-2 transition-colors hover:text-primary ${
              location.pathname === "/chatbot"
                ? "text-primary"
                : "text-muted-foreground"
            }`}
          >
            <MessageCircleHeart className="h-4 w-4" />
            AI Chat
          </Link>

          <Link to="/questionnaire" onClick={() => setIsOpen(false)}>
            <Button size="sm" className="w-full">
              Take Assessment
            </Button>
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;