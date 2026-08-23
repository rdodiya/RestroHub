import { useState } from 'react';
import { Download, Eye, Loader2 } from 'lucide-react';
import QRCode from 'react-qr-code';
import toast from 'react-hot-toast';

const QRPreview = ({ qrColor, selectedStyle }) => {
  const [downloading, setDownloading] = useState(null);

  const sampleUrl = `${window.location.origin}/Restrohub/RajkotDhaba/1?table=1`;

  const downloadFormats = [
    { id: 'png', label: 'PNG', desc: 'Best for print' },
    { id: 'svg', label: 'SVG', desc: 'Scalable vector' },
    { id: 'pdf', label: 'PDF', desc: 'Ready to print' },
  ];

  const handleDownload = async (format) => {
    try {
      setDownloading(format);
      // 🔌 await api.get(`/api/qr/download?format=${format}`, { responseType: 'blob' });
      await new Promise((r) => setTimeout(r, 500));
      console.log('Download:', format);
    } catch (err) {
      console.error('Download failed:', err);
      toast.error('Download failed');
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
      {/* ============================= */}
      {/* HEADER                        */}
      {/* ============================= */}
      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-4 sm:px-6 sm:py-5">
        <h3 className="text-sm font-semibold text-gray-900 sm:text-base">
          Preview
        </h3>
        <button
          className="
            inline-flex items-center gap-2 rounded-lg
            bg-gray-50 px-3 py-2 text-xs font-medium text-gray-700
            hover:bg-gray-100 transition-colors
            sm:text-sm
          "
        >
          <Eye className="h-4 w-4" />
          <span className="hidden sm:inline">Full</span> Preview
        </button>
      </div>

      {/* ============================= */}
      {/* BODY                          */}
      {/* ============================= */}
      <div className="px-4 py-6 sm:px-6 sm:py-8">
        <div className="flex flex-col items-center">
          {/* QR Container */}
          <div
            className={`
              rounded-2xl border border-gray-200 bg-white p-5 shadow-lg
              transition-all duration-300
              sm:p-6
              ${selectedStyle === 'decorative' ? 'ring-4 ring-blue-50' : ''}
              ${selectedStyle === 'branded' ? 'ring-2 ring-blue-100' : ''}
            `}
          >
            <QRCode
              value={sampleUrl}
              size={180}
              fgColor={qrColor}
              level="H"
            />
          </div>

          {/* Label */}
          <div className="mt-4 text-center">
            <p className="text-sm font-medium text-gray-700">
              Table 1 — Sample QR
            </p>
            <p className="mt-0.5 text-xs text-gray-400">
              Style: {selectedStyle}
            </p>
          </div>

          {/* Download Buttons */}
          <div className="mt-6 flex flex-wrap justify-center gap-2 sm:gap-3">
            {downloadFormats.map((format) => (
              <button
                key={format.id}
                onClick={() => handleDownload(format.id)}
                disabled={downloading === format.id}
                className="
                  inline-flex items-center gap-2 rounded-lg
                  border border-gray-200 bg-white px-3 py-2
                  text-xs font-medium text-gray-700
                  hover:bg-gray-50 transition-colors
                  disabled:opacity-50
                  sm:px-4 sm:text-sm
                "
              >
                {downloading === format.id ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Download className="h-3.5 w-3.5" />
                )}
                {format.label}
              </button>
            ))}
          </div>

          {/* Color Indicator */}
          <div
            className="
              mt-5 inline-flex items-center gap-2 rounded-full
              bg-gray-50 px-3 py-1.5
            "
          >
            <div
              className="h-3 w-3 rounded-full border border-gray-200"
              style={{ backgroundColor: qrColor }}
            />
            <span className="text-xs font-medium uppercase text-gray-600">
              {qrColor}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRPreview;