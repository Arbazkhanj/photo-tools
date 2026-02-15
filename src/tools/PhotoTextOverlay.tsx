import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Upload, 
  Download, 
  RotateCcw, 
  Image as ImageIcon,
  Type,
  X,
  ArrowLeft,
  Calendar,
  User,
  Plus,
  Trash2
} from 'lucide-react';

interface TextOverlay {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  color: string;
  fontWeight: string;
  backgroundColor: string;
  type: 'name' | 'date' | 'custom';
}

interface PhotoTextOverlayProps {
  onClose: () => void;
  title?: string;
  defaultName?: string;
  defaultDate?: string;
}

const PRESET_COLORS = [
  '#FFFFFF', '#000000', '#FF0000', '#00FF00', '#0000FF', 
  '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080'
];

const PRESET_BG_COLORS = [
  'transparent', '#000000', '#FFFFFF', '#FF0000', '#00FF00', 
  '#0000FF', '#FFFF00', '#FFA500'
];

const PhotoTextOverlay = ({ 
  onClose, 
  title = 'Add Name & Date on Photo',
  defaultName = '',
  defaultDate = ''
}: PhotoTextOverlayProps) => {
  const [image, setImage] = useState<string | null>(null);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [overlays, setOverlays] = useState<TextOverlay[]>([]);
  const [selectedOverlay, setSelectedOverlay] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [processedSize, setProcessedSize] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [dragging, setDragging] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [photoSize, setPhotoSize] = useState({ width: 0, height: 0 });
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const getBase64Size = (base64String: string): number => {
    const base64Length = base64String.split(',')[1]?.length || 0;
    return Math.round((base64Length * 3) / 4);
  };

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (JPG, PNG)');
      return;
    }
    
    if (file.size > 10 * 1024 * 1024) {
      alert('File size should be less than 10MB');
      return;
    }

    setFileName(file.name);
    setOriginalSize(file.size);
    setProcessedImage(null);
    setOverlays([]);
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        setCanvasSize({ width: img.width, height: img.height });
      };
      img.src = event.target?.result as string;
      setImage(event.target?.result as string);
      setOriginalImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const addOverlay = (type: 'name' | 'date' | 'custom') => {
    const newOverlay: TextOverlay = {
      id: Date.now().toString(),
      text: type === 'name' ? (defaultName || 'Your Name') : type === 'date' ? (defaultDate || new Date().toLocaleDateString('en-IN')) : 'Enter Text',
      x: canvasSize.width / 2,
      y: type === 'name' ? canvasSize.height - 40 : type === 'date' ? canvasSize.height - 20 : canvasSize.height / 2,
      fontSize: type === 'custom' ? 24 : 18,
      color: '#FFFFFF',
      fontWeight: 'bold',
      backgroundColor: 'transparent',
      type
    };
    setOverlays([...overlays, newOverlay]);
    setSelectedOverlay(newOverlay.id);
  };

  const updateOverlay = (id: string, updates: Partial<TextOverlay>) => {
    setOverlays(overlays.map(o => o.id === id ? { ...o, ...updates } : o));
  };

  const deleteOverlay = (id: string) => {
    setOverlays(overlays.filter(o => o.id !== id));
    if (selectedOverlay === id) setSelectedOverlay(null);
  };

  const handleMouseDown = (e: React.MouseEvent, overlayId: string) => {
    e.stopPropagation();
    setSelectedOverlay(overlayId);
    setDragging(overlayId);
    
    const overlay = overlays.find(o => o.id === overlayId);
    if (overlay && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const scaleX = canvasSize.width / rect.width;
      const scaleY = canvasSize.height / rect.height;
      
      setDragOffset({
        x: (e.clientX - rect.left) * scaleX - overlay.x,
        y: (e.clientY - rect.top) * scaleY - overlay.y
      });
    }
  };

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragging || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const scaleX = canvasSize.width / rect.width;
    const scaleY = canvasSize.height / rect.height;
    
    const newX = (e.clientX - rect.left) * scaleX - dragOffset.x;
    const newY = (e.clientY - rect.top) * scaleY - dragOffset.y;
    
    updateOverlay(dragging, { 
      x: Math.max(0, Math.min(canvasSize.width, newX)),
      y: Math.max(0, Math.min(canvasSize.height, newY))
    });
  }, [dragging, dragOffset, canvasSize]);

  const handleMouseUp = () => {
    setDragging(null);
  };

  const processImage = useCallback(() => {
    if (!image || !canvasRef.current) return;
    
    setIsProcessing(true);
    
    setTimeout(() => {
      const canvas = canvasRef.current!;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Draw original image
        ctx.drawImage(img, 0, 0);
        
        // Draw overlays
        overlays.forEach(overlay => {
          ctx.font = `${overlay.fontWeight} ${overlay.fontSize * (img.width / 600)}px Arial`;
          ctx.fillStyle = overlay.color;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          
          const scaleX = img.width / canvasSize.width;
          const scaleY = img.height / canvasSize.height;
          const x = overlay.x * scaleX;
          const y = overlay.y * scaleY;
          
          // Draw background if not transparent
          if (overlay.backgroundColor !== 'transparent') {
            const metrics = ctx.measureText(overlay.text);
            const fontHeight = overlay.fontSize * (img.width / 600);
            ctx.fillStyle = overlay.backgroundColor;
            ctx.fillRect(
              x - metrics.width / 2 - 5,
              y - fontHeight / 2 - 2,
              metrics.width + 10,
              fontHeight + 4
            );
          }
          
          // Draw text
          ctx.fillStyle = overlay.color;
          ctx.fillText(overlay.text, x, y);
        });
        
        const result = canvas.toDataURL('image/jpeg', 0.95);
        setProcessedImage(result);
        setProcessedSize(getBase64Size(result));
        setIsProcessing(false);
      };
      img.src = image;
    }, 100);
  }, [image, overlays, canvasSize]);

  const downloadImage = useCallback(() => {
    if (!processedImage) return;
    const link = document.createElement('a');
    link.href = processedImage;
    link.download = 'named_' + (fileName || 'photo.jpg').replace(/\.[^/.]+$/, '') + '.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [processedImage, fileName]);

  const resetImage = useCallback(() => {
    if (originalImage) {
      setImage(originalImage);
      setOverlays([]);
      setProcessedImage(null);
      setSelectedOverlay(null);
    }
  }, [originalImage]);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const selectedOverlayData = overlays.find(o => o.id === selectedOverlay);

  return (
    <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 lg:p-6 border-b">
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-xl lg:text-2xl font-bold text-gray-900">{title}</h2>
              <p className="text-sm text-gray-500">Add name and date on passport photos for SSC & Railways</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-4 lg:p-6">
          {!image ? (
            <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-blue-300 rounded-2xl p-8 lg:p-16 text-center cursor-pointer hover:border-blue-600 hover:bg-blue-50 transition-all">
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload your photo</h3>
              <p className="text-sm text-gray-500 mb-4">Click to browse or drag and drop your image here</p>
              <p className="text-xs text-gray-400">Supports JPG, PNG, WEBP (Max 10MB)</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              {/* Preview Area */}
              <div className="lg:col-span-3 space-y-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                      <ImageIcon className="w-4 h-4" /> Preview
                    </h4>
                    <span className="text-xs text-gray-500">Drag text to position</span>
                  </div>
                  
                  {/* Image Container */}
                  <div 
                    ref={containerRef}
                    className="relative bg-white rounded-lg overflow-hidden flex items-center justify-center min-h-[400px] cursor-crosshair"
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                  >
                    {processedImage ? (
                      <img src={processedImage} alt="Processed" className="max-w-full max-h-[500px] object-contain" />
                    ) : (
                      <>
                        <img 
                          ref={imgRef}
                          src={image} 
                          alt="Original" 
                          className="max-w-full max-h-[500px] object-contain"
                          onLoad={(e) => {
                            const img = e.target as HTMLImageElement;
                            setPhotoSize({ width: img.offsetWidth, height: img.offsetHeight });
                          }}
                        />
                        
                        {/* Text Overlays */}
                        {overlays.map((overlay) => {
                          const scaleX = photoSize.width / canvasSize.width;
                          const scaleY = photoSize.height / canvasSize.height;
                          
                          return (
                            <div
                              key={overlay.id}
                              onMouseDown={(e) => handleMouseDown(e, overlay.id)}
                              className={`absolute cursor-move select-none px-2 py-1 rounded transition-all ${
                                selectedOverlay === overlay.id 
                                  ? 'ring-2 ring-blue-500 ring-offset-2' 
                                  : 'hover:ring-1 hover:ring-blue-300'
                              }`}
                              style={{
                                left: overlay.x * scaleX,
                                top: overlay.y * scaleY,
                                transform: 'translate(-50%, -50%)',
                                fontSize: overlay.fontSize * scaleX,
                                color: overlay.color,
                                fontWeight: overlay.fontWeight,
                                backgroundColor: overlay.backgroundColor === 'transparent' ? 'rgba(0,0,0,0.3)' : overlay.backgroundColor,
                                textShadow: overlay.backgroundColor === 'transparent' ? '1px 1px 2px rgba(0,0,0,0.8)' : 'none'
                              }}
                            >
                              {overlay.text}
                            </div>
                          );
                        })}
                      </>
                    )}
                  </div>
                </div>

                {/* File Info */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" /> File Info
                  </h4>
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
                    <div className="flex justify-between">
                      <span className="text-gray-500">Overlays:</span>
                      <span className="font-medium">{overlays.length}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="lg:col-span-2 space-y-4">
                {/* Quick Add Buttons */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Quick Add
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => addOverlay('name')}
                      className="flex items-center gap-2"
                    >
                      <User className="w-4 h-4" /> Add Name
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => addOverlay('date')}
                      className="flex items-center gap-2"
                    >
                      <Calendar className="w-4 h-4" /> Add Date
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => addOverlay('custom')}
                      className="flex items-center gap-2 col-span-2"
                    >
                      <Type className="w-4 h-4" /> Add Custom Text
                    </Button>
                  </div>
                </div>

                {/* Selected Overlay Controls */}
                {selectedOverlayData && (
                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-semibold text-blue-900 flex items-center gap-2">
                        <Type className="w-4 h-4" /> Edit Text
                      </h4>
                      <button 
                        onClick={() => deleteOverlay(selectedOverlayData.id)}
                        className="p-1.5 text-red-500 hover:bg-red-100 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="space-y-3">
                      {/* Text Input */}
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Text Content</label>
                        <input
                          type="text"
                          value={selectedOverlayData.text}
                          onChange={(e) => updateOverlay(selectedOverlayData.id, { text: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      {/* Font Size */}
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Font Size: {selectedOverlayData.fontSize}px</label>
                        <input
                          type="range"
                          min="10"
                          max="72"
                          value={selectedOverlayData.fontSize}
                          onChange={(e) => updateOverlay(selectedOverlayData.id, { fontSize: parseInt(e.target.value) })}
                          className="w-full"
                        />
                      </div>

                      {/* Text Color */}
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Text Color</label>
                        <div className="flex flex-wrap gap-1.5">
                          {PRESET_COLORS.map(color => (
                            <button
                              key={color}
                              onClick={() => updateOverlay(selectedOverlayData.id, { color })}
                              className={`w-7 h-7 rounded-full border-2 transition-all ${
                                selectedOverlayData.color === color ? 'border-blue-500 scale-110' : 'border-gray-200'
                              }`}
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Background Color */}
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Background</label>
                        <div className="flex flex-wrap gap-1.5">
                          {PRESET_BG_COLORS.map(color => (
                            <button
                              key={color}
                              onClick={() => updateOverlay(selectedOverlayData.id, { backgroundColor: color })}
                              className={`w-7 h-7 rounded-full border-2 transition-all ${
                                selectedOverlayData.backgroundColor === color ? 'border-blue-500 scale-110' : 'border-gray-200'
                              } ${color === 'transparent' ? 'bg-gray-100 relative' : ''}`}
                              style={{ backgroundColor: color === 'transparent' ? 'transparent' : color }}
                            >
                              {color === 'transparent' && (
                                <span className="absolute inset-0 flex items-center justify-center text-[8px] text-gray-500">✕</span>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Position */}
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">X Position</label>
                          <input
                            type="number"
                            value={Math.round(selectedOverlayData.x)}
                            onChange={(e) => updateOverlay(selectedOverlayData.id, { x: parseInt(e.target.value) || 0 })}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Y Position</label>
                          <input
                            type="number"
                            value={Math.round(selectedOverlayData.y)}
                            onChange={(e) => updateOverlay(selectedOverlayData.id, { y: parseInt(e.target.value) || 0 })}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Overlay List */}
                {overlays.length > 0 && (
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Text Layers ({overlays.length})</h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {overlays.map((overlay, index) => (
                        <div
                          key={overlay.id}
                          onClick={() => setSelectedOverlay(overlay.id)}
                          className={`p-2 rounded-lg cursor-pointer flex items-center justify-between transition-colors ${
                            selectedOverlay === overlay.id ? 'bg-blue-100 border border-blue-200' : 'bg-white border border-gray-100 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-400">#{index + 1}</span>
                            <span className="text-sm font-medium truncate max-w-[150px]">{overlay.text}</span>
                          </div>
                          <button
                            onClick={(e) => { e.stopPropagation(); deleteOverlay(overlay.id); }}
                            className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col gap-2">
                  <Button 
                    onClick={processImage} 
                    disabled={isProcessing || overlays.length === 0} 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5"
                  >
                    {isProcessing ? (
                      <><RotateCcw className="w-4 h-4 mr-2 animate-spin" />Processing...</>
                    ) : processedImage ? (
                      <><ImageIcon className="w-4 h-4 mr-2" />Re-process</>
                    ) : (
                      <><ImageIcon className="w-4 h-4 mr-2" />Apply Text & Download</>
                    )}
                  </Button>
                  
                  {processedImage && (
                    <Button 
                      onClick={downloadImage} 
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-5"
                    >
                      <Download className="w-4 h-4 mr-2" /> Download Photo
                    </Button>
                  )}
                  
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={resetImage} className="flex-1">
                      <RotateCcw className="w-4 h-4 mr-2" /> Reset
                    </Button>
                    <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="flex-1">
                      <Upload className="w-4 h-4 mr-2" /> New
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Hidden canvas for processing */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default PhotoTextOverlay;
