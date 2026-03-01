import { Heart, Shield, Users } from "lucide-react";
import youngFamilyImage from "@/assets/young-family.jpg";

const benefits = [
  {
    icon: Heart,
    title: "Fair, Manageable Payments",
    description:
      "We work with you to create payment schedules that fit your budget. No surprises, no hidden fees—just clear, affordable terms.",
  },
  {
    icon: Users,
    title: "Respectful, Human Service",
    description:
      "You're not just a number to us. Our team treats every customer with dignity, understanding that everyone's situation is unique.",
  },
  {
    icon: Shield,
    title: "Transparent Process",
    description:
      "We explain everything upfront so you always know what to expect. Honest communication is the foundation of our business.",
  },
];

const TrustSection = () => {
  return (
    <section id="about" className="py-24 section-light">
      <div className="container-wide">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-serif text-foreground mb-6">
            Your Family Deserves Financial Peace of Mind
          </h2>
          <p className="text-lg text-muted-foreground">
            Fox Finance strives to be the premier non-bank lender of consumer installment loans in our community. We conduct our business with integrity, honesty, and treat our customers with dignity and respect.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {benefits.map((benefit, index) => (
            <div
              key={benefit.title}
              className="card-trust text-center animate-fade-in"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-accent/10 flex items-center justify-center">
                <benefit.icon className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-serif font-semibold text-foreground mb-3">
                {benefit.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>

        {/* Image & Text Block */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="rounded-2xl overflow-hidden shadow-card">
            <img
              src={youngFamilyImage}
              alt="Young family reviewing financial documents together"
              className="w-full h-auto object-cover"
            />
          </div>
          <div>
            <h3 className="text-2xl md:text-3xl font-serif text-foreground mb-6">
              We're Here to Help, Not Judge
            </h3>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              At Fox Finance, we understand that financial challenges can happen to anyone. Whether you're facing an unexpected expense, need to consolidate bills, or are simply looking for a path forward—we're here to help.
            </p>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Our team takes the time to understand your situation and work with you to find a solution that makes sense. We believe in second chances and building lasting relationships with the families we serve.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#contact" className="btn-primary">
                Contact Us
              </a>
              <a href="#services" className="btn-secondary">
                Learn More
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
