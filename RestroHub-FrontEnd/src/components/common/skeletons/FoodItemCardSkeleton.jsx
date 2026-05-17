// ============================================
// Reusable Skeleton for Food Item Card
// ============================================
const FoodItemCardSkeleton = () => (
  <div
    className="
      bg-white rounded-2xl shadow-sm border border-gray-100 animate-pulse
      p-4
      sm:flex sm:gap-4 sm:p-4
      lg:flex-col lg:p-5
    "
  >
    {/* Image Skeleton */}
    <div
      className="
        bg-gray-100 rounded-xl
        w-full h-36 mb-3
        sm:w-32 sm:h-32 sm:min-w-[8rem] sm:mb-0
        lg:w-full lg:h-36 lg:mb-4
      "
    />

    {/* Content Skeleton */}
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

export default FoodItemCardSkeleton;