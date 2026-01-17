import { Link } from "react-router-dom";
import { ShoppingBag, Mail, Phone, MapPin } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-foreground text-primary-foreground">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <ShoppingBag className="h-6 w-6" />
              <span className="font-display text-xl font-semibold">KayaHaus</span>
            </Link>
            <p className="text-sm text-primary-foreground/70">
              Curated collection of handcrafted products made with love and attention to detail.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {["Home", "Products", "Services", "About", "Contact"].map((item) => (
                <li key={item}>
                  <Link
                    to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                    className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-primary-foreground/70">
                <Mail className="h-4 w-4" />
                info@kayahaus.co.za
              </li>
              <li className="flex items-center gap-2 text-sm text-primary-foreground/70">
                <Phone className="h-4 w-4" />
                +27 78 574 9329
              </li>
              <li className="flex items-center gap-2 text-sm text-primary-foreground/70">
                <MapPin className="h-4 w-4" />
                1 Nortjie Street Onverwacht Road, Strand Helderberg
              </li>
            </ul>
          </div>
        </div>
        
<div className="mt-12 pt-8 border-t border-primary-foreground/10 text-center text-sm text-primary-foreground/50">
  © {new Date().getFullYear()} KayaHaus. All rights reserved.
  <div className="mt-2">
    Powered by{" "}
    <a 
      href="https://devtechinnovations.co.za" 
      target="_blank" 
      rel="noopener noreferrer"
      className="text-primary-foreground/70 hover:text-primary-foreground hover:underline transition-colors"
    >
      DevTech Innovations
    </a>
  </div>
</div>
      </div>
    </footer>
  );
};
