import olderCoupleImage from "@/assets/older-couple.jpg";

const CTASection = () => {
  return (
    <section
      className="relative py-24 parallax-bg"
      style={{ backgroundImage: `url(${olderCoupleImage})` }}
    >
      {/* Overlay with warm tint */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/85 to-primary/70" />

      {/* Content */}
      <div className="relative z-10 container-wide text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-serif text-white mb-6">
            Ready to Take the Next Step?
          </h2>
          <p className="text-lg text-white/90 mb-8">
            Whether you're ready to apply or just have questions, we're here for you. Our team is committed to providing friendly, respectful service every step of the way.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#contact" className="btn-primary">
              Apply Now
            </a>
            <a href="#contact" className="btn-outline">
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
