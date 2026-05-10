import { useState } from 'react';
import {
  CreditCard,
  Check,
  Copy,
  Trash2,
  TestTube,
  Star,
  Loader2,
  MoreVertical,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

const UPICard = ({ link, onCopy, onSetDefault, onDelete, onTest, copiedId }) => {
  const [deleting, setDeleting] = useState(false);
  const [settingDefault, setSettingDefault] = useState(false);

  // ------------------------------------
  // HANDLERS
  // ------------------------------------
  const handleSetDefault = async () => {
    try {
      setSettingDefault(true);
      // 🔌 await api.put(`/api/upi/${link.id}/default`);
      await new Promise((r) => setTimeout(r, 400));
      onSetDefault(link.id);
    } catch (err) {
      console.error('Failed:', err);
    } finally {
      setSettingDefault(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${link.name}" UPI link?`)) return;
    try {
      setDeleting(true);
      // 🔌 await api.delete(`/api/upi/${link.id}`);
      await new Promise((r) => setTimeout(r, 300));
      onDelete(link.id);
    } catch (err) {
      console.error('Failed:', err);
    } finally {
      setDeleting(false);
    }
  };

  const isCopied = copiedId === link.id;

  return (
    <div
      className={`
        overflow-hidden rounded-2xl border bg-white
        transition-all duration-200
        ${
          link.isDefault
            ? 'border-blue-200 hover:border-blue-300 hover:shadow-lg'
            : 'border-gray-200 hover:border-gray-300 hover:shadow-lg'
        }
      `}
    >
      {/* ============================= */}
      {/* HEADER                        */}
      {/* ============================= */}
      <div className="border-b border-gray-100 px-4 py-4 sm:px-6 sm:py-5">
        {/* Default Badge */}
        {link.isDefault && (
          <div className="mb-3 flex items-center gap-2">
            <Star className="h-3.5 w-3.5 text-blue-600 fill-blue-600" />
            <span
              className="
                inline-flex items-center rounded-full
                bg-blue-50 px-2.5 py-0.5
                text-xs font-medium text-blue-700
              "
            >
              Default Payment
            </span>
          </div>
        )}

        <div className="flex items-start justify-between gap-3">
          {/* Left: Icon + Details */}
          <div className="flex items-center gap-3">
            <div
              className={`
                flex h-10 w-10 shrink-0 items-center justify-center rounded-xl
                sm:h-12 sm:w-12
                ${link.isDefault ? 'bg-blue-50' : 'bg-gray-50'}
              `}
            >
              <CreditCard
                className={`
                  h-5 w-5 sm:h-6 sm:w-6
                  ${link.isDefault ? 'text-blue-600' : 'text-gray-500'}
                `}
              />
            </div>
            <div className="min-w-0">
              <h4 className="truncate text-sm font-semibold text-gray-900 sm:text-base">
                {link.name}
              </h4>
              <p className="truncate text-sm text-gray-500">{link.upiId}</p>
            </div>
          </div>

          {/* Right: Copy Button */}
          <button
            onClick={() => onCopy(link.upiId, link.id)}
            className={`
              inline-flex h-9 w-9 shrink-0 items-center justify-center
              rounded-lg transition-all duration-200
              ${
                isCopied
                  ? 'bg-green-50 text-green-600'
                  : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
              }
            `}
            title={isCopied ? 'Copied!' : 'Copy UPI ID'}
          >
            {isCopied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* ============================= */}
      {/* BODY - Stats                  */}
      {/* ============================= */}
      <div className="px-4 py-4 sm:px-6 sm:py-5">
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {/* Transactions */}
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-gray-500 sm:text-sm">
                Transactions
              </p>
              <span className="inline-flex items-center gap-0.5 text-xs font-medium text-green-600">
                <ArrowUpRight className="h-3 w-3" />
                12%
              </span>
            </div>
            <p className="mt-1 text-lg font-bold text-gray-900 sm:text-xl">
              {link.transactions}
            </p>
          </div>

          {/* Revenue */}
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-gray-500 sm:text-sm">
                Revenue
              </p>
              <span className="inline-flex items-center gap-0.5 text-xs font-medium text-green-600">
                <ArrowUpRight className="h-3 w-3" />
                8%
              </span>
            </div>
            <p className="mt-1 text-lg font-bold text-gray-900 sm:text-xl">
              ₹{link.revenue.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* ============================= */}
      {/* FOOTER - Actions              */}
      {/* ============================= */}
      <div className="border-t border-gray-100 px-4 py-3 sm:px-6 sm:py-4">
        <div className="flex items-center gap-2">
          {/* Test Button */}
          <button
            onClick={() => onTest(link)}
            className="
              inline-flex flex-1 items-center justify-center gap-2
              rounded-lg bg-blue-50 px-3 py-2.5
              text-xs font-medium text-blue-700 sm:text-sm
              hover:bg-blue-100 transition-colors
            "
          >
            <TestTube className="h-4 w-4" />
            Test ₹1
          </button>

          {/* Set Default */}
          {!link.isDefault && (
            <button
              onClick={handleSetDefault}
              disabled={settingDefault}
              className="
                inline-flex flex-1 items-center justify-center gap-2
                rounded-lg bg-green-50 px-3 py-2.5
                text-xs font-medium text-green-700 sm:text-sm
                hover:bg-green-100 transition-colors
                disabled:opacity-50
              "
            >
              {settingDefault ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Star className="h-4 w-4" />
              )}
              Set Default
            </button>
          )}

          {/* Delete */}
          {!link.isDefault && (
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="
                inline-flex h-10 w-10 shrink-0 items-center justify-center
                rounded-lg bg-red-50 text-red-600
                hover:bg-red-100 transition-colors
                disabled:opacity-50
              "
              title="Delete"
            >
              {deleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UPICard;