import { useState } from 'react';
import { Upload, Clock, BarChart3, Shield } from 'lucide-react';
import UploadPage from './components/UploadPage';
import HistoryPage from './components/HistoryPage';
import ResultPage from './components/ResultPage';
import AnalyticsPage from './components/AnalyticsPage';

type Page = 'upload' | 'history' | 'analytics' | 'result';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('upload');
  const [selectedImageId, setSelectedImageId] = useState<string>('');

  const navigate = (page: string, id?: string) => {
    setCurrentPage(page as Page);
    if (id) setSelectedImageId(id);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">SafetySnap</h1>
                <p className="text-xs text-gray-600">PPE Detection System</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => navigate('upload')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentPage === 'upload'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Upload className="w-5 h-5" />
                Upload
              </button>

              <button
                onClick={() => navigate('history')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentPage === 'history'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Clock className="w-5 h-5" />
                History
              </button>

              <button
                onClick={() => navigate('analytics')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentPage === 'analytics'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <BarChart3 className="w-5 h-5" />
                Analytics
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {currentPage === 'upload' && <UploadPage onNavigate={navigate} />}
        {currentPage === 'history' && <HistoryPage onNavigate={navigate} />}
        {currentPage === 'analytics' && <AnalyticsPage />}
        {currentPage === 'result' && (
          <ResultPage imageId={selectedImageId} onNavigate={navigate} />
        )}
      </main>

      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">About SafetySnap</h3>
              <p className="text-sm text-gray-600">
                Advanced PPE detection system for construction site safety monitoring
                and compliance verification.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Features</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>Real-time PPE detection</li>
                <li>Normalized bounding boxes</li>
                <li>Duplicate file prevention</li>
                <li>Advanced filtering and analytics</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Detection Types</h3>
              <div className="flex flex-wrap gap-2">
                {['Helmet', 'Vest', 'Gloves', 'Boots', 'Mask'].map(label => (
                  <span
                    key={label}
                    className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full"
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-600">
            SafetySnap - PPE Detection System
          </div>
        </div>
      </footer>
    </div>
  );
}
