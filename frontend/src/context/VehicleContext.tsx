import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { Vehicle, ViewMode } from '../types';
import { useAuth } from './AuthContext';

interface VehicleContextType {
  vehicles: Vehicle[];
  selectedVehicle: Vehicle | null;
  selectVehicle: (v: Vehicle) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  toggleViewMode: () => void;
  loadingVehicles: boolean;
  refreshVehicles: () => Promise<void>;
}

const VehicleContext = createContext<VehicleContextType | undefined>(undefined);

export const VehicleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>(
    (localStorage.getItem('yanama_view_mode') as ViewMode) || (user?.role === 'mechanic' ? 'mechanic' : 'owner')
  );
  const [loadingVehicles, setLoadingVehicles] = useState<boolean>(true);

  const fetchVehicles = async () => {
    try {
      setLoadingVehicles(true);
      const res = await api.get('/vehicles');
      setVehicles(res.data);
      if (res.data.length > 0) {
        // Keep selected vehicle if still in list, else default to first
        setSelectedVehicle((prev) => {
          if (prev) {
            const found = res.data.find((v: Vehicle) => v.id === prev.id);
            if (found) return found;
          }
          return res.data[0];
        });
      } else {
        setSelectedVehicle(null);
      }
    } catch (err) {
      console.error('Failed to fetch vehicles', err);
    } finally {
      setLoadingVehicles(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchVehicles();
    }
  }, [user]);

  const toggleViewMode = () => {
    const next = viewMode === 'owner' ? 'mechanic' : 'owner';
    setViewMode(next);
    localStorage.setItem('yanama_view_mode', next);
  };

  const handleSetViewMode = (mode: ViewMode) => {
    setViewMode(mode);
    localStorage.setItem('yanama_view_mode', mode);
  };

  return (
    <VehicleContext.Provider
      value={{
        vehicles,
        selectedVehicle,
        selectVehicle: setSelectedVehicle,
        viewMode,
        setViewMode: handleSetViewMode,
        toggleViewMode,
        loadingVehicles,
        refreshVehicles: fetchVehicles,
      }}
    >
      {children}
    </VehicleContext.Provider>
  );
};

export const useVehicle = () => {
  const context = useContext(VehicleContext);
  if (!context) {
    throw new Error('useVehicle must be used within a VehicleProvider');
  }
  return context;
};
