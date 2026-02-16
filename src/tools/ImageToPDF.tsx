import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { 
  Download, 
  X,
  ArrowLeft,
  Trash2,
  Plus,
  FileText,
  AlertCircle,
  Check
} from 'lucide-react';

interface ImageFile {
  id: string;
  src: string;
  name: string;
  size: number;
  width: number;
  height: number;
}

interface ImageToPDFProps {
  onClose: () => void;
  title?: string;
  defaultMaxKB?: number;
}

const ImageToPDF = ({ 
  onClose, 
  title = 'Image to PDF',
  defaultMaxKB = 200
}: ImageToPDFProps) => {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [targetKB, setTargetKB] = useState(defaultMaxKB);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [error, setError] = useState<string>('');
  const [pageSize, setPageSize] = useState<'a4' | 'letter' | 'auto'>('auto');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setError('');
    
    if (files.length === 0) return;

    files.forEach(file => {
      if (!file.type.startsWith('image/')) {
        setError('Please upload image files only (JPG, PNG)');
        return;
      }
      
      if (file.size > 10 * 1024 * 1024) {
        setError('File size should be less than 10MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const newImage: ImageFile = {
            id: Date.now() + Math.random().toString(36).substr(2, 9),
            src: event.target?.result as string,
            name: file.name,
            size: file.size,
            width: img.width,
            height: img.height
          };
          setImages(prev => [...prev, newImage]);
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  }, []);

  const removeImage = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id));
    setPdfUrl(null);
  };

  const moveImage = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === images.length - 1) return;
    
    const newImages = [...images];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    [newImages[index], newImages[newIndex]] = [newImages[newIndex], newImages[index]];
    setImages(newImages);
  };

  // Compress image to target size
  const compressImage = (src: string, targetBytes: number): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject('Canvas not supported');
          return;
        }

        // Start with original dimensions
        let width = img.width;
        let height = img.height;
        
        // Iteratively reduce size until under target
        let quality = 0.9;
        let result = '';
        
        const tryCompress = () => {
          canvas.width = width;
          canvas.height = height;
          
          // White background
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);
          
          result = canvas.toDataURL('image/jpeg', quality);
          const sizeBytes = Math.round((result.split(',')[1].length * 3) / 4);
          
          if (sizeBytes <= targetBytes || (quality <= 0.1 && width < 100)) {
            resolve(result);
            return;
          }
          
          // Reduce quality first
          if (quality > 0.3) {
            quality -= 0.1;
          } else {
            // Then reduce dimensions
            width *= 0.9;
            height *= 0.9;
            quality = 0.7;
          }
          
          setTimeout(tryCompress, 10);
        };
        
        tryCompress();
      };
      img.onerror = () => reject('Failed to load image');
      img.src = src;
    });
  };

  const generatePDF = useCallback(async () => {
    if (images.length === 0) return;
    
    setIsProcessing(true);
    setError('');
    
    try {
      // Calculate target size per image
      const targetPerImage = (targetKB * 1024) / images.length;
      
      // Compress all images
      const compressedImages = await Promise.all(
        images.map(img => compressImage(img.src, targetPerImage * 0.8))
      );
      
      // Create PDF using jsPDF-like approach with html2canvas or direct canvas
      const { jsPDF } = await import('jspdf');
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: pageSize === 'letter' ? 'letter' : 'a4'
      });
      
      const pageWidth = pageSize === 'letter' ? 216 : 210;
      const pageHeight = pageSize === 'letter' ? 279 : 297;
      
      for (let i = 0; i < compressedImages.length; i++) {
        if (i > 0) {
          pdf.addPage();
        }
        
        const imgData = compressedImages[i];
        const img = images[i];
        
        // Calculate dimensions to fit page with margins
        const margin = 10;
        const maxWidth = pageWidth - 2 * margin;
        const maxHeight = pageHeight - 2 * margin;
        
        let imgWidth = maxWidth;
        let imgHeight = (img.height / img.width) * imgWidth;
        
        if (imgHeight > maxHeight) {
          imgHeight = maxHeight;
          imgWidth = (img.width / img.height) * imgHeight;
        }
        
        const x = (pageWidth - imgWidth) / 2;
        const y = (pageHeight - imgHeight) / 2;
        
        pdf.addImage(imgData, 'JPEG', x, y, imgWidth, imgHeight);
      }
      
      const pdfBlob = pdf.output('blob');
      const pdfUrl = URL.createObjectURL(pdfBlob);
      setPdfUrl(pdfUrl);
      
    } catch (err) {
      setError('Failed to generate PDF: ' + (err as Error).message);
    } finally {
      setIsProcessing(false);
    }
  }, [images, targetKB, pageSize]);

  const downloadPDF = useCallback(() => {
    if (!pdfUrl) return;
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = 'converted_images.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [pdfUrl]);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const totalOriginalSize = images.reduce((acc, img) => acc + img.size, 0);

  return (
    <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 lg:p-6 border-b">
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-xl lg:text-2xl font-bold text-gray-900">{title}</h2>
              <p className="text-sm text-gray-500">Convert images to PDF with size control</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-4 lg:p-6">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-700">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Upload Area */}
          <div 
            onClick={() => fileInputRef.current?.click()} 
            className="border-2 border-dashed border-blue-300 rounded-2xl p-6 text-center cursor-pointer hover:border-blue-600 hover:bg-blue-50 transition-all mb-6"
          >
            <input 
              ref={fileInputRef} 
              type="file" 
              accept="image/*" 
              multiple
              onChange={handleFileUpload} 
              className="hidden" 
            />
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Plus className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-base font-semibold text-gray-900 mb-1">Add Images</h3>
            <p className="text-sm text-gray-500">Click to browse or drag and drop</p>
          </div>

          {/* Settings */}
          {images.length > 0 && (
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Target PDF Size</label>
                  <div className="flex items-center gap-4">
                    <Slider 
                      value={[targetKB]} 
                      onValueChange={(v) => setTargetKB(v[0])} 
                      min={100} 
                      max={1000} 
                      step={50} 
                      className="flex-1" 
                    />
                    <span className="text-sm font-medium w-20">{targetKB} KB</span>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Page Size</label>
                  <div className="flex gap-2">
                    {(['auto', 'a4', 'letter'] as const).map(size => (
                      <button
                        key={size}
                        onClick={() => setPageSize(size)}
                        className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${
                          pageSize === size 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-white text-gray-600 border hover:bg-gray-50'
                        }`}
                      >
                        {size.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Total Images: {images.length}</span>
                  <span className="text-gray-500">Original Size: {formatBytes(totalOriginalSize)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Image List */}
          {images.length > 0 && (
            <div className="space-y-3 mb-6">
              <h3 className="text-sm font-semibold text-gray-900">Selected Images</h3>
              {images.map((img, index) => (
                <div key={img.id} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                  <img 
                    src={img.src} 
                    alt={img.name} 
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{img.name}</p>
                    <p className="text-xs text-gray-500">
                      {formatBytes(img.size)} • {img.width}x{img.height}px
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => moveImage(index, 'up')}
                      disabled={index === 0}
                      className="p-2 hover:bg-gray-200 rounded-lg disabled:opacity-30"
                    >
                      ↑
                    </button>
                    <button 
                      onClick={() => moveImage(index, 'down')}
                      disabled={index === images.length - 1}
                      className="p-2 hover:bg-gray-200 rounded-lg disabled:opacity-30"
                    >
                      ↓
                    </button>
                    <button 
                      onClick={() => removeImage(img.id)}
                      className="p-2 hover:bg-red-100 text-red-600 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Actions */}
          {images.length > 0 && (
            <div className="flex flex-col gap-3">
              {!pdfUrl ? (
                <Button 
                  onClick={generatePDF} 
                  disabled={isProcessing} 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5"
                >
                  {isProcessing ? (
                    <><div className="w-4 h-4 mr-2 animate-spin border-2 border-white border-t-transparent rounded-full" />Generating PDF...</>
                  ) : (
                    <><FileText className="w-4 h-4 mr-2" /> Generate PDF</>
                  )}
                </Button>
              ) : (
                <>
                  <div className="p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2 text-green-700">
                    <Check className="w-5 h-5 flex-shrink-0" />
                    <p className="text-sm">PDF generated successfully!</p>
                  </div>
                  <Button 
                    onClick={downloadPDF} 
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-5"
                  >
                    <Download className="w-4 h-4 mr-2" /> Download PDF
                  </Button>
                  <Button 
                    onClick={() => { setPdfUrl(null); setImages([]); }} 
                    variant="outline"
                    className="w-full"
                  >
                    Start New
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageToPDF;
