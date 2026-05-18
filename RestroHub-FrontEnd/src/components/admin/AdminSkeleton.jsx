import { RefreshCw } from 'lucide-react';

const AdminSkeleton = ({ variant = 'order' }) => {
  switch (variant) {

    // ============================================
    // ORDER SKELETON
    // ============================================
    case 'order':
      return (
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl animate-pulse">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-200 rounded-xl" />

            <div>
              <div className="w-32 h-4 bg-gray-200 rounded mb-2" />
              <div className="w-48 h-3 bg-gray-200 rounded" />
            </div>
          </div>

          <div className="w-16 h-5 bg-gray-200 rounded" />
        </div>
      );

    // ============================================
    // STATS CARD SKELETON
    // ============================================
    case 'stats':
      return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gray-200" />
            <div className="w-16 h-5 rounded bg-gray-200" />
          </div>

          <div className="w-24 h-4 rounded bg-gray-200 mb-2" />
          <div className="w-32 h-7 rounded bg-gray-200" />
        </div>
      );

    // ============================================
    // CHART SKELETON
    // ============================================
    case 'chart':
      return (
        <div className="w-full h-full bg-gray-100 rounded-xl animate-pulse flex items-center justify-center">
          <RefreshCw className="w-8 h-8 text-gray-300 animate-spin" />
        </div>
      );
      
      case 'category':
  return (
    <div className="space-y-2">
      {[1, 2, 3, 4].map(i => (
        <div
          key={i}
          className="h-12 bg-gray-100 rounded-xl animate-pulse"
        />
      ))}
    </div>
  );

  case 'food-card':
  return (
    <div
      className="
        bg-white rounded-2xl shadow-sm border border-gray-100 animate-pulse
        p-4
        sm:flex sm:gap-4 sm:p-4
        lg:flex-col lg:p-5
      "
    >
      <div
        className="
          bg-gray-100 rounded-xl
          w-full h-36 mb-3
          sm:w-32 sm:h-32 sm:min-w-[8rem] sm:mb-0
          lg:w-full lg:h-36 lg:mb-4
        "
      />

      <div className="flex-1">
        <div className="w-32 h-5 bg-gray-100 rounded mb-2" />
        <div className="w-20 h-6 bg-gray-100 rounded mb-3 sm:mb-2 lg:mb-4" />

        <div className="flex justify-between mb-3 sm:mb-2 lg:mb-4">
          <div className="w-24 h-4 bg-gray-100 rounded" />
          <div className="w-16 h-5 bg-gray-100 rounded-full" />
        </div>

        <div className="flex gap-2">
          <div className="flex-1 h-9 sm:h-8 lg:h-9 bg-gray-100 rounded-xl" />
          <div className="flex-1 h-9 sm:h-8 lg:h-9 bg-gray-100 rounded-xl" />
          <div className="w-9 sm:w-8 lg:w-9 h-9 sm:h-8 lg:h-9 bg-gray-100 rounded-xl" />
        </div>
      </div>
    </div>
  );

  case 'menu-card':
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
      <div className="h-2 bg-gray-100" />

      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gray-100 rounded-2xl" />

            <div>
              <div className="w-40 h-5 bg-gray-100 rounded-lg mb-2" />
              <div className="w-28 h-4 bg-gray-100 rounded-lg" />
            </div>
          </div>

          <div className="w-20 h-7 bg-gray-100 rounded-full" />
        </div>

        <div className="w-full h-4 bg-gray-100 rounded mb-2" />
        <div className="w-2/3 h-4 bg-gray-100 rounded mb-5" />

        <div className="flex gap-2 mb-5">
          <div className="w-20 h-7 bg-gray-100 rounded-full" />
          <div className="w-24 h-7 bg-gray-100 rounded-full" />
          <div className="w-16 h-7 bg-gray-100 rounded-full" />
        </div>

        <div className="flex gap-2 pt-4 border-t border-gray-100">
          <div className="flex-1 h-10 bg-gray-100 rounded-xl" />
          <div className="flex-1 h-10 bg-gray-100 rounded-xl" />
          <div className="w-10 h-10 bg-gray-100 rounded-xl" />
        </div>
      </div>
    </div>
  );

  case 'order-card':
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gray-100 rounded-xl" />

          <div>
            <div className="w-28 h-5 bg-gray-100 rounded mb-1" />
            <div className="w-20 h-3 bg-gray-100 rounded" />
          </div>
        </div>

        <div className="w-8 h-8 bg-gray-100 rounded-lg" />
      </div>

      <div className="p-3 bg-gray-50 rounded-xl mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-100 rounded-full" />

          <div>
            <div className="w-24 h-4 bg-gray-100 rounded mb-1" />
            <div className="w-20 h-3 bg-gray-100 rounded" />
          </div>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between">
          <div className="w-32 h-4 bg-gray-100 rounded" />
          <div className="w-12 h-4 bg-gray-100 rounded" />
        </div>

        <div className="flex justify-between">
          <div className="w-24 h-4 bg-gray-100 rounded" />
          <div className="w-12 h-4 bg-gray-100 rounded" />
        </div>

        <div className="flex justify-between pt-2 border-t">
          <div className="w-16 h-5 bg-gray-100 rounded" />
          <div className="w-16 h-6 bg-gray-100 rounded" />
        </div>
      </div>

      <div className="w-full h-10 bg-gray-100 rounded-xl" />
    </div>
  );

  case 'branch':
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
      {/* Header skeleton */}
      <div className="border-b border-gray-100 px-4 py-4 sm:px-6 sm:py-5 animate-pulse">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 shrink-0 rounded-xl bg-gray-100 sm:h-12 sm:w-12" />

          <div className="flex-1">
            <div className="h-5 w-32 rounded bg-gray-100 mb-2" />
            <div className="h-4 w-16 rounded-full bg-gray-100" />
          </div>
        </div>
      </div>

      {/* Body skeleton */}
      <div className="px-4 py-4 sm:px-6 sm:py-5 animate-pulse">
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="h-4 w-4 rounded bg-gray-100" />
              <div className="h-4 w-44 rounded bg-gray-100" />
            </div>
          ))}
        </div>
      </div>

      {/* Footer skeleton */}
      <div className="border-t border-gray-100 px-4 py-3 sm:px-6 sm:py-4 animate-pulse">
        <div className="flex items-center gap-2">
          <div className="h-10 flex-1 rounded-lg bg-gray-100" />
          <div className="h-10 w-10 rounded-lg bg-gray-100" />
          <div className="h-10 w-10 rounded-lg bg-gray-100" />
        </div>
      </div>
    </div>
  );

  case 'table':
    return (
      <div className="overflow-hidden rounded-2xl border-2 border-gray-200 bg-white animate-pulse">
        <div className="px-4 py-5 text-center">
          <div className="mx-auto mb-2 h-14 w-14 rounded-xl bg-gray-100" />
          <div className="mx-auto mb-1 h-4 w-14 rounded bg-gray-100" />
          <div className="mx-auto mb-2 h-3 w-12 rounded bg-gray-100" />
          <div className="mx-auto h-5 w-16 rounded-full bg-gray-100" />
        </div>

        <div className="flex justify-center gap-2 border-t border-gray-100 px-3 py-3">
          <div className="h-8 w-8 rounded-lg bg-gray-100" />
          <div className="h-8 w-8 rounded-lg bg-gray-100" />
          <div className="h-8 w-8 rounded-lg bg-gray-100" />
        </div>
      </div>
    );

  case 'upi':
    return (
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white animate-pulse">
        {/* Header */}
        <div className="border-b border-gray-100 px-4 py-4 sm:px-6 sm:py-5">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 shrink-0 rounded-xl bg-gray-100 sm:h-12 sm:w-12" />

            <div className="flex-1">
              <div className="mb-2 h-5 w-32 rounded bg-gray-100" />
              <div className="h-4 w-40 rounded bg-gray-100" />
            </div>

            <div className="h-9 w-9 rounded-lg bg-gray-100" />
          </div>
        </div>

        {/* Body */}
        <div className="px-4 py-4 sm:px-6 sm:py-5">
          <div className="grid grid-cols-2 gap-3">
            <div className="h-20 rounded-xl bg-gray-100" />
            <div className="h-20 rounded-xl bg-gray-100" />
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex gap-2">
            <div className="h-10 flex-1 rounded-lg bg-gray-100" />
            <div className="h-10 flex-1 rounded-lg bg-gray-100" />
            <div className="h-10 w-10 rounded-lg bg-gray-100" />
          </div>
        </div>
      </div>
    );

    default:
      return null;
  }
};

export default AdminSkeleton;