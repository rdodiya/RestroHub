import { useCallback, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Check, Loader2, RefreshCw, X } from 'lucide-react';
import api from '@services/common/api';
import { hasAnyRole, normalizeRole, readStoredRoles } from '../../../utils/auth';

const BASE = '/secure/api/v1/admin/registration-requests';
// Never grantable from this page (backend rejects SUPER_ADMIN; CUSTOMER is the public default).
const EXCLUDED_ROLES = ['SUPER_ADMIN', 'CUSTOMER'];

// Superadmin review queue for self-service sign-ups (email already verified).
export default function RegistrationRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [roles, setRoles] = useState({}); // requestId -> chosen role (join requests)
  const [roleOptions, setRoleOptions] = useState([]);
  const [rejecting, setRejecting] = useState(null); // { id, note }

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [res, roleRes] = await Promise.all([api.get(BASE), api.get('/api/v1/roles/active')]);
      setRequests(res.data);
      setRoleOptions(
        [...new Set(roleRes.data.data.map((r) => normalizeRole(r.name)))].filter(
          (name) => !EXCLUDED_ROLES.includes(name)
        )
      );
    } catch (err) {
      toast.error(err.response?.data?.message || 'Unable to load registration requests');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (!hasAnyRole(readStoredRoles(), ['SUPER_ADMIN'])) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const act = async (id, action, body, success) => {
    setBusyId(id);
    try {
      await api.post(`${BASE}/${id}/${action}`, body);
      toast.success(success);
      setRejecting(null);
      setRequests((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      toast.error(err.response?.data?.message || `Unable to ${action} request`);
    } finally {
      setBusyId(null);
    }
  };

  const approve = (r) => {
    if (!r.newRestaurant && !roles[r.id]) {
      toast.error('Choose a role for this user first');
      return;
    }
    act(
      r.id,
      'approve',
      { roleName: r.newRestaurant ? undefined : roles[r.id] },
      r.newRestaurant ? 'Restaurant created and owner assigned' : 'Role assigned'
    );
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Registration Requests
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Verified sign-ups waiting for approval. The user is emailed on your decision.
          </p>
        </div>
        <button
          onClick={load}
          className="flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
        >
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="animate-spin text-blue-600" />
        </div>
      ) : requests.length === 0 ? (
        <p className="py-16 text-center text-gray-500 dark:text-gray-400">No pending requests.</p>
      ) : (
        <ul className="space-y-4">
          {requests.map((r) => (
            <li
              key={r.id}
              className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {r.name} <span className="font-normal text-gray-500">({r.email})</span>
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {r.newRestaurant ? 'New restaurant: ' : 'Join existing restaurant: '}
                    <b>{r.requestedRestaurant}</b>
                  </p>
                  <p className="text-xs text-gray-400">
                    Requested {new Date(r.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {!r.newRestaurant && (
                    <select
                      value={roles[r.id] || ''}
                      onChange={(e) => setRoles((p) => ({ ...p, [r.id]: e.target.value }))}
                      className="rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm dark:border-gray-600 dark:text-white"
                    >
                      <option value="">Select role…</option>
                      {roleOptions.map((role) => (
                        <option key={role} value={role} className="text-gray-900">
                          {role}
                        </option>
                      ))}
                    </select>
                  )}
                  <button
                    disabled={busyId === r.id}
                    onClick={() => approve(r)}
                    className="flex items-center gap-1 rounded-lg bg-green-600 px-3 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-60"
                  >
                    <Check size={16} /> Approve
                  </button>
                  <button
                    disabled={busyId === r.id}
                    onClick={() => setRejecting({ id: r.id, note: '' })}
                    className="flex items-center gap-1 rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
                  >
                    <X size={16} /> Reject
                  </button>
                </div>
              </div>

              {rejecting?.id === r.id && (
                <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                  <input
                    value={rejecting.note}
                    onChange={(e) => setRejecting({ id: r.id, note: e.target.value })}
                    maxLength={500}
                    placeholder="Reason (optional, included in the email)"
                    className="flex-1 rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm dark:border-gray-600 dark:text-white"
                  />
                  <button
                    disabled={busyId === r.id}
                    onClick={() =>
                      act(r.id, 'reject', { note: rejecting.note }, 'Request rejected')
                    }
                    className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
                  >
                    Confirm reject
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
