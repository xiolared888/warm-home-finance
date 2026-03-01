import { CheckCircle } from "lucide-react";
import multigenerationalImage from "@/assets/multigenerational-family.jpg";

const loanFeatures = [
  "Loan amounts from $200 to $5,000",
  "Minimum of 4 equal payments over at least 120 days",
  "Flexible bi-weekly or monthly payment options",
  "Terms tailored to your individual circumstances",
  "Clear, upfront terms with no hidden fees",
  "Quick application process—we respond as soon as possible",
];

const ServicesSection = () => {
  return (
    <section id="services" className="py-24 section-blue">
      <div className="container-wide">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-serif text-foreground mb-6">
            Installment Loans Built Around Your Needs
          </h2>
          <p className="text-lg text-muted-foreground">
            Our installment loans are designed to be manageable and fair. We work with you to break payments into affordable amounts that fit your life.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Features Card */}
          <div className="card-trust">
            <h3 className="text-2xl font-serif text-foreground mb-6">
              How Our Loans Work
            </h3>
            <ul className="space-y-4 mb-8">
              {loanFeatures.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>
            <div className="p-4 bg-muted rounded-xl">
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">Please note:</strong> We do not accept walk-ins. Simply fill out our online application and we will respond as quickly as possible.
              </p>
            </div>
            <div className="mt-8">
              <a href="#contact" className="btn-primary">
                Contact Us
              </a>
            </div>
          </div>

          {/* Image */}
          <div className="rounded-2xl overflow-hidden shadow-card">
            <img
              src={multigenerationalImage}
              alt="Multigenerational family enjoying time together"
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
