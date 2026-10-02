import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '@services/common/api';

const BranchContext = createContext();

export const useBranch = () => {
  const context = useContext(BranchContext);
  if (!context) {
    throw new Error('useBranch must be used within a BranchProvider');
  }
  return context;
};

export const BranchProvider = ({ children }) => {
  const [branches, setBranches] = useState([]);
  const [selectedBranchId, setSelectedBranchId] = useState(() => {
    return localStorage.getItem('selectedBranchId') || 'all';
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        setLoading(true);
        // Assuming there is an API to get branches for the user/restaurant
        const response = await api.get('/secure/api/v1/users/fetchRestaurantId');
        if (response.data && response.data.restaurantId) {
          const branchesRes = await api.get(
            `/secure/api/v1/branches/restaurant/${response.data.restaurantId}`
          );
          // Endpoint returns a page ({ content: [...] }); older responses were a bare array.
          const list = branchesRes.data?.content ?? branchesRes.data ?? [];
          setBranches(Array.isArray(list) ? list : []);

          // If selectedBranchId is a specific ID but it's not in the branches, reset it
          if (selectedBranchId !== 'all' && Array.isArray(list)) {
            const isValid = list.some((b) => b.branchId.toString() === selectedBranchId);
            if (!isValid) {
              setSelectedBranchId('all');
            }
          }
        }
      } catch (error) {
        console.error('Failed to fetch branches for context:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBranches();
  }, []);

  const handleBranchChange = (branchId) => {
    setSelectedBranchId(branchId);
    if (branchId === 'all') {
      localStorage.removeItem('selectedBranchId');
    } else {
      localStorage.setItem('selectedBranchId', branchId);
    }
  };

  // Branch-scoped API calls need a real branch the user owns. "All" falls back to the first of the
  // user's branches (never a hardcoded ID — that leaked another restaurant's data).
  // ponytail: "all" is not aggregated yet; add a restaurant-wide endpoint when owners need totals.
  const effectiveBranchId =
    selectedBranchId === 'all' ? (branches[0]?.branchId ?? null) : selectedBranchId;

  return (
    <BranchContext.Provider
      value={{ branches, selectedBranchId, effectiveBranchId, handleBranchChange, loading }}
    >
      {children}
    </BranchContext.Provider>
  );
};

export default BranchContext;
