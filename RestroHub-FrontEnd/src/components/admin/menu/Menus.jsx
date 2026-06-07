// Menus.jsx
import { useRef, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import MenuHeader from './menuCard/Header';
import BulkActions from './menuCard/BulkActions';
import CategorySidebar from './menuCard/CategorySidebar';
import MenuItemsGrid from './menuCard/FoodItemsGrid';
import MenuFormModal from './menuCard/FoodItemFormModal';
import CategoryFormModal from './menuCard/CategoryFormModal';
import MenuCreation from './menuCard/MenuFormModal';
import MenusGrid from './menuCard/MenusGrid';
import api from "@services/common/api";

const Menus = () => {
  const [activeTab, setActiveTab] = useState('foods');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [allCategories, setAllCategories] = useState([]);
  const menuGridRef = useRef(null);
  const menusGridRef = useRef(null);
  const categorySidebarRef = useRef(null);

  // FOOD ITEM MODAL STATE
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // CATEGORY MODAL STATE
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  // MENU CREATION MODAL STATE
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [editingMenu, setEditingMenu] = useState(null);
  const [allBranches, setAllBranches] = useState([]);

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      const response = await api.get('/secure/api/v1/branches', {
        params: { page: 0, size: 100, sortBy: 'name', sortDirection: 'asc' }
      });
      const branchList = response.data?.content || response.data || [];
      setAllBranches(Array.isArray(branchList) ? branchList : []);
    } catch (err) {
      console.error('Failed to fetch branches:', err.response?.data || err);
      setAllBranches([]);
    }
  };

  const refreshFoodItemsAndCategoryCounts = () => {
    menuGridRef.current?.refreshFoods();
    categorySidebarRef.current?.refreshCategoryCounts();
  };

  // FOOD ITEM MODAL HANDLERS
  const openAddModal = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const openEditModal = async (item) => {
    try {
      const response = await api.get(`/secure/api/v1/foods/${item.foodId}`);
      setEditingItem(response.data);
      setIsModalOpen(true);
    } catch (err) {
      console.error('Failed to fetch food item:', err.response?.data || err);
      toast.error(err.response?.data?.message || 'Failed to load food item details');
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleFoodItemSaved = () => {
    closeModal();
    refreshFoodItemsAndCategoryCounts();
  };

  // CATEGORY MODAL HANDLERS
  const openCategoryModal = () => {
    setEditingCategory(null);
    setIsCategoryModalOpen(true);
  };

  const openEditCategoryModal = (category) => {
    setEditingCategory(category);
    setIsCategoryModalOpen(true);
  };

  const closeCategoryModal = () => {
    setIsCategoryModalOpen(false);
    setEditingCategory(null);
  };

  const handleCategorySaved = () => {
    closeCategoryModal();
    categorySidebarRef.current?.refreshCategories();
    menuGridRef.current?.refreshFoods();
  };

  const handleCategoryDeleted = () => {
    menuGridRef.current?.refreshFoods();
  };

  // MENU CREATION MODAL HANDLERS
  const openMenuCreationModal = () => {
    setEditingMenu(null);
    setIsMenuModalOpen(true);
  };

  const openEditMenuModal = (menu) => {
    setEditingMenu(menu);
    setIsMenuModalOpen(true);
  };

  const closeMenuModal = () => {
    setIsMenuModalOpen(false);
    setEditingMenu(null);
    menusGridRef.current?.refreshMenus();
  };

  // TAB CONFIG
  const tabs = [
    { id: 'foods', label: 'Food Items', icon: '🍽️' },
    { id: 'menus', label: 'Menus', icon: '📋' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <MenuHeader
        activeTab={activeTab}
        onAddItem={openAddModal}
        onCreateMenu={openMenuCreationModal}
      />

      {/* ================================= */}
      {/* TAB NAVIGATION                    */}
      {/* ================================= */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-1.5 inline-flex gap-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold
              transition-all duration-300 ease-out
              ${activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }
            `}
          >
            <span className="text-base">{tab.icon}</span>
            {tab.label}
            {activeTab === tab.id && (
              <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-6 h-0.5 
                               bg-white/50 rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* ================================= */}
      {/* TAB CONTENT                       */}
      {/* ================================= */}

      {/* TAB 1: Food Items (existing) */}
      {activeTab === 'foods' && (
        <div className="animate-in fade-in duration-300">
          <BulkActions />
          <div className="flex flex-col lg:flex-row gap-6 mt-6">
            <CategorySidebar
              ref={categorySidebarRef}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              onAddCategory={openCategoryModal}
              onEditCategory={openEditCategoryModal}
              setAllCategories={setAllCategories}
              onCategoryDeleted={handleCategoryDeleted}
            />
            <MenuItemsGrid
              ref={menuGridRef}
              selectedCategory={selectedCategory}
              onEditItem={openEditModal}
              onFoodItemsChanged={refreshFoodItemsAndCategoryCounts}
            />
          </div>
        </div>
      )}

      {/* TAB 2: Menus */}
      {activeTab === 'menus' && (
        <div className="animate-in fade-in duration-300">
          <MenusGrid
            ref={menusGridRef}
            onEditMenu={openEditMenuModal}
            onCreateMenu={openMenuCreationModal}
          />
        </div>
      )}

      {/* Food Item Modal */}
      <MenuFormModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSaved={handleFoodItemSaved}
        editingItem={editingItem}
        allCategories={allCategories}
      />

      {/* Category Modal */}
      <CategoryFormModal
        isOpen={isCategoryModalOpen}
        onClose={closeCategoryModal}
        editingCategory={editingCategory}
        onSaved={handleCategorySaved}
      />

      {/* Menu Creation Modal */}
      <MenuCreation
        isOpen={isMenuModalOpen}
        onClose={closeMenuModal}
        editingMenu={editingMenu}
        allCategories={allCategories}
        allBranches={allBranches}
      />
    </div>
  );
};

export default Menus;
