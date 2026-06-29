import { useState } from 'react';
import {
  Edit2,
  EyeOff,
  Eye,
  Image as ImageIcon,
  Trash2,
  Loader2,
  Leaf,
  Drumstick,
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from "@services/common/api";
import { useAdminTheme } from '@context/AdminThemeContext';

const getErrorMessage = (err, fallback) =>
  err.response?.data?.message || err.response?.data?.error || fallback;

const MenuItemCard = ({ item, onEdit, onToggle, onDelete }) => {
  const [togglingAvailability, setTogglingAvailability] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const { isDark } = useAdminTheme();

  const isAvailable = item.isAvailable ?? true;
  const isVeg = item.isVeg ?? item.isVegetarian ?? true;

  const handleToggle = async () => {
    try {
      setTogglingAvailability(true);
      const response = await api.patch(`/secure/api/v1/foods/${item.foodId}/${!isAvailable}`);
      onToggle(response.data);
      toast.success(`Food item ${!isAvailable ? 'shown' : 'hidden'} successfully`);
    } catch (err) {
      console.error('Failed to toggle:', err.response?.data || err);
      toast.error(getErrorMessage(err, 'Failed to update availability'));
    } finally {
      setTogglingAvailability(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${item.name}"? This action cannot be undone.`)) return;

    try {
      setDeleting(true);
      await api.delete(`/secure/api/v1/foods/${item.foodId}`);
      onDelete(item.foodId);
      toast.success('Food item deleted successfully');
    } catch (err) {
      console.error('Failed to delete:', err.response?.data || err);
      toast.error(getErrorMessage(err, 'Failed to delete food item'));
    } finally {
      setDeleting(false);
    }
  };

  const stockBadge = isAvailable
    ? { text: 'Available', className: 'bg-green-50 text-green-700' }
    : { text: 'Unavailable', className: 'bg-red-50 text-red-700' };

  return (
    <div
      className={`
        rounded-2xl shadow-sm border transition-all
        ${isDark ? 'bg-gray-800 border-gray-700 hover:border-gray-600 hover:shadow-md' : 'bg-white border-gray-200 hover:shadow-md hover:border-blue-100'}
        ${!isAvailable ? 'opacity-75' : ''}
        p-4 sm:flex sm:gap-4 sm:p-4 lg:flex-col lg:p-5
      `}
    >
      <div
        className={`
          relative rounded-xl flex items-center justify-center overflow-hidden border
          ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-blue-50 border-blue-100/50'}
          w-full h-36 mb-3 sm:w-32 sm:h-32 sm:min-w-[8rem] sm:mb-0 lg:w-full lg:h-36 lg:mb-4
        `}
      >
        {item.imageUrl && !imageFailed ? (
          <img
            src={item.imageUrl}
            alt={item.name || 'Food item'}
            className="w-full h-full object-cover rounded-lg"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <ImageIcon className="w-10 h-10 text-blue-200 sm:w-8 sm:h-8 lg:w-12 lg:h-12" />
        )}
        {!isAvailable && (
          <div className="absolute inset-0 bg-gray-800/60 flex items-center justify-center">
            <span className="text-white font-semibold bg-red-500 px-3 py-1 rounded-full text-xs sm:text-xs lg:text-sm">
              Hidden
            </span>
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between mb-2 sm:mb-1.5 lg:mb-3">
          <div className="min-w-0 flex-1">
            <h3 className={`font-semibold text-base sm:text-sm lg:text-base truncate ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
              {item.name}
            </h3>
            <p className="text-lg sm:text-base lg:text-lg font-bold text-blue-600">
              Rs. {item.price}
            </p>
          </div>
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${
              isVeg ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            }`}
          >
            {isVeg ? <Leaf className="w-3 h-3" /> : <Drumstick className="w-3 h-3" />}
            {isVeg ? 'Veg' : 'Non-veg'}
          </span>
        </div>

        {item.description && (
          <p className={`mb-3 line-clamp-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            {item.description}
          </p>
        )}

        <div className="flex items-center justify-between mb-3 sm:mb-2 lg:mb-4">
          <span className={`text-sm sm:text-xs lg:text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Availability
          </span>
          <span className={`text-xs px-2 py-0.5 sm:py-0.5 lg:py-1 rounded-full font-medium ${stockBadge.className}`}>
            {stockBadge.text}
          </span>
        </div>

        <div className="flex gap-2 flex-row sm:flex-wrap lg:flex-nowrap">
          <button
            onClick={() => onEdit(item)}
            className="
              flex items-center justify-center gap-1.5 rounded-xl transition-colors font-medium
              bg-blue-50 text-blue-700 hover:bg-blue-100 flex-1 px-3 py-2 text-sm
              sm:px-2 sm:py-1.5 sm:text-xs lg:px-3 lg:py-2 lg:text-sm
            "
          >
            <Edit2 className="w-4 h-4 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4" />
            <span>Edit</span>
          </button>

          <button
            onClick={handleToggle}
            disabled={togglingAvailability}
            className={`
              flex items-center justify-center gap-1.5 rounded-xl transition-colors font-medium disabled:opacity-50
              ${isAvailable
                ? 'bg-yellow-50 text-yellow-800 hover:bg-yellow-100'
                : 'bg-green-50 text-green-800 hover:bg-green-100'
              }
              flex-1 px-3 py-2 text-sm sm:px-2 sm:py-1.5 sm:text-xs lg:px-3 lg:py-2 lg:text-sm
            `}
          >
            {togglingAvailability ? (
              <Loader2 className="w-4 h-4 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4 animate-spin" />
            ) : isAvailable ? (
              <EyeOff className="w-4 h-4 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4" />
            ) : (
              <Eye className="w-4 h-4 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4" />
            )}
            <span>{isAvailable ? 'Hide' : 'Show'}</span>
          </button>

          <button
            onClick={handleDelete}
            disabled={deleting}
            className="
              bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors disabled:opacity-50
              flex items-center justify-center p-2 sm:p-1.5 lg:p-2
            "
            aria-label={`Delete ${item.name}`}
          >
            {deleting ? (
              <Loader2 className="w-4 h-4 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuItemCard;
