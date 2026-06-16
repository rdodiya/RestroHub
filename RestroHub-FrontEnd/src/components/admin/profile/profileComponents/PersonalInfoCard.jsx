import { useState, useEffect } from 'react';
import { User, Save, Loader2, X} from 'lucide-react';
import toast from 'react-hot-toast';

const PersonalInfoCard = ({ profile, onSave }) => {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    email: profile.email || '',
    phoneNumber: profile.phoneNumber || '',
    firstName: profile.name ? profile.name.split(' ')[0] : '',
    lastName: profile.name ? profile.name.split(' ').slice(1).join(' ') : '',
    altPhone: profile.altPhone || '',
    dateOfBirth: profile.dateOfBirth || '1995-06-15',
    gender: profile.gender || 'male',
    address: profile.address || 'Kalawad Road, Rajkot',
    city: profile.city || 'Rajkot',
    state: profile.state || 'Gujarat',
    pincode: profile.pincode || '360005',
    bio: profile.bio || '',
  });

  // Sync form data when profile prop updates (after API fetch completes)
  useEffect(() => {
    const names = profile.name ? profile.name.split(' ') : [];
    setFormData((prev) => ({
      ...prev,
      firstName: names[0] || '',
      lastName: names.slice(1).join(' ') || '',
      email: profile.email || '',
      phoneNumber: profile.phoneNumber || '',
    }));
  }, [profile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      if (onSave) {
        const fullName = `${formData.firstName} ${formData.lastName}`.trim();
        await onSave({
          name: fullName,
          phoneNumber: formData.phoneNumber
        });
      }
      toast.success('Profile updated successfully!');
      setEditing(false);
    } catch (err) {
      console.error('Save failed:', err);
      toast.error('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    const names = profile.name ? profile.name.split(' ') : [];
    // Reset form to last fetched profile values
    setFormData((prev) => ({
      ...prev,
      firstName: names[0] || '',
      lastName: names.slice(1).join(' ') || '',
      email: profile.email || '',
      phoneNumber: profile.phoneNumber || '',
    }));
  };

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const inputClass = `
    w-full rounded-lg border border-gray-200 bg-white
    px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400
    outline-none transition-all
    focus:border-blue-300 focus:ring-2 focus:ring-blue-100
    disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
  `;

  const labelClass = 'mb-1.5 block text-sm font-medium text-gray-800';

  // View Mode Row
  const InfoRow = ({ label, value }) => (
    <div>
      <p className="text-xs font-medium text-gray-500">{label}</p>
      <p className="mt-0.5 text-sm text-gray-900">{value || '—'}</p>
    </div>
  );

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
            <User className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 sm:text-base">
              Personal Information
            </h3>
            <p className="text-xs text-gray-500">
              Your personal details and contact info
            </p>
          </div>
        </div>

        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="
              inline-flex items-center gap-1.5 rounded-lg
              bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700
              border border-blue-200 hover:bg-blue-100
              transition-colors sm:text-sm sm:px-4 sm:py-2
            "
          >
            <User className="h-3.5 w-3.5" />
            Edit
          </button>
        )}
      </div>

      {/* Body */}
      {editing ? (
        /* edit mode */
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 px-4 py-5 sm:px-6">
            {/* First Name & Last Name Row */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>First Name</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => updateField('firstName', e.target.value)}
                  className={inputClass}
                  placeholder="First name"
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Last Name</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => updateField('lastName', e.target.value)}
                  className={inputClass}
                  placeholder="Last name"
                />
              </div>
            </div>

            {/* Email & Phone Row */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  className={inputClass}
                  disabled
                  title="Email cannot be changed"
                />
              </div>
              <div>
                <label className={labelClass}>Phone Number</label>
                <input
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => updateField('phoneNumber', e.target.value)}
                  className={inputClass}
                  placeholder="9876543210"
                  required
                />
              </div>
            </div>

            {/* DOB + Gender */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Date of Birth</label>
                <input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => updateField('dateOfBirth', e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Gender</label>
                <select
                  value={formData.gender}
                  onChange={(e) => updateField('gender', e.target.value)}
                  className={inputClass}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer-not">Prefer not to say</option>
                </select>
              </div>
            </div>

            {/* Address */}
            <div>
              <label className={labelClass}>Address</label>
              <textarea
                value={formData.address}
                onChange={(e) => updateField('address', e.target.value)}
                className={`${inputClass} resize-none`}
                rows={2}
                placeholder="Street address"
              />
            </div>

            {/* City + State + Pincode */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className={labelClass}>City</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => updateField('city', e.target.value)}
                  className={inputClass}
                  placeholder="City"
                />
              </div>
              <div>
                <label className={labelClass}>State</label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => updateField('state', e.target.value)}
                  className={inputClass}
                  placeholder="State"
                />
              </div>
              <div>
                <label className={labelClass}>Pincode</label>
                <input
                  type="text"
                  value={formData.pincode}
                  onChange={(e) => updateField('pincode', e.target.value)}
                  className={inputClass}
                  placeholder="360005"
                />
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className={labelClass}>Bio</label>
              <textarea
                value={formData.bio}
                onChange={(e) => updateField('bio', e.target.value)}
                className={`${inputClass} resize-none`}
                rows={3}
                maxLength={200}
                placeholder="Tell us about yourself..."
              />
              <p className="mt-1 text-xs text-gray-400">
                {formData.bio.length}/200 characters
              </p>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-3 border-t border-gray-100 px-4 py-4 sm:px-6">
            <button
              type="button"
              onClick={handleCancel}
              disabled={saving}
              className="
                inline-flex items-center gap-1.5 rounded-lg
                border border-gray-200 px-4 py-2 text-sm font-medium
                text-gray-700 hover:bg-gray-50 transition-colors
                disabled:opacity-50
              "
            >
              <X className="h-4 w-4" />
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="
                inline-flex items-center gap-1.5 rounded-lg
                bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700
                border border-blue-200 hover:bg-blue-100
                transition-colors disabled:opacity-50
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
        </form>
      ) : (
        /* view mode */
        <div className="px-4 py-5 sm:px-6">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <InfoRow label="First Name" value={formData.firstName} />
            <InfoRow label="Last Name" value={formData.lastName} />
            <InfoRow label="Email" value={formData.email} />
            <InfoRow label="Phone" value={formData.phoneNumber} />
            <InfoRow label="Date of Birth" value={formData.dateOfBirth} />
            <InfoRow
              label="Gender"
              value={formData.gender?.charAt(0).toUpperCase() + formData.gender?.slice(1)}
            />
            <InfoRow label="City" value={formData.city} />
            <InfoRow label="State" value={formData.state} />
            <InfoRow label="Pincode" value={formData.pincode} />
          </div>
          {formData.address && (
            <div className="mt-5 border-t border-gray-100 pt-5">
              <InfoRow label="Full Address" value={formData.address} />
            </div>
          )}
          {formData.bio && (
            <div className="mt-4">
              <InfoRow label="Bio" value={formData.bio} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PersonalInfoCard;