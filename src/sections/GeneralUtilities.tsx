import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Wrench, Star, Sparkles, ThumbsUp } from 'lucide-react';

interface Utility {
  id: number;
  title: string;
  description: string;
  badge?: string;
  badgeIcon?: React.ReactNode;
  badgeColor?: string;
  image: string;
  toolType: string;
  toolConfig: {
    width?: number;
    height?: number;
    maxKB?: number;
    aspectRatio?: number | null;
    minKB?: number;
  };
}

const utilities: Utility[] = [
  {
    id: 1,
    title: 'Image to PDF (Fixed Size)',
    description: 'Convert photos to PDF under 100KB, 200KB, or 500KB. Combine multiple images into one file.',
    badge: 'Popular',
    badgeIcon: <Star className="w-3 h-3" />,
    badgeColor: 'bg-amber-500',
    image: '/images/thumb_image_to_pdf.jpg',
    toolType: 'image-to-pdf',
    toolConfig: { maxKB: 200 }
  },
  {
    id: 2,
    title: 'Add Name & Date on Photo',
    description: 'Auto-print Name and Date of Photo (DOP) on passport photos for SSC & Railways.',
    badge: 'New',
    badgeIcon: <Sparkles className="w-3 h-3" />,
    badgeColor: 'bg-green-500',
    image: '/images/thumb_name_date.jpg',
    toolType: 'photo-text-overlay',
    toolConfig: {}
  },
  {
    id: 3,
    title: 'Compress Image to 20KB, 50KB, 100KB',
    description: 'Quickly reduce image size to under 20KB, 50KB or 100KB for online forms.',
    image: '/images/thumb_compress.jpg',
    toolType: 'photo-resizer',
    toolConfig: { width: 800, height: 1000, maxKB: 100, aspectRatio: null }
  },
  {
    id: 4,
    title: 'Passport Photo Maker',
    description: 'Crop any image to standard 3.5cm x 4.5cm passport size. Compress to 50KB.',
    image: '/images/thumb_passport.jpg',
    toolType: 'photo-resizer',
    toolConfig: { width: 350, height: 450, maxKB: 50, aspectRatio: 3.5/4.5 }
  },
  {
    id: 5,
    title: 'Age Calculator',
    description: 'Check your exact Age (Years, Months, Days) for Exam Eligibility.',
    badge: 'Useful',
    badgeIcon: <ThumbsUp className="w-3 h-3" />,
    badgeColor: 'bg-blue-600',
    image: '/images/thumb_age_calc.jpg',
    toolType: 'age-calculator',
    toolConfig: {}
  },
  {
    id: 6,
    title: 'Signature Background Remover',
    description: 'Make signature transparent for forms that require clean uploads. Removes white background.',
    badge: 'New',
    badgeIcon: <Sparkles className="w-3 h-3" />,
    badgeColor: 'bg-purple-500',
    image: '/images/thumb_bg_remove.jpg',
    toolType: 'signature-bg-remover',
    toolConfig: {}
  }
];

interface GeneralUtilitiesProps {
  onOpenTool: (tool: string, config?: any) => void;
}

const GeneralUtilities = ({ onOpenTool }: GeneralUtilitiesProps) => {
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
    <section ref={sectionRef} id="utilities" className="relative w-full py-16 lg:py-24 bg-white" style={{ zIndex: 40 }}>
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className={`mb-10 lg:mb-14 text-center transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
          <div className="inline-flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full mb-4">
            <Wrench className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Utilities</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">General Utilities</h2>
          <p className="text-base lg:text-lg text-gray-600 max-w-xl mx-auto">Quick helpers for documents, images, and everyday tasks.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {utilities.map((utility, index) => (
            <div key={utility.id} className={`group bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all duration-500 hover:-translate-y-1 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-9'}`} style={{ transitionDelay: `${index * 70}ms` }}>
              <div className="relative aspect-[16/10] overflow-hidden bg-gray-200">
                <img src={utility.image} alt={utility.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                {utility.badge && <div className={`absolute top-3 left-3 ${utility.badgeColor} text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1`}>{utility.badgeIcon}{utility.badge}</div>}
              </div>
              <div className="p-5">
                <h3 className="text-base font-bold text-gray-900 mb-2">{utility.title}</h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">{utility.description}</p>
                <button onClick={() => onOpenTool(utility.toolType, { title: utility.title, ...utility.toolConfig })} className="flex items-center gap-2 text-blue-600 font-semibold text-sm group-hover:gap-3 transition-all">
                  Open Tool <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GeneralUtilities;
