// MenuHeader.jsx
import { Plus, UtensilsCrossed } from 'lucide-react';

const MenuHeader = ({ activeTab, onAddItem, onCreateMenu }) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Menu Management</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage your food items and menus
        </p>
      </div>

      <div className="flex gap-3">
        {activeTab === 'menus' ? (
          <button
            onClick={onCreateMenu}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white
                       rounded-xl hover:bg-blue-700 transition-colors font-medium
                       shadow-lg shadow-blue-600/20"
          >
            <UtensilsCrossed className="w-4 h-4" />
            Create Menu
          </button>
        ) : (
          <>
            <button
              onClick={onCreateMenu}
              className="flex items-center gap-2 px-4 py-2.5 border border-blue-600
                         text-blue-600 rounded-xl hover:bg-blue-50 transition-colors
                         font-medium"
            >
              <UtensilsCrossed className="w-4 h-4" />
              Create Menu
            </button>
            <button
              onClick={onAddItem}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white
                         rounded-xl hover:bg-blue-700 transition-colors font-medium
                         shadow-lg shadow-blue-600/20"
            >
              <Plus className="w-5 h-5" />
              Add Item
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default MenuHeader;