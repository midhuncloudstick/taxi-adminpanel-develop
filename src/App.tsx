import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SearchResults from "./pages/SearchResults";
import BookingDetails from "./pages/BookingDetails";
import BookingConfirmation from "./pages/BookingConfirmation";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Fleet from "./pages/Fleet";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark" attribute="class">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/services" element={<div className="min-h-screen flex flex-col"><Header /><main className="container-custom flex-1 py-24 text-center"><h1 className="text-3xl font-bold text-primary mb-2">Services</h1><p className="max-w-lg mx-auto text-muted-foreground mb-8">Our premium transport services include well-maintained vehicles, professional drivers, and a smooth experience throughout your entire journey.</p></main><Footer /></div>} />
            <Route path="/fleet" element={<Fleet />} />
            <Route path="/search-results" element={<SearchResults />} />
            <Route path="/booking-details" element={<BookingDetails />} />
            <Route path="/booking-confirmation" element={<BookingConfirmation />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
