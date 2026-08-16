import { useEffect, useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  Check,
  Edit2,
  Loader2,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Trash2,
  X,
} from 'lucide-react';
import api from '@services/common/api';
import { hasAnyRole, readStoredRoles } from '../../../utils/auth';

const emptyFeatureForm = {
  featureKey: '',
  displayName: '',
  description: '',
  isActive: true,
};

const emptyPlanForm = {
  name: '',
  description: '',
  price: '',
  billingCycle: 'MONTHLY',
  isActive: true,
  featureValues: {},
};

const pickData = (response) => response.data?.data || response.data || [];

const SubscriptionManagement = () => {
  const roles = readStoredRoles();
  const [activeTab, setActiveTab] = useState('plans');
  const [plans, setPlans] = useState([]);
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [planSearch, setPlanSearch] = useState('');
  const [featureSearch, setFeatureSearch] = useState('');
  const [editingPlanId, setEditingPlanId] = useState(null);
  const [editingFeatureId, setEditingFeatureId] = useState(null);
  const [planForm, setPlanForm] = useState(emptyPlanForm);
  const [featureForm, setFeatureForm] = useState(emptyFeatureForm);
  const [selectedFeatureIds, setSelectedFeatureIds] = useState([]);
  const [confirmTarget, setConfirmTarget] = useState(null);
  const [assignment, setAssignment] = useState({
    restaurantId: '',
    planId: '',
    durationInMonths: 1,
    isAutoRenew: true,
  });
  const [restaurantSubscription, setRestaurantSubscription] = useState(null);
  const [assignmentLoading, setAssignmentLoading] = useState(false);

  const fetchSubscriptions = async () => {
    setLoading(true);
    try {
      const [plansResponse, featuresResponse] = await Promise.all([
        api.get('/secure/api/v1/admin/subscriptions/plans'),
        api.get('/secure/api/v1/admin/subscriptions/features'),
      ]);
      const planList = pickData(plansResponse);
      const featureList = pickData(featuresResponse);
      setPlans(Array.isArray(planList) ? planList : []);
      setFeatures(Array.isArray(featureList) ? featureList : []);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to load subscriptions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const filteredPlans = useMemo(() => {
    const query = planSearch.trim().toLowerCase();
    if (!query) return plans;
    return plans.filter((plan) =>
      [plan.name, plan.description, plan.billingCycle].some((value) =>
        String(value || '').toLowerCase().includes(query)
      )
    );
  }, [plans, planSearch]);

  const filteredFeatures = useMemo(() => {
    const query = featureSearch.trim().toLowerCase();
    if (!query) return features;
    return features.filter((feature) =>
      [feature.featureKey, feature.displayName, feature.description].some((value) =>
        String(value || '').toLowerCase().includes(query)
      )
    );
  }, [features, featureSearch]);

  if (!hasAnyRole(roles, ['SUPER_ADMIN'])) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const resetPlanForm = () => {
    setEditingPlanId(null);
    setPlanForm(emptyPlanForm);
    setSelectedFeatureIds([]);
  };

  const resetFeatureForm = () => {
    setEditingFeatureId(null);
    setFeatureForm(emptyFeatureForm);
  };

  const editPlan = (plan) => {
    const featureValues = {};
    const featureIds = (plan.features || []).map((mapping) => {
      featureValues[mapping.featureId] = mapping.featureValue || 'true';
      return Number(mapping.featureId);
    });

    setEditingPlanId(plan.id);
    setSelectedFeatureIds(featureIds);
    setPlanForm({
      name: plan.name || '',
      description: plan.description || '',
      price: plan.price ?? '',
      billingCycle: plan.billingCycle || 'MONTHLY',
      isActive: plan.isActive !== false,
      featureValues,
    });
    setActiveTab('plans');
  };

  const editFeature = (feature) => {
    setEditingFeatureId(feature.id);
    setFeatureForm({
      featureKey: feature.featureKey || '',
      displayName: feature.displayName || '',
      description: feature.description || '',
      isActive: feature.isActive !== false,
    });
    setActiveTab('features');
  };

  const togglePlanFeature = (featureId) => {
    setSelectedFeatureIds((current) =>
      current.includes(featureId)
        ? current.filter((id) => id !== featureId)
        : [...current, featureId]
    );
    setPlanForm((current) => ({
      ...current,
      featureValues: {
        ...current.featureValues,
        [featureId]: current.featureValues[featureId] || 'true',
      },
    }));
  };

  const savePlan = async (event) => {
    event.preventDefault();
    setSaving(true);
    const payload = {
      name: planForm.name.trim(),
      description: planForm.description.trim(),
      price: Number(planForm.price),
      billingCycle: planForm.billingCycle,
      isActive: planForm.isActive,
      features: selectedFeatureIds.map((featureId) => ({
        featureId: Number(featureId),
        featureValue: planForm.featureValues[featureId] || 'true',
      })),
    };

    try {
      if (editingPlanId) {
        await api.put(`/secure/api/v1/admin/subscriptions/plans/${editingPlanId}`, payload);
        toast.success('Plan updated');
      } else {
        await api.post('/secure/api/v1/admin/subscriptions/plans', payload);
        toast.success('Plan created');
      }
      resetPlanForm();
      await fetchSubscriptions();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to save plan');
    } finally {
      setSaving(false);
    }
  };

  const saveFeature = async (event) => {
    event.preventDefault();
    setSaving(true);
    const payload = {
      featureKey: featureForm.featureKey.trim(),
      displayName: featureForm.displayName.trim(),
      description: featureForm.description.trim(),
      isActive: featureForm.isActive,
    };

    try {
      if (editingFeatureId) {
        await api.put(`/secure/api/v1/admin/subscriptions/features/${editingFeatureId}`, payload);
        toast.success('Feature updated');
      } else {
        await api.post('/secure/api/v1/admin/subscriptions/features', payload);
        toast.success('Feature created');
      }
      resetFeatureForm();
      await fetchSubscriptions();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to save feature');
    } finally {
      setSaving(false);
    }
  };

  const deleteSelected = async () => {
    if (!confirmTarget) return;
    setSaving(true);
    try {
      const endpoint =
        confirmTarget.type === 'plan'
          ? `/secure/api/v1/admin/subscriptions/plans/${confirmTarget.id}`
          : `/secure/api/v1/admin/subscriptions/features/${confirmTarget.id}`;
      await api.delete(endpoint);
      toast.success(confirmTarget.type === 'plan' ? 'Plan deleted' : 'Feature deleted');
      await fetchSubscriptions();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to delete item');
    } finally {
      setSaving(false);
      setConfirmTarget(null);
    }
  };

  const assignPlan = async (event) => {
    event.preventDefault();
    setAssignmentLoading(true);
    try {
      const response = await api.post(
        `/secure/api/v1/admin/subscriptions/restaurants/${assignment.restaurantId}/assign`,
        {
          planId: Number(assignment.planId),
          isAutoRenew: assignment.isAutoRenew,
          durationInMonths: Number(assignment.durationInMonths),
        }
      );
      setRestaurantSubscription(pickData(response));
      toast.success('Plan assigned');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to assign plan');
    } finally {
      setAssignmentLoading(false);
    }
  };

  const fetchRestaurantSubscription = async () => {
    if (!assignment.restaurantId) {
      toast.error('Enter a restaurant ID');
      return;
    }
    setAssignmentLoading(true);
    try {
      const response = await api.get(`/secure/api/v1/restaurant/${assignment.restaurantId}/subscription`);
      setRestaurantSubscription(pickData(response));
    } catch (error) {
      setRestaurantSubscription(null);
      toast.error(error.response?.data?.message || 'No subscription found');
    } finally {
      setAssignmentLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-lg border border-gray-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-blue-600">
            <ShieldCheck className="h-4 w-4" />
            SuperAdmin
          </div>
          <h1 className="mt-2 text-2xl font-bold text-gray-900">Subscription Management</h1>
        </div>
        <button
          type="button"
          onClick={fetchSubscriptions}
          className="inline-flex items-center justify-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {[
          ['plans', 'Plans'],
          ['features', 'Features'],
          ['assignment', 'Restaurant Assignment'],
        ].map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => setActiveTab(value)}
            className={`rounded-md px-4 py-2 text-sm font-medium transition ${
              activeTab === value
                ? 'bg-blue-600 text-white'
                : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid gap-4 lg:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div key={item} className="h-40 animate-pulse rounded-lg border border-gray-200 bg-gray-100" />
          ))}
        </div>
      ) : (
        <>
          {activeTab === 'plans' && (
            <div className="grid gap-6 xl:grid-cols-[minmax(320px,420px)_1fr]">
              <form onSubmit={savePlan} className="space-y-4 rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-lg font-semibold text-gray-900">{editingPlanId ? 'Edit Plan' : 'Create Plan'}</h2>
                  {editingPlanId && (
                    <button type="button" onClick={resetPlanForm} className="rounded-md p-2 text-gray-500 hover:bg-gray-100">
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <input
                  value={planForm.name}
                  onChange={(event) => setPlanForm({ ...planForm, name: event.target.value })}
                  required
                  placeholder="Plan name"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
                <textarea
                  value={planForm.description}
                  onChange={(event) => setPlanForm({ ...planForm, description: event.target.value })}
                  placeholder="Description"
                  rows={3}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
                <div className="grid gap-3 sm:grid-cols-2">
                  <input
                    value={planForm.price}
                    onChange={(event) => setPlanForm({ ...planForm, price: event.target.value })}
                    required
                    min="0"
                    step="0.01"
                    type="number"
                    placeholder="Price"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  />
                  <select
                    value={planForm.billingCycle}
                    onChange={(event) => setPlanForm({ ...planForm, billingCycle: event.target.value })}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  >
                    <option value="MONTHLY">Monthly</option>
                    <option value="QUARTERLY">Quarterly</option>
                    <option value="YEARLY">Yearly</option>
                  </select>
                </div>
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={planForm.isActive}
                    onChange={(event) => setPlanForm({ ...planForm, isActive: event.target.checked })}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  Active
                </label>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Features</p>
                  <div className="max-h-64 space-y-2 overflow-y-auto rounded-md border border-gray-200 p-2">
                    {features.length === 0 ? (
                      <p className="px-2 py-3 text-sm text-gray-500">No features available</p>
                    ) : (
                      features.map((feature) => {
                        const selected = selectedFeatureIds.includes(feature.id);
                        return (
                          <div key={feature.id} className="rounded-md border border-gray-100 p-2">
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-800">
                              <input
                                type="checkbox"
                                checked={selected}
                                onChange={() => togglePlanFeature(feature.id)}
                                className="h-4 w-4 rounded border-gray-300"
                              />
                              {feature.displayName}
                            </label>
                            {selected && (
                              <input
                                value={planForm.featureValues[feature.id] || ''}
                                onChange={(event) =>
                                  setPlanForm((current) => ({
                                    ...current,
                                    featureValues: {
                                      ...current.featureValues,
                                      [feature.id]: event.target.value,
                                    },
                                  }))
                                }
                                placeholder="Feature value"
                                className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                              />
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-60"
                >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                  {editingPlanId ? 'Update Plan' : 'Create Plan'}
                </button>
              </form>

              <div className="space-y-4">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    value={planSearch}
                    onChange={(event) => setPlanSearch(event.target.value)}
                    placeholder="Search plans"
                    className="w-full rounded-md border border-gray-300 bg-white py-2 pl-9 pr-3 text-sm"
                  />
                </div>
                <div className="grid gap-4 lg:grid-cols-2">
                  {filteredPlans.map((plan) => (
                    <div key={plan.id} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-base font-semibold text-gray-900">{plan.name}</h3>
                          <p className="mt-1 text-sm text-gray-600">{plan.description}</p>
                        </div>
                        <span className={`rounded-full px-2 py-1 text-xs font-medium ${plan.isActive !== false ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                          {plan.isActive !== false ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-gray-700">
                        <span className="rounded-md bg-gray-100 px-2 py-1">Rs. {plan.price}</span>
                        <span className="rounded-md bg-gray-100 px-2 py-1">{plan.billingCycle}</span>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {(plan.features || []).map((feature) => (
                          <span key={feature.id || feature.featureId} className="rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                            {feature.featureKey}: {feature.featureValue}
                          </span>
                        ))}
                      </div>
                      <div className="mt-4 flex justify-end gap-2">
                        <button type="button" onClick={() => editPlan(plan)} className="rounded-md border border-gray-300 p-2 text-gray-600 hover:bg-gray-50">
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button type="button" onClick={() => setConfirmTarget({ type: 'plan', id: plan.id, name: plan.name })} className="rounded-md border border-red-200 p-2 text-red-600 hover:bg-red-50">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'features' && (
            <div className="grid gap-6 xl:grid-cols-[minmax(320px,420px)_1fr]">
              <form onSubmit={saveFeature} className="space-y-4 rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-lg font-semibold text-gray-900">{editingFeatureId ? 'Edit Feature' : 'Create Feature'}</h2>
                  {editingFeatureId && (
                    <button type="button" onClick={resetFeatureForm} className="rounded-md p-2 text-gray-500 hover:bg-gray-100">
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <input
                  value={featureForm.featureKey}
                  onChange={(event) => setFeatureForm({ ...featureForm, featureKey: event.target.value })}
                  required
                  placeholder="Feature key"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
                <input
                  value={featureForm.displayName}
                  onChange={(event) => setFeatureForm({ ...featureForm, displayName: event.target.value })}
                  required
                  placeholder="Display name"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
                <textarea
                  value={featureForm.description}
                  onChange={(event) => setFeatureForm({ ...featureForm, description: event.target.value })}
                  placeholder="Description"
                  rows={3}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={featureForm.isActive}
                    onChange={(event) => setFeatureForm({ ...featureForm, isActive: event.target.checked })}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  Active
                </label>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-60"
                >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                  {editingFeatureId ? 'Update Feature' : 'Create Feature'}
                </button>
              </form>

              <div className="space-y-4">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    value={featureSearch}
                    onChange={(event) => setFeatureSearch(event.target.value)}
                    placeholder="Search features"
                    className="w-full rounded-md border border-gray-300 bg-white py-2 pl-9 pr-3 text-sm"
                  />
                </div>
                <div className="grid gap-4 lg:grid-cols-2">
                  {filteredFeatures.map((feature) => (
                    <div key={feature.id} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-base font-semibold text-gray-900">{feature.displayName}</h3>
                          <p className="mt-1 text-sm font-medium text-blue-600">{feature.featureKey}</p>
                          <p className="mt-2 text-sm text-gray-600">{feature.description}</p>
                        </div>
                        {feature.isActive !== false && <Check className="h-5 w-5 text-green-600" />}
                      </div>
                      <div className="mt-4 flex justify-end gap-2">
                        <button type="button" onClick={() => editFeature(feature)} className="rounded-md border border-gray-300 p-2 text-gray-600 hover:bg-gray-50">
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button type="button" onClick={() => setConfirmTarget({ type: 'feature', id: feature.id, name: feature.displayName })} className="rounded-md border border-red-200 p-2 text-red-600 hover:bg-red-50">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'assignment' && (
            <div className="grid gap-6 lg:grid-cols-[minmax(320px,420px)_1fr]">
              <form onSubmit={assignPlan} className="space-y-4 rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900">Assign Plan</h2>
                <input
                  value={assignment.restaurantId}
                  onChange={(event) => setAssignment({ ...assignment, restaurantId: event.target.value })}
                  required
                  min="1"
                  type="number"
                  placeholder="Restaurant ID"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
                <select
                  value={assignment.planId}
                  onChange={(event) => setAssignment({ ...assignment, planId: event.target.value })}
                  required
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                >
                  <option value="">Select plan</option>
                  {plans.map((plan) => (
                    <option key={plan.id} value={plan.id}>
                      {plan.name}
                    </option>
                  ))}
                </select>
                <input
                  value={assignment.durationInMonths}
                  onChange={(event) => setAssignment({ ...assignment, durationInMonths: event.target.value })}
                  required
                  min="1"
                  type="number"
                  placeholder="Duration in months"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={assignment.isAutoRenew}
                    onChange={(event) => setAssignment({ ...assignment, isAutoRenew: event.target.checked })}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  Auto renew
                </label>
                <div className="grid gap-2 sm:grid-cols-2">
                  <button
                    type="submit"
                    disabled={assignmentLoading}
                    className="inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-60"
                  >
                    {assignmentLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
                    Assign
                  </button>
                  <button
                    type="button"
                    onClick={fetchRestaurantSubscription}
                    disabled={assignmentLoading}
                    className="inline-flex items-center justify-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-60"
                  >
                    View Current
                  </button>
                </div>
              </form>

              <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900">Current Subscription</h2>
                {restaurantSubscription ? (
                  <div className="mt-4 space-y-3 text-sm text-gray-700">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <p><span className="font-medium text-gray-900">Restaurant:</span> {restaurantSubscription.restaurantId}</p>
                      <p><span className="font-medium text-gray-900">Status:</span> {restaurantSubscription.status}</p>
                      <p><span className="font-medium text-gray-900">Plan:</span> {restaurantSubscription.plan?.name}</p>
                      <p><span className="font-medium text-gray-900">Auto renew:</span> {restaurantSubscription.isAutoRenew ? 'Yes' : 'No'}</p>
                      <p><span className="font-medium text-gray-900">Start:</span> {restaurantSubscription.startDate || '-'}</p>
                      <p><span className="font-medium text-gray-900">End:</span> {restaurantSubscription.endDate || '-'}</p>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-2">
                      {(restaurantSubscription.plan?.features || []).map((feature) => (
                        <span key={feature.id || feature.featureId} className="rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                          {feature.featureKey}: {feature.featureValue}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="mt-4 text-sm text-gray-500">No subscription selected</p>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {confirmTarget && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-lg bg-white p-5 shadow-xl">
            <h2 className="text-lg font-semibold text-gray-900">Confirm delete</h2>
            <p className="mt-2 text-sm text-gray-600">
              Delete {confirmTarget.name}?
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirmTarget(null)}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={deleteSelected}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
              >
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionManagement;
