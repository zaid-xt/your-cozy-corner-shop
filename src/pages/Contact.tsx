import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const contactInfo = [
  { icon: Mail, label: "Email", value: "info@kayahaus.co.za" },
  { icon: Phone, label: "Phone", value: "+27 78 574 9329" },
  { icon: MapPin, label: "Address", value: "1 Nortjie Street Onverwacht Road, Strand Helderberg" },
  { 
    icon: Clock, 
    label: "Business Hours", 
    value: [
      "Mon - Fri: 9:00 AM - 17:00 PM",
      "Saturday: 9:00 AM - 13:00 PM", 
      "Sunday and Public Holidays: Closed"
    ]
  },
];

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message Sent!",
      description: "Thank you for reaching out. We'll get back to you soon.",
    });
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="hero-gradient py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display text-4xl md:text-5xl font-semibold text-foreground mb-6 animate-slide-up">
            Get in Touch
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-in">
            Have a question or want to work with us? We'd love to hear from you.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Contact Form */}
            <div className="animate-slide-up">
              <h2 className="font-display text-2xl font-semibold text-foreground mb-6">
                Send us a Message
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Your Name
                    </label>
                    <Input
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Email Address
                    </label>
                    <Input
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Subject
                  </label>
                  <Input
                    placeholder="How can we help?"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Message
                  </label>
                  <Textarea
                    placeholder="Tell us more about your inquiry..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={5}
                    className="resize-none"
                    required
                  />
                </div>
                <Button type="submit" className="button-shadow gap-2">
                  <Send className="h-4 w-4" />
                  Send Message
                </Button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="animate-slide-up" style={{ animationDelay: "100ms" }}>
              <h2 className="font-display text-2xl font-semibold text-foreground mb-6">
                Contact Information
              </h2>
              <div className="space-y-6 mb-8">
                {contactInfo.map((info) => (
                  <div key={info.label} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <info.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground mb-1">{info.label}</p>
                      
                      {/* Check if value is an array (for Business Hours) */}
                      {Array.isArray(info.value) ? (
                        <div className="flex flex-col space-y-0.5">
                          {info.value.map((hour, index) => (
                            <p key={index} className="font-medium text-foreground text-sm">
                              {hour}
                            </p>
                          ))}
                        </div>
                      ) : (
                        <p className="font-medium text-foreground">{info.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Map Placeholder */}
              <div className="aspect-video rounded-xl bg-muted overflow-hidden card-shadow">
                <img
                  src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800"
                  alt="Location map"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Preview */}
      <section className="py-16 md:py-24 bg-muted">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-3xl font-semibold text-foreground mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-12">
            Quick answers to common questions about our products and services.
          </p>
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto text-left">
            {[
              { q: "What's your return policy?", a: "We offer a 30-day satisfaction guarantee on all products." },
              { q: "Do you ship internationally?", a: "Yes! We ship to over 50 countries worldwide." },
              { q: "How long does shipping take?", a: "Domestic orders arrive in 3-5 business days." },
              { q: "Are your products handmade?", a: "Every product is handcrafted by skilled artisans." },
            ].map((faq, index) => (
              <div
                key={index}
                className="bg-card p-6 rounded-lg card-shadow animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <h3 className="font-semibold text-foreground mb-2">{faq.q}</h3>
                <p className="text-sm text-muted-foreground">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;