import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "../images/WhatsApp Image 2026-01-08 at 10.04.23.jpeg";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Products", path: "/products" },
  { name: "Services", path: "/services" },
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showBanner, setShowBanner] = useState(true);
  const location = useLocation();

  return (
    <>
      {/* Free Delivery Banner */}
      {showBanner && (
        <div className="bg-primary text-primary-foreground py-2 px-4 relative">
          <div className="container mx-auto flex items-center justify-center gap-2">
            <span className="text-sm font-medium text-center">
              🚚 Free delivery and free scatter cushions on couch orders in CPT!
            </span>
            <button
              onClick={() => setShowBanner(false)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-primary-foreground/80 hover:text-primary-foreground"
              aria-label="Close banner"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Navigation */}
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 md:space-x-3">
              <img 
                src={logo} 
                alt="KayaHaus Logo" 
                className="h-10 w-auto md:h-14 lg:h-16"
              />
              <span className="font-display text-lg md:text-xl lg:text-2xl font-semibold text-foreground">
                KayaHaus
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative text-sm font-medium transition-colors hover:text-primary ${
                    location.pathname === link.path
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  {link.name}
                  {/* Active indicator underline */}
                  {location.pathname === link.path && (
                    <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full" />
                  )}
                </Link>
              ))}
            </div>

            {/* Actions */}
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/admin">
                <Button variant="ghost" size="sm" className="gap-2">
                  <User className="h-4 w-4" />
                  Admin
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className="h-6 w-6 text-foreground" />
              ) : (
                <Menu className="h-6 w-6 text-foreground" />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isOpen && (
            <div className="md:hidden py-4 border-t border-border animate-fade-in">
              <div className="flex flex-col space-y-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`relative text-base font-medium transition-colors hover:text-primary ${
                      location.pathname === link.path
                        ? "text-primary"
                        : "text-muted-foreground"
                    }`}
                  >
                    {link.name}
                    {/* Active indicator for mobile */}
                    {location.pathname === link.path && (
                      <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full" />
                    )}
                  </Link>
                ))}
                <Link to="/admin" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full gap-2">
                    <User className="h-4 w-4" />
                    Admin Login
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};