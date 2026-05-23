import { useState, useEffect } from 'react';
import {
  Building2,
  Save,
  Loader2,
  X,
  Globe,
  Instagram,
  Facebook,
} from 'lucide-react';
import api from '../../../../services/common/api';

const RestaurantInfoCard = ({ profile, onSave }) => {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [backupFormData, setBackupFormData] = useState(null);

  const handleStartEdit = () => {
    setBackupFormData({ ...formData });
    setEditing(true);
  };

  const handleCancelEdit = () => {
    if (backupFormData) {
      setFormData(backupFormData);
    }
    setEditing(false);
  };

  const [formData, setFormData] = useState({
    restaurantName: profile.restaurantName || 'Rajkot Dhaba',
    tagline: profile.tagline || 'Authentic Gujarati Food',
    cuisineType: profile.cuisineType || 'Gujarati, North Indian',
    gstNumber: profile.gstNumber || '24AAACR1234F1Z5',
    fssaiNumber: profile.fssaiNumber || '11223344556677',
    website: profile.website || 'www.rajkotdhaba.com',
    instagram: profile.instagram || '@rajkotdhaba',
    facebook: profile.facebook || 'rajkotdhaba',
    openingTime: profile.openingTime || '10:00',
    closingTime: profile.closingTime || '23:00',
    seatingCapacity: profile.seatingCapacity || '120',
    avgOrderValue: profile.avgOrderValue || '350',
    serviceRequestEnabled: true,
  });

  useEffect(() => {
    const fetchRestaurantSettings = async () => {
      try {
        const res = await api.get('/public/api/v1/restaurants/1');
        if (res.data) {
          setFormData(prev => ({
            ...prev,
            restaurantName: res.data.name || prev.restaurantName,
            tagline: res.data.description || prev.tagline,
            serviceRequestEnabled: res.data.serviceRequestEnabled !== false,
          }));
        }
      } catch (err) {
        console.warn('Could not fetch restaurant details, using mock defaults.', err);
      }
    };
    fetchRestaurantSettings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      
      try {
        await api.put('/secure/api/v1/restaurants/1', {
          name: formData.restaurantName,
          description: formData.tagline,
          phoneNumber: '+91-9876543210',
          isActive: true,
          serviceRequestEnabled: formData.serviceRequestEnabled,
        });
      } catch (err) {
        console.warn('Backend restaurant update failed. Syncing locally.', err);
      }

      onSave?.(formData);
      setEditing(false);
    } catch (err) {
      console.error('Save failed:', err);
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleToggleServiceRequest = async () => {
    const newValue = !formData.serviceRequestEnabled;
    setFormData((prev) => ({ ...prev, serviceRequestEnabled: newValue }));

    try {
      await api.put('/secure/api/v1/restaurants/1', {
        name: formData.restaurantName,
        description: formData.tagline,
        phoneNumber: '+91-9876543210',
        isActive: true,
        serviceRequestEnabled: newValue,
      });
      onSave?.({ ...formData, serviceRequestEnabled: newValue });
    } catch (err) {
      console.warn('Backend restaurant update failed. Syncing locally.', err);
    }
  };


  const inputClass = `
    w-full rounded-lg border border-gray-200 bg-white
    px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400
    outline-none transition-all
    focus:border-blue-300 focus:ring-2 focus:ring-blue-100
  `;

  const labelClass = 'mb-1.5 block text-sm font-medium text-gray-800';

  const InfoRow = ({ label, value, icon: Icon }) => (
    <div className="flex items-start gap-3">
      {Icon && (
        <div className="mt-0.5 flex h-5 w-5 items-center justify-center">
          <Icon className="h-4 w-4 text-blue-500" />
        </div>
      )}
      <div>
        <p className="text-xs font-medium text-gray-500">{label}</p>
        <p className="mt-0.5 text-sm text-gray-900">{value || '—'}</p>
      </div>
    </div>
  );

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
            <Building2 className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 sm:text-base">
              Restaurant Information
            </h3>
            <p className="text-xs text-gray-500">
              Your restaurant details and business info
            </p>
          </div>
        </div>

        {!editing && (
          <button
            onClick={handleStartEdit}
            className="
              inline-flex items-center gap-1.5 rounded-lg
              bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700
              border border-blue-200 hover:bg-blue-100
              transition-colors sm:text-sm sm:px-4 sm:py-2
            "
          >
            <Building2 className="h-3.5 w-3.5" />
            Edit
          </button>
        )}
      </div>

      {/* Body */}
      {editing ? (
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 px-4 py-5 sm:px-6">
            {/* Restaurant Name + Tagline */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Restaurant Name</label>
                <input
                  type="text"
                  value={formData.restaurantName}
                  onChange={(e) => updateField('restaurantName', e.target.value)}
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Tagline</label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => updateField('tagline', e.target.value)}
                  className={inputClass}
                  placeholder="Your restaurant's tagline"
                />
              </div>
            </div>

            {/* Cuisine + Capacity */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Cuisine Type</label>
                <input
                  type="text"
                  value={formData.cuisineType}
                  onChange={(e) => updateField('cuisineType', e.target.value)}
                  className={inputClass}
                  placeholder="e.g., Italian, Indian"
                />
              </div>
              <div>
                <label className={labelClass}>Seating Capacity</label>
                <input
                  type="number"
                  value={formData.seatingCapacity}
                  onChange={(e) => updateField('seatingCapacity', e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            {/* Timings */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Opening Time</label>
                <input
                  type="time"
                  value={formData.openingTime}
                  onChange={(e) => updateField('openingTime', e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Closing Time</label>
                <input
                  type="time"
                  value={formData.closingTime}
                  onChange={(e) => updateField('closingTime', e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            {/* Legal */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>GST Number</label>
                <input
                  type="text"
                  value={formData.gstNumber}
                  onChange={(e) => updateField('gstNumber', e.target.value)}
                  className={inputClass}
                  placeholder="GST Number"
                />
              </div>
              <div>
                <label className={labelClass}>FSSAI License</label>
                <input
                  type="text"
                  value={formData.fssaiNumber}
                  onChange={(e) => updateField('fssaiNumber', e.target.value)}
                  className={inputClass}
                  placeholder="FSSAI Number"
                />
              </div>
            </div>

            {/* Social */}
            <div className="border-t border-gray-100 pt-4">
              <p className="mb-3 text-sm font-medium text-gray-800">Social & Web</p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className={labelClass}>Website</label>
                  <input
                    type="text"
                    value={formData.website}
                    onChange={(e) => updateField('website', e.target.value)}
                    className={inputClass}
                    placeholder="www.example.com"
                  />
                </div>
                <div>
                  <label className={labelClass}>Instagram</label>
                  <input
                    type="text"
                    value={formData.instagram}
                    onChange={(e) => updateField('instagram', e.target.value)}
                    className={inputClass}
                    placeholder="@handle"
                  />
                </div>
                <div>
                  <label className={labelClass}>Facebook</label>
                  <input
                    type="text"
                    value={formData.facebook}
                    onChange={(e) => updateField('facebook', e.target.value)}
                    className={inputClass}
                    placeholder="Page name"
                  />
                </div>
              </div>
            </div>

            {/* Service Request Feature Toggle */}
            <div className="border-t border-gray-100 pt-4">
              <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4 border border-gray-100">
                <div className="space-y-0.5">
                  <label className="text-sm font-semibold text-gray-800 flex items-center gap-1.5">
                    🛎️ Customer Service Requests (FAB)
                  </label>
                  <p className="text-xs text-gray-500">
                    Allow table customers to call waiter or request the bill directly from their digital menu page.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => updateField('serviceRequestEnabled', !formData.serviceRequestEnabled)}
                  className={`
                    relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none
                    ${formData.serviceRequestEnabled ? 'bg-blue-600' : 'bg-gray-200'}
                  `}
                >
                  <span
                    className={`
                      pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out
                      ${formData.serviceRequestEnabled ? 'translate-x-5' : 'translate-x-0'}
                    `}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 border-t border-gray-100 px-4 py-4 sm:px-6">
            <button type="button" onClick={handleCancelEdit} disabled={saving}
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              <X className="h-4 w-4" /> Cancel
            </button>
            <button type="submit" disabled={saving}
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 border border-blue-200 hover:bg-blue-100 disabled:opacity-50"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save Changes
            </button>
          </div>
        </form>
      ) : (
        <div className="px-4 py-5 sm:px-6">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <InfoRow label="Restaurant Name" value={formData.restaurantName} icon={Building2} />
            <InfoRow label="Tagline" value={formData.tagline} />
            <InfoRow label="Cuisine" value={formData.cuisineType} />
            <InfoRow label="Opening" value={formData.openingTime} />
            <InfoRow label="Closing" value={formData.closingTime} />
            <InfoRow label="Capacity" value={`${formData.seatingCapacity} seats`} />
            <InfoRow label="GST" value={formData.gstNumber} />
            <InfoRow label="FSSAI" value={formData.fssaiNumber} />
          </div>
          <div className="mt-5 border-t border-gray-100 pt-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <InfoRow label="Website" value={formData.website} icon={Globe} />
              <InfoRow label="Instagram" value={formData.instagram} icon={Instagram} />
              <InfoRow label="Facebook" value={formData.facebook} icon={Facebook} />
            </div>
            
            <div className="flex items-center justify-between gap-3 mt-5 p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="flex items-start gap-3">
                <div className="flex h-5 w-5 items-center justify-center mt-0.5">
                  <span className="text-blue-500 text-lg">🛎️</span>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500">Service Requests (FAB)</p>
                  <div className="mt-1.5 flex items-center gap-2">
                    <span className={`inline-flex h-2.5 w-2.5 rounded-full ${formData.serviceRequestEnabled ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                    <span className="text-sm font-medium text-gray-900">
                      {formData.serviceRequestEnabled ? 'Enabled (Customers can Call Waiter / Request Bill)' : 'Disabled'}
                    </span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                disabled={true}
                className={`
                  relative inline-flex h-6 w-11 shrink-0 cursor-not-allowed opacity-60 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none
                  ${formData.serviceRequestEnabled ? 'bg-blue-600' : 'bg-gray-200'}
                `}
                title="Please click 'Edit' above to enable/disable service requests"
              >
                <span
                  className={`
                    pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out
                    ${formData.serviceRequestEnabled ? 'translate-x-5' : 'translate-x-0'}
                  `}
                />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantInfoCard;