import {
  User,
  Building2,
  Shield,
  Bell,
  Globe,
  CreditCard,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Star,
} from 'lucide-react';

const ProfileSidebar = ({ profile, activeSection, onSectionChange }) => {
  const navItems = [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'restaurant', label: 'Restaurant Info', icon: Building2 },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  const stats = [
    { label: 'Total Orders', value: profile.totalOrders || '1,234' },
    { label: 'Revenue', value: profile.totalRevenue || '₹4.5L' },
    { label: 'Rating', value: profile.rating || '4.8' },
    { label: 'Branches', value: profile.branches || '3' },
  ];

  return (
    <div className="space-y-5">
      {/* Quick Stats */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
        <div className="border-b border-gray-100 px-4 py-4 sm:px-5">
          <h3 className="text-sm font-semibold text-gray-900">Overview</h3>
        </div>
        <div className="grid grid-cols-2 gap-px bg-gray-100">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white p-4 text-center">
              <p className="text-lg font-bold text-gray-900 sm:text-xl">
                {stat.value}
              </p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
        <div className="border-b border-gray-100 px-4 py-4 sm:px-5">
          <h3 className="text-sm font-semibold text-gray-900">Settings</h3>
        </div>
        <nav className="p-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={`
                  flex w-full items-center gap-3 rounded-lg px-3 py-2.5
                  text-sm font-medium transition-all duration-200
                  ${
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
              >
                <Icon
                  className={`h-4 w-4 ${
                    isActive ? 'text-blue-600' : 'text-gray-400'
                  }`}
                />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Contact Card */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
        <div className="border-b border-gray-100 px-4 py-4 sm:px-5">
          <h3 className="text-sm font-semibold text-gray-900">Contact</h3>
        </div>
        <div className="space-y-3 px-4 py-4 sm:px-5">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50">
              <Mail className="h-4 w-4 text-blue-600" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-gray-500">Email</p>
              <p className="truncate text-sm font-medium text-gray-900">
                {profile.email || 'admin@restrohub.com'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50">
              <Phone className="h-4 w-4 text-blue-600" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-gray-500">Phone</p>
              <p className="truncate text-sm font-medium text-gray-900">
                {profile.phone || '+91 98765 43210'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50">
              <MapPin className="h-4 w-4 text-blue-600" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-gray-500">Location</p>
              <p className="truncate text-sm font-medium text-gray-900">
                {profile.location || 'Rajkot, Gujarat'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSidebar;