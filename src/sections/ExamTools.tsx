import { useEffect, useRef, useState } from 'react';
import { ArrowRight, CreditCard } from 'lucide-react';

interface ExamTool {
  id: number;
  title: string;
  description: string;
  badge?: string;
  image: string;
  toolType: string;
  toolConfig: {
    width: number;
    height: number;
    maxKB: number;
    aspectRatio: number | null;
  };
}

const examTools: ExamTool[] = [
  {
    id: 1,
    title: 'RRB Photo Resizer',
    description: 'Specifically for RRB Group D & ALP. Fixes 320×240 pixels & 20–70KB size.',
    image: '/images/thumb_rrb_photo.jpg',
    toolType: 'photo-resizer',
    toolConfig: { width: 320, height: 240, maxKB: 70, aspectRatio: 320/240 }
  },
  {
    id: 2,
    title: 'NSDL PAN Photo',
    description: 'Fix 3.5×2.5cm & 200 DPI for Protean PAN. Size: 20KB–50KB.',
    badge: 'PAN',
    image: '/images/thumb_pan_photo.jpg',
    toolType: 'photo-resizer',
    toolConfig: { width: 350, height: 250, maxKB: 50, aspectRatio: 3.5/2.5 }
  },
  {
    id: 3,
    title: 'NSDL PAN Signature',
    description: 'Fix 2×4.5cm & 200 DPI for Protean PAN. Size: 10KB–50KB.',
    badge: 'PAN',
    image: '/images/thumb_pan_signature.jpg',
    toolType: 'photo-resizer',
    toolConfig: { width: 200, height: 450, maxKB: 50, aspectRatio: 2/4.5 }
  },
  {
    id: 4,
    title: 'SSC Signature Resizer',
    description: 'Compress signature to 10KB–20KB. Perfect for CGL, CHSL, MTS & GD.',
    image: '/images/thumb_ssc_signature.jpg',
    toolType: 'photo-resizer',
    toolConfig: { width: 300, height: 120, maxKB: 20, aspectRatio: 5/2 }
  },
  {
    id: 5,
    title: 'UPSC IAS Photo Resizer',
    description: 'Resize photo to 350×350 pixels (30KB–100KB) for Civil Services & NDA.',
    image: '/images/thumb_upsc_photo.jpg',
    toolType: 'photo-resizer',
    toolConfig: { width: 350, height: 350, maxKB: 100, aspectRatio: 1 }
  },
  {
    id: 6,
    title: 'Passport Photo Maker',
    description: 'Crop any image to standard 3.5cm x 4.5cm passport size. Compress to 50KB.',
    image: '/images/thumb_passport.jpg',
    toolType: 'photo-resizer',
    toolConfig: { width: 350, height: 450, maxKB: 50, aspectRatio: 3.5/4.5 }
  }
];

interface ExamToolsProps {
  onOpenTool: (tool: string, config?: any) => void;
}

const ExamTools = ({ onOpenTool }: ExamToolsProps) => {
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
    <section ref={sectionRef} id="exams" className="relative w-full py-16 lg:py-24 bg-gradient-to-b from-gray-50 to-white" style={{ zIndex: 30 }}>
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className={`mb-10 lg:mb-14 text-center transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <div className="inline-flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full mb-4">
            <CreditCard className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">Exam Specific</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">Exam & Card Specific Tools</h2>
          <p className="text-base lg:text-lg text-gray-600 max-w-xl mx-auto">Pre-configured sizes, ratios, and KB limits—no guesswork.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {examTools.map((tool, index) => (
            <div key={tool.id} className={`group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all duration-500 hover:-translate-y-1 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-11'}`} style={{ transitionDelay: `${index * 60}ms` }}>
              <div className="relative aspect-[16/10] overflow-hidden bg-gray-200">
                <img src={tool.image} alt={tool.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                {tool.badge && <div className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">{tool.badge}</div>}
              </div>
              <div className="p-5">
                <h3 className="text-base font-bold text-gray-900 mb-2">{tool.title}</h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">{tool.description}</p>
                <button onClick={() => onOpenTool(tool.toolType, { title: tool.title, ...tool.toolConfig })} className="flex items-center gap-2 text-blue-600 font-semibold text-sm group-hover:gap-3 transition-all">
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

export default ExamTools;
