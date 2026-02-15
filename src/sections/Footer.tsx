import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Mail, Phone, MapPin } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const footerLinks = {
  services: [
    { label: 'Document Services', href: '/services' },
    { label: 'Banking Services', href: '/services' },
    { label: 'Bill Payments', href: '/services' },
    { label: 'Travel Booking', href: '/services' },
  ],
  tools: [
    { label: 'Photo Resizer', href: '/#utilities' },
    { label: 'Image to PDF', href: '/#utilities' },
    { label: 'Signature BG Remover', href: '/#utilities' },
    { label: 'Age Calculator', href: '/#utilities' },
  ],
  company: [
    { label: 'About Us', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'Services', href: '/services' },
  ],
  support: [
    { label: 'Help Center', href: '#' },
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms & Conditions', href: '#' }
  ]
};

const Footer = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -10% 0px' }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <footer
      ref={sectionRef}
      className="relative w-full bg-gray-900 text-white"
      style={{ zIndex: 90 }}
    >
      {/* CTA Section */}
      <div 
        className={`w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-16 lg:py-20 border-b border-gray-800 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
        }`}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
            Need help with documents?
          </h2>
          <p className="text-base lg:text-lg text-gray-400 mb-8">
            Visit our center in Basti or use our free online tools.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-base font-semibold rounded-xl transition-all hover:scale-[1.02]"
              onClick={() => navigate('/services')}
            >
              Our Services
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-gray-600 text-white hover:bg-gray-800 px-8 py-6 text-base font-semibold rounded-xl transition-all"
              onClick={() => navigate('/crop-resizer')}
            >
              Free Tools
            </Button>
          </div>
        </div>
      </div>

      {/* Footer Links */}
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12 max-w-6xl mx-auto">
          {/* Brand Column */}
          <div 
            className={`col-span-2 md:col-span-4 lg:col-span-1 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ transitionDelay: '100ms' }}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">KJ</span>
              </div>
              <span className="font-bold text-lg">Khan Jan Seva Kendra</span>
            </div>
            <p className="text-sm text-gray-400 mb-4 leading-relaxed">
              Your trusted digital services partner in Basti, Uttar Pradesh.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Mail className="w-4 h-4" />
                <span>support@khanjanseva.com</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Phone className="w-4 h-4" />
                <span>+91 XXXXX XXXXX</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <MapPin className="w-4 h-4" />
                <span>Basti, Uttar Pradesh</span>
              </div>
            </div>
          </div>

          {/* Services Column */}
          <div 
            className={`transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ transitionDelay: '200ms' }}
          >
            <h4 className="font-semibold text-base mb-4">Services</h4>
            <ul className="space-y-2">
              {footerLinks.services.map((link, i) => (
                <li key={i}>
                  <Link to={link.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tools Column */}
          <div 
            className={`transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ transitionDelay: '300ms' }}
          >
            <h4 className="font-semibold text-base mb-4">Free Tools</h4>
            <ul className="space-y-2">
              {footerLinks.tools.map((link, i) => (
                <li key={i}>
                  <Link to={link.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column */}
          <div 
            className={`transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ transitionDelay: '400ms' }}
          >
            <h4 className="font-semibold text-base mb-4">Company</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link, i) => (
                <li key={i}>
                  <Link to={link.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Column */}
          <div 
            className={`transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ transitionDelay: '500ms' }}
          >
            <h4 className="font-semibold text-base mb-4">Support</h4>
            <ul className="space-y-2">
              {footerLinks.support.map((link, i) => (
                <li key={i}>
                  <Link to={link.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Disclaimer & Copyright */}
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-6 border-t border-gray-800">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs text-gray-500 text-center mb-3 leading-relaxed">
            Disclaimer: Khan Jan Seva Kendra is an independent service provider. 
            We are not affiliated with any Government organization. 
            Users are advised to check official notifications before uploading documents.
          </p>
          <p className="text-xs text-gray-500 text-center">
            © {new Date().getFullYear()} Khan Jan Seva Kendra. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
