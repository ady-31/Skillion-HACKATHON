import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Image as ImageIcon, Shield } from 'lucide-react';
import { imageStore } from '../services/imageStore';

export default function AnalyticsPage() {
  const [stats, setStats] = useState({
    totalImages: 0,
    totalDetections: 0,
    labelCounts: {} as Record<string, number>,
    recentImages: [] as any[]
  });

  useEffect(() => {
    const data = imageStore.getStats();
    setStats(data);
  }, []);

  const labelColors: Record<string, string> = {
    helmet: 'bg-blue-500',
    vest: 'bg-orange-500',
    gloves: 'bg-green-500',
    boots: 'bg-purple-500',
    mask: 'bg-red-500'
  };

  const maxCount = Math.max(...Object.values(stats.labelCounts), 1);

  const averageDetectionsPerImage = stats.totalImages > 0
    ? (stats.totalDetections / stats.totalImages).toFixed(1)
    : '0';

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
        <p className="text-gray-600">
          Overview of PPE detection statistics and trends
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <ImageIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Images</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalImages}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Detections</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalDetections}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Avg per Image</p>
              <p className="text-2xl font-bold text-gray-900">
                {averageDetectionsPerImage}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">PPE Types</p>
              <p className="text-2xl font-bold text-gray-900">
                {Object.keys(stats.labelCounts).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Detection by PPE Type
          </h2>

          {Object.keys(stats.labelCounts).length === 0 ? (
            <div className="text-center py-12">
              <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No detections yet</p>
              <p className="text-sm text-gray-500 mt-1">
                Upload images to see analytics
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(stats.labelCounts)
                .sort(([, a], [, b]) => b - a)
                .map(([label, count]) => {
                  const percentage = (count / maxCount) * 100;
                  return (
                    <div key={label}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-900 capitalize">
                          {label}
                        </span>
                        <span className="text-sm text-gray-600">
                          {count} detection{count !== 1 ? 's' : ''}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            labelColors[label] || 'bg-gray-500'
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Label Distribution
          </h2>

          {Object.keys(stats.labelCounts).length === 0 ? (
            <div className="text-center py-12">
              <Shield className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No data available</p>
            </div>
          ) : (
            <div className="space-y-3">
              {Object.entries(stats.labelCounts)
                .sort(([, a], [, b]) => b - a)
                .map(([label, count]) => {
                  const percentage = ((count / stats.totalDetections) * 100).toFixed(1);
                  return (
                    <div
                      key={label}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-4 h-4 rounded ${
                            labelColors[label] || 'bg-gray-500'
                          }`}
                        />
                        <span className="font-medium text-gray-900 capitalize">
                          {label}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900">
                          {percentage}%
                        </div>
                        <div className="text-xs text-gray-600">
                          {count} of {stats.totalDetections}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Recent Uploads
        </h2>

        {stats.recentImages.length === 0 ? (
          <div className="text-center py-12">
            <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No recent uploads</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Filename
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Uploaded
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">
                    Detections
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Labels
                  </th>
                </tr>
              </thead>
              <tbody>
                {stats.recentImages.map((image) => (
                  <tr key={image.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-900">
                      {image.filename}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {new Date(image.uploadedAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-sm text-center font-medium text-gray-900">
                      {image.detections.length}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-1 flex-wrap">
                        {Array.from(new Set(image.detections.map((d: any) => d.label))).map((label: string) => (
                          <span
                            key={label}
                            className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded"
                          >
                            {label}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="font-semibold text-blue-900 mb-2">
            Real-time Processing
          </h3>
          <p className="text-sm text-blue-800">
            All images are processed instantly upon upload with immediate detection results.
          </p>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
          <h3 className="font-semibold text-green-900 mb-2">
            Normalized Coordinates
          </h3>
          <p className="text-sm text-green-800">
            Bounding boxes use normalized values (0-1) for consistent results across different image sizes.
          </p>
        </div>

        <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
          <h3 className="font-semibold text-orange-900 mb-2">
            Duplicate Prevention
          </h3>
          <p className="text-sm text-orange-800">
            File hashing ensures duplicate uploads return existing results instead of reprocessing.
          </p>
        </div>
      </div>
    </div>
  );
}
