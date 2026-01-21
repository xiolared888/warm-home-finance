const MapSection = () => {
  return (
    <section className="py-16 section-light">
      <div className="container-wide">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif text-foreground mb-4">
            Find Us
          </h2>
          <p className="text-muted-foreground">
            Located in downtown Saint Louis, MO
          </p>
        </div>

        {/* Map Container */}
        <div className="rounded-2xl overflow-hidden shadow-card border border-border">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3116.1234567890123!2d-90.1934!3d38.6270!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x87d8b4a9f5e4c3b1%3A0x1234567890abcdef!2s400%20N%204th%20St%2C%20St.%20Louis%2C%20MO%2063102!5e0!3m2!1sen!2sus!4v1234567890123"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Fox Finance Location"
            className="w-full"
          />
        </div>
      </div>
    </section>
  );
};

export default MapSection;
