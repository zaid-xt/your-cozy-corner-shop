import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Palette, ArrowRight, Wrench, Tv, Sofa } from "lucide-react";

const services = [
 {
    icon: Palette,
    title: "Custom Creations",
    description: "Work with our artisans to design a unique piece tailored to your vision. From ceramics to textiles, we bring your ideas to life. Perfect for heirlooms, statement pieces, or personal expressions of creativity.",
    features: ["Personal consultation", "Design collaboration", "Handcrafted to order", "Unique, one-of-a-kind pieces"],
    price: "Contact for pricing",
  },
  {
    icon: Wrench,
    title: "Kitchen Fittings",
    description: "Custom-designed modern kitchens tailored to your space. We handle cabinetry, finishes, and installation with a focus on clean lines, functionality, and premium materials.",
    features: ["Space-optimized cabinetry", "Premium material finishes", "Full installation service", "Functional layout planning"],
    price: "Project-based quote",
  },
  {
    icon: Tv,
    title: "Modern Floating TV Stands",
    description: "Bespoke floating fitted TV units designed for contemporary interiors. Made-to-measure, minimalist, and engineered for a seamless, luxury look.",
    features: ["Custom measurements", "Minimalist design", "Hidden cable management", "Premium materials"],
    price: "Project-based quote",
  },
  {
    icon: Sofa,
    title: "Upholstery & Reupholstery Services",
    description: "Professional upholstery for sofas, chairs, and custom furniture. We restore, redesign, or upgrade pieces using quality fabrics and expert craftsmanship.",
    features: ["Fabric selection", "Full restoration", "Custom redesign", "Expert craftsmanship"],
    price: "Contact for pricing",
  },
];

const Services = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="hero-gradient py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display text-4xl md:text-5xl font-semibold text-foreground mb-6 animate-slide-up">
            Our Services
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-in">
            Beyond our curated collection, we offer personalized services to bring 
            the artisan experience into your life and business.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {services.map((service, index) => (
              <div
                key={service.title}
                className="bg-card rounded-xl p-8 card-shadow hover:card-shadow-hover transition-shadow animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <service.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-display text-2xl font-semibold text-foreground mb-3">
                  {service.title}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {service.description}
                </p>
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <span className="font-semibold text-foreground">{service.price}</span>
                  <Link to="/contact">
                  <Button variant="ghost" size="sm" className="gap-1 text-primary">
                    Contact Us <ArrowRight className="h-4 w-4" />
                  </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 md:py-24 bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-semibold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Our simple process ensures you get exactly what you're looking for.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { step: "1", title: "Consult", desc: "Share your vision with our team" },
              { step: "2", title: "Design", desc: "Collaborate on the perfect concept" },
              { step: "3", title: "Create", desc: "Our artisans craft your piece" },
              { step: "4", title: "Deliver", desc: "Receive your unique creation" },
            ].map((item, index) => (
              <div
                key={item.step}
                className="text-center animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 font-display text-xl font-semibold">
                  {item.step}
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-1">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-3xl font-semibold text-foreground mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-8">
            Contact us to discuss your project or book a consultation.
          </p>
          <Link to="/contact">
            <Button size="lg" className="button-shadow gap-2">
              Contact Us
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Services;
