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
             const branchesRes = await api.get(`/secure/api/v1/branches/restaurant/${response.data.restaurantId}`);
             setBranches(branchesRes.data || []);

             // If selectedBranchId is a specific ID but it's not in the branches, reset it
             if (selectedBranchId !== 'all' && branchesRes.data) {
                const isValid = branchesRes.data.some(b => b.branchId.toString() === selectedBranchId);
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

  return (
    <BranchContext.Provider value={{ branches, selectedBranchId, handleBranchChange, loading }}>
      {children}
    </BranchContext.Provider>
  );
};

export default BranchContext;
