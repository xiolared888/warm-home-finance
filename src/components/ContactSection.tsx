import { useState } from "react";
import { Send, User, Mail, Phone, MessageSquare } from "lucide-react";

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form submission logic would go here
    console.log("Form submitted:", formData);
    alert("Thank you for your message! We'll be in touch soon.");
    setFormData({ name: "", email: "", phone: "", message: "" });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section id="contact" className="py-24 section-cream">
      <div className="container-wide">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Form Side */}
          <div>
            <h2 className="text-3xl md:text-4xl font-serif text-foreground mb-4">
              Have Questions? We're Here to Help
            </h2>
            <p className="text-muted-foreground mb-8">
              Fill out the form below and a member of our team will get back to you as soon as possible. We look forward to hearing from you.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-4 rounded-xl border border-border bg-white focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
                />
              </div>

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-4 rounded-xl border border-border bg-white focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
                />
              </div>

              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-4 rounded-xl border border-border bg-white focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
                />
              </div>

              <div className="relative">
                <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-muted-foreground" />
                <textarea
                  name="message"
                  placeholder="Your Message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full pl-12 pr-4 py-4 rounded-xl border border-border bg-white focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent resize-none"
                />
              </div>

              <button
                type="submit"
                className="btn-primary w-full sm:w-auto flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                Send Message
              </button>
            </form>
          </div>

          {/* Info Side */}
          <div className="lg:pl-8">
            <div className="card-trust h-full">
              <h3 className="text-2xl font-serif text-foreground mb-6">
                Get in Touch
              </h3>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">
                    Office Address
                  </h4>
                  <p className="text-muted-foreground">
                    400 North 4th Street, Ste 712<br />
                    Saint Louis, MO 63102
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-2">Phone</h4>
                  <a
                    href="tel:3144365600"
                    className="text-primary hover:text-accent transition-colors"
                  >
                    (314) 436-5600
                  </a>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-2">Email</h4>
                  <a
                    href="mailto:loans@foxfinance.net"
                    className="text-primary hover:text-accent transition-colors"
                  >
                    loans@foxfinance.net
                  </a>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-2">
                    Business Hours
                  </h4>
                  <p className="text-muted-foreground">
                    Monday – Friday: 10:00am – 5:00pm<br />
                    Saturday: 10:00am – 1:00pm<br />
                    Sunday: Closed
                  </p>
                </div>

                <div className="pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-foreground">Please note:</strong> We do not accept walk-ins. Please fill out an online application and we will respond as quickly as possible.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
