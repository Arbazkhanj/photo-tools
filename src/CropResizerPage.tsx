import { useState } from 'react';
import { 
  FileText, 
  Eraser, 
  Upload, 
  Download, 
  Check,
  Trash2,
  Plus,
  RefreshCw,
  ArrowLeft,
  Crop,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

// ==================== PHOTO RESIZER COMPONENT ====================
interface PhotoResizerToolProps {
  onBack: () => void;
}

const PhotoResizerTool = ({ onBack }: PhotoResizerToolProps) => {
  const [image, setImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');
  const [width, setWidth] = useState(350);
  const [height, setHeight] = useState(350);
  const [quality, setQuality] = useState(90);
  const [maxKB, setMaxKB] = useState(50);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState(0);
  const [processedSize, setProcessedSize] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [originalWidth, setOriginalWidth] = useState(0);
  const [originalHeight, setOriginalHeight] = useState(0);

  const PRESET_RATIOS = [
    { name: 'Free', value: null },
    { name: '1:1', value: 1 },
    { name: '4:5', value: 4/5 },
    { name: '5:4', value: 5/4 },
    { name: '5:2 Sig', value: 5/2 },
    { name: '2:5', value: 2/5 },
    { name: '3:4', value: 3/4 },
    { name: '4:3', value: 4/3 },
    { name: '16:9', value: 16/9 },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    setFileName(file.name);
    setOriginalSize(file.size);
    setError('');
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        setOriginalWidth(img.width);
        setOriginalHeight(img.height);
        setWidth(Math.min(350, img.width));
        setHeight(Math.min(350, img.height));
      };
      img.src = event.target?.result as string;
      setImage(event.target?.result as string);
      setProcessedImage(null);
    };
    reader.readAsDataURL(file);
  };

  const compressToTarget = (canvas: HTMLCanvasElement, targetKB: number) => {
    let low = 0.1, high = 1.0;
    let bestResult = canvas.toDataURL('image/jpeg', 0.1);
    let bestSize = 0;
    
    for (let i = 0; i < 15; i++) {
      const mid = (low + high) / 2;
      const result = canvas.toDataURL('image/jpeg', mid);
      const base64Length = result.split(',')[1].length;
      const sizeKB = (base64Length * 0.75) / 1024;
      
      if (sizeKB <= targetKB) {
        bestResult = result;
        bestSize = sizeKB;
        low = mid;
      } else {
        high = mid;
      }
    }
    
    return { dataUrl: bestResult, actualKB: bestSize };
  };

  const processImage = () => {
    if (!image) return;
    setIsProcessing(true);
    setError('');
    
    setTimeout(() => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const img = new Image();
      img.onload = () => {
        canvas.width = width;
        canvas.height = height;
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
        
        const { dataUrl, actualKB } = compressToTarget(canvas, maxKB);
        setProcessedImage(dataUrl);
        setProcessedSize(actualKB * 1024);
        
        if (actualKB > maxKB) {
          setError(`Warning: Final size ${actualKB.toFixed(1)}KB exceeds target`);
        }
        setIsProcessing(false);
      };
      img.src = image;
    }, 100);
  };

  const downloadImage = () => {
    if (!processedImage) return;
    const link = document.createElement('a');
    link.href = processedImage;
    link.download = 'resized_' + fileName.replace(/\.[^/.]+$/, '') + '.jpg';
    link.click();
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-2xl font-bold text-gray-900">Photo Crop & Resize</h2>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
          {error}
        </div>
      )}

      {!image ? (
        <div className="border-2 border-dashed border-blue-300 rounded-2xl p-12 text-center">
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleFileUpload}
            className="hidden"
            id="photo-upload"
          />
          <label htmlFor="photo-upload" className="cursor-pointer">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Upload className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Photo</h3>
            <p className="text-sm text-gray-500">Click to browse or drag and drop</p>
          </label>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-50 rounded-xl p-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Preview</h4>
            <div className="bg-white rounded-lg p-4 flex items-center justify-center min-h-[300px]">
              {processedImage ? (
                <img src={processedImage} alt="Processed" className="max-w-full max-h-[300px] object-contain" />
              ) : (
                <img src={image} alt="Original" className="max-w-full max-h-[300px] object-contain" />
              )}
            </div>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Original:</span>
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

          <div className="space-y-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Aspect Ratio</h4>
              <div className="grid grid-cols-3 gap-2">
                {PRESET_RATIOS.map((preset) => (
                  <button 
                    key={preset.name}
                    onClick={() => {
                      setAspectRatio(preset.value);
                    }}
                    className={`px-2 py-2 text-xs font-medium rounded-lg ${
                      aspectRatio === preset.value 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-white text-gray-600 border'
                    }`}
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-4">Settings</h4>
              
              <div className="mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-500">Width</span>
                  <span className="text-sm font-medium">{width}px</span>
                </div>
                <Slider value={[width]} onValueChange={(v) => setWidth(v[0])} min={50} max={originalWidth || 2000} step={10} />
              </div>

              <div className="mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-500">Height</span>
                  <span className="text-sm font-medium">{height}px</span>
                </div>
                <Slider value={[height]} onValueChange={(v) => setHeight(v[0])} min={50} max={originalHeight || 2000} step={10} />
              </div>

              <div className="mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-500">Quality</span>
                  <span className="text-sm font-medium">{quality}%</span>
                </div>
                <Slider value={[quality]} onValueChange={(v) => setQuality(v[0])} min={10} max={100} step={5} />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-500">Max Size</span>
                  <span className="text-sm font-medium">{maxKB} KB</span>
                </div>
                <Slider value={[maxKB]} onValueChange={(v) => setMaxKB(v[0])} min={10} max={500} step={10} />
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={processImage} disabled={isProcessing} className="flex-1 bg-blue-600">
                {isProcessing ? 'Processing...' : 'Process Image'}
              </Button>
              {processedImage && (
                <Button onClick={downloadImage} className="flex-1 bg-green-600">
                  <Download className="w-4 h-4 mr-2" /> Download
                </Button>
              )}
            </div>
            <Button variant="outline" onClick={() => setImage(null)} className="w-full">
              Upload New
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

// ==================== IMAGE TO PDF COMPONENT ====================
interface ImageToPDFToolProps {
  onBack: () => void;
}

const ImageToPDFTool = ({ onBack }: ImageToPDFToolProps) => {
  const [images, setImages] = useState<{id: string; src: string; name: string; size: number}[]>([]);
  const [targetKB, setTargetKB] = useState(200);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [error, setError] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        setImages(prev => [...prev, {
          id: Date.now().toString(),
          src: event.target?.result as string,
          name: file.name,
          size: file.size
        }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  const generatePDF = async () => {
    if (images.length === 0) return;
    setIsProcessing(true);
    
    try {
      const { jsPDF } = await import('jspdf');
      const pdf = new jsPDF();
      
      for (let i = 0; i < images.length; i++) {
        if (i > 0) pdf.addPage();
        const img = images[i];
        const imgProps = pdf.getImageProperties(img.src);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(img.src, 'PNG', 0, 0, pdfWidth, pdfHeight);
      }
      
      const blob = pdf.output('blob');
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
    } catch (err) {
      setError('Failed to generate PDF');
    }
    setIsProcessing(false);
  };

  const downloadPDF = () => {
    if (!pdfUrl) return;
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = 'images.pdf';
    link.click();
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-2xl font-bold text-gray-900">Image to PDF</h2>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
          {error}
        </div>
      )}

      <div className="border-2 border-dashed border-blue-300 rounded-2xl p-8 text-center mb-6">
        <input 
          type="file" 
          accept="image/*" 
          multiple
          onChange={handleFileUpload}
          className="hidden"
          id="pdf-upload"
        />
        <label htmlFor="pdf-upload" className="cursor-pointer">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Plus className="w-6 h-6 text-blue-600" />
          </div>
          <p className="text-sm text-gray-500">Add Images (Multiple allowed)</p>
        </label>
      </div>

      {images.length > 0 && (
        <>
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Target Size: {targetKB} KB</h4>
            <Slider value={[targetKB]} onValueChange={(v) => setTargetKB(v[0])} min={100} max={1000} step={50} />
          </div>

          <div className="space-y-3 mb-6">
            {images.map((img, index) => (
              <div key={img.id} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                <span className="text-sm text-gray-500 w-6">{index + 1}.</span>
                <img src={img.src} alt="" className="w-12 h-12 object-cover rounded" />
                <span className="flex-1 text-sm truncate">{img.name}</span>
                <button onClick={() => removeImage(img.id)} className="p-2 text-red-600 hover:bg-red-50 rounded">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            {!pdfUrl ? (
              <Button onClick={generatePDF} disabled={isProcessing} className="flex-1 bg-blue-600">
                {isProcessing ? 'Generating...' : 'Generate PDF'}
              </Button>
            ) : (
              <>
                <Button onClick={downloadPDF} className="flex-1 bg-green-600">
                  <Download className="w-4 h-4 mr-2" /> Download PDF
                </Button>
                <Button onClick={() => { setPdfUrl(null); setImages([]); }} variant="outline">
                  New
                </Button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

// ==================== SIGNATURE BG REMOVER COMPONENT ====================
interface SignatureBGRemoverToolProps {
  onBack: () => void;
}

const SignatureBGRemoverTool = ({ onBack }: SignatureBGRemoverToolProps) => {
  const [image, setImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [threshold, setThreshold] = useState(200);
  const [error, setError] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) {
      setError('Please upload an image');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
      setImage(event.target?.result as string);
      setProcessedImage(null);
      setTimeout(() => processImage(event.target?.result as string), 100);
    };
    reader.readAsDataURL(file);
  };

  const processImage = (src: string) => {
    if (!src) return;
    setIsProcessing(true);
    
    setTimeout(() => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        for (let i = 0; i < data.length; i += 4) {
          const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
          if (brightness > threshold) {
            data[i + 3] = 0;
          }
        }
        
        ctx.putImageData(imageData, 0, 0);
        setProcessedImage(canvas.toDataURL('image/png'));
        setIsProcessing(false);
      };
      img.src = src;
    }, 100);
  };

  const downloadImage = () => {
    if (!processedImage) return;
    const link = document.createElement('a');
    link.href = processedImage;
    link.download = 'signature_transparent.png';
    link.click();
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-2xl font-bold text-gray-900">Signature BG Remover</h2>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
          {error}
        </div>
      )}

      {!image ? (
        <div className="border-2 border-dashed border-blue-300 rounded-2xl p-12 text-center">
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleFileUpload}
            className="hidden"
            id="sig-upload"
          />
          <label htmlFor="sig-upload" className="cursor-pointer">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Upload className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Signature</h3>
            <p className="text-sm text-gray-500">Write on white paper, take clear photo</p>
          </label>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-50 rounded-xl p-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Result</h4>
            <div 
              className="rounded-lg flex items-center justify-center min-h-[250px]"
              style={{ 
                backgroundImage: 'linear-gradient(45deg, #e0e0e0 25%, transparent 25%), linear-gradient(-45deg, #e0e0e0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e0e0e0 75%), linear-gradient(-45deg, transparent 75%, #e0e0e0 75%)',
                backgroundSize: '20px 20px'
              }}
            >
              {isProcessing ? (
                <span className="text-gray-400">Processing...</span>
              ) : (
                <img 
                  src={processedImage || image} 
                  alt="Signature" 
                  className="max-w-full max-h-[250px] object-contain"
                />
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-4">Settings</h4>
              
              <div className="mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-500">Sensitivity</span>
                  <span className="text-sm font-medium">{threshold}</span>
                </div>
                <Slider 
                  value={[threshold]} 
                  onValueChange={(v) => setThreshold(v[0])} 
                  min={150} 
                  max={250} 
                  step={5}
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>Keep More</span>
                  <span>Remove More</span>
                </div>
              </div>

              <Button onClick={() => processImage(image)} disabled={isProcessing} variant="outline" className="w-full">
                {isProcessing ? 'Processing...' : <><RefreshCw className="w-4 h-4 mr-2" /> Apply</>}
              </Button>
            </div>

            <div className="bg-blue-50 rounded-xl p-4">
              <h4 className="text-sm font-semibold text-blue-900 mb-2">Tips</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Use dark ink on white paper</li>
                <li>• Good lighting when taking photo</li>
                <li>• Download as PNG for transparency</li>
              </ul>
            </div>

            {processedImage && (
              <Button onClick={downloadImage} className="w-full bg-green-600">
                <Download className="w-4 h-4 mr-2" /> Download PNG
              </Button>
            )}
            <Button onClick={() => setImage(null)} variant="outline" className="w-full">
              Upload New
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

// ==================== MAIN PAGE COMPONENT ====================
const CropResizerPage = () => {
  const [activeTool, setActiveTool] = useState<'menu' | 'photo' | 'pdf' | 'signature'>('menu');

  if (activeTool === 'photo') {
    return (
      <div className="min-h-screen bg-white p-4 lg:p-8">
        <PhotoResizerTool onBack={() => setActiveTool('menu')} />
      </div>
    );
  }

  if (activeTool === 'pdf') {
    return (
      <div className="min-h-screen bg-white p-4 lg:p-8">
        <ImageToPDFTool onBack={() => setActiveTool('menu')} />
      </div>
    );
  }

  if (activeTool === 'signature') {
    return (
      <div className="min-h-screen bg-white p-4 lg:p-8">
        <SignatureBGRemoverTool onBack={() => setActiveTool('menu')} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
            Crop Resizer Tools
          </h1>
          <p className="text-lg text-gray-600">
            Free online tools for photos, documents and signatures
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Photo Resizer Card */}
          <div 
            onClick={() => setActiveTool('photo')}
            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer hover:-translate-y-1"
          >
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
              <Crop className="w-7 h-7 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Photo Crop & Resize</h3>
            <p className="text-sm text-gray-600 mb-4">
              Resize photos for exams, passport, forms. Set exact dimensions and file size.
            </p>
            <div className="flex items-center text-blue-600 font-medium text-sm">
              Open Tool <ChevronRight className="w-4 h-4 ml-1" />
            </div>
          </div>

          {/* Image to PDF Card */}
          <div 
            onClick={() => setActiveTool('pdf')}
            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer hover:-translate-y-1"
          >
            <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-4">
              <FileText className="w-7 h-7 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Image to PDF</h3>
            <p className="text-sm text-gray-600 mb-4">
              Convert multiple images to single PDF. Control file size for uploads.
            </p>
            <div className="flex items-center text-green-600 font-medium text-sm">
              Open Tool <ChevronRight className="w-4 h-4 ml-1" />
            </div>
          </div>

          {/* Signature BG Remover Card */}
          <div 
            onClick={() => setActiveTool('signature')}
            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer hover:-translate-y-1"
          >
            <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
              <Eraser className="w-7 h-7 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Signature BG Remover</h3>
            <p className="text-sm text-gray-600 mb-4">
              Remove white background from signature. Make it transparent for forms.
            </p>
            <div className="flex items-center text-purple-600 font-medium text-sm">
              Open Tool <ChevronRight className="w-4 h-4 ml-1" />
            </div>
          </div>
        </div>

        <div className="mt-10 bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-bold text-gray-900 mb-3">Why use our tools?</h3>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-500" />
              <span>100% Free - No registration required</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-500" />
              <span>Works on your device - No server upload</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-500" />
              <span>Works on mobile and desktop</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CropResizerPage;
