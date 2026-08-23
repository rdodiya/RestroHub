import { useState } from 'react';
import { Shield, Save, Loader2, Eye, EyeOff, AlertCircle, Check } from 'lucide-react';

const SecurityCard = () => {
  const [saving, setSaving] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!formData.currentPassword) errs.currentPassword = 'Required';
    if (formData.newPassword.length < 8) errs.newPassword = 'Min 8 characters';
    if (formData.newPassword !== formData.confirmPassword)
      errs.confirmPassword = 'Passwords do not match';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      setSaving(true);
      setSuccess(false);
      // 🔌 await api.put('/api/profile/password', formData);
      await new Promise((r) => setTimeout(r, 1000));
      setSuccess(true);
      setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setErrors({ currentPassword: 'Current password is incorrect' });
    } finally {
      setSaving(false);
    }
  };

  const inputClass = `
    w-full rounded-lg border bg-white
    pl-4 pr-12 py-2.5 text-sm text-gray-900 placeholder-gray-400
    outline-none transition-all
    focus:border-blue-300 focus:ring-2 focus:ring-blue-100
  `;

  const PasswordField = ({ label, value, field, show, setShow, error }) => (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-gray-800">{label}</label>
      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={(e) => {
            setFormData((prev) => ({ ...prev, [field]: e.target.value }));
            setErrors((prev) => ({ ...prev, [field]: undefined }));
          }}
          className={`${inputClass} ${error ? 'border-red-300' : 'border-gray-200'}`}
          placeholder="••••••••"
          required
          aria-required="true"
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `err-${field}` : undefined}
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      {error && (
        <p id={`err-${field}`} className="mt-1 flex items-center gap-1 text-xs text-red-600">
          <AlertCircle className="h-3 w-3" /> {error}
        </p>
      )}
    </div>
  );

  // Password strength
  const getStrength = (pw) => {
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return score;
  };

  const strength = getStrength(formData.newPassword);
  const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['', 'bg-red-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-gray-100 px-4 py-4 sm:px-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
          <Shield className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-900 sm:text-base">
            Change Password
          </h3>
          <p className="text-xs text-gray-500">
            Update your password to keep your account secure
          </p>
        </div>
      </div>

      {/* Success */}
      {success && (
        <div className="mx-4 mt-4 flex items-center gap-2 rounded-lg bg-green-50 p-3 sm:mx-6">
          <Check className="h-4 w-4 text-green-600" />
          <span className="text-sm font-medium text-green-700">
            Password updated successfully!
          </span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="space-y-4 px-4 py-5 sm:px-6">
          <PasswordField
            label="Current Password"
            value={formData.currentPassword}
            field="currentPassword"
            show={showCurrent}
            setShow={setShowCurrent}
            error={errors.currentPassword}
          />

          <PasswordField
            label="New Password"
            value={formData.newPassword}
            field="newPassword"
            show={showNew}
            setShow={setShowNew}
            error={errors.newPassword}
          />

          {/* Strength Indicator */}
          {formData.newPassword && (
            <div>
              <div className="flex gap-1">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`h-1.5 flex-1 rounded-full ${
                      i <= strength ? strengthColors[strength] : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Strength: {strengthLabels[strength] || 'Too short'}
              </p>
            </div>
          )}

          <PasswordField
            label="Confirm New Password"
            value={formData.confirmPassword}
            field="confirmPassword"
            show={showConfirm}
            setShow={setShowConfirm}
            error={errors.confirmPassword}
          />

          {/* Info */}
          <div className="rounded-lg border border-blue-100 bg-blue-50 p-3">
            <p className="text-xs leading-relaxed text-blue-700">
              <strong>Requirements:</strong> Minimum 8 characters, with at least
              one uppercase letter, one number, and one special character.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end border-t border-gray-100 px-4 py-4 sm:px-6">
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
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Update Password
          </button>
        </div>
      </form>
    </div>
  );
};

export default SecurityCard;