import { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { 
  Upload, 
  Download, 
  RotateCcw, 
  Image as ImageIcon,
  FileImage,
  Check,
  X,
  ArrowLeft,
  Lock,
  Unlock,
  Crop,
  Maximize,
  AlertCircle,
  Move,
  ZoomIn,
  ZoomOut,
  RotateCw,
  ArrowUp,
  ArrowDown,
  ArrowRight
} from 'lucide-react';

interface PhotoResizerProps {
  onClose: () => void;
  title?: string;
  defaultWidth?: number;
  defaultHeight?: number;
  defaultMaxKB?: number;
  aspectRatio?: number | null;
  minKB?: number;
}

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

const PRESET_RATIOS = [
  { name: 'Free', value: null as number | null },
  { name: '1:1', value: 1 },
  { name: '4:5', value: 4/5 },
  { name: '5:4', value: 5/4 },
  { name: '5:2 Sig', value: 5/2 },
  { name: '2:5', value: 2/5 },
  { name: '3:4', value: 3/4 },
  { name: '4:3', value: 4/3 },
  { name: '16:9', value: 16/9 },
];

const PhotoResizer = ({ 
  onClose, 
  title = 'Photo Resizer',
  defaultWidth = 350,
  defaultHeight = 350,
  defaultMaxKB = 50,
  aspectRatio: defaultAspectRatio = null,
  minKB = 0
}: PhotoResizerProps) => {
  const [image, setImage] = useState<string | null>(null);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [width, setWidth] = useState(defaultWidth);
  const [height, setHeight] = useState(defaultHeight);
  const [quality, setQuality] = useState(90);
  const [maxKB, setMaxKB] = useState(defaultMaxKB);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [processedSize, setProcessedSize] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<number | null>(defaultAspectRatio);
  const [lockRatio, setLockRatio] = useState(!!defaultAspectRatio);
  const [showCropOverlay, setShowCropOverlay] = useState(true);
  const [originalWidth, setOriginalWidth] = useState(0);
  const [originalHeight, setOriginalHeight] = useState(0);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Crop state
  const [cropArea, setCropArea] = useState<CropArea>({ x: 0, y: 0, width: 0, height: 0 });
  const [, setDisplayScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<string>('');
  const containerRef = useRef<HTMLDivElement>(null);

  // Reset state when props change (new tool opened)
  useEffect(() => {
    setImage(null);
    setOriginalImage(null);
    setFileName('');
    setWidth(defaultWidth);
    setHeight(defaultHeight);
    setQuality(90);
    setMaxKB(defaultMaxKB);
    setProcessedImage(null);
    setOriginalSize(0);
    setProcessedSize(0);
    setIsProcessing(false);
    setAspectRatio(defaultAspectRatio);
    setLockRatio(!!defaultAspectRatio);
    setShowCropOverlay(true);
    setOriginalWidth(0);
    setOriginalHeight(0);
    setError('');
    setCropArea({ x: 0, y: 0, width: 0, height: 0 });
    setDisplayScale(1);
  }, [title, defaultWidth, defaultHeight, defaultMaxKB, defaultAspectRatio, minKB]);

  // Initialize crop area when image loads
  useEffect(() => {
    if (image && originalWidth && originalHeight) {
      initializeCropArea();
    }
  }, [image, originalWidth, originalHeight, aspectRatio]);

  const initializeCropArea = () => {
    let cropW, cropH;
    
    if (aspectRatio) {
      // Fit within the target dimensions while maintaining aspect ratio
      const targetRatio = aspectRatio;
      const imgRatio = originalWidth / originalHeight;
      
      if (imgRatio > targetRatio) {
        cropH = originalHeight * 0.8;
        cropW = cropH * targetRatio;
      } else {
        cropW = originalWidth * 0.8;
        cropH = cropW / targetRatio;
      }
    } else {
      // Default crop to 80% of image
      cropW = originalWidth * 0.8;
      cropH = originalHeight * 0.8;
    }

    // Center the crop area
    const x = (originalWidth - cropW) / 2;
    const y = (originalHeight - cropH) / 2;

    setCropArea({
      x: Math.max(0, x),
      y: Math.max(0, y),
      width: Math.min(cropW, originalWidth),
      height: Math.min(cropH, originalHeight)
    });
  };

  // Calculate actual file size from base64
  const getBase64Size = (base64String: string): number => {
    const base64Length = base64String.split(',')[1]?.length || 0;
    return Math.round((base64Length * 3) / 4);
  };

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError('');
    
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (JPG, PNG)');
      return;
    }
    
    if (file.size > 10 * 1024 * 1024) {
      setError('File size should be less than 10MB');
      return;
    }

    setFileName(file.name);
    setOriginalSize(file.size);
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        setOriginalWidth(img.width);
        setOriginalHeight(img.height);
        
        // Calculate dimensions based on aspect ratio
        let newWidth = defaultWidth;
        let newHeight = defaultHeight;
        
        if (aspectRatio && lockRatio) {
          const targetRatio = aspectRatio;
          const imgRatio = img.width / img.height;
          
          if (imgRatio > targetRatio) {
            newHeight = Math.min(defaultHeight, img.height);
            newWidth = newHeight * targetRatio;
          } else {
            newWidth = Math.min(defaultWidth, img.width);
            newHeight = newWidth / targetRatio;
          }
        } else {
          newWidth = Math.min(defaultWidth, img.width);
          newHeight = Math.min(defaultHeight, img.height);
        }
        
        setWidth(Math.round(newWidth));
        setHeight(Math.round(newHeight));
      };
      img.src = event.target?.result as string;
      setImage(event.target?.result as string);
      setOriginalImage(event.target?.result as string);
      setProcessedImage(null);
    };
    reader.readAsDataURL(file);
  }, [aspectRatio, lockRatio, defaultWidth, defaultHeight]);

  useEffect(() => {
    if (lockRatio && aspectRatio && image) {
      const newHeight = Math.round(width / aspectRatio);
      if (newHeight !== height) {
        setHeight(newHeight);
      }
    }
  }, [width, aspectRatio, lockRatio, image, height]);

  // Crop movement functions
  const moveCrop = (dx: number, dy: number) => {
    setCropArea(prev => ({
      ...prev,
      x: Math.max(0, Math.min(originalWidth - prev.width, prev.x + dx)),
      y: Math.max(0, Math.min(originalHeight - prev.height, prev.y + dy))
    }));
  };

  const zoomCrop = (factor: number) => {
    setCropArea(prev => {
      const newWidth = Math.max(50, Math.min(originalWidth, prev.width * factor));
      const newHeight = aspectRatio 
        ? newWidth / aspectRatio 
        : Math.max(50, Math.min(originalHeight, prev.height * factor));
      
      // Keep center point
      const centerX = prev.x + prev.width / 2;
      const centerY = prev.y + prev.height / 2;
      
      let newX = centerX - newWidth / 2;
      let newY = centerY - newHeight / 2;
      
      // Clamp to image bounds
      newX = Math.max(0, Math.min(originalWidth - newWidth, newX));
      newY = Math.max(0, Math.min(originalHeight - newHeight, newY));
      
      return {
        x: newX,
        y: newY,
        width: newWidth,
        height: newHeight
      };
    });
  };

  // Mouse handlers for drag
  const handleMouseDown = (e: React.MouseEvent, type: 'move' | 'resize', handle?: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (type === 'move') {
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
    } else if (type === 'resize' && handle) {
      setIsResizing(true);
      setResizeHandle(handle);
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const scaleX = originalWidth / rect.width;
    const scaleY = originalHeight / rect.height;
    
    if (isDragging) {
      const dx = (e.clientX - dragStart.x) * scaleX;
      const dy = (e.clientY - dragStart.y) * scaleY;
      
      setCropArea(prev => ({
        ...prev,
        x: Math.max(0, Math.min(originalWidth - prev.width, prev.x + dx)),
        y: Math.max(0, Math.min(originalHeight - prev.height, prev.y + dy))
      }));
      
      setDragStart({ x: e.clientX, y: e.clientY });
    } else if (isResizing) {
      const dx = (e.clientX - dragStart.x) * scaleX;
      const dy = (e.clientY - dragStart.y) * scaleY;
      
      setCropArea(prev => {
        let newX = prev.x;
        let newY = prev.y;
        let newW = prev.width;
        let newH = prev.height;
        
        if (resizeHandle.includes('e')) newW = Math.max(50, Math.min(originalWidth - prev.x, prev.width + dx));
        if (resizeHandle.includes('w')) {
          const delta = Math.min(prev.x, dx);
          newX = prev.x - delta;
          newW = prev.width + delta;
          if (newW < 50) {
            newX = prev.x + prev.width - 50;
            newW = 50;
          }
        }
        if (resizeHandle.includes('s')) newH = Math.max(50, Math.min(originalHeight - prev.y, prev.height + dy));
        if (resizeHandle.includes('n')) {
          const delta = Math.min(prev.y, dy);
          newY = prev.y - delta;
          newH = prev.height + delta;
          if (newH < 50) {
            newY = prev.y + prev.height - 50;
            newH = 50;
          }
        }
        
        // Maintain aspect ratio if locked
        if (aspectRatio && lockRatio) {
          if (resizeHandle.includes('e') || resizeHandle.includes('w')) {
            newH = newW / aspectRatio;
          } else {
            newW = newH * aspectRatio;
          }
        }
        
        return { x: newX, y: newY, width: newW, height: newH };
      });
      
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  }, [isDragging, isResizing, dragStart, originalWidth, originalHeight, aspectRatio, lockRatio, resizeHandle]);

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
    setResizeHandle('');
  };

  // Iterative compression to hit target size
  const compressToTarget = (
    canvas: HTMLCanvasElement, 
    targetKB: number, 
    minKB: number
  ): { dataUrl: string; quality: number; actualKB: number } => {
    let low = 0.1;
    let high = 1.0;
    let bestResult = canvas.toDataURL('image/jpeg', 0.1);
    let bestQuality = 0.1;
    let bestSize = getBase64Size(bestResult) / 1024;
    
    for (let i = 0; i < 15; i++) {
      const mid = (low + high) / 2;
      const result = canvas.toDataURL('image/jpeg', mid);
      const sizeKB = getBase64Size(result) / 1024;
      
      if (sizeKB <= targetKB && sizeKB >= minKB * 0.8) {
        bestResult = result;
        bestQuality = mid;
        bestSize = sizeKB;
        low = mid;
      } else if (sizeKB > targetKB) {
        high = mid;
      } else {
        low = mid;
        bestResult = result;
        bestQuality = mid;
        bestSize = sizeKB;
      }
    }
    
    if (bestSize > targetKB) {
      return resizeAndCompress(canvas, targetKB);
    }
    
    return { dataUrl: bestResult, quality: bestQuality, actualKB: bestSize };
  };

  const resizeAndCompress = (
    originalCanvas: HTMLCanvasElement,
    targetKB: number
  ): { dataUrl: string; quality: number; actualKB: number } => {
    let scale = 0.9;
    let bestResult = originalCanvas.toDataURL('image/jpeg', 0.1);
    let bestSize = getBase64Size(bestResult) / 1024;
    
    while (scale > 0.1 && bestSize > targetKB) {
      const newCanvas = document.createElement('canvas');
      newCanvas.width = originalCanvas.width * scale;
      newCanvas.height = originalCanvas.height * scale;
      
      const ctx = newCanvas.getContext('2d');
      if (ctx) {
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(originalCanvas, 0, 0, newCanvas.width, newCanvas.height);
        
        for (let q = 1.0; q >= 0.1; q -= 0.1) {
          const result = newCanvas.toDataURL('image/jpeg', q);
          const sizeKB = getBase64Size(result) / 1024;
          
          if (sizeKB <= targetKB) {
            bestResult = result;
            bestSize = sizeKB;
            break;
          }
        }
      }
      
      if (bestSize <= targetKB) break;
      scale -= 0.1;
    }
    
    return { dataUrl: bestResult, quality: 0.5, actualKB: bestSize };
  };

  const processImage = useCallback(() => {
    if (!image) return;
    setIsProcessing(true);
    setError('');
    
    setTimeout(() => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          setError('Canvas not supported');
          setIsProcessing(false);
          return;
        }

        const img = new Image();
        img.onload = () => {
          canvas.width = width;
          canvas.height = height;
          
          // Apply white background for JPEG
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, width, height);
          
          // Use crop area coordinates
          ctx.drawImage(
            img, 
            cropArea.x, 
            cropArea.y, 
            cropArea.width, 
            cropArea.height,
            0, 
            0, 
            width, 
            height
          );
          
          // Compress to target size
          const result = compressToTarget(canvas, maxKB, minKB);
          
          setProcessedImage(result.dataUrl);
          setProcessedSize(getBase64Size(result.dataUrl));
          
          if (result.actualKB > maxKB) {
            setError(`Warning: Could not compress below ${maxKB}KB. Final size: ${result.actualKB.toFixed(1)}KB`);
          }
          
          setIsProcessing(false);
        };
        img.onerror = () => {
          setError('Failed to load image');
          setIsProcessing(false);
        };
        img.src = image;
      } catch (err) {
        setError('Processing failed: ' + (err as Error).message);
        setIsProcessing(false);
      }
    }, 100);
  }, [image, width, height, maxKB, minKB, cropArea]);

  const downloadImage = useCallback(() => {
    if (!processedImage) return;
    const link = document.createElement('a');
    link.href = processedImage;
    const downloadName = fileName || 'image.jpg';
    link.download = 'resized_' + downloadName.replace(/\.[^/.]+$/, '') + '.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [processedImage, fileName]);

  const resetImage = useCallback(() => {
    if (originalImage) {
      setImage(originalImage);
      setWidth(defaultWidth);
      setHeight(defaultHeight);
      setProcessedImage(null);
      setError('');
      initializeCropArea();
    }
  }, [originalImage, defaultWidth, defaultHeight]);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleRatioSelect = (ratio: number | null) => {
    setAspectRatio(ratio);
    if (ratio !== null) {
      setLockRatio(true);
      if (image) {
        const newHeight = Math.round(width / ratio);
        setHeight(newHeight);
        // Re-initialize crop with new ratio
        setTimeout(initializeCropArea, 0);
      }
    } else {
      setLockRatio(false);
    }
  };

  const toggleLock = () => {
    if (aspectRatio) {
      setLockRatio(!lockRatio);
    }
  };

  const targetRangeText = minKB > 0 
    ? `${minKB}KB - ${maxKB}KB` 
    : `Max ${maxKB}KB`;

  return (
    <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 lg:p-6 border-b">
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-xl lg:text-2xl font-bold text-gray-900">{title}</h2>
              <p className="text-sm text-gray-500">Target: {targetRangeText} | {width}x{height}px</p>
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
              <div className="lg:col-span-3 space-y-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                      <ImageIcon className="w-4 h-4" /> Preview
                    </h4>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setShowCropOverlay(!showCropOverlay)} 
                        className={showCropOverlay ? 'p-2 rounded-lg text-sm flex items-center gap-1 transition-colors bg-blue-600 text-white' : 'p-2 rounded-lg text-sm flex items-center gap-1 transition-colors bg-white text-gray-600 border'}
                      >
                        <Crop className="w-4 h-4" /> Crop
                      </button>
                    </div>
                  </div>
                  
                  {/* Image with Crop Overlay */}
                  <div 
                    ref={containerRef}
                    className="relative bg-white rounded-lg flex items-center justify-center min-h-[300px] overflow-hidden"
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                  >
                    {processedImage ? (
                      <img src={processedImage} alt="Processed" className="max-w-full max-h-[400px] object-contain" />
                    ) : (
                      <div className="relative">
                        <img src={image} alt="Original" className="max-w-full max-h-[400px] object-contain" />
                        
                        {/* Draggable Crop Overlay */}
                        {showCropOverlay && cropArea.width > 0 && (
                          <div 
                            className="absolute border-2 border-blue-500 bg-blue-500/10 cursor-move"
                            style={{
                              left: `${(cropArea.x / originalWidth) * 100}%`,
                              top: `${(cropArea.y / originalHeight) * 100}%`,
                              width: `${(cropArea.width / originalWidth) * 100}%`,
                              height: `${(cropArea.height / originalHeight) * 100}%`,
                            }}
                            onMouseDown={(e) => handleMouseDown(e, 'move')}
                          >
                            {/* Corner Handles */}
                            <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-blue-600 rounded-full cursor-nw-resize" onMouseDown={(e) => handleMouseDown(e, 'resize', 'nw')} />
                            <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-blue-600 rounded-full cursor-ne-resize" onMouseDown={(e) => handleMouseDown(e, 'resize', 'ne')} />
                            <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-blue-600 rounded-full cursor-sw-resize" onMouseDown={(e) => handleMouseDown(e, 'resize', 'sw')} />
                            <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-blue-600 rounded-full cursor-se-resize" onMouseDown={(e) => handleMouseDown(e, 'resize', 'se')} />
                            
                            {/* Edge Handles */}
                            <div className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-3 h-3 bg-blue-600 rounded-full cursor-w-resize" onMouseDown={(e) => handleMouseDown(e, 'resize', 'w')} />
                            <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-3 bg-blue-600 rounded-full cursor-e-resize" onMouseDown={(e) => handleMouseDown(e, 'resize', 'e')} />
                            <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-blue-600 rounded-full cursor-n-resize" onMouseDown={(e) => handleMouseDown(e, 'resize', 'n')} />
                            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-blue-600 rounded-full cursor-s-resize" onMouseDown={(e) => handleMouseDown(e, 'resize', 's')} />
                            
                            {/* Center crosshair */}
                            <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-blue-600/50" />
                            <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-blue-600/50" />
                            
                            {/* Size label */}
                            <div className="absolute -top-7 left-1/2 -translate-x-1/2 text-xs font-medium text-blue-600 bg-white px-2 py-0.5 rounded shadow whitespace-nowrap">
                              {Math.round(cropArea.width)} × {Math.round(cropArea.height)}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Crop Controls */}
                {!processedImage && showCropOverlay && (
                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                    <h4 className="text-sm font-semibold text-blue-900 mb-3 flex items-center gap-2">
                      <Move className="w-4 h-4" /> Crop Controls
                    </h4>
                    
                    {/* Position Controls */}
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      <div />
                      <button onClick={() => moveCrop(0, -10)} className="p-2 bg-white rounded-lg shadow-sm hover:bg-blue-100 transition-colors flex justify-center">
                        <ArrowUp className="w-4 h-4 text-blue-600" />
                      </button>
                      <div />
                      <button onClick={() => moveCrop(-10, 0)} className="p-2 bg-white rounded-lg shadow-sm hover:bg-blue-100 transition-colors flex justify-center">
                        <ArrowLeft className="w-4 h-4 text-blue-600" />
                      </button>
                      <div className="flex items-center justify-center text-xs text-blue-600 font-medium">
                        Move
                      </div>
                      <button onClick={() => moveCrop(10, 0)} className="p-2 bg-white rounded-lg shadow-sm hover:bg-blue-100 transition-colors flex justify-center">
                        <ArrowRight className="w-4 h-4 text-blue-600" />
                      </button>
                      <div />
                      <button onClick={() => moveCrop(0, 10)} className="p-2 bg-white rounded-lg shadow-sm hover:bg-blue-100 transition-colors flex justify-center">
                        <ArrowDown className="w-4 h-4 text-blue-600" />
                      </button>
                      <div />
                    </div>

                    {/* Zoom Controls */}
                    <div className="flex items-center gap-3">
                      <button onClick={() => zoomCrop(0.9)} className="p-2 bg-white rounded-lg shadow-sm hover:bg-blue-100 transition-colors">
                        <ZoomOut className="w-4 h-4 text-blue-600" />
                      </button>
                      <div className="flex-1">
                        <div className="text-xs text-blue-700 mb-1 text-center">Zoom In/Out</div>
                        <div className="h-1 bg-blue-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-500 transition-all"
                            style={{ width: `${Math.min(100, (cropArea.width / originalWidth) * 200)}%` }}
                          />
                        </div>
                      </div>
                      <button onClick={() => zoomCrop(1.1)} className="p-2 bg-white rounded-lg shadow-sm hover:bg-blue-100 transition-colors">
                        <ZoomIn className="w-4 h-4 text-blue-600" />
                      </button>
                    </div>

                    {/* Reset Crop */}
                    <button 
                      onClick={initializeCropArea}
                      className="mt-3 w-full py-2 text-sm text-blue-700 bg-white hover:bg-blue-100 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <RotateCw className="w-4 h-4" /> Reset Crop Position
                    </button>
                  </div>
                )}

                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <FileImage className="w-4 h-4" /> File Info
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Original Size:</span>
                      <span className="font-medium">{formatBytes(originalSize)}</span>
                    </div>
                    {processedImage && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">New Size:</span>
                        <span className={`font-medium ${processedSize/1024 <= maxKB ? 'text-green-600' : 'text-red-600'}`}>
                          {formatBytes(processedSize)}
                          {processedSize/1024 <= maxKB ? ' ✓' : ' ✗'}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-500">Dimensions:</span>
                      <span className="font-medium">{width} x {height} px</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Crop Area:</span>
                      <span className="font-medium text-blue-600">
                        {Math.round(cropArea.x)}, {Math.round(cropArea.y)} | {Math.round(cropArea.width)} × {Math.round(cropArea.height)}
                      </span>
                    </div>
                    {aspectRatio && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Aspect Ratio:</span>
                        <span className="font-medium text-blue-600">
                          {aspectRatio >= 1 ? aspectRatio.toFixed(2) + ':1' : '1:' + (1/aspectRatio).toFixed(2)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2 space-y-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Maximize className="w-4 h-4" /> Aspect Ratio
                  </h4>
                  <div className="grid grid-cols-3 gap-2">
                    {PRESET_RATIOS.map((preset) => (
                      <button 
                        key={preset.name} 
                        onClick={() => handleRatioSelect(preset.value)} 
                        className={aspectRatio === preset.value ? 'px-2 py-2 text-xs font-medium rounded-lg transition-all bg-blue-600 text-white' : 'px-2 py-2 text-xs font-medium rounded-lg transition-all bg-white text-gray-600 hover:bg-blue-50 border'}
                      >
                        {preset.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-4">Resize Settings</h4>
                  
                  <div className="mb-4">
                    <div className="flex justify-between mb-2">
                      <label className="text-sm text-gray-500">Width (px)</label>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{width}px</span>
                        {aspectRatio && (
                          <button onClick={toggleLock} className={lockRatio ? 'p-1 rounded transition-colors bg-blue-600 text-white' : 'p-1 rounded transition-colors bg-white text-gray-600 border'}>
                            {lockRatio ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                          </button>
                        )}
                      </div>
                    </div>
                    <Slider value={[width]} onValueChange={(v) => setWidth(v[0])} min={50} max={originalWidth || 2000} step={10} className="w-full" />
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex justify-between mb-2">
                      <label className="text-sm text-gray-500">Height (px)</label>
                      <span className="text-sm font-medium">{height}px</span>
                    </div>
                    <Slider value={[height]} onValueChange={(v) => setHeight(v[0])} min={50} max={originalHeight || 2000} step={10} disabled={lockRatio && !!aspectRatio} className="w-full" />
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex justify-between mb-2">
                      <label className="text-sm text-gray-500">Quality</label>
                      <span className="text-sm font-medium">{quality}%</span>
                    </div>
                    <Slider value={[quality]} onValueChange={(v) => setQuality(v[0])} min={10} max={100} step={5} className="w-full" />
                  </div>
                  
                  <div className="mb-2">
                    <div className="flex justify-between mb-2">
                      <label className="text-sm text-gray-500">Target Max Size</label>
                      <span className="text-sm font-medium">{maxKB} KB</span>
                    </div>
                    <Slider value={[maxKB]} onValueChange={(v) => setMaxKB(v[0])} min={10} max={500} step={5} className="w-full" />
                    {minKB > 0 && (
                      <p className="text-xs text-gray-400 mt-1">Min required: {minKB}KB</p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Button 
                    onClick={processImage} 
                    disabled={isProcessing} 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5"
                  >
                    {isProcessing ? (
                      <><RotateCcw className="w-4 h-4 mr-2 animate-spin" />Processing...</>
                    ) : processedImage ? (
                      <><Check className="w-4 h-4 mr-2" />Re-process</>
                    ) : (
                      <><ImageIcon className="w-4 h-4 mr-2" />Process Image</>
                    )}
                  </Button>
                  
                  {processedImage && (
                    <Button 
                      onClick={downloadImage} 
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-5"
                    >
                      <Download className="w-4 h-4 mr-2" /> Download ({formatBytes(processedSize)})
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
    </div>
  );
};

export default PhotoResizer;
