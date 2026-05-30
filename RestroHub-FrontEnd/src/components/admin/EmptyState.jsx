const EmptyState = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className = "",
}) => (
  <div
    className={`bg-white rounded-2xl border border-gray-100 text-center p-8 sm:p-12 shadow-sm ${className}`}
  >
    {Icon ? (
      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-5">
        <Icon className="w-8 h-8 sm:w-10 sm:h-10 text-blue-300" />
      </div>
    ) : null}
    <p className="text-gray-700 font-semibold text-base sm:text-lg mb-1">{title}</p>
    {description ? (
      <p className="text-gray-500 text-sm mb-5 max-w-md mx-auto">{description}</p>
    ) : null}
    {actionLabel && onAction ? (
      <button
        type="button"
        onClick={onAction}
        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all font-semibold shadow-lg shadow-blue-600/25"
      >
        {actionLabel}
      </button>
    ) : null}
  </div>
);

export default EmptyState;
