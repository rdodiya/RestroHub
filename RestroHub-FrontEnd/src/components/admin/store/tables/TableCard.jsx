import { useState } from 'react';
import { QrCode, Edit2, Trash2, Users, Loader2 } from 'lucide-react';

const TableCard = ({ table, onShowQR, onEdit, onDelete }) => {
  const [deleting, setDeleting] = useState(false);

  const statusStyles = {
    available: {
      border: 'border-green-200 hover:border-green-300',
      badge: 'bg-green-50 text-green-700',
      dot: 'bg-green-500',
      numberBg: 'bg-green-50',
    },
    occupied: {
      border: 'border-red-200 hover:border-red-300',
      badge: 'bg-red-50 text-red-700',
      dot: 'bg-red-500',
      numberBg: 'bg-red-50',
    },
    reserved: {
      border: 'border-yellow-200 hover:border-yellow-300',
      badge: 'bg-yellow-50 text-yellow-700',
      dot: 'bg-yellow-500',
      numberBg: 'bg-yellow-50',
    },
  };

  const styles = statusStyles[table.status] || statusStyles.available;

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!window.confirm(`Delete Table ${table.number}?`)) return;
    try {
      setDeleting(true);
      // 🔌 await api.delete(`/api/tables/${table.id}`);
      await new Promise((r) => setTimeout(r, 300));
      onDelete(table.id);
    } catch (err) {
      console.error('Delete failed:', err);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div
      onClick={() => onShowQR(table)}
      className={`
        cursor-pointer overflow-hidden rounded-2xl border-2
        bg-white transition-all duration-200
        hover:shadow-lg
        ${styles.border}
      `}
    >
      {/* Body */}
      <div className="px-3 py-4 text-center sm:px-4 sm:py-5">
        {/* Number Circle */}
        <div
          className={`
            mx-auto mb-2 flex items-center justify-center
            rounded-xl border border-gray-100 shadow-sm
            h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16
            ${styles.numberBg}
          `}
        >
          <span className="text-lg font-bold text-gray-900 sm:text-xl lg:text-2xl">
            {table.number}
          </span>
        </div>

        {/* Label */}
        <p className="text-xs font-semibold text-gray-900 sm:text-sm">
          Table {table.number}
        </p>

        {/* Capacity */}
        <div className="mt-1 flex items-center justify-center gap-1 text-gray-600">
          <Users className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
          <span className="text-xs sm:text-sm">{table.capacity} seats</span>
        </div>

        {/* Status Badge */}
        <div className="mt-2 flex items-center justify-center">
          <span
            className={`
              inline-flex items-center gap-1.5 rounded-full
              px-2 py-0.5 text-xs font-medium capitalize
              ${styles.badge}
            `}
          >
            <span className={`inline-block h-1.5 w-1.5 rounded-full ${styles.dot}`} />
            {table.status}
          </span>
        </div>
      </div>

      {/* Actions Footer */}
      <div className="flex items-center justify-center gap-1 border-t border-gray-100 px-2 py-2 sm:gap-2 sm:px-3 sm:py-3">
        <button
          onClick={(e) => { e.stopPropagation(); onShowQR(table); }}
          className="
            inline-flex h-8 w-8 items-center justify-center
            rounded-lg bg-blue-50 text-blue-600
            hover:bg-blue-100 transition-colors
          "
          title="View QR"
        >
          <QrCode className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onEdit?.(table); }}
          className="
            inline-flex h-8 w-8 items-center justify-center
            rounded-lg bg-gray-50 text-gray-600
            hover:bg-gray-100 transition-colors
          "
          title="Edit"
        >
          <Edit2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </button>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="
            inline-flex h-8 w-8 items-center justify-center
            rounded-lg bg-red-50 text-red-600
            hover:bg-red-100 transition-colors
            disabled:opacity-50
          "
          title="Delete"
        >
          {deleting ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          )}
        </button>
      </div>
    </div>
  );
};

export default TableCard;