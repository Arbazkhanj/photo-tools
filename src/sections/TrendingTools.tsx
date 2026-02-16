import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Flame } from 'lucide-react';

interface ToolCard {
  id: number;
  title: string;
  description: string;
  badge: string;
  badgeColor: string;
  image: string;
  toolType: string;
  toolConfig: {
    width: number;
    height: number;
    maxKB: number;
    aspectRatio: number | null;
  };
}

const tools: ToolCard[] = [
  {
    id: 1,
    title: 'NEET 2026 Document Resizer',
    description: 'Fix 4×6 Postcard, Passport, and Signature for NTA NEET. Automatic KB weight fix.',
    badge: 'Hot',
    badgeColor: 'bg-red-500',
    image: '/images/thumb_neet_docs.jpg',
    toolType: 'photo-resizer',
    toolConfig: { width: 600, height: 400, maxKB: 300, aspectRatio: 4/6 }
  },
  {
    id: 2,
    title: 'India Post GDS Signature',
    description: 'Fix the "5:2 Aspect Ratio" error instantly. Resize signature to 20KB–50KB.',
    badge: 'Hot',
    badgeColor: 'bg-red-500',
    image: '/images/thumb_gds_signature.jpg',
    toolType: 'photo-resizer',
    toolConfig: { width: 300, height: 120, maxKB: 50, aspectRatio: 5/2 }
  },
  {
    id: 3,
    title: 'India Post GDS Photo',
    description: 'Fix "4:5 Aspect Ratio" error. Resize photo to 30KB–50KB (Portrait).',
    badge: 'Hot',
    badgeColor: 'bg-red-500',
    image: '/images/thumb_gds_photo.jpg',
    toolType: 'photo-resizer',
    toolConfig: { width: 240, height: 300, maxKB: 50, aspectRatio: 4/5 }
  },
  {
    id: 4,
    title: 'RRB Signature (30KB–50KB)',
    description: 'Specifically for Group D & ALP. Fixes 140×60 px and forces size above 30KB.',
    badge: 'Strict',
    badgeColor: 'bg-amber-500',
    image: '/images/thumb_rrb_signature.jpg',
    toolType: 'photo-resizer',
    toolConfig: { width: 140, height: 60, maxKB: 50, aspectRatio: 140/60 }
  }
];

interface TrendingToolsProps {
  onOpenTool: (tool: string, config?: any) => void;
}

const TrendingTools = ({ onOpenTool }: TrendingToolsProps) => {
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
      id="trending"
      className="relative w-full py-16 lg:py-24 bg-white"
      style={{ zIndex: 20 }}
    >
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className={`mb-10 lg:mb-14 text-center transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <div className="inline-flex items-center gap-2 bg-red-50 px-4 py-2 rounded-full mb-4">
            <Flame className="w-5 h-5 text-red-500" />
            <span className="text-sm font-semibold text-red-500 uppercase tracking-wider">Trending Now</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">Most Popular Tools</h2>
          <p className="text-base lg:text-lg text-gray-600 max-w-xl mx-auto">Most used tools this week—updated every day.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {tools.map((tool, index) => (
            <div key={tool.id} className={`group bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all duration-500 hover:-translate-y-1 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: `${index * 100}ms` }}>
              <div className="relative aspect-[16/10] overflow-hidden bg-gray-200">
                <img src={tool.image} alt={tool.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className={`absolute top-3 left-3 ${tool.badgeColor} text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1`}>
                  {tool.badge === 'Hot' && <Flame className="w-3 h-3" />}
                  {tool.badge}
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-2">{tool.title}</h3>
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

export default TrendingTools;
