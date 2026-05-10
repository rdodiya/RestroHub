import { Plus, Building2 } from 'lucide-react';

const BranchHeader = ({ onAddBranch, totalBranches = 0 }) => {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Left */}
      <div>
        <div className="flex items-center gap-2">
          <Building2 className="h-6 w-6 text-blue-600 hidden sm:block" />
          <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
            Branches
          </h2>
          {totalBranches > 0 && (
            <span className="rounded-full bg-blue-100 px-2.5 py-0.5
                             text-xs font-bold text-blue-700">
              {totalBranches}
            </span>
          )}
        </div>
        <p className="mt-1 text-sm text-gray-500">
          Manage your restaurant locations and addresses
        </p>
      </div>

      {/* Right */}
      <button
        onClick={onAddBranch}
        className="inline-flex items-center justify-center gap-2
                   rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600
                   px-5 py-2.5 text-sm font-semibold text-white
                   shadow-lg shadow-blue-600/25
                   hover:from-blue-700 hover:to-indigo-700
                   hover:shadow-xl hover:shadow-blue-600/30
                   transition-all w-full sm:w-auto"
      >
        <Plus className="h-4 w-4" />
        Add Branch
      </button>
    </div>
  );
};

export default BranchHeader;