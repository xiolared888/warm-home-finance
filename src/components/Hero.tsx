import heroImage from "@/assets/hero-family.jpg";

const Hero = () => {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center parallax-bg"
      style={{ backgroundImage: `url(${heroImage})` }}
    >
      {/* Overlay */}
      <div className="parallax-overlay" />

      {/* Content */}
      <div className="relative z-10 container-wide pt-20">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white leading-tight mb-6 animate-fade-in">
            Financial Confidence for Your Family's Future
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-xl animate-fade-in" style={{ animationDelay: "0.2s" }}>
            We understand that life happens. Fox Finance offers straightforward installment loans with fair terms and personal service you can trust.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <a href="#contact" className="btn-primary">
              Apply Now
            </a>
            <a href="#contact" className="btn-outline">
              Contact Us
            </a>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-8 h-12 rounded-full border-2 border-white/50 flex items-start justify-center p-2">
          <div className="w-1.5 h-3 bg-white/70 rounded-full" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
