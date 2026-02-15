import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { 
  Upload, 
  Download, 
  X,
  ArrowLeft,
  Image as ImageIcon,
  Eraser,
  AlertCircle,
  RefreshCw
} from 'lucide-react';

interface SignatureBGRemoverProps {
  onClose: () => void;
  title?: string;
}

const SignatureBGRemover = ({ 
  onClose, 
  title = 'Signature Background Remover'
}: SignatureBGRemoverProps) => {
  const [image, setImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string>('');
  const [threshold, setThreshold] = useState(200);
  const [showOriginal, setShowOriginal] = useState(false);
  const [bgColor, setBgColor] = useState<'transparent' | 'white'>('transparent');
  const [originalSize, setOriginalSize] = useState(0);
  const [processedSize, setProcessedSize] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError('');
    
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (JPG, PNG)');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      setError('File size should be less than 5MB');
      return;
    }

    setFileName(file.name);
    setOriginalSize(file.size);
    
    const reader = new FileReader();
    reader.onload = (event) => {
      setImage(event.target?.result as string);
      setProcessedImage(null);
      // Auto-process after load
      setTimeout(() => processImage(event.target?.result as string, threshold), 100);
    };
    reader.readAsDataURL(file);
  }, [threshold]);

  const processImage = useCallback((src: string, thresh: number) => {
    if (!src) return;
    setIsProcessing(true);
    setError('');
    
    setTimeout(() => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) {
          setError('Canvas not supported');
          setIsProcessing(false);
          return;
        }

        const img = new Image();
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          
          // Draw original
          ctx.drawImage(img, 0, 0);
          
          // Get image data
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;
          
          // Process pixels - make light backgrounds transparent
          for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            
            // Calculate brightness
            const brightness = (r + g + b) / 3;
            
            // If pixel is light (background), make it transparent
            if (brightness > thresh) {
              data[i + 3] = 0; // Alpha = 0
            } else {
              // Darken the signature slightly for better contrast
              const factor = 1.2;
              data[i] = Math.min(255, r * factor);
              data[i + 1] = Math.min(255, g * factor);
              data[i + 2] = Math.min(255, b * factor);
              data[i + 3] = 255; // Full opacity
            }
          }
          
          // Put processed data back
          ctx.putImageData(imageData, 0, 0);
          
          // Export as PNG (to preserve transparency)
          const result = canvas.toDataURL('image/png');
          setProcessedImage(result);
          
          // Calculate size
          const base64Length = result.split(',')[1].length;
          const sizeBytes = Math.round((base64Length * 3) / 4);
          setProcessedSize(sizeBytes);
          
          setIsProcessing(false);
        };
        img.onerror = () => {
          setError('Failed to load image');
          setIsProcessing(false);
        };
        img.src = src;
      } catch (err) {
        setError('Processing failed: ' + (err as Error).message);
        setIsProcessing(false);
      }
    }, 100);
  }, []);

  const reprocess = () => {
    if (image) {
      processImage(image, threshold);
    }
  };

  const downloadImage = useCallback(() => {
    if (!processedImage) return;
    const link = document.createElement('a');
    link.href = processedImage;
    const downloadName = fileName || 'signature.png';
    link.download = 'transparent_' + downloadName.replace(/\.[^/.]+$/, '') + '.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [processedImage, fileName]);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

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
              <p className="text-sm text-gray-500">Remove background from signature images</p>
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

          {!image ? (
            <div 
              onClick={() => fileInputRef.current?.click()} 
              className="border-2 border-dashed border-blue-300 rounded-2xl p-8 lg:p-16 text-center cursor-pointer hover:border-blue-600 hover:bg-blue-50 transition-all"
            >
              <input 
                ref={fileInputRef} 
                type="file" 
                accept="image/*" 
                onChange={handleFileUpload} 
                className="hidden" 
              />
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Signature</h3>
              <p className="text-sm text-gray-500 mb-4">Click to browse or drag and drop</p>
              <ul className="text-xs text-gray-400 space-y-1">
                <li>• Write signature on white paper</li>
                <li>• Take photo in good lighting</li>
                <li>• Supports JPG, PNG (Max 5MB)</li>
              </ul>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Preview */}
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                      <ImageIcon className="w-4 h-4" /> 
                      {showOriginal ? 'Original' : 'Result'}
                    </h4>
                    <button 
                      onClick={() => setShowOriginal(!showOriginal)}
                      className="text-xs text-blue-600 hover:underline"
                    >
                      {showOriginal ? 'Show Result' : 'Show Original'}
                    </button>
                  </div>
                  
                  <div 
                    className="rounded-lg flex items-center justify-center min-h-[250px] relative overflow-hidden"
                    style={{ 
                      backgroundColor: bgColor === 'transparent' 
                        ? '#f0f0f0' 
                        : '#ffffff',
                      backgroundImage: bgColor === 'transparent' 
                        ? 'linear-gradient(45deg, #e0e0e0 25%, transparent 25%), linear-gradient(-45deg, #e0e0e0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e0e0e0 75%), linear-gradient(-45deg, transparent 75%, #e0e0e0 75%)' 
                        : 'none',
                      backgroundSize: '20px 20px',
                      backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
                    }}
                  >
                    {isProcessing ? (
                      <div className="flex flex-col items-center text-gray-400">
                        <RefreshCw className="w-8 h-8 animate-spin mb-2" />
                        <span className="text-sm">Processing...</span>
                      </div>
                    ) : (
                      <img 
                        src={showOriginal ? image : (processedImage || image)} 
                        alt="Signature" 
                        className="max-w-full max-h-[300px] object-contain"
                      />
                    )}
                  </div>
                </div>

                {/* File Info */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">File Info</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Original Size:</span>
                      <span className="font-medium">{formatBytes(originalSize)}</span>
                    </div>
                    {processedImage && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">New Size:</span>
                        <span className="font-medium text-green-600">{formatBytes(processedSize)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Eraser className="w-4 h-4" /> Background Removal
                  </h4>
                  
                  <div className="mb-4">
                    <div className="flex justify-between mb-2">
                      <label className="text-sm text-gray-500">Sensitivity</label>
                      <span className="text-sm font-medium">{threshold}</span>
                    </div>
                    <Slider 
                      value={[threshold]} 
                      onValueChange={(v) => setThreshold(v[0])} 
                      min={150} 
                      max={250} 
                      step={5} 
                      className="w-full mb-2" 
                    />
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>Keep More</span>
                      <span>Remove More</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="text-sm text-gray-500 mb-2 block">Preview Background</label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setBgColor('transparent')}
                        className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                          bgColor === 'transparent' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-white text-gray-600 border'
                        }`}
                      >
                        Transparent
                      </button>
                      <button
                        onClick={() => setBgColor('white')}
                        className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                          bgColor === 'white' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-white text-gray-600 border'
                        }`}
                      >
                        White
                      </button>
                    </div>
                  </div>

                  <Button 
                    onClick={reprocess} 
                    disabled={isProcessing} 
                    variant="outline"
                    className="w-full"
                  >
                    {isProcessing ? (
                      <><RefreshCw className="w-4 h-4 mr-2 animate-spin" />Processing...</>
                    ) : (
                      <><RefreshCw className="w-4 h-4 mr-2" /> Apply Changes</>
                    )}
                  </Button>
                </div>

                {/* Tips */}
                <div className="bg-blue-50 rounded-xl p-4">
                  <h4 className="text-sm font-semibold text-blue-900 mb-2">Tips for Best Results</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Use dark ink (blue/black) on white paper</li>
                    <li>• Ensure good lighting when taking photo</li>
                    <li>• Avoid shadows on the signature</li>
                    <li>• Increase sensitivity if background remains</li>
                    <li>• Download as PNG to keep transparency</li>
                  </ul>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2">
                  {processedImage && (
                    <Button 
                      onClick={downloadImage} 
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-5"
                    >
                      <Download className="w-4 h-4 mr-2" /> Download PNG
                    </Button>
                  )}
                  <Button 
                    onClick={() => { setImage(null); setProcessedImage(null); }} 
                    variant="outline"
                    className="w-full"
                  >
                    Upload New Signature
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignatureBGRemover;
