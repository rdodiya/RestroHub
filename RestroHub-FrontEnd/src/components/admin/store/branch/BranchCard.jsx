import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin, Phone, Clock, Grid3X3, Edit2, Power,
  ChevronRight, MoreVertical, Loader2, Trash2,
  Copy, Building2, Globe, Hash, RotateCcw,
  UtensilsCrossed, FileText
} from 'lucide-react';
import api from '@services/common/api';

const BranchCard = ({ branch, onEdit, onDelete, onRestore }) => {
  const [toggling, setToggling] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Soft delete toggle (using delete/restore endpoints)
  const handleToggle = async () => {
    try {
      setToggling(true);
      if (!branch.isDelete) {
        await api.delete(`/secure/api/v1/branches/${branch.branchId}`);
      } else {
        await api.patch(`/secure/api/v1/branches/${branch.branchId}/restore`);
      }
      // Trigger parent refresh
      if (!branch.isDelete) {
        onDelete?.(branch.branchId);
      } else {
        onRestore?.(branch.branchId);
      }
    } catch (err) {
      console.error('Toggle failed:', err);
    } finally {
      setToggling(false);
    }
  };

  // Build full address from nested address object
  const fullAddress = branch.address?.fullAddress ||
    [
      branch.address?.add1,
      branch.address?.add2,
      branch.address?.city,
      branch.address?.state,
      branch.address?.postalCode,
      branch.address?.country,
    ].filter(Boolean).join(', ');

  // Determine active state (isDelete = false means active)
  const isActive = !branch.isDelete;

  // Table count
  const tableCount = branch.tableCount || branch.tables?.length || 0;

  // Detail items config — mapped to BranchResponseDTO fields
  const details = [
    {
      icon: MapPin,
      label: 'Address',
      value: fullAddress || 'No address provided',
      color: 'text-red-500',
    },
    {
      icon: Building2,
      label: 'City',
      value: branch.address?.city
        ? `${branch.address.city}${branch.address.state ? ', ' + branch.address.state : ''}`
        : null,
      color: 'text-green-500',
    },
    {
      icon: Hash,
      label: 'Postal Code',
      value: branch.address?.postalCode || null,
      color: 'text-indigo-500',
    },
    {
      icon: Grid3X3,
      label: 'Tables',
      value: `${tableCount} Tables`,
      color: 'text-purple-500',
      badge: tableCount > 15 ? 'Large' : tableCount > 8 ? 'Medium' : tableCount > 0 ? 'Small' : null,
    },
    {
      icon: UtensilsCrossed,
      label: 'Menu',
      value: branch.menu?.menuName || null,
      color: 'text-orange-500',
    },
    {
      icon: FileText,
      label: 'Restaurant',
      value: branch.restaurant?.name || null,
      color: 'text-teal-500',
    },
  ].filter((item) => item.value); // Remove null entries

  return (
    <div
      className={`overflow-hidden rounded-2xl border bg-white
                  transition-all duration-200
                  ${isActive
                    ? 'border-gray-200 hover:border-blue-200 hover:shadow-lg'
                    : 'border-gray-200 opacity-60'
                  }`}
    >
      {/* ============================= */}
      {/* HEADER                        */}
      {/* ============================= */}
      <div className="border-b border-gray-100 px-4 py-4 sm:px-6 sm:py-5">
        <div className="flex items-start justify-between gap-3">
          {/* Icon + Name + Badge */}
          <div className="flex items-start gap-3">
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl
                          sm:h-12 sm:w-12
                          ${isActive ? 'bg-blue-50' : 'bg-gray-100'}`}
            >
              <MapPin
                className={`h-5 w-5 sm:h-6 sm:w-6
                            ${isActive ? 'text-blue-600' : 'text-gray-400'}`}
              />
            </div>

            <div className="min-w-0">
              <h4 className="truncate text-sm font-semibold text-gray-900 sm:text-base">
                {branch.name}
              </h4>

              {/* Description (if exists) */}
              {branch.description && (
                <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                  {branch.description}
                </p>
              )}

              <span
                className={`mt-1 inline-flex items-center gap-1.5
                            rounded-full px-2 py-0.5 text-xs font-medium
                            ${isActive
                              ? 'bg-green-50 text-green-700'
                              : 'bg-red-50 text-red-600'
                            }`}
              >
                <span
                  className={`inline-block h-1.5 w-1.5 rounded-full
                              ${isActive ? 'bg-green-500' : 'bg-red-400'}`}
                />
                {isActive ? 'Active' : 'Deleted'}
              </span>
            </div>
          </div>

          {/* Dropdown */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="inline-flex h-8 w-8 items-center justify-center
                         rounded-lg text-gray-400 hover:bg-gray-100
                         hover:text-gray-600 transition-colors"
            >
              <MoreVertical className="h-4 w-4" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-full z-30 mt-1
                              w-48 overflow-hidden rounded-xl border border-gray-200
                              bg-white shadow-xl">
                <button
                  onClick={() => { onEdit?.(branch); setMenuOpen(false); }}
                  className="flex w-full items-center gap-2.5 px-4 py-2.5
                             text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Edit2 className="h-4 w-4 text-gray-400" />
                  Edit Branch
                </button>

                {branch.address?.add1 && (
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(fullAddress);
                      setMenuOpen(false);
                    }}
                    className="flex w-full items-center gap-2.5 px-4 py-2.5
                               text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Copy className="h-4 w-4 text-gray-400" />
                    Copy Address
                  </button>
                )}

                <div className="border-t border-gray-100" />

                {/* {isActive ? (
                  <button
                    onClick={() => { handleToggle(); setMenuOpen(false); }}
                    className="flex w-full items-center gap-2.5 px-4 py-2.5
                               text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <Power className="h-4 w-4" />
                    Deactivate
                  </button>
                ) : (
                  <button
                    onClick={() => { onRestore?.(branch.branchId); setMenuOpen(false); }}
                    className="flex w-full items-center gap-2.5 px-4 py-2.5
                               text-sm text-green-600 hover:bg-green-50 transition-colors"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Restore
                  </button>
                )} */}

                {onDelete && (
                  <button
                    onClick={() => { onDelete?.(branch.branchId); setMenuOpen(false); }}
                    className="flex w-full items-center gap-2.5 px-4 py-2.5
                               text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete Branch
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ============================= */}
      {/* BODY - Details                */}
      {/* ============================= */}
      <div className="px-4 py-4 sm:px-6 sm:py-5">
        <ul className="space-y-3">
          {details.map((item, index) => {
            const Icon = item.icon;
            return (
              <li key={index} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center">
                  <Icon className={`h-4 w-4 ${item.color}`} />
                </span>
                <div className="flex flex-wrap items-center gap-2 min-w-0">
                  <span className="text-sm leading-relaxed text-gray-700 break-words">
                    {item.value}
                  </span>
                  {item.badge && (
                    <span className="rounded bg-blue-50 px-1.5 py-0.5
                                     text-xs font-medium text-blue-700">
                      {item.badge}
                    </span>
                  )}
                </div>
              </li>
            );
          })}
        </ul>

        {/* Created date */}
        {branch.createdDate && (
          <p className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-400
                        flex items-center gap-1.5">
            <Clock className="w-3 h-3" />
            Created {new Date(branch.createdDate).toLocaleDateString('en-IN', {
              day: 'numeric', month: 'short', year: 'numeric'
            })}
          </p>
        )}
      </div>

      {/* ============================= */}
      {/* FOOTER - Actions              */}
      {/* ============================= */}
      <div className="border-t border-gray-100 px-4 py-3 sm:px-6 sm:py-4">
        <div className="flex items-center gap-2">
          {/* Manage Tables - Primary */}
          <Link
            to={`/admin/store/branches/${branch.branchId}/tables`}
            className="inline-flex flex-1 items-center justify-center gap-1.5
                       rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50
                       border border-blue-200 px-4 py-2.5
                       text-sm font-medium text-blue-700
                       hover:from-blue-100 hover:to-indigo-100
                       transition-all"
          >
            <Grid3X3 className="h-4 w-4" />
            <span className="hidden xs:inline sm:hidden md:inline">Manage</span>
            Tables
            <ChevronRight className="h-4 w-4" />
          </Link>

          {/* Toggle Active/Inactive */}
          {/* <button
            onClick={handleToggle}
            disabled={toggling}
            className={`inline-flex h-10 w-10 shrink-0 items-center justify-center
                        rounded-xl transition-colors
                        disabled:cursor-not-allowed disabled:opacity-50
                        ${isActive
                          ? 'bg-red-50 text-red-600 hover:bg-red-100'
                          : 'bg-green-50 text-green-600 hover:bg-green-100'
                        }`}
            title={isActive ? 'Deactivate' : 'Activate'}
          >
            {toggling ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : isActive ? (
              <Power className="h-4 w-4" />
            ) : (
              <RotateCcw className="h-4 w-4" />
            )}
          </button> */}

          {/* Edit */}
          <button
            onClick={() => onEdit?.(branch)}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center
                       rounded-xl bg-gray-50 text-gray-600
                       hover:bg-gray-100 transition-colors"
            title="Edit"
          >
            <Edit2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BranchCard;