import { useState, useRef, useEffect } from "react";
import { Menu, X, Phone, ChevronDown } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinks = [
    { name: "Home", href: isHome ? "#home" : "/", isRoute: !isHome },
    { name: "About", href: isHome ? "#about" : "/#about", isRoute: !isHome },
    { name: "Our Team", href: "#team" },
    { name: "Blog", href: "#blog" },
    { name: "Contact Us", href: isHome ? "#contact" : "/#contact", isRoute: !isHome },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-soft">
      <div className="container-wide">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-serif font-bold text-primary">
              Fox Finance
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) =>
              link.isRoute ? (
                <Link
                  key={link.name}
                  to={link.href}
                  className="text-foreground/80 hover:text-primary font-medium transition-colors"
                >
                  {link.name}
                </Link>
              ) : (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-foreground/80 hover:text-primary font-medium transition-colors"
                >
                  {link.name}
                </a>
              )
            )}
          </nav>

          {/* CTA & Phone & User Dropdown */}
          <div className="hidden md:flex items-center gap-6">
            <a
              href="tel:3144365600"
              className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span className="font-medium">(314) 436-5600</span>
            </a>
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-1.5 text-foreground/80 hover:text-primary font-medium transition-colors text-sm"
              >
                User
                <ChevronDown className={`w-4 h-4 transition-transform ${userDropdownOpen ? "rotate-180" : ""}`} />
              </button>
              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-popover border border-border rounded-lg shadow-lg z-50 py-1">
                  <button
                    onClick={() => { setUserDropdownOpen(false); navigate("/"); }}
                    className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                  >
                    Applicant
                  </button>
                  <button
                    onClick={() => { setUserDropdownOpen(false); navigate("/admin/login"); }}
                    className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                  >
                    Admin
                  </button>
                </div>
              )}
            </div>
            <a href="#contact" className="btn-primary text-sm py-3 px-6">
              Contact Us
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border animate-fade-in">
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) =>
                link.isRoute ? (
                  <Link
                    key={link.name}
                    to={link.href}
                    className="text-foreground/80 hover:text-primary font-medium py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ) : (
                  <a
                    key={link.name}
                    href={link.href}
                    className="text-foreground/80 hover:text-primary font-medium py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.name}
                  </a>
                )
              )}
              <a
                href="tel:3144365600"
                className="flex items-center gap-2 text-muted-foreground py-2"
              >
                <Phone className="w-4 h-4" />
                <span>(314) 436-5600</span>
              </a>
              <a
                href="#contact"
                className="btn-primary text-center mt-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact Us
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
