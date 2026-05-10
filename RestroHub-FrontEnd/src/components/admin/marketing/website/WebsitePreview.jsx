import { Eye, ExternalLink, Monitor, Smartphone, Tablet } from 'lucide-react';
import { useState } from 'react';

const WebsitePreview = ({ selectedTemplate, selectedTheme }) => {
  const [device, setDevice] = useState('desktop');

  const devices = [
    { id: 'desktop', icon: Monitor, label: 'Desktop' },
    { id: 'tablet', icon: Tablet, label: 'Tablet' },
    { id: 'mobile', icon: Smartphone, label: 'Mobile' },
  ];

  const previewWidths = {
    desktop: 'w-full',
    tablet: 'w-3/4 mx-auto',
    mobile: 'w-1/3 mx-auto min-w-[280px]',
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
      {/* ============================= */}
      {/* HEADER                        */}
      {/* ============================= */}
      <div className="flex flex-col gap-3 border-b border-gray-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-5">
        <h3 className="text-sm font-semibold text-gray-900 sm:text-base">
          Live Preview
        </h3>

        <div className="flex items-center gap-2">
          {/* Device Toggle */}
          <div className="inline-flex rounded-lg border border-gray-200 bg-gray-50 p-0.5">
            {devices.map((d) => {
              const Icon = d.icon;
              const isActive = device === d.id;
              return (
                <button
                  key={d.id}
                  onClick={() => setDevice(d.id)}
                  className={`
                    inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5
                    text-xs font-medium transition-all
                    ${
                      isActive
                        ? 'bg-white text-blue-700 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                    }
                  `}
                  title={d.label}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">{d.label}</span>
                </button>
              );
            })}
          </div>

          {/* Open in New Tab */}
          <button
            className="
              inline-flex items-center gap-1.5 rounded-lg
              bg-gray-50 px-3 py-2 text-xs font-medium text-gray-700
              hover:bg-gray-100 transition-colors
              sm:text-sm
            "
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Open</span>
          </button>
        </div>
      </div>

      {/* ============================= */}
      {/* BODY                          */}
      {/* ============================= */}
      <div className="bg-gray-50 px-4 py-6 sm:px-6 sm:py-8">
        {/* Info Bar */}
        <div className="mb-4 flex flex-wrap items-center justify-center gap-2">
          <span className="rounded bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
            Template: {selectedTemplate}
          </span>
          <span className="rounded bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
            Theme: {selectedTheme}
          </span>
          <span className="rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">
            Device: {device}
          </span>
        </div>

        {/* Preview Area */}
        <div
          className={`
            ${previewWidths[device]}
            transition-all duration-300
          `}
        >
          <div
            className="
              flex h-72 items-center justify-center
              rounded-xl border border-gray-200 bg-white
              shadow-sm
              sm:h-80 lg:h-96
            "
          >
            <div className="text-center">
              <Monitor className="mx-auto mb-3 h-10 w-10 text-blue-200" />
              <p className="text-sm font-medium text-gray-600">
                Menu Website Preview
              </p>
              <p className="mt-1 text-xs text-gray-400">
                Your menu will appear here
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebsitePreview;