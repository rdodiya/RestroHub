const ProfileSkeleton = () => {
  return (
    <div className="p-6 animate-pulse space-y-6">
      <div className="h-32 rounded-lg bg-gray-200 dark:bg-gray-700"></div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 h-64 rounded-lg bg-gray-200 dark:bg-gray-700"></div>
        <div className="lg:col-span-8 space-y-6">
          <div className="h-48 rounded-lg bg-gray-200 dark:bg-gray-700"></div>
          <div className="h-48 rounded-lg bg-gray-200 dark:bg-gray-700"></div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSkeleton;
