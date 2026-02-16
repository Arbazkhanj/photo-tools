import { useEffect, useRef, useState } from 'react';
import { MousePointer, Upload, Download } from 'lucide-react';

const steps = [
  {
    number: '01',
    title: 'Choose your tool',
    description: 'Pick an exam or utility. Everything is pre-configured with the correct sizes and ratios.',
    icon: <MousePointer className="w-6 h-6" />
  },
  {
    number: '02',
    title: 'Upload & adjust',
    description: 'Crop, rotate, or compress. Preview your document before downloading to ensure it meets requirements.',
    icon: <Upload className="w-6 h-6" />
  },
  {
    number: '03',
    title: 'Download & use',
    description: 'Get the exact size and KB limit—ready to upload to your government portal.',
    icon: <Download className="w-6 h-6" />
  }
];

const HowItWorks = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

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
    <section
      ref={sectionRef}
      className="relative w-full py-16 lg:py-24 bg-white"
      style={{ zIndex: 60 }}
    >
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* Section Header */}
        <div 
          className={`mb-10 lg:mb-14 text-center transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`}
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
            How it works
          </h2>
          <p className="text-base lg:text-lg text-gray-600 max-w-2xl mx-auto">
            Three simple steps to get your documents ready for any government form.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`relative bg-gray-50 rounded-2xl lg:rounded-3xl p-6 lg:p-8 text-center group hover:bg-white hover:shadow-lg border border-transparent hover:border-gray-100 transition-all duration-500 ${
                isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-7 scale-[0.98]'
              }`}
              style={{ transitionDelay: `${index * 120}ms` }}
            >
              {/* Step Number */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                {step.number}
              </div>

              {/* Icon */}
              <div className="mt-6 mb-4 w-14 h-14 bg-white rounded-xl flex items-center justify-center text-blue-600 mx-auto group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-sm">
                {step.icon}
              </div>

              {/* Content */}
              <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-2">
                {step.title}
              </h3>
              <p className="text-sm lg:text-base text-gray-600 leading-relaxed">
                {step.description}
              </p>

              {/* Connector line (hidden on mobile and last item) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-[2px] bg-gray-200">
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-blue-600 rounded-full" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
