import { useState, useRef, useEffect } from 'react';
import {
  Menu,
  Bell,
  Search,
  User,
  Settings,
  LogOut,
  HelpCircle,
  ChevronDown,
  X,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Header = ({ onMobileMenuClick, collapsed, onCollapseToggle }) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const profileRef = useRef(null);
  const notifRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const notifications = [
    { id: 1, title: 'New order #127', desc: 'Table 4 - 2 items', time: '2m ago', unread: true },
    { id: 2, title: 'Payment received', desc: '₹450 via UPI', time: '15m ago', unread: true },
    { id: 3, title: 'Low stock alert', desc: 'Paneer Tikka - 3 left', time: '1h ago', unread: false },
  ];

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 bg-white">
      <div className="flex items-center justify-between px-4 py-3 sm:px-5 lg:px-6">
        {/* ============================= */}
        {/* LEFT                          */}
        {/* ============================= */}
        <div className="flex items-center gap-3">

          {/* 📱 Mobile Only: Hamburger to open drawer */}
          <button
            onClick={onMobileMenuClick}
            className="
              inline-flex h-9 w-9 items-center justify-center
              rounded-lg text-gray-600 hover:bg-gray-100
              transition-colors
              lg:hidden
            "
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* 🖥️ Desktop Only: Collapse/Expand toggle */}
          <button
            onClick={onCollapseToggle}
            className="
              hidden h-9 w-9 items-center justify-center
              rounded-lg text-gray-600 hover:bg-gray-100
              transition-colors
              lg:inline-flex
            "
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <line x1="9" y1="3" x2="9" y2="21" />
            </svg>
          </button>

          {/* Search - Desktop */}
          <div
            className="
              hidden items-center gap-2 rounded-lg border border-gray-200
              bg-gray-50 px-4 py-2 transition-all
              focus-within:border-blue-300 focus-within:bg-white
              focus-within:ring-2 focus-within:ring-blue-100
              md:flex md:w-64 lg:w-80
            "
          >
            <Search className="h-4 w-4 shrink-0 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none"
            />
          </div>

          {/* Search - Mobile toggle */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="
              inline-flex h-9 w-9 items-center justify-center
              rounded-lg text-gray-600 hover:bg-gray-100
              transition-colors md:hidden
            "
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </button>
        </div>

        {/* ============================= */}
        {/* RIGHT                         */}
        {/* ============================= */}
        <div className="flex items-center gap-1 sm:gap-2">

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => {
                setNotifOpen(!notifOpen);
                setProfileOpen(false);
              }}
              className="
                relative inline-flex h-9 w-9 items-center justify-center
                rounded-lg text-gray-600 hover:bg-gray-100
                transition-colors
              "
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span
                  className="
                    absolute right-1 top-1 flex h-4 w-4 items-center justify-center
                    rounded-full bg-red-500 text-[10px] font-bold text-white
                    ring-2 ring-white
                  "
                >
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {notifOpen && (
              <div
                className="
                  absolute right-0 top-full z-50 mt-2
                  w-[calc(100vw-2rem)] max-w-sm
                  overflow-hidden rounded-xl border border-gray-200
                  bg-white shadow-lg
                  sm:w-80
                "
              >
                <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
                  <h4 className="text-sm font-semibold text-gray-900">Notifications</h4>
                  {unreadCount > 0 && (
                    <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
                      {unreadCount} new
                    </span>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`
                        flex items-start gap-3 border-b border-gray-50 px-4 py-3
                        transition-colors hover:bg-gray-50 cursor-pointer
                        ${notif.unread ? 'bg-blue-50/30' : ''}
                      `}
                    >
                      <div
                        className={`
                          mt-1.5 h-2 w-2 shrink-0 rounded-full
                          ${notif.unread ? 'bg-blue-500' : 'bg-transparent'}
                        `}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-gray-900">{notif.title}</p>
                        <p className="text-xs text-gray-500">{notif.desc}</p>
                        <p className="mt-0.5 text-xs text-gray-400">{notif.time}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-100 px-4 py-2.5 text-center">
                  <button className="text-xs font-medium text-blue-700 hover:text-blue-800">
                    View All Notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="mx-1 hidden h-6 w-px bg-gray-200 sm:block" />

          {/* Profile */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => {
                setProfileOpen(!profileOpen);
                setNotifOpen(false);
              }}
              className="
                flex items-center gap-2 rounded-lg px-1.5 py-1
                hover:bg-gray-50 transition-colors
                sm:px-2 sm:py-1.5
              "
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 sm:h-9 sm:w-9">
                <User className="h-4 w-4 text-white" />
              </div>

              <div className="hidden text-left sm:block">
                <p className="text-sm font-semibold text-gray-900">Admin User</p>
                <p className="text-xs text-gray-500">admin@restrohub.com</p>
              </div>

              <ChevronDown
                className={`
                  hidden h-4 w-4 text-gray-400 transition-transform duration-200
                  sm:block
                  ${profileOpen ? 'rotate-180' : ''}
                `}
              />
            </button>

            {/* Profile Dropdown */}
            {profileOpen && (
              <div
                className="
                  absolute right-0 top-full z-50 mt-2 w-56
                  overflow-hidden rounded-xl border border-gray-200
                  bg-white shadow-lg
                "
              >
                {/* Mobile user info */}
                <div className="border-b border-gray-100 px-4 py-3 sm:hidden">
                  <p className="text-sm font-semibold text-gray-900">Admin User</p>
                  <p className="text-xs text-gray-500">admin@restrohub.com</p>
                </div>

                <div className="py-1">
                  {[
                    { icon: User, label: 'My Profile' },
                    { icon: Settings, label: 'Settings' },
                    { icon: HelpCircle, label: 'Help & Support' },
                  ].map((item) => (
                    <button
                      key={item.label}
                      className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => {
                        if(item.label==='My Profile') navigate('/admin/profile');
                        setProfileOpen(false);
                      }}
                    >
                      <item.icon className="h-4 w-4 text-gray-400" />
                      {item.label}
                    </button>
                  ))}
                </div>

                <div className="border-t border-gray-100 py-1">
                  <button
                    className="
                      flex w-full items-center gap-2.5 px-4 py-2.5
                      text-sm text-red-600 hover:bg-red-50 transition-colors
                    "
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ============================= */}
      {/* MOBILE SEARCH BAR             */}
      {/* ============================= */}
      {searchOpen && (
        <div className="border-t border-gray-100 bg-white px-4 py-3 md:hidden">
          <div
            className="
              flex items-center gap-2 rounded-lg border border-gray-200
              bg-gray-50 px-3 py-2
              focus-within:border-blue-300 focus-within:bg-white
              focus-within:ring-2 focus-within:ring-blue-100
            "
          >
            <Search className="h-4 w-4 shrink-0 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none"
              autoFocus
            />
            <button
              onClick={() => setSearchOpen(false)}
              className="shrink-0 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;