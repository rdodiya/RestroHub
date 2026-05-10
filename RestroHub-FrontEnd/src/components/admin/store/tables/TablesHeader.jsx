import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, ArrowLeft, Download, Loader2, LayoutGrid } from 'lucide-react';

const TablesHeader = ({ branchId, onAddTable, totalTables = 0 }) => {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    try {
      setDownloading(true);
      // 🔌 API call
      await new Promise((r) => setTimeout(r, 500));
      console.log('Download all QRs');
    } catch (err) {
      console.error('Download failed:', err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Left */}
      <div className="flex items-center gap-3">
        <Link
          to="/admin/store/branches"
          className="
            inline-flex h-9 w-9 items-center justify-center
            rounded-lg border border-gray-200 text-gray-600
            hover:bg-gray-50 transition-colors
            sm:h-10 sm:w-10
          "
        >
          <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
        </Link>
        <div>
          <div className="flex items-center gap-2">
            <LayoutGrid className="h-5 w-5 text-blue-600 hidden sm:block" />
            <h2 className="text-lg font-bold text-gray-900 sm:text-2xl">
              Tables
            </h2>
            <span className="rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
              Branch #{branchId}
            </span>
            {totalTables > 0 && (
              <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700">
                {totalTables}
              </span>
            )}
          </div>
          <p className="mt-0.5 text-sm text-gray-500">
            Manage tables and QR codes
          </p>
        </div>
      </div>

      {/* Right */}
      <div className="flex gap-2 sm:gap-3 pl-12 sm:pl-0">
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="
            inline-flex items-center gap-2 rounded-lg
            border border-gray-200 bg-white px-3 py-2 sm:px-4 sm:py-2.5
            text-sm font-medium text-gray-700
            hover:bg-gray-50 transition-colors
            disabled:opacity-50
          "
        >
          {downloading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          <span className="hidden sm:inline">Download</span> QRs
        </button>
        <button
          onClick={onAddTable}
          className="
            inline-flex items-center gap-2 rounded-lg
            bg-blue-50 px-3 py-2 sm:px-4 sm:py-2.5
            text-sm font-medium text-blue-700
            border border-blue-200
            hover:bg-blue-100 transition-colors
          "
        >
          <Plus className="h-4 w-4" />
          Add Table
        </button>
      </div>
    </div>
  );
};

export default TablesHeader;