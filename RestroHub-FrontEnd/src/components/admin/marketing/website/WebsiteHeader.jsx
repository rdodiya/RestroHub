import { useState } from 'react';
import { Save, Globe, Loader2 } from 'lucide-react';

const WebsiteHeader = ({ onSave }) => {
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    try {
      setSaving(true);
      // 🔌 await api.put('/api/website/settings', settings);
      await new Promise((r) => setTimeout(r, 500));
      onSave?.();
      console.log('Saved');
    } catch (err) {
      console.error('Save failed:', err);
      toast.error('Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Left */}
      <div>
        <div className="flex items-center gap-2">
          <Globe className="hidden h-6 w-6 text-blue-600 sm:block" />
          <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
            Website Customization
          </h2>
        </div>
        <p className="mt-1 text-sm text-gray-500">
          Choose templates and color themes for your menu website
        </p>
      </div>

      {/* Right */}
      <button
        onClick={handleSave}
        disabled={saving}
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
        {saving ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Save className="h-4 w-4" />
        )}
        Save Changes
      </button>
    </div>
  );
};

export default WebsiteHeader;