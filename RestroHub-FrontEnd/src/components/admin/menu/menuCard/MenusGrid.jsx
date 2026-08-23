// MenusGrid.jsx
import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import {
  Search,
  RefreshCw,
  AlertCircle,
  UtensilsCrossed,
  Edit3,
  Trash2,
  MapPin,
  Tag,
  MoreVertical,
  Plus,
  FileText,
  Eye,
  X,
  ChevronRight,
  Hash,
  Building2,
  Layers,
  Shield,
  Sparkles,
  Clock,
  Leaf,
  Drumstick,
  IndianRupee,
  ImageOff,
  ChevronDown,
  Star,
  Flame,
  Coffee,
  BadgePercent,
} from 'lucide-react';
import { Dialog } from '@headlessui/react';
import api from "@services/common/api";
import AdminSkeleton from '../../AdminSkeleton';
import toast from 'react-hot-toast';

// ============================================
// CONSTANTS
// ============================================
const cardGradients = [
  'from-blue-500 via-blue-600 to-indigo-600',
  'from-violet-500 via-purple-600 to-indigo-600',
  'from-emerald-500 via-green-600 to-teal-600',
  'from-orange-500 via-amber-600 to-yellow-600',
  'from-pink-500 via-rose-600 to-red-600',
  'from-cyan-500 via-teal-600 to-emerald-600',
  'from-fuchsia-500 via-purple-600 to-violet-600',
  'from-sky-500 via-blue-600 to-cyan-600',
];

const getCardGradient = (id) => cardGradients[(id || 0) % cardGradients.length];

const categoryStyleSets = [
  { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', dot: 'bg-blue-500', light: 'bg-blue-100', accent: 'from-blue-500 to-blue-600' },
  { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', dot: 'bg-purple-500', light: 'bg-purple-100', accent: 'from-purple-500 to-purple-600' },
  { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500', light: 'bg-emerald-100', accent: 'from-emerald-500 to-emerald-600' },
  { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', dot: 'bg-orange-500', light: 'bg-orange-100', accent: 'from-orange-500 to-orange-600' },
  { bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200', dot: 'bg-pink-500', light: 'bg-pink-100', accent: 'from-pink-500 to-pink-600' },
  { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200', dot: 'bg-teal-500', light: 'bg-teal-100', accent: 'from-teal-500 to-teal-600' },
  { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500', light: 'bg-amber-100', accent: 'from-amber-500 to-amber-600' },
  { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', dot: 'bg-indigo-500', light: 'bg-indigo-100', accent: 'from-indigo-500 to-indigo-600' },
];

const getCategoryStyle = (index) => categoryStyleSets[index % categoryStyleSets.length];

// ============================================
// VEG / NON-VEG INDICATOR
// ============================================
const VegIndicator = ({ isVeg }) => (
  <div
    className={`
      w-5 h-5 border-2 rounded-sm flex items-center justify-center shrink-0
      ${isVeg ? 'border-green-600' : 'border-red-600'}
    `}
    title={isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
  >
    <div className={`w-2 h-2 rounded-full ${isVeg ? 'bg-green-600' : 'bg-red-600'}`} />
  </div>
);

// ============================================
// FOOD ITEM ROW (inside detail modal)
// ============================================
const FoodItemRow = ({ food, isLast }) => {
  const hasDiscount = food.discountedPrice && food.discountedPrice < food.price;

  return (
    <div
      className={`
        flex items-start gap-3 sm:gap-4 py-4 group/food
        ${!isLast ? 'border-b border-dashed border-gray-200' : ''}
        hover:bg-gray-50/50 -mx-3 px-3 rounded-lg transition-colors
      `}
    >
      {/* Food Image or Placeholder */}
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shrink-0
                      bg-gray-100 border border-gray-200">
        {food.imageUrl ? (
          <img
            src={food.imageUrl}
            alt={food.name}
            className="w-full h-full object-cover group-hover/food:scale-105
                       transition-transform duration-300"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div
          className={`w-full h-full items-center justify-center bg-gray-50
                      ${food.imageUrl ? 'hidden' : 'flex'}`}
        >
          <Coffee className="w-6 h-6 text-gray-300" />
        </div>
      </div>

      {/* Food Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <VegIndicator isVeg={food.isVeg} />
              <h4 className="font-semibold text-gray-800 text-sm sm:text-base truncate">
                {food.name}
              </h4>
              {!food.isAvailable && (
                <span className="px-2 py-0.5 bg-red-100 text-red-600 text-[10px] font-bold
                                 rounded-full uppercase tracking-wider shrink-0">
                  Unavailable
                </span>
              )}
            </div>

            {food.description && (
              <p className="text-xs sm:text-sm text-gray-400 line-clamp-2 leading-relaxed mb-1.5">
                {food.description}
              </p>
            )}

            {/* Meta Tags */}
            <div className="flex flex-wrap items-center gap-2">
              {food.preparationTime && (
                <span className="inline-flex items-center gap-1 text-[11px] text-gray-400 font-medium">
                  <Clock className="w-3 h-3" />
                  {food.preparationTime} min
                </span>
              )}
              {food.servingSize && (
                <span className="inline-flex items-center gap-1 text-[11px] text-gray-400 font-medium">
                  <UtensilsCrossed className="w-3 h-3" />
                  {food.servingSize}
                </span>
              )}
              {food.foodType && (
                <span className="inline-flex items-center gap-1 text-[11px] text-gray-400 font-medium">
                  <Flame className="w-3 h-3" />
                  {food.foodType}
                </span>
              )}
            </div>
          </div>

          {/* Price */}
          <div className="text-right shrink-0 ml-2">
            {hasDiscount ? (
              <>
                <div className="flex items-center gap-1 justify-end mb-0.5">
                  <BadgePercent className="w-3.5 h-3.5 text-green-500" />
                  <span className="text-xs text-green-600 font-bold">OFFER</span>
                </div>
                <p className="text-sm text-gray-400 line-through">
                  ₹{Number(food.price).toFixed(0)}
                </p>
                <p className="text-lg font-bold text-green-600">
                  ₹{Number(food.discountedPrice).toFixed(0)}
                </p>
              </>
            ) : (
              <p className={`text-lg font-bold ${
                food.isAvailable ? 'text-gray-800' : 'text-gray-400'
              }`}>
                ₹{Number(food.price).toFixed(0)}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// CATEGORY SECTION (inside detail modal)
// ============================================
const CategoryMenuSection = ({ category, index, defaultExpanded = true }) => {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const style = getCategoryStyle(index);
  const foodCount = category.foods?.length || category.foodCount || 0;

  return (
    <div className={`rounded-2xl border overflow-hidden transition-all duration-300
                     ${expanded ? `${style.border} shadow-sm` : 'border-gray-200'}`}>
      {/* Category Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className={`
          w-full flex items-center justify-between px-5 py-4 text-left
          transition-all duration-300
          ${expanded
            ? `${style.bg} border-b ${style.border}`
            : 'bg-white hover:bg-gray-50'
          }
        `}
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0
                           ${expanded ? style.light : 'bg-gray-100'}`}>
            <Tag className={`w-4 h-4 ${expanded ? style.text : 'text-gray-400'}`} />
          </div>
          <div className="min-w-0">
            <h3 className={`font-bold text-sm sm:text-base truncate
                           ${expanded ? style.text : 'text-gray-700'}`}>
              {category.name}
            </h3>
            {category.description && (
              <p className="text-xs text-gray-400 truncate mt-0.5">
                {category.description}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 ml-3">
          <span className={`
            px-2.5 py-1 text-xs font-bold rounded-full
            ${expanded
              ? `${style.light} ${style.text}`
              : 'bg-gray-100 text-gray-500'
            }
          `}>
            {foodCount} {foodCount === 1 ? 'item' : 'items'}
          </span>
          <ChevronDown
            className={`w-5 h-5 transition-transform duration-300
                       ${expanded ? 'rotate-180' : ''}
                       ${expanded ? style.text : 'text-gray-400'}`}
          />
        </div>
      </button>

      {/* Food Items List */}
      {expanded && (
        <div className="bg-white px-5 py-2">
          {category.foods && category.foods.length > 0 ? (
            category.foods.map((food, idx) => (
              <FoodItemRow
                key={food.foodId}
                food={food}
                isLast={idx === category.foods.length - 1}
              />
            ))
          ) : (
            <div className="py-8 text-center">
              <Coffee className="w-8 h-8 text-gray-200 mx-auto mb-2" />
              <p className="text-sm text-gray-400 italic">
                No items in this category yet
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ============================================
// MENU DETAIL MODAL (HOTEL MENU STYLE)
// ============================================
const MenuDetailModal = ({ isOpen, onClose, menu, onEdit, onDelete }) => {
  const [activeSection, setActiveSection] = useState('menu');

  if (!menu) return null;

  const gradient = getCardGradient(menu.menuId);
  const totalFoods = menu.totalFoodCount
    || menu.categories?.reduce((sum, cat) => sum + (cat.foods?.length || 0), 0)
    || 0;
  const vegCount = menu.categories?.reduce(
    (sum, cat) => sum + (cat.foods?.filter((f) => f.isVeg).length || 0), 0
  ) || 0;
  const nonVegCount = totalFoods - vegCount;

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-gradient-to-br from-black/40 to-black/60 backdrop-blur-sm"
           aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-3 sm:p-4">
        <Dialog.Panel
          className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-gray-100
                     max-h-[94vh] overflow-hidden flex flex-col"
        >

          {/* ========== HERO HEADER ========== */}
          <div className={`relative bg-gradient-to-r ${gradient} shrink-0 overflow-hidden`}>
            {/* Decorative Elements */}
            <div className="absolute inset-0">
              <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10" />
              <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-white/5" />
              <div className="absolute top-1/2 right-1/4 w-24 h-24 rounded-full bg-white/5" />
              {/* Pattern overlay */}
              <div className="absolute inset-0 opacity-5"
                   style={{
                     backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                     backgroundSize: '24px 24px',
                   }} />
            </div>

            <div className="relative px-6 sm:px-8 pt-6 pb-5">
              {/* Close */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 bg-white/15 hover:bg-white/25
                           rounded-xl transition-colors backdrop-blur-sm"
              >
                <X className="w-5 h-5 text-white" />
              </button>

              {/* Title Row */}
              <div className="flex items-start gap-4 mb-4">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center
                                justify-center border border-white/20 shadow-lg shrink-0">
                  <UtensilsCrossed className="w-7 h-7 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <Dialog.Title className="text-xl sm:text-2xl font-bold text-white leading-tight">
                    {menu.menuName}
                  </Dialog.Title>
                  <div className="flex items-center gap-3 mt-2 flex-wrap">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold
                                      rounded-full backdrop-blur-sm border
                                      ${menu.isDeleted
                                        ? 'bg-red-500/20 text-red-100 border-red-300/30'
                                        : 'bg-green-500/20 text-green-100 border-green-300/30'
                                      }`}>
                      <span className={`w-2 h-2 rounded-full ${
                        menu.isDeleted ? 'bg-red-300' : 'bg-green-300 animate-pulse'
                      }`} />
                      {menu.isDeleted ? 'Deleted' : 'Active'}
                    </span>
                    {menu.branch && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium
                                       rounded-full bg-white/15 text-white/90 backdrop-blur-sm
                                       border border-white/10">
                        <MapPin className="w-3 h-3" />
                        {menu.branch.name}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick Stats Row */}
              <div className="grid grid-cols-4 gap-2 sm:gap-3">
                {[
                  { label: 'Categories', value: menu.categories?.length || 0, icon: Layers },
                  { label: 'Total Items', value: totalFoods, icon: UtensilsCrossed },
                  { label: 'Veg', value: vegCount, icon: Leaf },
                  { label: 'Non-Veg', value: nonVegCount, icon: Drumstick },
                ].map((stat, i) => (
                  <div key={i} className="bg-white/15 backdrop-blur-sm rounded-xl px-3 py-2.5
                                          border border-white/10 text-center">
                    <stat.icon className="w-4 h-4 text-white/70 mx-auto mb-1" />
                    <p className="text-lg sm:text-xl font-bold text-white leading-none">
                      {stat.value}
                    </p>
                    <p className="text-[10px] sm:text-xs text-white/60 font-medium mt-0.5">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Section Tabs */}
            <div className="relative px-6 sm:px-8 pb-0 flex gap-1">
              {[
                { id: 'menu', label: 'Full Menu', icon: UtensilsCrossed },
                { id: 'info', label: 'Details', icon: FileText },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveSection(tab.id)}
                  className={`
                    flex items-center gap-1.5 px-4 py-2.5 text-xs sm:text-sm font-semibold
                    rounded-t-xl transition-all duration-200
                    ${activeSection === tab.id
                      ? 'bg-white text-gray-800 shadow-sm'
                      : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
                    }
                  `}
                >
                  <tab.icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* ========== BODY ========== */}
          <div className="flex-1 overflow-y-auto">

            {/* ---- FULL MENU VIEW ---- */}
            {activeSection === 'menu' && (
              <div className="px-6 sm:px-8 py-6 space-y-4">

                {menu.menuDesc && (
                  <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-100
                                  flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <p className="text-sm text-amber-800 leading-relaxed italic">
                      {menu.menuDesc}
                    </p>
                  </div>
                )}

                {/* Veg / Non-Veg Legend */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                      <VegIndicator isVeg={true} />
                      <span className="text-xs text-gray-500 font-medium">Veg</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <VegIndicator isVeg={false} />
                      <span className="text-xs text-gray-500 font-medium">Non-Veg</span>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400">
                    {totalFoods} items across {menu.categories?.length || 0} categories
                  </span>
                </div>

                {/* Category Sections */}
                {menu.categories && menu.categories.length > 0 ? (
                  <div className="space-y-3">
                    {menu.categories.map((cat, idx) => (
                      <CategoryMenuSection
                        key={cat.categoryId}
                        category={cat}
                        index={idx}
                        defaultExpanded={idx < 3}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center
                                    justify-center mx-auto mb-4">
                      <UtensilsCrossed className="w-8 h-8 text-gray-300" />
                    </div>
                    <p className="text-gray-500 font-medium mb-1">No categories yet</p>
                    <p className="text-sm text-gray-400">
                      Add categories with food items to build your menu
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* ---- DETAILS VIEW ---- */}
            {activeSection === 'info' && (
              <div className="px-6 sm:px-8 py-6 space-y-6">

                {/* Description */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-4 h-4 text-purple-600" />
                    </div>
                    <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                      Description
                    </h3>
                  </div>
                  <div className="ml-10 p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {menu.menuDesc || (
                        <span className="italic text-gray-400">No description provided</span>
                      )}
                    </p>
                  </div>
                </div>

                {/* Branch */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <Building2 className="w-4 h-4 text-green-600" />
                    </div>
                    <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                      Branch
                    </h3>
                  </div>
                  <div className="ml-10">
                    {menu.branch ? (
                      <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl
                                      border border-green-100">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center
                                          justify-center shrink-0">
                            <MapPin className="w-5 h-5 text-green-600" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-gray-800">
                              {menu.branch.name}
                            </p>
                            {menu.branch.address?.city && (
                              <p className="text-xs text-gray-500 mt-0.5">
                                📍 {menu.branch.address.city}
                                {menu.branch.address?.state ? `, ${menu.branch.address.state}` : ''}
                              </p>
                            )}
                            {menu.branch.phone && (
                              <p className="text-xs text-gray-400 mt-0.5">
                                📞 {menu.branch.phone}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 bg-gray-50 rounded-xl border border-dashed border-gray-200
                                      text-center">
                        <MapPin className="w-5 h-5 text-gray-300 mx-auto mb-1" />
                        <p className="text-sm text-gray-400 italic">No branch assigned</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* All Categories List */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Layers className="w-4 h-4 text-orange-600" />
                      </div>
                      <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                        All Categories
                      </h3>
                    </div>
                    {menu.categories && menu.categories.length > 0 && (
                      <span className="px-2.5 py-1 bg-blue-100 text-blue-700 text-xs font-bold
                                       rounded-full">
                        {menu.categories.length} total
                      </span>
                    )}
                  </div>
                  <div className="ml-10">
                    {menu.categories && menu.categories.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {menu.categories.map((cat, idx) => {
                          const style = getCategoryStyle(idx);
                          return (
                            <div
                              key={cat.categoryId}
                              className={`flex items-center gap-3 px-4 py-3 rounded-xl border
                                          ${style.bg} ${style.border}
                                          transition-all hover:shadow-md hover:-translate-y-0.5`}
                            >
                              <div className={`w-2.5 h-2.5 rounded-full ${style.dot} shrink-0`} />
                              <div className="min-w-0 flex-1">
                                <p className={`text-sm font-semibold ${style.text} truncate`}>
                                  {cat.name}
                                </p>
                                <p className="text-xs text-gray-400 mt-0.5">
                                  {cat.foodCount || cat.foods?.length || 0} items
                                </p>
                              </div>
                              <Tag className={`w-3.5 h-3.5 ${style.text} opacity-50 shrink-0`} />
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="p-4 bg-gray-50 rounded-xl border border-dashed border-gray-200
                                      text-center">
                        <Tag className="w-5 h-5 text-gray-300 mx-auto mb-1" />
                        <p className="text-sm text-gray-400 italic">No categories assigned</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Status Info */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Shield className="w-4 h-4 text-blue-600" />
                    </div>
                    <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                      Status Info
                    </h3>
                  </div>
                  <div className="ml-10 grid grid-cols-2 gap-3">
                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                      <p className="text-xs text-gray-400 font-medium mb-1">Menu ID</p>
                      <p className="text-sm font-bold text-gray-800"># {menu.menuId}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                      <p className="text-xs text-gray-400 font-medium mb-1">Status</p>
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${
                          menu.isDeleted ? 'bg-red-500' : 'bg-green-500 animate-pulse'
                        }`} />
                        <p className={`text-sm font-bold ${
                          menu.isDeleted ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {menu.isDeleted ? 'Deleted' : 'Active'}
                        </p>
                      </div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                      <p className="text-xs text-gray-400 font-medium mb-1">Total Items</p>
                      <p className="text-sm font-bold text-gray-800">{totalFoods}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                      <p className="text-xs text-gray-400 font-medium mb-1">Branch</p>
                      <p className="text-sm font-bold text-gray-800 truncate">
                        {menu.branch?.name || 'Unassigned'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ========== FOOTER ========== */}
          <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 sm:px-8 py-4
                          flex items-center justify-between shrink-0">
            <button
              onClick={onClose}
              className="px-5 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50
                         transition-colors font-medium text-gray-600 text-sm"
            >
              Close
            </button>
            <div className="flex gap-2.5">
              <button
                onClick={() => {
                  onClose();
                  setTimeout(() => onDelete(menu.menuId), 200);
                }}
                className="flex items-center gap-2 px-4 py-2.5 border border-red-200
                           text-red-600 rounded-xl hover:bg-red-50 transition-colors
                           font-medium text-sm"
              >
                <Trash2 className="w-4 h-4" />
                <span className="hidden sm:inline">Delete</span>
              </button>
              <button
                onClick={() => {
                  onClose();
                  setTimeout(() => onEdit(menu), 200);
                }}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600
                           to-indigo-600 text-white rounded-xl hover:from-blue-700
                           hover:to-indigo-700 transition-all font-semibold text-sm
                           shadow-lg shadow-blue-600/25"
              >
                <Edit3 className="w-4 h-4" />
                Edit Menu
              </button>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

// ============================================
// MENU CARD COMPONENT
// ============================================
const MenuCard = ({ menu, onEdit, onDelete, onView, deleting }) => {
  const [showActions, setShowActions] = useState(false);

  const gradient = getCardGradient(menu.menuId);
  const visibleCategories = menu.categories?.slice(0, 3) || [];
  const remainingCount = (menu.categories?.length || 0) - 3;
  const totalFoods = menu.totalFoodCount
    || menu.categories?.reduce((sum, cat) => sum + (cat.foods?.length || 0), 0)
    || 0;

  return (
    <div
      className={`
        group relative bg-white rounded-2xl overflow-hidden
        transition-all duration-500 ease-out
        hover:shadow-2xl hover:shadow-gray-300/30 hover:-translate-y-1
        ${menu.isDeleted
          ? 'border-2 border-red-200 ring-1 ring-red-100'
          : 'border border-gray-100 shadow-md shadow-gray-100/50'
        }
      `}
    >
      {/* Gradient Top Bar */}
      <div className={`h-2 bg-gradient-to-r ${gradient}
                       ${menu.isDeleted ? 'opacity-30' : 'opacity-100'}`} />

      <div className="p-5 sm:p-6">

        {/* Top: Icon + Name + Actions */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div
              className={`
                relative w-12 h-12 rounded-2xl flex items-center justify-center shrink-0
                transition-all duration-500 group-hover:scale-110 group-hover:rotate-3
                shadow-lg
                ${menu.isDeleted
                  ? 'bg-red-100 shadow-red-200/50'
                  : `bg-gradient-to-br ${gradient} shadow-blue-300/30`
                }
              `}
            >
              <UtensilsCrossed
                className={`w-5 h-5 transition-transform duration-500
                            group-hover:scale-110
                            ${menu.isDeleted ? 'text-red-500' : 'text-white'}`}
              />
              {!menu.isDeleted && (
                <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-green-400 rounded-full
                                border-2 border-white shadow-sm">
                  <div className="w-full h-full bg-green-400 rounded-full animate-ping opacity-50" />
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-gray-800 text-base leading-tight truncate
                             group-hover:text-blue-700 transition-colors duration-300">
                {menu.menuName}
              </h3>
              {menu.branch ? (
                <div className="flex items-center gap-1.5 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span className="text-xs text-gray-500 truncate font-medium">
                    {menu.branch.name}
                    {menu.branch.address?.city ? ` • ${menu.branch.address.city}` : ''}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-gray-300 shrink-0" />
                  <span className="text-xs text-gray-400 italic">No branch</span>
                </div>
              )}
            </div>
          </div>

          {/* Badge + Dropdown */}
          <div className="flex items-center gap-2 shrink-0 ml-2">
            <span
              className={`
                inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-full
                ${menu.isDeleted
                  ? 'bg-red-100 text-red-600 ring-1 ring-red-200'
                  : 'bg-green-100 text-green-700 ring-1 ring-green-200'
                }
              `}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${
                menu.isDeleted ? 'bg-red-500' : 'bg-green-500 animate-pulse'
              }`} />
              {menu.isDeleted ? 'Deleted' : 'Active'}
            </span>

            <div className="relative">
              <button
                onClick={() => setShowActions(!showActions)}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-all duration-200
                           opacity-0 group-hover:opacity-100"
              >
                <MoreVertical className="w-4 h-4 text-gray-400" />
              </button>

              {showActions && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowActions(false)} />
                  <div className="absolute right-0 top-full mt-1 z-20 bg-white border border-gray-200
                                  rounded-xl shadow-2xl py-1.5 min-w-[160px]">
                    <button
                      onClick={() => { setShowActions(false); onView(menu); }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700
                                 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                    >
                      <Eye className="w-4 h-4 text-blue-500" />
                      View Full Menu
                    </button>
                    <button
                      onClick={() => { setShowActions(false); onEdit(menu); }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700
                                 hover:bg-amber-50 hover:text-amber-700 transition-colors"
                    >
                      <Edit3 className="w-4 h-4 text-amber-500" />
                      Edit Menu
                    </button>
                    <div className="h-px bg-gray-100 my-1" />
                    <button
                      onClick={() => { setShowActions(false); onDelete(menu.menuId); }}
                      disabled={deleting}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600
                                 hover:bg-red-50 transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete Menu
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        {menu.menuDesc && (
          <div className="mb-4 p-3 bg-gray-50/80 rounded-xl border border-gray-100/80
                          group-hover:bg-blue-50/30 group-hover:border-blue-100/50
                          transition-colors duration-300">
            <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
              {menu.menuDesc}
            </p>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="bg-blue-50/60 rounded-xl px-3 py-2 text-center border border-blue-100/50">
            <p className="text-base font-bold text-blue-700">{menu.categories?.length || 0}</p>
            <p className="text-[10px] text-blue-500 font-medium">Categories</p>
          </div>
          <div className="bg-green-50/60 rounded-xl px-3 py-2 text-center border border-green-100/50">
            <p className="text-base font-bold text-green-700">{totalFoods}</p>
            <p className="text-[10px] text-green-500 font-medium">Items</p>
          </div>
          <div className="bg-purple-50/60 rounded-xl px-3 py-2 text-center border border-purple-100/50">
            <p className="text-base font-bold text-purple-700">
              #{menu.menuId}
            </p>
            <p className="text-[10px] text-purple-500 font-medium">Menu ID</p>
          </div>
        </div>

        {/* Categories */}
        <div className="mb-1">
          <div className="flex items-center gap-1.5 mb-2">
            <Tag className="w-3.5 h-3.5 text-gray-300" />
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
              Categories
            </span>
          </div>
          {menu.categories && menu.categories.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {visibleCategories.map((cat, idx) => {
                const style = getCategoryStyle(idx);
                return (
                  <span
                    key={cat.categoryId}
                    className={`
                      inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold
                      rounded-full border transition-all duration-200
                      hover:shadow-md hover:-translate-y-0.5 cursor-default
                      ${style.bg} ${style.text} ${style.border}
                    `}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                    {cat.name}
                    {(cat.foodCount || cat.foods?.length) ? (
                      <span className="opacity-60">
                        ({cat.foodCount || cat.foods?.length})
                      </span>
                    ) : null}
                  </span>
                );
              })}
              {remainingCount > 0 && (
                <button
                  onClick={() => onView(menu)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold
                             rounded-full bg-gray-100 text-gray-500 border border-gray-200
                             hover:bg-blue-100 hover:text-blue-600 hover:border-blue-200
                             transition-all duration-200"
                >
                  +{remainingCount} more
                  <ChevronRight className="w-3 h-3" />
                </button>
              )}
            </div>
          ) : (
            <p className="text-xs text-gray-400 italic pl-1">No categories</p>
          )}
        </div>
      </div>

      {/* Card Footer */}
      <div className="px-5 sm:px-6 py-3.5 bg-gradient-to-r from-gray-50 to-gray-50/50
                      border-t border-gray-100 flex items-center justify-between">
        <button
          onClick={() => onView(menu)}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold
                     text-indigo-600 bg-indigo-50 border border-indigo-200
                     hover:bg-indigo-100 rounded-xl transition-all duration-200
                     shadow-sm hover:shadow-md"
        >
          <Eye className="w-3.5 h-3.5" />
          Full View
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(menu)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold
                       text-blue-600 bg-blue-50 border border-blue-200
                       hover:bg-blue-100 rounded-xl transition-all duration-200
                       shadow-sm hover:shadow-md"
          >
            <Edit3 className="w-3.5 h-3.5" />
            Edit
          </button>
          <button
            onClick={() => onDelete(menu.menuId)}
            disabled={deleting}
            className="flex items-center justify-center w-9 h-9 text-gray-400
                       hover:text-red-500 hover:bg-red-50 border border-transparent
                       hover:border-red-200 rounded-xl transition-all duration-200
                       disabled:opacity-50 shadow-sm hover:shadow-md"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Bottom Accent */}
      <div className={`h-0.5 bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-100
                       transition-opacity duration-500`} />
    </div>
  );
};

// ============================================
// MAIN MENUS GRID COMPONENT
// ============================================
const MenusGrid = forwardRef(({ onEditMenu, onCreateMenu }, ref) => {
  const [menus, setMenus] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // Detail modal
  const [viewingMenu, setViewingMenu] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  useEffect(() => {
    fetchMenus();
  }, []);

  useImperativeHandle(ref, () => ({
    refreshMenus() {
      fetchMenus();
    }
  }));

  const fetchMenus = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get('/secure/api/v1/menus', {
        params: { page: 0, size: 50, sortBy: 'menuName', sortDirection: 'asc' }
      });

      const menuList = response.data?.content || response.data || [];
      setMenus(Array.isArray(menuList) ? menuList : []);
    } catch (err) {
      console.error('Failed to fetch menus:', err.response?.data || err);
      toast.error('Failed to fetch menus');
      setError('Failed to load menus');
      setMenus([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (menuId) => {
    if (!window.confirm('Are you sure you want to delete this menu?')) return;

    try {
      setDeletingId(menuId);
      await api.delete(`/secure/api/v1/menus/${menuId}`);
      setMenus((prev) => prev.filter((m) => m.menuId !== menuId));
    } catch (err) {
      console.error('Failed to delete menu:', err.response?.data || err);
      toast.error(
        err.response?.data?.message || 'Failed to delete menu'  // Fallback message
      );
    } finally {
      setDeletingId(null);
    }
  };

  const openDetailModal = (menu) => {
    setViewingMenu(menu);
    setIsDetailOpen(true);
  };

  const closeDetailModal = () => {
    setIsDetailOpen(false);
    setTimeout(() => setViewingMenu(null), 200);
  };

  const filteredMenus = menus.filter((menu) =>
    menu.menuName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    menu.menuDesc?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    menu.branch?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-5">

      {/* Stats */}
      {!loading && menus.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Total Menus', value: menus.length, icon: UtensilsCrossed,
              gradient: 'from-blue-500 to-indigo-500', bg: 'bg-blue-50', text: 'text-blue-700' },
            { label: 'Active', value: menus.filter((m) => !m.isDeleted).length, icon: Sparkles,
              gradient: 'from-green-500 to-emerald-500', bg: 'bg-green-50', text: 'text-green-700' },
            { label: 'Total Items',
              value: menus.reduce((sum, m) =>
                sum + (m.totalFoodCount || m.categories?.reduce((s, c) =>
                  s + (c.foods?.length || 0), 0) || 0), 0),
              icon: Coffee,
              gradient: 'from-amber-500 to-orange-500', bg: 'bg-amber-50', text: 'text-amber-700' },
            { label: 'With Branch', value: menus.filter((m) => m.branch).length, icon: Building2,
              gradient: 'from-purple-500 to-violet-500', bg: 'bg-purple-50', text: 'text-purple-700' },
          ].map((stat, idx) => (
            <div key={idx} className="relative bg-white rounded-2xl border border-gray-100 shadow-sm
                                      px-4 py-4 overflow-hidden group hover:shadow-md transition-all">
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.gradient}
                               opacity-60 group-hover:opacity-100 transition-opacity`} />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400 font-medium">{stat.label}</p>
                  <p className={`text-2xl font-bold mt-1 ${stat.text}`}>{stat.value}</p>
                </div>
                <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center`}>
                  <stat.icon className={`w-5 h-5 ${stat.text}`} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Search + Refresh */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 flex items-center gap-2 bg-white rounded-xl border border-gray-200
                        shadow-sm px-4 py-3 focus-within:border-blue-400 focus-within:ring-2
                        focus-within:ring-blue-100 transition-all">
          <Search className="w-5 h-5 text-gray-400 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search menus by name, description, or branch..."
            className="bg-transparent outline-none flex-1 min-w-0 text-gray-800
                       placeholder-gray-400 text-sm sm:text-base"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')}
                    className="text-gray-400 hover:text-gray-600 text-sm font-medium shrink-0">
              Clear
            </button>
          )}
        </div>
        <button onClick={fetchMenus} disabled={loading}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-white border
                           border-gray-200 rounded-xl hover:bg-gray-50 transition-colors
                           text-gray-600 font-medium text-sm shadow-sm disabled:opacity-50 shrink-0">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span className="sm:inline hidden">Refresh</span>
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid gap-5 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => <AdminSkeleton key={i} variant="menu-card" />)}
        </div>
      ) : error && menus.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 text-center p-8 sm:p-12 shadow-sm">
          <AlertCircle className="w-14 h-14 text-red-300 mx-auto mb-4" />
          <p className="text-red-600 font-semibold mb-2">{error}</p>
          <button onClick={fetchMenus}
                  className="flex items-center gap-2 mx-auto px-5 py-2.5 text-sm text-blue-700
                             bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors font-semibold">
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        </div>
      ) : filteredMenus.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 text-center p-10 sm:p-16 shadow-sm">
          <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-5">
            <UtensilsCrossed className="w-10 h-10 text-blue-300" />
          </div>
          <p className="text-gray-700 font-bold text-lg mb-1">
            {searchQuery ? 'No menus found' : 'No menus yet'}
          </p>
          <p className="text-gray-400 text-sm mb-6 max-w-md mx-auto">
            {searchQuery
              ? `No results for "${searchQuery}"`
              : 'Create your first menu to organize your food items.'}
          </p>
          {!searchQuery && (
            <button onClick={onCreateMenu}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600
                               to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700
                               transition-all font-semibold shadow-lg shadow-blue-600/25">
              <Plus className="w-5 h-5" />
              Create Your First Menu
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-5 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
          {filteredMenus.map((menu) => (
            <MenuCard
              key={menu.menuId}
              menu={menu}
              onEdit={onEditMenu}
              onDelete={handleDelete}
              onView={openDetailModal}
              deleting={deletingId === menu.menuId}
            />
          ))}
        </div>
      )}

      {/* Count */}
      {!loading && filteredMenus.length > 0 && (
        <div className="text-center pt-2">
          <p className="text-xs sm:text-sm text-gray-400">
            Showing <span className="font-semibold text-gray-600">{filteredMenus.length}</span> of{' '}
            <span className="font-semibold text-gray-600">{menus.length}</span> menus
          </p>
        </div>
      )}

      {/* Detail Modal */}
      <MenuDetailModal
        isOpen={isDetailOpen}
        onClose={closeDetailModal}
        menu={viewingMenu}
        onEdit={onEditMenu}
        onDelete={handleDelete}
      />
    </div>
  );
});

MenusGrid.displayName = 'MenusGrid';

export default MenusGrid;