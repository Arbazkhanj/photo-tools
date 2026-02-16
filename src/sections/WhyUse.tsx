import { useEffect, useRef, useState } from 'react';
import { Shield, Settings, Check } from 'lucide-react';

const features = [
  {
    icon: <Shield className="w-8 h-8" />,
    title: 'Client-Side Privacy',
    description: 'Your photos and signatures are processed locally in your browser. We never upload or store your personal documents on our servers. It is 100% safe and secure.',
    points: [
      'No server uploads',
      'Files stay on your device',
      '100% secure processing'
    ]
  },
  {
    icon: <Settings className="w-8 h-8" />,
    title: 'Preset for Success',
    description: "Don't know pixels or DPI? No problem. Our tools come with built-in settings for all major exams and government services.",
    points: [
      'NEET: 4×6 inch Postcard ratios',
      'NSDL PAN: 200 DPI calibration',
      'SSC: 10-20KB signatures',
      'India Post GDS: 5:2 & 4:5 ratios',
      'RRB: Forced 30KB minimum'
    ]
  }
];

const WhyUse = () => {
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
      className="relative w-full py-16 lg:py-24 bg-gradient-to-b from-white to-gray-50"
      style={{ zIndex: 50 }}
    >
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* Section Header */}
        <div 
          className={`mb-10 lg:mb-14 text-center transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
            Why use Khan Jan Seva Kendra?
          </h2>
          <p className="text-base lg:text-lg text-gray-600 max-w-2xl mx-auto">
            Applying for government jobs and documents is stressful enough without worrying about form rejections.
          </p>
        </div>

        {/* Feature Blocks */}
        <div className="space-y-6 lg:space-y-8 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`bg-white rounded-2xl lg:rounded-3xl p-6 lg:p-10 flex flex-col lg:flex-row gap-6 lg:gap-10 items-start border border-gray-100 shadow-sm hover:shadow-md transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-x-0' : 'opacity-0'
              } ${index === 0 ? (isVisible ? '' : '-translate-x-24') : (isVisible ? '' : 'translate-x-24')}`}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              {/* Icon */}
              <div className="flex-shrink-0 w-16 h-16 lg:w-20 lg:h-20 bg-blue-600 rounded-2xl flex items-center justify-center text-white">
                {feature.icon}
              </div>

              {/* Content */}
              <div className="flex-1">
                <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-base text-gray-600 leading-relaxed mb-4 lg:mb-5">
                  {feature.description}
                </p>

                {/* Points */}
                <ul className="space-y-2">
                  {feature.points.map((point, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm lg:text-base text-gray-700">
                      <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyUse;
