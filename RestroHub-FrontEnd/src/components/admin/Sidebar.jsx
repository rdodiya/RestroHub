import { NavLink, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import {
  LayoutDashboard,
  UtensilsCrossed,
  ShoppingCart,
  Store,
  Megaphone,
  CreditCard,
  ChevronDown,
  X,
  Building2,
  Globe,
  QrCode,
  ChevronsLeft,
  ChevronsRight,
  ChefHat,
Users,
  ShieldCheck,
} from 'lucide-react';
import { useAdminTheme } from '@context/AdminThemeContext';
import { FULL_ADMIN_ROLES, hasAnyRole, readStoredRoles } from '../../utils/auth';
import { isAdmin } from '@hooks/useAuth';

const Sidebar = ({ open, setOpen, collapsed, setCollapsed }) => {
  const location = useLocation();
  const sidebarRef = useRef(null);
  const { isDark } = useAdminTheme();
  const roles = readStoredRoles();
  const limitedAdminRoles = ['MANAGER', 'STAFF'];
  const superAdminOnly = ['SUPER_ADMIN'];
  const allAdminRoles = [...FULL_ADMIN_ROLES, ...limitedAdminRoles];

  const [expandedMenus, setExpandedMenus] = useState({
    store: false,
    marketing: false,
  });

  // Auto-expand active parent on mount
  useEffect(() => {
    if (location.pathname.startsWith('/admin/store')) {
      setExpandedMenus((prev) => ({ ...prev, store: true }));
    }
    if (location.pathname.startsWith('/admin/marketing')) {
      setExpandedMenus((prev) => ({ ...prev, marketing: true }));
    }
  }, []);

  // Close mobile sidebar on route change
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const toggleMenu = (menu) => {
    if (collapsed) {
      setCollapsed(false);
      setTimeout(() => {
        setExpandedMenus((prev) => ({ ...prev, [menu]: true }));
      }, 300);
      return;
    }
    setExpandedMenus((prev) => ({ ...prev, [menu]: !prev[menu] }));
  };

  // ============================================
  // NAV CONFIG
  // ============================================
  const navSections = [
    {
      label: 'Menu',
      items: [
        { type: 'link', name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard, allowedRoles: FULL_ADMIN_ROLES },
        { type: 'link', name: 'Kitchen Display', path: '/admin/kds', icon: ChefHat, allowedRoles: allAdminRoles },
        { type: 'link', name: 'Menus', path: '/admin/menus', icon: UtensilsCrossed, allowedRoles: FULL_ADMIN_ROLES },
        { type: 'link', name: 'Orders', path: '/admin/orders', icon: ShoppingCart, allowedRoles: allAdminRoles },
      ],
    },
    {
      label: 'Management',
      items: [
        ...(isAdmin() ? [{ type: 'link', name: 'User Roles', path: '/admin/role-management', icon: Users }] : []),
        {
          type: 'expandable',
          name: 'Store',
          icon: Store,
          menuKey: 'store',
          allowedRoles: FULL_ADMIN_ROLES,
          children: [
            { name: 'Branches', path: '/admin/store/branches', icon: Building2, allowedRoles: FULL_ADMIN_ROLES },
          ],
        },
        {
          type: 'expandable',
          name: 'Marketing',
          icon: Megaphone,
          menuKey: 'marketing',
          allowedRoles: FULL_ADMIN_ROLES,
          children: [
            { name: 'Website', path: '/admin/marketing/website', icon: Globe, allowedRoles: FULL_ADMIN_ROLES },
            //{ name: 'QR Display', path: '/admin/marketing/qr-display', icon: QrCode, allowedRoles: FULL_ADMIN_ROLES },
          ],
        },
      ],
    },
    {
      label: 'Payments',
      items: [
        { type: 'link', name: 'UPI Links', path: '/admin/upi-links', icon: CreditCard, allowedRoles: FULL_ADMIN_ROLES },
      ],
    },
    {
      label: 'Platform',
      items: [
        { type: 'link', name: 'Subscriptions', path: '/admin/subscriptions', icon: ShieldCheck, allowedRoles: superAdminOnly },
      ],
    },
  ];

  const canViewItem = (item) => !item.allowedRoles || hasAnyRole(roles, item.allowedRoles);

  const visibleNavSections = navSections
    .map((section) => ({
      ...section,
      items: section.items
        .map((item) => {
          if (item.type !== 'expandable') return item;
          return {
            ...item,
            children: item.children.filter(canViewItem),
          };
        })
        .filter((item) => canViewItem(item) && (item.type !== 'expandable' || item.children.length > 0)),
    }))
    .filter((section) => section.items.length > 0);

  // ============================================
  // SINGLE NAV LINK
  // ============================================
  const SidebarLink = ({ item }) => {
    const Icon = item.icon;

    return (
      <li>
        <NavLink
          to={item.path}
          className={({ isActive }) => `
            group relative flex items-center rounded-lg
            transition-all duration-200
            ${collapsed
              ? 'justify-center px-2 py-2.5'
              : 'gap-3 px-3 py-2.5'
            }
            ${isActive
              ? isDark
                ? 'bg-blue-900/40 text-blue-400 font-medium'
                : 'bg-blue-50 text-blue-700 font-medium'
              : isDark
                ? 'text-gray-400 hover:bg-gray-700 hover:text-gray-100'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }
          `}
        >
          {({ isActive }) => (
            <>
              {/* Left active bar */}
              {isActive && (
                <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-blue-500" />
              )}

              <Icon
                className={`h-5 w-5 shrink-0 ${
                  isActive
                    ? 'text-blue-500'
                    : isDark
                      ? 'text-gray-500 group-hover:text-gray-300'
                      : 'text-gray-500 group-hover:text-gray-700'
                }`}
              />

              {!collapsed && (
                <span className="truncate text-sm">{item.name}</span>
              )}

              {/* Tooltip - collapsed only */}
              {collapsed && (
                <div
                  className={`
                    invisible absolute left-full top-1/2 z-[100] ml-3
                    -translate-y-1/2 whitespace-nowrap rounded-lg
                    border px-3 py-1.5
                    text-xs font-medium shadow-lg
                    group-hover:visible
                    ${isDark
                      ? 'border-gray-600 bg-gray-800 text-gray-200'
                      : 'border-gray-200 bg-white text-gray-700'
                    }
                  `}
                >
                  {item.name}
                </div>
              )}
            </>
          )}
        </NavLink>
      </li>
    );
  };

  // ============================================
  // EXPANDABLE MENU
  // ============================================
  const SidebarExpandable = ({ item }) => {
    const Icon = item.icon;
    const isExpanded = expandedMenus[item.menuKey];
    const isParentActive = item.children.some((child) =>
      location.pathname.startsWith(child.path)
    );

    return (
      <li>
        {/* Parent button */}
        <button
          onClick={() => toggleMenu(item.menuKey)}
          className={`
            group relative flex w-full items-center rounded-lg
            transition-all duration-200
            ${collapsed
              ? 'justify-center px-2 py-2.5'
              : 'justify-between gap-3 px-3 py-2.5'
            }
            ${isParentActive
              ? isDark
                ? 'bg-blue-900/40 text-blue-400 font-medium'
                : 'bg-blue-50 text-blue-700 font-medium'
              : isDark
                ? 'text-gray-400 hover:bg-gray-700 hover:text-gray-100'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }
          `}
        >
          <div className="flex items-center gap-3">
            {isParentActive && (
              <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-blue-500" />
            )}

            <Icon
              className={`h-5 w-5 shrink-0 ${
                isParentActive
                  ? 'text-blue-500'
                  : isDark
                    ? 'text-gray-500 group-hover:text-gray-300'
                    : 'text-gray-500 group-hover:text-gray-700'
              }`}
            />

            {!collapsed && (
              <span className="truncate text-sm">{item.name}</span>
            )}
          </div>

          {!collapsed && (
            <ChevronDown
              className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
                isDark ? 'text-gray-600' : 'text-gray-400'
              } ${isExpanded ? 'rotate-0' : '-rotate-90'}`}
            />
          )}

          {/* Tooltip - collapsed only */}
          {collapsed && (
            <div
              className={`
                invisible absolute left-full top-1/2 z-[100] ml-3
                -translate-y-1/2 whitespace-nowrap rounded-lg
                border px-3 py-1.5
                text-xs font-medium shadow-lg
                group-hover:visible
                ${isDark
                  ? 'border-gray-600 bg-gray-800 text-gray-200'
                  : 'border-gray-200 bg-white text-gray-700'
                }
              `}
            >
              {item.name}
            </div>
          )}
        </button>

        {/* Children */}
        {isExpanded && !collapsed && (
          <ul className={`ml-4 mt-1 space-y-0.5 border-l-2 pl-3 ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
            {item.children.map((child) => {
              const ChildIcon = child.icon;
              return (
                <li key={child.path}>
                  <NavLink
                    to={child.path}
                    className={({ isActive }) => `
                      flex items-center gap-3 rounded-lg px-3 py-2
                      text-sm transition-all duration-200
                      ${isActive
                        ? isDark
                          ? 'bg-blue-900/40 font-medium text-blue-400'
                          : 'bg-blue-50 font-medium text-blue-700'
                        : isDark
                          ? 'text-gray-500 hover:bg-gray-700 hover:text-gray-300'
                          : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                      }
                    `}
                  >
                    <ChildIcon className="h-4 w-4 shrink-0" />
                    <span className="truncate">{child.name}</span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        )}
      </li>
    );
  };

  // ============================================
  // RENDER
  // ============================================
  return (
    <>
      {/* Mobile Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`
          absolute inset-y-0 left-0 z-50 flex flex-col
          border-r overflow-x-hidden overflow-y-hidden
          transition-all duration-300 ease-in-out

          /* Mobile: slide in/out */
          ${open ? 'translate-x-0' : '-translate-x-full'}
          w-72

          /* Desktop: always visible, no translate */
          lg:static lg:translate-x-0
          ${collapsed ? 'lg:w-[80px]' : 'lg:w-72'}

          ${isDark
            ? 'border-gray-700 bg-gray-900'
            : 'border-gray-200 bg-white'
          }
        `}
      >
        {/* ================================= */}
        {/* LOGO                              */}
        {/* ================================= */}
        <div
          className={`
            flex shrink-0 items-center border-b
            ${isDark ? 'border-gray-700' : 'border-gray-200'}
            ${collapsed ? 'justify-center px-2 py-5' : 'justify-between px-4 py-5'}
          `}
        >
          <div
            className={`
              flex items-center
              ${collapsed ? 'justify-center' : 'gap-3'}
            `}
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600">
              <UtensilsCrossed className="h-5 w-5 text-white" />
            </div>

            {!collapsed && (
              <div>
                <h1 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Restroly</h1>
                <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Admin Panel</p>
              </div>
            )}
          </div>

          {/* Close - mobile only */}
          <button
            onClick={() => setOpen(false)}
            className={`
              inline-flex h-8 w-8 items-center justify-center
              rounded-lg transition-colors lg:hidden
              ${isDark
                ? 'text-gray-400 hover:bg-gray-700'
                : 'text-gray-500 hover:bg-gray-100'
              }
            `}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* ================================= */}
        {/* NAVIGATION                        */}
        {/* ================================= */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-4">
          {visibleNavSections.map((section, sectionIndex) => (
            <div key={section.label} className={sectionIndex > 0 ? 'mt-4' : ''}>
              {/* Section Label */}
              {!collapsed ? (
                <p className={`mb-2 px-3 text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
                  {section.label}
                </p>
              ) : (
                sectionIndex > 0 && (
                  <div className={`mx-auto my-3 w-8 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`} />
                )
              )}

              {/* Items */}
              <ul className="space-y-1">
                {section.items.map((item) =>
                  item.type === 'expandable' ? (
                    <SidebarExpandable key={item.menuKey} item={item} />
                  ) : (
                    <SidebarLink key={item.path} item={item} />
                  )
                )}
              </ul>
            </div>
          ))}
        </div>

        {/* ================================= */}
        {/* COLLAPSE TOGGLE - Desktop only    */}
        {/* ================================= */}
        <div className={`hidden shrink-0 border-t px-3 py-3 lg:block ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`
              flex w-full items-center rounded-lg
              text-sm font-medium
              transition-all duration-200
              ${collapsed ? 'justify-center px-2 py-2' : 'gap-2 px-3 py-2'}
              ${isDark
                ? 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }
            `}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? (
              <ChevronsRight className="h-4 w-4" />
            ) : (
              <>
                <ChevronsLeft className="h-4 w-4" />
                <span>Collapse</span>
              </>
            )}
          </button>
        </div>

        {/* ================================= */}
        {/* RESTAURANT INFO                   */}
        {/* ================================= */}
        <div className={`shrink-0 border-t px-3 py-3 ${isDark ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-gray-50'}`}>
          <div
            className={`
              flex items-center rounded-xl border shadow-sm
              ${collapsed ? 'justify-center p-2' : 'gap-3 p-2.5'}
              ${isDark
                ? 'border-gray-700 bg-gray-800'
                : 'border-gray-200 bg-white'
              }
            `}
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50">
              <Store className="h-4 w-4 text-blue-600" />
            </div>

            {!collapsed && (
              <div className="min-w-0 flex-1">
                <p className={`truncate text-sm font-semibold ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                  Rajkot Dhaba
                </p>
                <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Main Branch</p>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
