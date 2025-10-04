import { useState } from 'react';
import { Upload, CheckCircle, AlertCircle } from 'lucide-react';
import { imageStore } from '../services/imageStore';
import { ImageRecord } from '../types';

interface UploadPageProps {
  onNavigate: (page: string, id?: string) => void;
}

export default function UploadPage({ onNavigate }: UploadPageProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<ImageRecord | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    setUploading(true);
    setError(null);
    setUploadedImage(null);

    try {
      const result = await imageStore.uploadImage(file);
      setUploadedImage(result);
      setTimeout(() => {
        onNavigate('result', result.id);
      }, 1500);
    } catch (err) {
      setError('Failed to upload and process image');
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Upload Image for PPE Analysis
        </h1>
        <p className="text-lg text-gray-600">
          Upload construction site images to detect safety equipment like helmets, vests, and more
        </p>
      </div>

      <div
        className={`relative border-2 border-dashed rounded-2xl p-12 transition-all duration-200 ${
          dragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="file-upload"
          className="hidden"
          accept="image/*"
          onChange={handleFileInput}
          disabled={uploading}
        />

        <label
          htmlFor="file-upload"
          className="flex flex-col items-center cursor-pointer"
        >
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 ${
            uploading ? 'bg-blue-100' : 'bg-gray-100'
          }`}>
            <Upload className={`w-10 h-10 ${
              uploading ? 'text-blue-600 animate-pulse' : 'text-gray-600'
            }`} />
          </div>

          {uploading ? (
            <div className="text-center">
              <p className="text-xl font-semibold text-gray-900 mb-2">
                Processing Image...
              </p>
              <p className="text-gray-600">
                Analyzing for PPE equipment
              </p>
            </div>
          ) : uploadedImage ? (
            <div className="text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <p className="text-xl font-semibold text-gray-900 mb-2">
                Upload Complete!
              </p>
              <p className="text-gray-600">
                Found {uploadedImage.detections.length} PPE items
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Redirecting to results...
              </p>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-xl font-semibold text-gray-900 mb-2">
                Drop your image here, or click to browse
              </p>
              <p className="text-gray-600 mb-4">
                Supports JPG, PNG, and other image formats
              </p>
              <div className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                Select Image
              </div>
            </div>
          )}
        </label>
      </div>

      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
            <Upload className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Quick Upload</h3>
          <p className="text-sm text-gray-600">
            Drag and drop or click to select images from your device
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Auto Detection</h3>
          <p className="text-sm text-gray-600">
            AI automatically detects helmets, vests, and other PPE equipment
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
            <AlertCircle className="w-6 h-6 text-orange-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Instant Results</h3>
          <p className="text-sm text-gray-600">
            View detailed detection results with bounding boxes and confidence scores
          </p>
        </div>
      </div>
    </div>
  );
}
