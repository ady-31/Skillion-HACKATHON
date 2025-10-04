import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Download, Trash2, Hash, Calendar, FileText } from 'lucide-react';
import { imageStore } from '../services/imageStore';
import { ImageRecord } from '../types';

interface ResultPageProps {
  imageId: string;
  onNavigate: (page: string) => void;
}

export default function ResultPage({ imageId, onNavigate }: ResultPageProps) {
  const [image, setImage] = useState<ImageRecord | null>(null);
  const [showJson, setShowJson] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = imageStore.getImageById(imageId);
    setImage(img);
  }, [imageId]);

  useEffect(() => {
    if (image && imgRef.current && canvasRef.current) {
      drawDetections();
    }
  }, [image]);

  const drawDetections = () => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img || !image) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    ctx.drawImage(img, 0, 0);

    const colors: Record<string, string> = {
      helmet: '#3B82F6',
      vest: '#F59E0B',
      gloves: '#10B981',
      boots: '#8B5CF6',
      mask: '#EF4444'
    };

    image.detections.forEach((detection) => {
      const x = detection.bbox.x * canvas.width;
      const y = detection.bbox.y * canvas.height;
      const width = detection.bbox.width * canvas.width;
      const height = detection.bbox.height * canvas.height;

      const color = colors[detection.label] || '#6B7280';

      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.strokeRect(x, y, width, height);

      ctx.fillStyle = color;
      ctx.fillRect(x, y - 25, width, 25);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 14px sans-serif';
      ctx.fillText(
        `${detection.label} ${(detection.confidence * 100).toFixed(1)}%`,
        x + 5,
        y - 7
      );
    });
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this image?')) {
      imageStore.deleteImage(imageId);
      onNavigate('history');
    }
  };

  const downloadJson = () => {
    if (!image) return;

    const jsonData = {
      id: image.id,
      filename: image.filename,
      detections_hash: image.detectionsHash,
      uploaded_at: image.uploadedAt,
      detections: image.detections.map(d => ({
        label: d.label,
        confidence: d.confidence,
        bbox: {
          x: d.bbox.x,
          y: d.bbox.y,
          width: d.bbox.width,
          height: d.bbox.height
        }
      }))
    };

    const blob = new Blob([JSON.stringify(jsonData, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${image.filename.split('.')[0]}_detections.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!image) {
    return (
      <div className="max-w-7xl mx-auto text-center py-16">
        <p className="text-xl text-gray-600">Image not found</p>
        <button
          onClick={() => onNavigate('history')}
          className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
        >
          Back to History
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => onNavigate('history')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to History
        </button>

        <div className="flex gap-3">
          <button
            onClick={() => setShowJson(!showJson)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            <FileText className="w-5 h-5" />
            {showJson ? 'Hide' : 'Show'} JSON
          </button>
          <button
            onClick={downloadJson}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            <Download className="w-5 h-5" />
            Download JSON
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
          >
            <Trash2 className="w-5 h-5" />
            Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-xl font-semibold text-gray-900">
                Detection Results
              </h2>
            </div>
            <div className="p-6">
              <div className="relative bg-gray-100 rounded-lg overflow-hidden">
                <img
                  ref={imgRef}
                  src={image.fileUrl}
                  alt={image.filename}
                  className="hidden"
                  onLoad={drawDetections}
                />
                <canvas
                  ref={canvasRef}
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>

          {showJson && (
            <div className="mt-6 bg-gray-900 rounded-xl overflow-hidden">
              <div className="p-4 border-b border-gray-700">
                <h3 className="text-lg font-semibold text-white">JSON Output</h3>
              </div>
              <pre className="p-6 text-sm text-green-400 overflow-x-auto">
                {JSON.stringify(
                  {
                    id: image.id,
                    filename: image.filename,
                    detections_hash: image.detectionsHash,
                    uploaded_at: image.uploadedAt,
                    detections: image.detections.map(d => ({
                      label: d.label,
                      confidence: d.confidence,
                      bbox: {
                        x: d.bbox.x,
                        y: d.bbox.y,
                        width: d.bbox.width,
                        height: d.bbox.height
                      }
                    }))
                  },
                  null,
                  2
                )}
              </pre>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Image Details
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                  <FileText className="w-4 h-4" />
                  Filename
                </div>
                <p className="text-gray-900 font-medium break-all">
                  {image.filename}
                </p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                  <Calendar className="w-4 h-4" />
                  Uploaded
                </div>
                <p className="text-gray-900 font-medium">
                  {new Date(image.uploadedAt).toLocaleString()}
                </p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                  <Hash className="w-4 h-4" />
                  Detections Hash
                </div>
                <p className="text-gray-900 font-mono text-sm break-all">
                  {image.detectionsHash}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Detections ({image.detections.length})
            </h3>
            <div className="space-y-3">
              {image.detections.map((detection, index) => (
                <div
                  key={detection.id}
                  className="p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-900 capitalize">
                      {detection.label}
                    </span>
                    <span className="text-sm text-gray-600">
                      {(detection.confidence * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="text-xs text-gray-600 space-y-1">
                    <div className="grid grid-cols-2 gap-2">
                      <span>X: {detection.bbox.x.toFixed(3)}</span>
                      <span>Y: {detection.bbox.y.toFixed(3)}</span>
                      <span>W: {detection.bbox.width.toFixed(3)}</span>
                      <span>H: {detection.bbox.height.toFixed(3)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h4 className="font-semibold text-blue-900 mb-2">
              About Bounding Boxes
            </h4>
            <p className="text-sm text-blue-800">
              All bounding box coordinates are normalized between 0 and 1,
              relative to the image dimensions. Multiply by image width/height
              to get pixel coordinates.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
