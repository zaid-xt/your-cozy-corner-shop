import { Layout } from "@/components/layout/Layout";
import { Heart, Users, Leaf, Award } from "lucide-react";
import { Helmet } from "react-helmet-async";

const values = [
  {
    icon: Heart,
    title: "Crafted with Love",
    description: "Every product is made by skilled artisans who pour their heart into their craft.",
  },
  {
    icon: Leaf,
    title: "Sustainable Practices",
    description: "We prioritize eco-friendly materials and sustainable production methods.",
  },
  {
    icon: Users,
    title: "Community First",
    description: "We support local artisan communities and fair trade practices worldwide.",
  },
  {
    icon: Award,
    title: "Quality Guaranteed",
    description: "Each piece undergoes rigorous quality checks to ensure lasting beauty.",
  },
];

const About = () => {
  return (
    <>
      <Helmet>
        <title>Custom Luxury Furniture Cape Town | Premium Couches, Beds & TV Units - Kayahaus</title>
        <meta 
          name="description" 
          content="Kayahaus crafts custom luxury furniture in Cape Town: bespoke couches, beds, TV units, kitchen fittings & upholstery. South Africa's premier furniture artisans."
        />
        <meta 
          name="keywords" 
          content="luxury couches Cape Town, custom beds South Africa, TV units Cape Town, kitchen fittings, upholstery services, custom furniture Cape Town, premium furniture South Africa, bespoke couches, handmade beds, artisan furniture, Cape Town furniture makers, South Africa furniture"
        />
        <meta property="og:title" content="Cape Town's Premier Custom Furniture Maker | Kayahaus" />
        <meta property="og:description" content="Bespoke luxury furniture in Cape Town: couches, beds, TV units & kitchen fittings. Crafted by South African artisans." />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="en_ZA" />
        
        {/* Local Business SEO */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FurnitureStore",
            "name": "Kayahaus",
            "description": "Custom luxury furniture maker in Cape Town, South Africa specializing in bespoke couches, beds, TV units, kitchen fittings and upholstery services.",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Cape Town",
              "addressRegion": "Western Cape",
              "addressCountry": "ZA"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": "-33.9249",
              "longitude": "18.4241"
            },
            "url": "https://kayahaus.co.za/about",
            "telephone": "+27-XXX-XXX-XXXX",
            "priceRange": "$$$",
            "openingHours": "Mo-Fr 08:00-17:00",
            "image": "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=800",
            "areaServed": ["Cape Town", "Western Cape", "South Africa"],
            "makesOffer": [
              "Custom Couches",
              "Luxury Beds", 
              "TV Units",
              "Kitchen Fittings",
              "Upholstery Services"
            ]
          })}
        </script>
      </Helmet>

      <Layout>
        {/* Hero - Kept EXACTLY as original */}
        <section className="hero-gradient py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-display text-4xl md:text-5xl font-semibold text-foreground mb-6 animate-slide-up">
              Our Story
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-in">
              Founded on a passion for authentic craftsmanship and sustainable living, 
              Artisan connects you with treasures from skilled makers around the world.
            </p>
          </div>
        </section>

        {/* Story Section - Kept EXACTLY as original */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="animate-slide-up">
                <img
                  src="https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=800"
                  alt="Artisan workshop"
                  className="rounded-xl card-shadow"
                />
              </div>
              <div className="space-y-6">
                <h2 className="font-display text-3xl font-semibold text-foreground">
                  Where Tradition Meets Modern Living
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Kayahaus is a modern furniture brand specialising in custom-made, minimalist luxury couches and home furniture.
                  We focus on high-quality craftsmanship, clean contemporary designs, and comfort tailored to each client's space.
                  All pieces are made to order, offering clients the freedom to customise fabrics, sizes, and finishes while maintaining a premium yet accessible price point.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Our mission is to deliver stylish, durable furniture with exceptional value, supported by personalised service, free delivery, and thoughtful extras that enhance the customer experience.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section - Kept EXACTLY as original */}
        <section className="py-16 md:py-24 bg-muted">
          <div className="container mx-auto px-4">
            <h2 className="font-display text-3xl font-semibold text-foreground text-center mb-12">
              What We Stand For
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <div
                  key={value.title}
                  className="text-center animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <value.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                    {value.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default About;