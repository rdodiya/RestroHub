// src/components/admin/roles/UserRoleManagement.jsx
import React, { useCallback, useEffect, useState } from 'react';
import { useAdminTheme } from '@context/AdminThemeContext';
import {
  Users,
  Building2,
  ShieldCheck,
  Search,
  Filter,
  Plus,
  Trash2,
  X,
  AlertCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@services/common/api';

const ADMIN_API = '/secure/api/v1/admin';

// The four app roles; only these three can be assigned to a restaurant.
const ASSIGNABLE_ROLES = {
  ADMIN: {
    label: 'Admin (Restaurant Owner)',
    color:
      'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border-blue-200 dark:border-blue-800',
  },
  MANAGER: {
    label: 'Manager',
    color:
      'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
  },
  STAFF: {
    label: 'Staff',
    color:
      'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300 border-purple-200 dark:border-purple-800',
  },
};

const normalizeRoleName = (name) =>
  String(name || '')
    .replace(/^(ROLE_)+/i, '')
    .toUpperCase();
const initials = (name) =>
  String(name || '?')
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

const UserRoleManagement = () => {
  const { isDark } = useAdminTheme();

  // Data from the API
  const [users, setUsers] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [roles, setRoles] = useState([]); // [{ id, key, label }]
  const [assignments, setAssignments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRestaurantFilter, setSelectedRestaurantFilter] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState('');

  // Form State
  const [formData, setFormData] = useState({ userId: '', restaurantId: '', roleId: '' });
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);

  // Confirm delete modal state
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [usersRes, restaurantsRes, rolesRes, assignmentsRes] = await Promise.all([
        api.get('/secure/api/v1/users/all'),
        api.get(`${ADMIN_API}/restaurants`),
        api.get('/api/v1/roles/active'),
        api.get(`${ADMIN_API}/role-assignments`),
      ]);
      setUsers(
        usersRes.data.data.map((u) => ({
          id: u.id,
          name: u.fullName || `${u.firstName || ''} ${u.lastName || ''}`.trim() || u.email,
          email: u.email,
        }))
      );
      setRestaurants(restaurantsRes.data);
      const seen = new Set();
      setRoles(
        rolesRes.data.data
          .map((r) => ({ id: r.id, key: normalizeRoleName(r.name) }))
          .filter((r) => ASSIGNABLE_ROLES[r.key] && !seen.has(r.key) && seen.add(r.key))
          .map((r) => ({ ...r, label: ASSIGNABLE_ROLES[r.key].label }))
      );
      setAssignments(assignmentsRes.data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to load role management data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value ? Number(value) : '' }));
  };

  const resetForm = () => setFormData({ userId: '', restaurantId: '', roleId: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.userId || !formData.restaurantId || !formData.roleId) {
      toast.error('Please fill in all fields');
      return;
    }
    setIsSubmitLoading(true);
    try {
      const res = await api.post(`${ADMIN_API}/role-assignments`, formData);
      setAssignments((prev) => [res.data, ...prev]);
      toast.success('Role assigned successfully!');
      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to assign role');
    } finally {
      setIsSubmitLoading(false);
    }
  };

  const handleDeleteClick = (id) => setDeleteConfirmId(id);

  const confirmDelete = async () => {
    try {
      await api.delete(`${ADMIN_API}/role-assignments/${deleteConfirmId}`);
      setAssignments((prev) => prev.filter((a) => a.id !== deleteConfirmId));
      toast.success('Role assignment revoked successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to revoke role');
    } finally {
      setDeleteConfirmId(null);
    }
  };

  const filteredAssignments = assignments.filter((a) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      a.userName?.toLowerCase().includes(q) || a.userEmail?.toLowerCase().includes(q);
    const matchesRestaurant = selectedRestaurantFilter
      ? a.restaurantId === Number(selectedRestaurantFilter)
      : true;
    const matchesRole = selectedRoleFilter ? a.roleName === selectedRoleFilter : true;
    return matchesSearch && matchesRestaurant && matchesRole;
  });

  const getRoleBadge = (roleName) => {
    const role = ASSIGNABLE_ROLES[roleName];
    return (
      <span
        className={`inline-block whitespace-nowrap px-2.5 py-1 rounded-full text-xs font-semibold border ${
          role?.color || ''
        }`}
      >
        {role?.label || roleName}
      </span>
    );
  };

  // Stats Counters
  const totalAssignments = assignments.length;
  const uniqueUsersWithRoles = new Set(assignments.map((a) => a.userId)).size;
  const uniqueRestaurantsWithRoles = new Set(assignments.map((a) => a.restaurantId)).size;

  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1
            className={`text-2xl font-bold tracking-tight ${isDark ? 'text-gray-100' : 'text-gray-800'}`}
          >
            User Role Management
          </h1>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Assign and manage user roles across different restaurant branches.
          </p>
        </div>
      </div>

      {/* STATS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1 */}
        <div
          className={`p-5 rounded-xl border flex items-center gap-4 shadow-sm ${
            isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}
        >
          <div className="p-3 rounded-lg bg-blue-500/10 text-blue-500">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <p
              className={`text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-500' : 'text-gray-400'}`}
            >
              Total Assignments
            </p>
            <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {totalAssignments}
            </p>
          </div>
        </div>

        {/* Card 2 */}
        <div
          className={`p-5 rounded-xl border flex items-center gap-4 shadow-sm ${
            isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}
        >
          <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-500">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p
              className={`text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-500' : 'text-gray-400'}`}
            >
              Users with Roles
            </p>
            <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {uniqueUsersWithRoles}
            </p>
          </div>
        </div>

        {/* Card 3 */}
        <div
          className={`p-5 rounded-xl border flex items-center gap-4 shadow-sm ${
            isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}
        >
          <div className="p-3 rounded-lg bg-amber-500/10 text-amber-500">
            <Building2 className="h-6 w-6" />
          </div>
          <div>
            <p
              className={`text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-500' : 'text-gray-400'}`}
            >
              Active Restaurants
            </p>
            <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {uniqueRestaurantsWithRoles}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: ASSIGN/EDIT FORM */}
        <div className="lg:col-span-4 space-y-6">
          <div
            className={`p-6 rounded-xl border shadow-sm ${
              isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}
          >
            <h2
              className={`text-lg font-bold mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}
            >
              <Plus className="h-5 w-5 text-blue-500" />
              Assign New Role
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Select User */}
              <div>
                <label
                  className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                >
                  Select User
                </label>
                <select
                  name="userId"
                  value={formData.userId}
                  onChange={handleInputChange}
                  className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-blue-500 ${
                    isDark
                      ? 'bg-gray-900 border-gray-700 text-gray-100 disabled:opacity-50'
                      : 'bg-gray-50 border-gray-300 text-gray-900 disabled:opacity-50'
                  }`}
                  required
                >
                  <option value="">Choose User...</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </option>
                  ))}
                </select>
              </div>

              {/* Select Restaurant */}
              <div>
                <label
                  className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                >
                  Select Restaurant
                </label>
                <select
                  name="restaurantId"
                  value={formData.restaurantId}
                  onChange={handleInputChange}
                  className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-blue-500 ${
                    isDark
                      ? 'bg-gray-900 border-gray-700 text-gray-100'
                      : 'bg-gray-50 border-gray-300 text-gray-900'
                  }`}
                  required
                >
                  <option value="">Choose Restaurant...</option>
                  {restaurants.map((rest) => (
                    <option key={rest.id} value={rest.id}>
                      {rest.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Select Role */}
              <div>
                <label
                  className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                >
                  Select Role
                </label>
                <select
                  name="roleId"
                  value={formData.roleId}
                  onChange={handleInputChange}
                  className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-blue-500 ${
                    isDark
                      ? 'bg-gray-900 border-gray-700 text-gray-100'
                      : 'bg-gray-50 border-gray-300 text-gray-900'
                  }`}
                  required
                >
                  <option value="">Choose Role...</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Submit & Cancel Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitLoading}
                  className="flex-1 py-2 text-sm font-medium rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition disabled:opacity-60"
                >
                  {isSubmitLoading ? 'Saving...' : 'Assign Role'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* RIGHT COLUMN: SEARCH, FILTER & LIST TABLE */}
        <div className="lg:col-span-8 space-y-6">
          <div
            className={`p-6 rounded-xl border shadow-sm ${
              isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}
          >
            {/* SEARCH & FILTERS BAR */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              {/* Search input */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search user by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-9 pr-4 py-2 rounded-lg border text-sm outline-none transition focus:ring-2 focus:ring-blue-500 ${
                    isDark
                      ? 'bg-gray-900 border-gray-700 text-gray-100 placeholder-gray-500'
                      : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'
                  }`}
                />
              </div>

              {/* Restaurant filter */}
              <div className="relative min-w-[150px]">
                <select
                  value={selectedRestaurantFilter}
                  onChange={(e) => setSelectedRestaurantFilter(e.target.value)}
                  className={`w-full pl-3 pr-8 py-2 rounded-lg border text-sm outline-none appearance-none transition focus:ring-2 focus:ring-blue-500 ${
                    isDark
                      ? 'bg-gray-900 border-gray-700 text-gray-100'
                      : 'bg-gray-50 border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="">All Restaurants</option>
                  {restaurants.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
                <Filter className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>

              {/* Role filter */}
              <div className="relative min-w-[140px]">
                <select
                  value={selectedRoleFilter}
                  onChange={(e) => setSelectedRoleFilter(e.target.value)}
                  className={`w-full pl-3 pr-8 py-2 rounded-lg border text-sm outline-none appearance-none transition focus:ring-2 focus:ring-blue-500 ${
                    isDark
                      ? 'bg-gray-900 border-gray-700 text-gray-100'
                      : 'bg-gray-50 border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="">All Roles</option>
                  {roles.map((role) => (
                    <option key={role.key} value={role.key}>
                      {role.label}
                    </option>
                  ))}
                </select>
                <Filter className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* ROLES TABLE */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left border-collapse">
                <thead>
                  <tr
                    className={`border-b text-xs font-semibold uppercase tracking-wider ${
                      isDark ? 'border-gray-700 text-gray-400' : 'border-gray-200 text-gray-500'
                    }`}
                  >
                    <th className="pb-3 pl-3">User</th>
                    <th className="pb-3">Restaurant</th>
                    <th className="pb-3">Assigned Role</th>
                    <th className="pb-3 pr-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody
                  className={`divide-y text-sm ${
                    isDark ? 'divide-gray-700/60' : 'divide-gray-100'
                  }`}
                >
                  {filteredAssignments.length > 0 ? (
                    filteredAssignments.map((assignment) => {
                      return (
                        <tr
                          key={assignment.id}
                          className={`group hover:bg-gray-500/[0.02] transition-colors`}
                        >
                          {/* User Column */}
                          <td className="py-3.5 pl-3 pr-4">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-full bg-blue-600/10 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0">
                                {initials(assignment.userName)}
                              </div>
                              <div className="min-w-0">
                                <p
                                  className={`font-semibold whitespace-nowrap ${isDark ? 'text-gray-200' : 'text-gray-800'}`}
                                >
                                  {assignment.userName}
                                </p>
                                <p
                                  className={`text-xs whitespace-nowrap ${isDark ? 'text-gray-500' : 'text-gray-400'}`}
                                >
                                  {assignment.userEmail}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Restaurant Column */}
                          <td className="py-3.5 pr-4 whitespace-nowrap">
                            <span
                              className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                            >
                              {assignment.restaurantName}
                            </span>
                          </td>

                          {/* Role Badge Column */}
                          <td className="py-3.5 pr-4 whitespace-nowrap">
                            {getRoleBadge(assignment.roleName)}
                          </td>

                          {/* Actions Column */}
                          <td className="py-3.5 pr-3 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleDeleteClick(assignment.id)}
                                title="Revoke assignment"
                                className={`p-1.5 rounded-lg border transition ${
                                  isDark
                                    ? 'border-gray-700 text-gray-400 hover:text-red-400 hover:border-red-400/40 bg-gray-900/40'
                                    : 'border-gray-200 text-gray-500 hover:text-red-600 hover:border-red-200 bg-gray-50'
                                }`}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="4" className="py-8 text-center">
                        <div className="flex flex-col items-center justify-center text-gray-400 gap-2">
                          <AlertCircle className="h-8 w-8 text-gray-500" />
                          <p className="text-sm">
                            {isLoading
                              ? 'Loading...'
                              : 'No role assignments found matching the search criteria.'}
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* CONFIRM REVOCATION MODAL */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center px-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setDeleteConfirmId(null)}
          />
          <div
            className={`relative w-full max-w-md rounded-xl border p-6 shadow-xl animate-fade-in ${
              isDark
                ? 'bg-gray-800 border-gray-700 text-white'
                : 'bg-white border-gray-200 text-gray-900'
            }`}
          >
            <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              Revoke Role Assignment?
            </h3>
            <p className={`text-sm mb-6 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Are you sure you want to remove this role assignment? The user will immediately lose
              administrative access to this restaurant branch. This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className={`px-4 py-2 text-sm font-medium rounded-lg border transition ${
                  isDark
                    ? 'border-gray-700 hover:bg-gray-700 text-gray-300'
                    : 'border-gray-300 hover:bg-gray-100 text-gray-700'
                }`}
              >
                No, Keep
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-sm font-medium rounded-lg bg-red-600 hover:bg-red-700 text-white transition"
              >
                Yes, Revoke
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserRoleManagement;
