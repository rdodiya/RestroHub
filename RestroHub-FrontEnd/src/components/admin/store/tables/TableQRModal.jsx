import { useState } from 'react';
import { X, Download, Loader2, ExternalLink } from 'lucide-react';
import { Dialog } from '@headlessui/react';
import QRCode from 'react-qr-code';
import toast from 'react-hot-toast';

const TableQRModal = ({ isOpen, onClose, table, branchId }) => {
  const [downloading, setDownloading] = useState(false);

  if (!table) return null;

  const qrUrl = `${window.location.origin}/Restrohub/RajkotDhaba/${branchId}?tableId=${table.id}&table=${table.number}`;

  const handleDownload = async () => {
    try {
      setDownloading(true);
      await new Promise((r) => setTimeout(r, 500));
      console.log('Download QR:', table.number);
    } catch (err) {
      console.error('Download failed:', err);
      toast.error('Download failed');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel
          className="
            w-full max-w-sm overflow-hidden rounded-2xl
            border border-gray-200 bg-white shadow-xl
          "
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
            <Dialog.Title className="text-lg font-bold text-gray-900">
              Table {table.number} - QR Code
            </Dialog.Title>
            <button
              onClick={onClose}
              className="
                inline-flex h-8 w-8 items-center justify-center
                rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600
              "
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Body */}
          <div className="px-5 py-6 text-center sm:px-6 sm:py-8">
            <div
              className="
                mx-auto inline-flex items-center justify-center
                rounded-2xl border border-gray-200 bg-gray-50 p-5
                shadow-sm sm:p-6
              "
            >
              <QRCode id="qr-code-svg" value={qrUrl} size={180} level="H" />
            </div>

            <p className="mt-4 text-sm font-medium text-gray-700">
              Scan to view menu & place order
            </p>

            {/* URL Preview */}
            <div
              className="
                mt-3 flex items-center justify-center gap-1.5
                rounded-lg bg-gray-50 px-3 py-2
              "
            >
              <ExternalLink className="h-3 w-3 shrink-0 text-gray-400" />
              <p className="truncate text-xs text-gray-500">{qrUrl}</p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center gap-3 border-t border-gray-100 px-5 py-4">
            <button
              onClick={onClose}
              className="
                flex-1 rounded-lg border border-gray-200 px-4 py-2.5
                text-sm font-medium text-gray-700
                hover:bg-gray-50 transition-colors
              "
            >
              Close
            </button>
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="
                flex-1 inline-flex items-center justify-center gap-2
                rounded-lg bg-blue-50 px-4 py-2.5
                text-sm font-medium text-blue-700
                border border-blue-200
                hover:bg-blue-100 transition-colors
                disabled:opacity-50
              "
            >
              {downloading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              Download
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default TableQRModal;
