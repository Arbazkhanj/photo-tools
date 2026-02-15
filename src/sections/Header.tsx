import { useState, useEffect } from 'react';
import { Menu, X, Globe, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/services' },
    { label: 'Crop Resizer', href: '/crop-resizer' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };



  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-md'
          : 'bg-transparent'
      }`}
    >
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-2 group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <span className="text-white font-bold text-lg">KJ</span>
            </div>
            <span className="font-bold text-gray-900 text-lg hidden sm:block">
              Khan Jan Seva Kendra
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className={`px-4 py-2 rounded-lg transition-all text-sm font-medium ${
                  isActive(link.href)
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2 lg:gap-3">
            <Button
              variant="outline"
              size="sm"
              className="hidden sm:flex items-center gap-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Support</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="hidden md:flex items-center gap-2 text-gray-600 hover:text-blue-600"
            >
              <Globe className="w-4 h-4" />
              <span>EN / हिन्दी</span>
            </Button>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-900" />
              ) : (
                <Menu className="w-6 h-6 text-gray-900" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg">
          <nav className="flex flex-col p-4 gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className={`px-4 py-3 rounded-lg transition-all text-base font-medium ${
                  isActive(link.href)
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-100">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 items-center gap-2 border-blue-600 text-blue-600"
              >
                <HelpCircle className="w-4 h-4" />
                <span>Support</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 text-gray-600"
              >
                <Globe className="w-4 h-4" />
                <span>EN</span>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
