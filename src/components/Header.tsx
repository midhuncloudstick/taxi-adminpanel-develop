
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Menu, Phone, User } from 'lucide-react';
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger 
} from './ui/sheet';

const Header = () => {
  return (
    <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container-custom py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <h1 className="text-2xl font-bold text-foreground">
              <span className="text-primary">Brisbane</span> Premium
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-foreground/80 hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/services" className="text-foreground/80 hover:text-primary transition-colors">
              Services
            </Link>
            <Link to="/fleet" className="text-foreground/80 hover:text-primary transition-colors">
              Our Fleet
            </Link>
            <Link to="/about" className="text-foreground/80 hover:text-primary transition-colors">
              About Us
            </Link>
            <Link to="/contact" className="text-foreground/80 hover:text-primary transition-colors">
              Contact
            </Link>
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="outline" size="sm" className="rounded-full">
              <Phone className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">1300 PREMIUM</span>
            </Button>
            <Button variant="default" size="sm" className="rounded-full">
              <User className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Sign In</span>
            </Button>
          </div>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col space-y-4 mt-8">
                <Link to="/" className="text-foreground/80 hover:text-primary transition-colors py-2">
                  Home
                </Link>
                <Link to="/services" className="text-foreground/80 hover:text-primary transition-colors py-2">
                  Services
                </Link>
                <Link to="/fleet" className="text-foreground/80 hover:text-primary transition-colors py-2">
                  Our Fleet
                </Link>
                <Link to="/about" className="text-foreground/80 hover:text-primary transition-colors py-2">
                  About Us
                </Link>
                <Link to="/contact" className="text-foreground/80 hover:text-primary transition-colors py-2">
                  Contact
                </Link>
                <div className="pt-4 flex flex-col space-y-2">
                  <Button variant="outline" size="sm" className="justify-start rounded-full">
                    <Phone className="h-4 w-4 mr-2" />
                    <span>1300 PREMIUM</span>
                  </Button>
                  <Button variant="default" size="sm" className="justify-start rounded-full">
                    <User className="h-4 w-4 mr-2" />
                    <span>Sign In</span>
                  </Button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
