import { useState } from 'react';
import { Download, QrCode, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const QRHeader = () => {
  const [downloading, setDownloading] = useState(false);

  const handleDownloadAll = async () => {
    try {
      setDownloading(true);
      // 🔌 await api.get('/api/qr/download-all', { responseType: 'blob' });
      await new Promise((r) => setTimeout(r, 500));
      console.log('Download all QRs');
    } catch (err) {
      console.error('Download failed:', err);
      toast.error('Download failed');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Left */}
      <div>
        <div className="flex items-center gap-2">
          <QrCode className="hidden h-6 w-6 text-blue-600 sm:block" />
          <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
            QR Display Settings
          </h2>
        </div>
        <p className="mt-1 text-sm text-gray-500">
          Customize how your QR codes look
        </p>
      </div>

      {/* Right */}
      <button
        onClick={handleDownloadAll}
        disabled={downloading}
        className="
          inline-flex w-full items-center justify-center gap-2
          rounded-lg bg-blue-50 px-5 py-2.5
          text-sm font-medium text-blue-700
          border border-blue-200
          hover:bg-blue-100 transition-colors
          disabled:opacity-50
          sm:w-auto
        "
      >
        {downloading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Download className="h-4 w-4" />
        )}
        Download All QRs
      </button>
    </div>
  );
};

export default QRHeader;