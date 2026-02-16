import { useState, useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Header from './sections/Header';
import Hero from './sections/Hero';
import TrendingTools from './sections/TrendingTools';
import ExamTools from './sections/ExamTools';
import GeneralUtilities from './sections/GeneralUtilities';
import WhyUse from './sections/WhyUse';
import HowItWorks from './sections/HowItWorks';
import Testimonials from './sections/Testimonials';
import FAQ from './sections/FAQ';
import Footer from './sections/Footer';
import PhotoResizer from './tools/PhotoResizer';
import ImageToPDF from './tools/ImageToPDF';
import SignatureBGRemover from './tools/SignatureBGRemover';
import AgeCalculator from './tools/AgeCalculator';
import PhotoTextOverlay from './tools/PhotoTextOverlay';
import CropResizerPage from './CropResizerPage';
import './App.css';

// Home Page Component
const HomePage = ({ onOpenTool }: { onOpenTool: (tool: string, config?: any) => void }) => (
  <>
    <Hero />
    <TrendingTools onOpenTool={onOpenTool} />
    <ExamTools onOpenTool={onOpenTool} />
    <GeneralUtilities onOpenTool={onOpenTool} />
    <WhyUse />
    <HowItWorks />
    <Testimonials />
    <FAQ />
  </>
);

// Services Page Component
const ServicesPage = () => (
  <div className="min-h-screen pt-20">
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Our Services</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-3">📋 Document Services</h3>
          <ul className="text-gray-600 space-y-2">
            <li>• PAN Card Services</li>
            <li>• Aadhaar Card Update</li>
            <li>• Voter ID Registration</li>
            <li>• Passport Application</li>
            <li>• Ration Card Services</li>
          </ul>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-3">💰 Banking Services</h3>
          <ul className="text-gray-600 space-y-2">
            <li>• Money Transfer</li>
            <li>• Account Opening</li>
            <li>• Loan Applications</li>
            <li>• Insurance Services</li>
            <li>• Fixed Deposits</li>
          </ul>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-3">💡 Utility Bill Payments</h3>
          <ul className="text-gray-600 space-y-2">
            <li>• Electricity Bill</li>
            <li>• Water Bill</li>
            <li>• Gas Bill</li>
            <li>• Mobile Recharge</li>
            <li>• DTH Recharge</li>
          </ul>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-3">🎓 Education & Jobs</h3>
          <ul className="text-gray-600 space-y-2">
            <li>• Exam Form Filling</li>
            <li>• Photo Resizing</li>
            <li>• Document Correction</li>
            <li>• Scholarship Forms</li>
            <li>• Job Applications</li>
          </ul>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-3">🚌 Travel Booking</h3>
          <ul className="text-gray-600 space-y-2">
            <li>• Train Ticket Booking</li>
            <li>• Bus Ticket Booking</li>
            <li>• Flight Booking</li>
            <li>• Hotel Reservation</li>
            <li>• Tour Packages</li>
          </ul>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-3">🔧 Other Services</h3>
          <ul className="text-gray-600 space-y-2">
            <li>• Typing Work</li>
            <li>• Xerox/Printout</li>
            <li>• Lamination</li>
            <li>• Document Scanning</li>
            <li>• Cyber Cafe</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

// About Page Component
const AboutPage = () => (
  <div className="min-h-screen pt-20">
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">About Us</h1>
      <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Khan Jan Seva Kendra</h2>
        <p className="text-gray-600 mb-4 leading-relaxed">
          Welcome to Khan Jan Seva Kendra, your trusted digital services partner in Basti, Uttar Pradesh. 
          We provide 100+ government and digital services to help you with all your documentation and 
          official work needs.
        </p>
        <p className="text-gray-600 mb-4 leading-relaxed">
          Our mission is to make essential services accessible, affordable, and hassle-free for everyone. 
          Whether you need help with government forms, bill payments, or travel bookings, we're here to help.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="text-center p-4 bg-blue-50 rounded-xl">
            <div className="text-3xl font-bold text-blue-600 mb-2">100+</div>
            <div className="text-gray-600">Services</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-xl">
            <div className="text-3xl font-bold text-green-600 mb-2">5000+</div>
            <div className="text-gray-600">Happy Customers</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-xl">
            <div className="text-3xl font-bold text-purple-600 mb-2">5+</div>
            <div className="text-gray-600">Years Experience</div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Vision & Mission</h3>
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-blue-600 font-bold">V</span>
            </div>
            <div>
              <h4 className="font-bold text-gray-900">Vision</h4>
              <p className="text-gray-600">To be the leading provider of essential services in Basti.</p>
              <p className="text-gray-700 text-sm mt-1">हमारा उद्देश्य है कि हर व्यक्ति को सभी सेवाएँ आसानी और पारदर्शिता के साथ मिलें।</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-green-600 font-bold">M</span>
            </div>
            <div>
              <h4 className="font-bold text-gray-900">Mission</h4>
              <p className="text-gray-600">To empower communities by making services accessible, affordable, and reliable.</p>
              <p className="text-gray-700 text-sm mt-1">हमारा मिशन है लोगों को डिजिटल सेवाओं से जोड़ना और उनके जीवन को सरल बनाना।</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Contact Page Component
const ContactPage = () => (
  <div className="min-h-screen pt-20">
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Contact Us</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Get in Touch</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">📍</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Address</p>
                <p className="text-gray-600">Khan Jan Seva Kendra, Basti, Uttar Pradesh, India</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">📞</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Phone</p>
                <p className="text-gray-600">+91 XXXXX XXXXX</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">✉️</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Email</p>
                <p className="text-gray-600">support@khanjansevakendra.com</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🕐</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Working Hours</p>
                <p className="text-gray-600">Mon - Sat: 9:00 AM - 6:00 PM</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Send Message</h3>
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Your name" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Your email" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea rows={4} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Your message"></textarea>
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
);

function App() {
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [toolConfig, setToolConfig] = useState<any>(null);
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Smooth scroll for anchor links
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a[href^="#"]');
      if (anchor) {
        const href = anchor.getAttribute('href');
        if (href && href !== '#') {
          e.preventDefault();
          const element = document.querySelector(href);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);
    return () => document.removeEventListener('click', handleAnchorClick);
  }, []);

  const handleOpenTool = (tool: string, config?: any) => {
    setActiveTool(tool);
    setToolConfig(config);
  };

  const handleCloseTool = () => {
    setActiveTool(null);
    setToolConfig(null);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <Routes>
        <Route path="/" element={<HomePage onOpenTool={handleOpenTool} />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/crop-resizer" element={<CropResizerPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      
      <Footer />
      
      {/* Tools Modal - works on all pages */}
      {activeTool === 'photo-resizer' && (
        <PhotoResizer 
          onClose={handleCloseTool}
          title={toolConfig?.title || 'Photo Resizer'}
          defaultWidth={toolConfig?.width || 350}
          defaultHeight={toolConfig?.height || 350}
          defaultMaxKB={toolConfig?.maxKB || 50}
          aspectRatio={toolConfig?.aspectRatio || null}
          minKB={toolConfig?.minKB || 0}
        />
      )}

      {activeTool === 'image-to-pdf' && (
        <ImageToPDF 
          onClose={handleCloseTool}
          title={toolConfig?.title || 'Image to PDF'}
          defaultMaxKB={toolConfig?.maxKB || 200}
        />
      )}

      {activeTool === 'signature-bg-remover' && (
        <SignatureBGRemover 
          onClose={handleCloseTool}
          title={toolConfig?.title || 'Signature Background Remover'}
        />
      )}

      {activeTool === 'age-calculator' && (
        <AgeCalculator 
          onClose={handleCloseTool}
          title={toolConfig?.title || 'Age Calculator'}
        />
      )}

      {activeTool === 'photo-text-overlay' && (
        <PhotoTextOverlay 
          onClose={handleCloseTool}
          title={toolConfig?.title || 'Add Name & Date on Photo'}
        />
      )}
    </div>
  );
}

export default App;
