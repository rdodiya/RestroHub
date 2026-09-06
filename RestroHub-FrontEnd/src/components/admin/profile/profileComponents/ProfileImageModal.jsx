import { useState, useRef } from 'react';
import { X, Upload, Loader2, Camera, Trash2 } from 'lucide-react';
import { Dialog } from '@headlessui/react';
import profileService from '../../../../services/user/profileService';

import toast from 'react-hot-toast';

const ProfileImageModal = ({ isOpen, onClose, currentImage, onSave }) => {
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    try {
      setUploading(true);
      // If preview is a data URL, extract base64 payload
      const base64 = preview?.includes(',') ? preview.split(',')[1] : preview;

      // Persist image to backend
      const resp = await profileService.updateUserProfile({ profileImageBytes: base64 });

      // server returns profileImage as base64 string; update parent with data URL
      const returnedBase64 = resp.profileImage || base64;
      onSave?.(`data:image/jpeg;base64,${returnedBase64}`);
      toast.success('Profile photo updated successfully!');
      onClose();
      setPreview(null);
    } catch (err) {
      console.error('Upload failed:', err);
      toast.error('Failed to upload profile photo.');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onSave?.(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-sm overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
            <Dialog.Title className="text-lg font-bold text-gray-900">
              Profile Photo
            </Dialog.Title>
            <button onClick={onClose} className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Body */}
          <div className="px-5 py-6 text-center">
            {/* Preview */}
            <div className="mx-auto mb-5 h-32 w-32 overflow-hidden rounded-2xl border-4 border-gray-100 bg-gray-50">
              {preview || currentImage ? (
                <img src={preview || currentImage} alt="Preview" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <Camera className="h-10 w-10 text-gray-300" />
                </div>
              )}
            </div>

            {/* Upload Area */}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              onClick={() => fileRef.current?.click()}
              className="
                inline-flex items-center gap-2 rounded-lg
                border-2 border-dashed border-gray-200 px-6 py-3
                text-sm font-medium text-gray-600
                hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700
                transition-all
              "
            >
              <Upload className="h-4 w-4" />
              Choose Photo
            </button>
            <p className="mt-2 text-xs text-gray-400">JPG, PNG • Max 5MB</p>
          </div>

          {/* Footer */}
          <div className="flex items-center gap-3 border-t border-gray-100 px-5 py-4">
            {currentImage && (
              <button onClick={handleRemove}
                className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-100"
              >
                <Trash2 className="h-4 w-4" /> Remove
              </button>
            )}
            <div className="flex-1" />
            <button onClick={onClose}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button onClick={handleSave} disabled={!preview || uploading}
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 border border-blue-200 hover:bg-blue-100 disabled:opacity-50"
            >
              {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              Save
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default ProfileImageModal;