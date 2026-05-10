import { Plus, CreditCard } from 'lucide-react';

const UPIHeader = ({ onAddLink, totalLinks = 0 }) => {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Left */}
      <div>
        <div className="flex items-center gap-2">
          <CreditCard className="hidden h-6 w-6 text-blue-600 sm:block" />
          <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
            UPI Links
          </h2>
          {totalLinks > 0 && (
            <span
              className="
                rounded-full bg-blue-50 px-2.5 py-0.5
                text-xs font-semibold text-blue-700
              "
            >
              {totalLinks}
            </span>
          )}
        </div>
        <p className="mt-1 text-sm text-gray-500">
          Manage your payment UPI IDs
        </p>
      </div>

      {/* Right */}
      <button
        onClick={onAddLink}
        className="
          inline-flex w-full items-center justify-center gap-2
          rounded-lg bg-blue-50 px-5 py-2.5
          text-sm font-medium text-blue-700
          border border-blue-200
          hover:bg-blue-100 transition-colors
          sm:w-auto
        "
      >
        <Plus className="h-4 w-4" />
        Add UPI Link
      </button>
    </div>
  );
};

export default UPIHeader;