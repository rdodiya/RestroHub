import { Layout, Palette, Image as ImageIcon, Check } from 'lucide-react';

const QRStyleSelector = ({
  selectedStyle,
  onStyleChange,
  qrColor,
  onColorChange,
}) => {
  const styles = [
    {
      id: 'minimal',
      name: 'Minimal',
      desc: 'Clean and simple QR code',
      icon: '⬜',
    },
    {
      id: 'branded',
      name: 'Branded',
      desc: 'With restaurant logo',
      icon: '🏷️',
    },
    {
      id: 'decorative',
      name: 'Decorative',
      desc: 'With borders and patterns',
      icon: '🎨',
    },
  ];

  return (
    <div
      className="
        overflow-hidden rounded-2xl border border-gray-200 bg-white
      "
    >
      {/* ============================= */}
      {/* HEADER                        */}
      {/* ============================= */}
      <div className="border-b border-gray-100 px-4 py-4 sm:px-6 sm:py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
            <Layout className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 sm:text-base">
              QR Style
            </h3>
            <p className="text-xs text-gray-500 sm:text-sm">
              Choose your QR code style
            </p>
          </div>
        </div>
      </div>

      {/* ============================= */}
      {/* BODY                          */}
      {/* ============================= */}
      <div className="px-4 py-4 sm:px-6 sm:py-5">
        {/* Style Cards */}
        <div className="space-y-3">
          {styles.map((style) => {
            const isSelected = selectedStyle === style.id;
            return (
              <button
                key={style.id}
                onClick={() => onStyleChange(style.id)}
                className={`
                  w-full rounded-xl border-2 p-3 text-left transition-all
                  sm:p-4
                  ${
                    isSelected
                      ? 'border-blue-200 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }
                `}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{style.icon}</span>
                    <div>
                      <h4
                        className={`text-sm font-medium ${
                          isSelected ? 'text-blue-700' : 'text-gray-900'
                        }`}
                      >
                        {style.name}
                      </h4>
                      <p className="text-xs text-gray-500">{style.desc}</p>
                    </div>
                  </div>

                  {isSelected && (
                    <span
                      className="
                        inline-flex h-5 w-5 items-center justify-center
                        rounded-full bg-blue-100
                      "
                    >
                      <Check className="h-3 w-3 text-blue-700" />
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Color Picker */}
        <div className="mt-5 border-t border-gray-100 pt-5 sm:mt-6 sm:pt-6">
          <div className="mb-3 flex items-center gap-2.5">
            <Palette className="h-4 w-4 text-blue-500" />
            <span className="text-sm font-medium text-gray-900">QR Color</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                type="color"
                value={qrColor}
                onChange={(e) => onColorChange(e.target.value)}
                className="
                  h-10 w-10 cursor-pointer rounded-lg border border-gray-200
                  bg-transparent sm:h-12 sm:w-12
                "
              />
            </div>
            <input
              type="text"
              value={qrColor}
              onChange={(e) => onColorChange(e.target.value)}
              className="
                w-28 rounded-lg border border-gray-200 bg-white
                px-3 py-2 text-sm uppercase text-gray-900
                placeholder-gray-400 outline-none
                focus:border-blue-300 focus:ring-2 focus:ring-blue-100
                transition-all
              "
            />
            {/* Quick Colors */}
            <div className="hidden items-center gap-1.5 sm:flex">
              {['#000000', '#1e40af', '#064e3b', '#7c2d12', '#4c1d95'].map(
                (color) => (
                  <button
                    key={color}
                    onClick={() => onColorChange(color)}
                    className={`
                      h-7 w-7 rounded-lg border-2 transition-all
                      ${
                        qrColor === color
                          ? 'border-blue-400 scale-110'
                          : 'border-gray-200 hover:scale-105'
                      }
                    `}
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                )
              )}
            </div>
          </div>
        </div>

        {/* Logo Upload */}
        <div className="mt-5 border-t border-gray-100 pt-5 sm:mt-6 sm:pt-6">
          <div className="mb-3 flex items-center gap-2.5">
            <ImageIcon className="h-4 w-4 text-blue-500" />
            <span className="text-sm font-medium text-gray-900">
              Center Logo
            </span>
            <span className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-500">
              Optional
            </span>
          </div>
          <div
            className="
              cursor-pointer rounded-xl border-2 border-dashed border-gray-200
              p-5 text-center transition-all
              hover:border-blue-300 hover:bg-blue-50
              sm:p-6
            "
          >
            <ImageIcon className="mx-auto mb-2 h-8 w-8 text-gray-400" />
            <p className="text-sm text-gray-600">Click to upload logo</p>
            <p className="mt-1 text-xs text-gray-400">PNG, SVG up to 2MB</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRStyleSelector;