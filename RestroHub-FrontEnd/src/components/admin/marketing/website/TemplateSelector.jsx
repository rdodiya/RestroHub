import { Layout, Check, Smartphone, Monitor } from 'lucide-react';

const TemplateSelector = ({ selectedTemplate, onTemplateChange }) => {
  const templates = [
    {
      id: 'modern',
      name: 'Modern Clean',
      desc: 'Minimalist design with focus on food images',
      icon: '✨',
      features: ['Grid layout', 'Large images', 'Smooth animations'],
    },
    {
      id: 'classic',
      name: 'Classic Restaurant',
      desc: 'Traditional elegant restaurant look',
      icon: '🏛️',
      features: ['List layout', 'Elegant fonts', 'Warm feel'],
    },
    {
      id: 'vibrant',
      name: 'Vibrant & Fun',
      desc: 'Colorful and energetic for cafes',
      icon: '🎉',
      features: ['Card layout', 'Bold colors', 'Playful style'],
    },
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
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
              Templates
            </h3>
            <p className="text-xs text-gray-500 sm:text-sm">
              Choose your menu layout
            </p>
          </div>
        </div>
      </div>

      {/* ============================= */}
      {/* BODY                          */}
      {/* ============================= */}
      <div className="px-4 py-4 sm:px-6 sm:py-5">
        <div className="space-y-3">
          {templates.map((template) => {
            const isSelected = selectedTemplate === template.id;
            return (
              <button
                key={template.id}
                onClick={() => onTemplateChange(template.id)}
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
                {/* Top Row */}
                <div className="mb-3 flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">{template.icon}</span>
                    <div>
                      <h4
                        className={`text-sm font-medium ${
                          isSelected ? 'text-blue-700' : 'text-gray-900'
                        }`}
                      >
                        {template.name}
                      </h4>
                      <p className="text-xs text-gray-500">{template.desc}</p>
                    </div>
                  </div>

                  {isSelected && (
                    <span
                      className="
                        inline-flex h-5 w-5 shrink-0 items-center justify-center
                        rounded-full bg-blue-100
                      "
                    >
                      <Check className="h-3 w-3 text-blue-700" />
                    </span>
                  )}
                </div>

                {/* Preview Placeholder */}
                <div
                  className={`
                    flex h-20 items-center justify-center rounded-lg
                    sm:h-24
                    ${isSelected ? 'bg-blue-100/50' : 'bg-gray-100'}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <Monitor
                      className={`h-5 w-5 ${
                        isSelected ? 'text-blue-400' : 'text-gray-300'
                      }`}
                    />
                    <Smartphone
                      className={`h-4 w-4 ${
                        isSelected ? 'text-blue-400' : 'text-gray-300'
                      }`}
                    />
                    <span
                      className={`text-xs ${
                        isSelected ? 'text-blue-500' : 'text-gray-400'
                      }`}
                    >
                      Template Preview
                    </span>
                  </div>
                </div>

                {/* Features */}
                <div className="mt-2.5 flex flex-wrap gap-1.5 sm:mt-3">
                  {template.features.map((feature) => (
                    <span
                      key={feature}
                      className={`
                        rounded px-1.5 py-0.5 text-xs font-medium
                        ${
                          isSelected
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100 text-gray-500'
                        }
                      `}
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TemplateSelector;