import { useEffect, useRef, useState } from 'react';
import { Quote, Star } from 'lucide-react';

const testimonials = [
  {
    quote: "I used to get rejected for 'aspect ratio' errors. This tool fixed my India Post GDS photo in one try.",
    name: 'Ravi Kumar',
    location: 'Bihar',
    rating: 5
  },
  {
    quote: "NEET document resizer saved me hours. The 4×6 postcard setting is perfect and exactly what NTA requires.",
    name: 'Ananya Sharma',
    location: 'Rajasthan',
    rating: 5
  },
  {
    quote: "Finally a tool that keeps files on my device. Safe, fast, and no worries about privacy.",
    name: 'Mohammed Asif',
    location: 'Uttar Pradesh',
    rating: 5
  }
];

const Testimonials = () => {
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
      className="relative w-full py-16 lg:py-24 bg-gradient-to-b from-gray-50 to-white"
      style={{ zIndex: 70 }}
    >
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* Section Header */}
        <div 
          className={`mb-10 lg:mb-14 text-center transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`}
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
            What users say
          </h2>
          <p className="text-base lg:text-lg text-gray-600 max-w-2xl mx-auto">
            Trusted by thousands of students and job seekers across India.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`bg-white rounded-2xl lg:rounded-3xl p-6 lg:p-8 relative border border-gray-100 hover:shadow-md transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Quote Icon */}
              <div className="absolute top-4 right-4 w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
                <Quote className="w-5 h-5 text-blue-600" />
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-base lg:text-lg text-gray-700 leading-relaxed mb-6">
                "{testimonial.quote}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">
                    {testimonial.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {testimonial.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
