import { useState } from 'react';
import { FileText, ClipboardList } from 'lucide-react';
import { DRNStatusTable } from './components/DRNStatusTable';
import { UCMStatusTable } from './components/UCMStatusTable';

function App() {
  const [activeTab, setActiveTab] = useState<'drn' | 'ucm'>('drn');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Status Dashboard</h1>
          <p className="text-gray-600">Manage DRN and UCM status tracking</p>
        </header>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('drn')}
              className={`flex items-center gap-2 px-6 py-4 font-semibold transition-colors ${
                activeTab === 'drn'
                  ? 'bg-blue-600 text-white border-b-2 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <FileText size={20} />
              DRN Status
            </button>
            <button
              onClick={() => setActiveTab('ucm')}
              className={`flex items-center gap-2 px-6 py-4 font-semibold transition-colors ${
                activeTab === 'ucm'
                  ? 'bg-blue-600 text-white border-b-2 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <ClipboardList size={20} />
              UCM Status
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'drn' ? <DRNStatusTable /> : <UCMStatusTable />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
