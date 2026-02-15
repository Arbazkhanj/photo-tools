import { useEffect, useRef, useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

const faqs = [
  {
    question: 'How do I resize a 4×6 postcard photo for NEET?',
    answer: 'Use our NEET Document Resizer. It automatically sets the correct aspect ratio for 4×6 postcard photos and ensures the file size stays within the official 50KB – 300KB range. Just upload your photo, and the tool will guide you through the process.'
  },
  {
    question: 'How do I resize a photo for NSDL PAN Card?',
    answer: 'Use our NSDL PAN Photo Resizer. It automatically sets the dimensions to 3.5×2.5 cm and ensures the resolution meets the 200 DPI standard while keeping the file under 50KB. The tool is specifically calibrated for Protean PAN applications.'
  },
  {
    question: 'Why is my India Post photo rejected?',
    answer: 'India Post requires a strict 4:5 Aspect Ratio for GDS photos. Use our GDS Photo Resizer to crop it correctly and ensure it is between 30KB-50KB. The most common rejection reasons are incorrect aspect ratio and file size issues.'
  },
  {
    question: 'How can I fix the "Signature size should be at least 30KB" error in RRB?',
    answer: 'This error is common because small crops lead to small file sizes. Use our specialized RRB Signature Resizer which forcefully increases the JPG data to stay above 30KB while maintaining the required 140×60 pixel dimensions.'
  },
  {
    question: 'Is my data uploaded to any server?',
    answer: 'No. All processing happens locally in your browser using client-side JavaScript. Your photos and signatures never leave your device, ensuring complete privacy and security. We do not store or transmit any of your personal documents.'
  }
];

const FAQ = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
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

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      ref={sectionRef}
      id="faq"
      className="relative w-full py-16 lg:py-24 bg-white"
      style={{ zIndex: 80 }}
    >
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* Section Header */}
        <div 
          className={`mb-10 lg:mb-14 text-center transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="inline-flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full mb-4">
            <HelpCircle className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">
              FAQ
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
            Frequently Asked Questions
          </h2>
          <p className="text-base lg:text-lg text-gray-600 max-w-2xl mx-auto">
            Got questions? We've got answers.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto space-y-3 lg:space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`bg-gray-50 rounded-xl lg:rounded-2xl overflow-hidden border border-gray-100 transition-all duration-500 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: `${index * 60}ms` }}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between p-4 lg:p-6 text-left hover:bg-white transition-colors"
              >
                <span className="text-base lg:text-lg font-semibold text-gray-900 pr-4">
                  {faq.question}
                </span>
                <ChevronDown 
                  className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              
              <div 
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <p className="px-4 lg:px-6 pb-4 lg:pb-6 text-sm lg:text-base text-gray-600 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
