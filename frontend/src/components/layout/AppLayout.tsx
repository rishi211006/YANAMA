import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useVehicle } from '../../context/VehicleContext';
import { AlertCircle } from 'lucide-react';

export const AppLayout: React.FC = () => {
  const { selectedVehicle, loadingVehicles } = useVehicle();

  return (
    <div className="flex min-h-screen bg-[#1D1D1D] text-[#F0EFED]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          {!loadingVehicles && !selectedVehicle ? (
            <div className="rounded-xl border border-amber-600/30 bg-amber-950/20 p-6 text-center max-w-xl mx-auto my-12">
              <AlertCircle className="w-10 h-10 text-amber-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-[#F0EFED] font-mono">No Vehicles Registered</h3>
              <p className="text-sm text-[#A5A78F] mt-2">
                Register a vehicle or upload a vehicle dataset to unlock performance analytics and diagnostics.
              </p>
            </div>
          ) : (
            <Outlet />
          )}
        </main>
      </div>
    </div>
  );
};
