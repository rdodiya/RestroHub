import React, { useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import {
  Search,
  Filter,
  RefreshCw,
  X,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@services/common/api';

const PAYMENT_STATUSES = ['UNPAID', 'LINK_SENT', 'VERIFIED_BY_STAFF'];
const ORDER_SOURCES = ['TABLE_QR', 'COUNTER_QR', 'STAFF'];

const OrderHistoryModal = ({ isOpen, onClose, branchId }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    status: '',
    phone: '',
    paymentStatus: '',
    tableNumber: '',
    orderSource: '',
  });

  const fetchHistory = async (pageNumber = 0) => {
    if (!branchId) return;

    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('branchId', branchId);
      params.append('page', pageNumber);
      params.append('size', 10);
      params.append('sort', 'createdAt,desc');

      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      if (filters.status) params.append('status', filters.status);
      if (filters.phone) params.append('phone', filters.phone);
      if (filters.paymentStatus) params.append('paymentStatus', filters.paymentStatus);
      if (filters.tableNumber !== '') params.append('tableNumber', filters.tableNumber);
      if (filters.orderSource) params.append('orderSource', filters.orderSource);

      const response = await api.get(`/secure/api/v1/orders/history?${params.toString()}`);

      const data = response.data;
      setOrders(data.content || []);
      setTotalPages(data.totalPages || 1);
      setPage(data.number || 0);
    } catch (err) {
      console.error('Failed to fetch order history:', err);
      toast.error('Failed to fetch order history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchHistory(0);
    }
  }, [isOpen, branchId]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplyFilters = () => {
    fetchHistory(0);
  };

  const handleClearFilters = () => {
    setFilters({
      startDate: '',
      endDate: '',
      status: '',
      phone: '',
      paymentStatus: '',
      tableNumber: '',
      orderSource: '',
    });
    // fetchHistory logic inside useEffect will run if we add dependencies,
    // but better to explicitly call it to avoid multiple triggers
    setTimeout(() => fetchHistory(0), 0);
  };

  const statusColors = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    CONFIRMED: 'bg-blue-100 text-blue-800',
    PREPARING: 'bg-orange-100 text-orange-800',
    READY: 'bg-green-100 text-green-800',
    SERVED: 'bg-teal-100 text-teal-800',
    BILLED: 'bg-purple-100 text-purple-800',
    CANCELLED: 'bg-red-100 text-red-800',
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-5xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 bg-gray-50">
                  <div>
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-bold text-gray-900 flex items-center gap-2"
                    >
                      Order History
                    </Dialog.Title>
                    <p className="text-sm text-gray-500 mt-1">
                      View and filter historical orders for this branch.
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="rounded-lg p-2 text-gray-400 hover:bg-gray-200 hover:text-gray-600 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Filters */}
                <div className="px-6 py-4 border-b border-gray-200 bg-white grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      value={filters.startDate}
                      onChange={handleFilterChange}
                      className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">End Date</label>
                    <input
                      type="date"
                      name="endDate"
                      value={filters.endDate}
                      onChange={handleFilterChange}
                      className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                    <select
                      name="status"
                      value={filters.status}
                      onChange={handleFilterChange}
                      className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="">All Statuses</option>
                      {Object.keys(statusColors).map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="text"
                      name="phone"
                      placeholder="Customer phone"
                      value={filters.phone}
                      onChange={handleFilterChange}
                      className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Payment</label>
                    <select
                      name="paymentStatus"
                      value={filters.paymentStatus}
                      onChange={handleFilterChange}
                      className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="">All</option>
                      {PAYMENT_STATUSES.map((v) => (
                        <option key={v} value={v}>
                          {v}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Table</label>
                    <input
                      type="number"
                      min="0"
                      name="tableNumber"
                      placeholder="0 = Counter"
                      value={filters.tableNumber}
                      onChange={handleFilterChange}
                      className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Source</label>
                    <select
                      name="orderSource"
                      value={filters.orderSource}
                      onChange={handleFilterChange}
                      className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="">All</option>
                      {ORDER_SOURCES.map((v) => (
                        <option key={v} value={v}>
                          {v}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleApplyFilters}
                      className="flex-1 rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition"
                    >
                      Apply
                    </button>
                    <button
                      onClick={handleClearFilters}
                      className="flex-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                {/* Table */}
                <div className="flex-1 overflow-auto bg-gray-50 p-6">
                  {loading ? (
                    <div className="flex h-32 items-center justify-center">
                      <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="flex h-32 items-center justify-center flex-col text-gray-500">
                      <Search className="h-8 w-8 mb-2 opacity-50" />
                      <p>No orders found for the given criteria.</p>
                    </div>
                  ) : (
                    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                      <table className="min-w-full divide-y divide-gray-200 text-sm text-left">
                        <thead className="bg-gray-50 text-gray-500 font-medium">
                          <tr>
                            <th className="px-6 py-3">Order</th>
                            <th className="px-6 py-3">Date</th>
                            <th className="px-6 py-3">Customer</th>
                            <th className="px-6 py-3">Table</th>
                            <th className="px-6 py-3">Source</th>
                            <th className="px-6 py-3">Payment</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3 text-right">Amount</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {orders.map((order) => (
                            <tr key={order.orderId} className="hover:bg-gray-50">
                              <td className="px-6 py-4 font-medium text-gray-900">
                                {order.reference || `#${order.orderId}`}
                              </td>
                              <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                                {new Date(order.createdAt).toLocaleString(undefined, {
                                  dateStyle: 'medium',
                                  timeStyle: 'short',
                                })}
                              </td>
                              <td className="px-6 py-4">
                                <div className="text-gray-900">{order.customerName}</div>
                                <div className="text-xs text-gray-500">{order.customerPhone}</div>
                              </td>
                              <td className="px-6 py-4 text-gray-600">
                                {order.tableNumber === 0 ? 'Counter' : `Table ${order.tableNumber}`}
                              </td>
                              <td className="px-6 py-4 text-gray-600">
                                {order.orderSource || '-'}
                              </td>
                              <td className="px-6 py-4 text-gray-600">
                                {order.paymentStatus || '-'}
                              </td>
                              <td className="px-6 py-4">
                                <span
                                  className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${statusColors[order.status] || 'bg-gray-100 text-gray-800'}`}
                                >
                                  {order.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-right font-semibold text-gray-900">
                                ₹{Number(order.totalAmount).toFixed(2)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between border-t border-gray-200 px-6 py-3 bg-white">
                  <span className="text-sm text-gray-600">
                    Page <span className="font-medium">{page + 1}</span> of{' '}
                    <span className="font-medium">{Math.max(1, totalPages)}</span>
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => fetchHistory(page - 1)}
                      disabled={page === 0 || loading}
                      className="rounded p-1 text-gray-500 hover:bg-gray-100 disabled:opacity-50 border border-gray-200"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => fetchHistory(page + 1)}
                      disabled={page >= totalPages - 1 || loading}
                      className="rounded p-1 text-gray-500 hover:bg-gray-100 disabled:opacity-50 border border-gray-200"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default OrderHistoryModal;
