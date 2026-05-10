import { useState } from 'react';
import {
  Edit2,
  EyeOff,
  Eye,
  MoreVertical,
  Globe,
  Image as ImageIcon,
  Trash2,
  Loader2
} from 'lucide-react';
import api from "@services/common/api";

const MenuItemCard = ({ item, onEdit, onToggle, onDelete }) => {
  const [togglingAvailability, setTogglingAvailability] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // ------------------------------------
  // HANDLERS
  // ------------------------------------
  const handleToggle = async () => {
    try {
      debugger
      setTogglingAvailability(true);
      await new Promise(resolve => setTimeout(resolve, 300));
      await api.patch(`/secure/api/v1/foods/${item.foodId}/${!item.isAvailable}`);
      onToggle(item.foodId);
    } catch (err) {
      console.error('Failed to toggle:', err);
    } finally {
      setTogglingAvailability(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${item.name}"?`)) return;
    try {
      setDeleting(true);
      await new Promise(resolve => setTimeout(resolve, 300));
      await api.delete(`/secure/api/v1/foods/${item.foodId}`);
      onDelete(item.foodId);
    } catch (err) {
      console.error('Failed to delete:', err);
    } finally {
      setDeleting(false);
    }
  };

  // ------------------------------------
  // STOCK STATUS
  // ------------------------------------
  const getStockBadge = () => {
    if (item.isAvailable) return { text: 'In Stock', className: 'bg-green-50 text-green-700' };
    //if (item.stock > 0) return { text: 'Low Stock', className: 'bg-yellow-50 text-yellow-700' };
    else return { text: 'Out of Stock', className: 'bg-red-50 text-red-700' };
  };

  const stockBadge = getStockBadge();

  // ------------------------------------
  // RENDER
  // ------------------------------------
  return (
    <div
      className={`
        bg-white rounded-2xl shadow-sm border border-gray-100
        hover:shadow-md hover:border-blue-100 transition-all
        ${!item.isAvailable ? 'opacity-70' : ''}

        /* MOBILE: vertical stack with padding */
        p-4

        /* TABLET: horizontal layout */
        sm:flex sm:gap-4 sm:p-4

        /* DESKTOP: back to vertical card */
        lg:flex-col lg:p-5
      `}
    >
      {/* ================================= */}
      {/* IMAGE SECTION                     */}
      {/* ================================= */}
      <div
        className={`
          relative bg-blue-50 rounded-xl flex items-center justify-center overflow-hidden border border-blue-100/50

          /* MOBILE: full width, shorter */
          w-full h-36 mb-3

          /* TABLET: fixed width square, no margin bottom */
          sm:w-32 sm:h-32 sm:min-w-[8rem] sm:mb-0

          /* DESKTOP: full width again */
          lg:w-full lg:h-36 lg:mb-4
        `}
      >
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.name || "Item image"}
            className="w-full h-full object-cover rounded-lg"
            onError={(e) => {
              e.target.onerror = null;
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "flex";
            }}
          />
        ) : (
          <ImageIcon className="w-10 h-10 text-blue-200 sm:w-8 sm:h-8 lg:w-12 lg:h-12" />
        )}
        {!item.isAvailable && (
          <div className="absolute inset-0 bg-gray-800/60 flex items-center justify-center">
            <span className="text-white font-semibold bg-red-500 px-3 py-1 rounded-full text-xs sm:text-xs lg:text-sm">
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* ================================= */}
      {/* CONTENT SECTION                   */}
      {/* ================================= */}
      <div className="flex-1 min-w-0">
        {/* Header: Name + Price + More button */}
        <div className="flex items-start justify-between mb-2 sm:mb-1.5 lg:mb-3">
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-gray-900 text-base sm:text-sm lg:text-base truncate">
              {item.name}
            </h3>
            <p className="text-lg sm:text-base lg:text-lg font-bold text-blue-600">
              ₹{item.price}
            </p>
          </div>
          <button className="p-1.5 sm:p-1 lg:p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0 ml-2">
            <MoreVertical className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Stock Info */}
        <div className="flex items-center justify-between mb-3 sm:mb-2 lg:mb-4">
          <span className="text-sm sm:text-xs lg:text-sm text-gray-600">
            Avalilablity :
          </span>
          <span
            className={`text-xs px-2 py-0.5 sm:py-0.5 lg:py-1 rounded-full font-medium ${stockBadge.className}`}
          >
            {stockBadge.text}
          </span>
        </div>

        {/* ================================= */}
        {/* ACTION BUTTONS                    */}
        {/* ================================= */}
        <div
          className={`
            flex gap-2

            /* MOBILE: full row */
            flex-row

            /* TABLET: compact buttons */
            sm:flex-wrap

            /* DESKTOP: full row again */
            lg:flex-nowrap
          `}
        >
          {/* Edit Button */}
          <button
            onClick={() => onEdit(item)}
            className={`
              flex items-center justify-center gap-1.5 rounded-xl transition-colors font-medium
              bg-blue-50 text-blue-700 hover:bg-blue-100

              /* MOBILE */
              flex-1 px-3 py-2 text-sm

              /* TABLET */
              sm:flex-1 sm:px-2 sm:py-1.5 sm:text-xs

              /* DESKTOP */
              lg:flex-1 lg:px-3 lg:py-2 lg:text-sm
            `}
          >
            <Edit2 className="w-4 h-4 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4" />
            <span>Edit</span>
          </button>

          {/* Toggle Button */}
          <button
            onClick={handleToggle}
            disabled={togglingAvailability}
            className={`
              flex items-center justify-center gap-1.5 rounded-xl transition-colors font-medium disabled:opacity-50

              ${item.isAvailable
                ? 'bg-yellow-50 text-yellow-800 hover:bg-yellow-100'
                : 'bg-green-50 text-green-800 hover:bg-green-100'
              }

              /* MOBILE */
              flex-1 px-3 py-2 text-sm

              /* TABLET */
              sm:flex-1 sm:px-2 sm:py-1.5 sm:text-xs

              /* DESKTOP */
              lg:flex-1 lg:px-3 lg:py-2 lg:text-sm
            `}
          >
            {togglingAvailability ? (
              <Loader2 className="w-4 h-4 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4 animate-spin" />
            ) : item.isAvailable ? (
              <EyeOff className="w-4 h-4 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4" />
            ) : (
              <Eye className="w-4 h-4 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4" />
            )}
            <span className="sm:hidden lg:inline">
              {item.isAvailable ? 'Hide' : 'Show'}
            </span>
            <span className="hidden sm:inline lg:hidden">
              {item.isAvailable ? 'Hide' : 'Show'}
            </span>
          </button>

          {/* Delete Button */}
          <button
            onClick={handleDelete}
            disabled={deleting}
            className={`
              bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors disabled:opacity-50 flex items-center justify-center

              /* MOBILE */
              p-2

              /* TABLET */
              sm:p-1.5

              /* DESKTOP */
              lg:p-2
            `}
          >
            {deleting ? (
              <Loader2 className="w-4 h-4 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4" />
            )}
          </button>
        </div>

        {/* ================================= */}
        {/* LANGUAGE TAGS                     */}
        {/* ================================= */}
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100 sm:mt-2 sm:pt-2 lg:mt-3 lg:pt-3">
          <Globe className="w-4 h-4 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4 text-gray-400 flex-shrink-0" />
          <div className="flex gap-1 flex-wrap">
            <span className="text-xs px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded font-medium">
              EN 🇺🇸
            </span>
            <span className="text-xs px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded">
              HI 🇮🇳
            </span>
            <span className="text-xs px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded">
              GU 🇮🇳
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuItemCard;