import { useState, useEffect } from 'react';
import { Calendar, Filter, Trash2, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { imageStore } from '../services/imageStore';
import { getAllLabels } from '../services/ppeDetection';
import { ImageRecord } from '../types';

interface HistoryPageProps {
  onNavigate: (page: string, id?: string) => void;
}

export default function HistoryPage({ onNavigate }: HistoryPageProps) {
  const [images, setImages] = useState<ImageRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [limit] = useState(9);
  const [selectedLabel, setSelectedLabel] = useState<string>('');
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);
  const availableLabels = getAllLabels();

  const loadImages = () => {
    const result = imageStore.getImages({
      limit,
      offset: currentPage * limit,
      label: selectedLabel || undefined,
      from: dateFrom || undefined,
      to: dateTo || undefined
    });
    setImages(result.data);
    setTotal(result.total);
  };

  useEffect(() => {
    loadImages();
  }, [currentPage, selectedLabel, dateFrom, dateTo]);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this image?')) {
      imageStore.deleteImage(id);
      loadImages();
    }
  };

  const clearFilters = () => {
    setSelectedLabel('');
    setDateFrom('');
    setDateTo('');
    setCurrentPage(0);
  };

  const totalPages = Math.ceil(total / limit);
  const hasFilters = selectedLabel || dateFrom || dateTo;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Image History</h1>
          <p className="text-gray-600">
            {total} {total === 1 ? 'image' : 'images'} uploaded
          </p>
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            showFilters || hasFilters
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Filter className="w-5 h-5" />
          Filters
          {hasFilters && <span className="w-2 h-2 bg-white rounded-full" />}
        </button>
      </div>

      {showFilters && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                PPE Label
              </label>
              <select
                value={selectedLabel}
                onChange={(e) => {
                  setSelectedLabel(e.target.value);
                  setCurrentPage(0);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Labels</option>
                {availableLabels.map(label => (
                  <option key={label} value={label}>
                    {label.charAt(0).toUpperCase() + label.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                From Date
              </label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => {
                  setDateFrom(e.target.value);
                  setCurrentPage(0);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                To Date
              </label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => {
                  setDateTo(e.target.value);
                  setCurrentPage(0);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {hasFilters && (
            <div className="mt-4 flex justify-end">
              <button
                onClick={clearFilters}
                className="text-sm text-gray-600 hover:text-gray-900 font-medium"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      )}

      {images.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {hasFilters ? 'No images match your filters' : 'No images uploaded yet'}
          </h3>
          <p className="text-gray-600 mb-6">
            {hasFilters
              ? 'Try adjusting your filters to see more results'
              : 'Upload your first image to get started with PPE detection'}
          </p>
          {hasFilters ? (
            <button
              onClick={clearFilters}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Clear Filters
            </button>
          ) : (
            <button
              onClick={() => onNavigate('upload')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Upload Image
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {images.map((image) => (
              <div
                key={image.id}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
                onClick={() => onNavigate('result', image.id)}
              >
                <div className="aspect-video bg-gray-100 relative overflow-hidden">
                  <img
                    src={image.fileUrl}
                    alt={image.filename}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3 flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigate('result', image.id);
                      }}
                      className="p-2 bg-white rounded-lg shadow-md hover:bg-gray-50 transition-colors"
                    >
                      <Eye className="w-4 h-4 text-gray-700" />
                    </button>
                    <button
                      onClick={(e) => handleDelete(image.id, e)}
                      className="p-2 bg-white rounded-lg shadow-md hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 truncate">
                    {image.filename}
                  </h3>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">
                      {image.detections.length} detection{image.detections.length !== 1 ? 's' : ''}
                    </span>
                    <span className="text-gray-500">
                      {new Date(image.uploadedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {Array.from(new Set(image.detections.map(d => d.label))).slice(0, 3).map((label) => (
                      <span
                        key={label}
                        className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded"
                      >
                        {label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                disabled={currentPage === 0}
                className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                      currentPage === page
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {page + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
                disabled={currentPage === totalPages - 1}
                className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
