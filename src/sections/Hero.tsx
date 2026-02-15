import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Image, Signature, FileText, MapPin, CheckCircle } from 'lucide-react';

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.querySelector(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative w-full min-h-screen flex items-center justify-center pt-20"
      style={{
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        zIndex: 10
      }}
    >
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234a5568' fill-opacity='0.08'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Welcome Section */}
          <div 
            className={`text-center mb-12 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full mb-6 shadow-sm">
              <MapPin className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-gray-700">बस्ती, उत्तर प्रदेश</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              <span className="text-blue-600">Khan Jan Seva Kendra</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed mb-2">
              Welcome to <strong>Khan Jan Seva Kendra</strong>, your go-to digital services hub in Basti!
            </p>
            
            <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              हम 100+ सेवाएँ प्रदान करते हैं जिनमें बैंकिंग, यात्रा बुकिंग, बिजली/पानी के बिल भुगतान,
              मतदाता पहचान पत्र, पैन, आधार कार्ड सेवाएँ और बहुत कुछ शामिल है।
            </p>
          </div>

          {/* Main Content Card */}
          <div 
            className={`bg-white rounded-3xl shadow-xl overflow-hidden transition-all duration-700 delay-200 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            <div className="flex flex-col lg:flex-row">
              {/* Left - Tools Info */}
              <div className="flex-1 p-6 sm:p-8 lg:p-10">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                  Sarkari forms ke liye photo, signature, aur documents — bilkul sahi size mein.
                </h2>
                
                <p className="text-base text-gray-600 leading-relaxed mb-6">
                  Free tools for NEET, SSC, UPSC, RRB, PAN, Passport, and more. 
                  No upload to server; your files stay on your device.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                  <Button
                    size="lg"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-5 text-base font-semibold rounded-xl transition-all hover:scale-[1.02]"
                    onClick={() => scrollToSection('#trending')}
                  >
                    Browse Tools
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-5 text-base font-semibold rounded-xl transition-all"
                    onClick={() => scrollToSection('#exams')}
                  >
                    View Exam Guides
                  </Button>
                </div>

                {/* Quick Tools */}
                <div className="flex flex-wrap gap-2">
                  {[
                    { icon: Image, label: 'Photo Resize' },
                    { icon: Signature, label: 'Signature Fix' },
                    { icon: FileText, label: 'Image to PDF' },
                  ].map((tool, i) => (
                    <button 
                      key={i}
                      onClick={() => scrollToSection('#utilities')}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm font-medium text-gray-700 transition-colors"
                    >
                      <tool.icon className="w-4 h-4" />
                      {tool.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Right - Vision & Mission */}
              <div className="flex-1 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 sm:p-8 lg:p-10">
                <div className="space-y-6">
                  {/* Vision */}
                  <div className="bg-white rounded-2xl p-5 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-blue-600" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900">Vision (उद्देश्य)</h3>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed mb-2">
                      To be the leading provider of essential services in Basti.
                    </p>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      हमारा उद्देश्य है कि हर व्यक्ति को सभी सेवाएँ आसानी और पारदर्शिता के साथ मिलें।
                    </p>
                  </div>

                  {/* Mission */}
                  <div className="bg-white rounded-2xl p-5 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900">Mission (मिशन)</h3>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed mb-2">
                      To empower communities by making services accessible, affordable, and reliable.
                    </p>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      हमारा मिशन है लोगों को डिजिटल सेवाओं से जोड़ना और उनके जीवन को सरल बनाना।
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
