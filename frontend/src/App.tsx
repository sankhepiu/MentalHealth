import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import Index from "./pages/Index";
import About from "./pages/About";
import Services from "./pages/Services";
import Questionnaire from "./pages/Questionnaire";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

// Pages
import ChatBot from "./pages/chatbot";
import LivingGarden from "./pages/LivingGarden";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />

      <BrowserRouter>
        <Routes>
          {/* Main pages */}
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/questionnaire" element={<Questionnaire />} />
          <Route path="/contact" element={<Contact />} />

          {/* Features */}
          <Route path="/chatbot" element={<ChatBot />} />
          <Route path="/garden" element={<LivingGarden />} />

          {/* 404 (always last) */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
