import React from 'react';
import { useVehicle } from '../../context/VehicleContext';
import { useAuth } from '../../context/AuthContext';
import { Car, Wrench, User, LogOut, ChevronDown, Sparkles, Fuel } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Header: React.FC = () => {
  const { vehicles, selectedVehicle, selectVehicle, viewMode, setViewMode } = useVehicle();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#1D1D1D]/90 backdrop-blur-md border-b border-[#3A3634] px-6 flex items-center justify-between">
      {/* Left: Vehicle Selector */}
      <div className="flex items-center space-x-4">
        {selectedVehicle && (
          <div className="relative group">
            <button className="flex items-center space-x-2.5 px-3.5 py-1.5 rounded-lg bg-[#4C4643]/70 hover:bg-[#4C4643] border border-[#3A3634] text-sm text-[#F0EFED] transition">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <div className="text-left font-mono">
                <span className="font-semibold">{selectedVehicle.registration_number}</span>
                <span className="text-[#A5A78F] ml-2 font-sans text-xs">
                  {selectedVehicle.manufacturer} {selectedVehicle.model}
                </span>
              </div>
              <ChevronDown className="w-4 h-4 text-[#A5A78F] ml-1" />
            </button>

            {/* Dropdown Menu */}
            <div className="absolute left-0 mt-2 w-72 bg-[#1D1D1D] border border-[#3A3634] rounded-xl shadow-2xl py-2 hidden group-hover:block z-50">
              <div className="px-3 py-1.5 text-[11px] font-mono uppercase tracking-wider text-[#A5A78F] border-b border-[#3A3634]">
                Active Fleet ({vehicles.length})
              </div>
              {vehicles.map((v) => (
                <button
                  key={v.id}
                  onClick={() => selectVehicle(v)}
                  className={`w-full text-left px-3.5 py-2.5 text-xs hover:bg-[#4C4643]/50 transition flex items-center justify-between ${
                    v.id === selectedVehicle.id ? 'bg-[#4C4643]/40 border-l-2 border-[#A5A78F]' : ''
                  }`}
                >
                  <div>
                    <div className="font-mono font-semibold text-[#F0EFED]">{v.registration_number}</div>
                    <div className="text-[#A5A78F] text-[11px]">{v.manufacturer} {v.model} ({v.year})</div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-semibold ${
                    v.fuel_type === 'petrol' ? 'bg-amber-900/40 text-amber-300 border border-amber-700/50' : 'bg-blue-900/40 text-blue-300 border border-blue-700/50'
                  }`}>
                    {v.fuel_type}
                  </span>
                </button>
              ))}
              <div className="pt-1 border-t border-[#3A3634] px-2">
                <button
                  onClick={() => navigate('/vehicles')}
                  className="w-full text-center py-1.5 text-xs text-[#A5A78F] hover:text-[#F0EFED] transition"
                >
                  Manage Fleet / Add Vehicle &rarr;
                </button>
              </div>
            </div>
          </div>
        )}

        {selectedVehicle && (
          <div className="hidden md:flex items-center space-x-2 text-xs text-[#A5A78F] font-mono">
            <span className="flex items-center">
              <Fuel className="w-3.5 h-3.5 mr-1" />
              {selectedVehicle.engine_capacity_cc}cc {selectedVehicle.fuel_type.toUpperCase()}
            </span>
            <span>&bull;</span>
            <span>{selectedVehicle.odometer_km.toLocaleString()} km</span>
          </div>
        )}
      </div>

      {/* Right Controls: View Switcher & Profile */}
      <div className="flex items-center space-x-4">
        {/* View Mode Toggle Pill (Owner vs Mechanic) */}
        <div className="bg-[#000000] p-0.5 rounded-lg border border-[#3A3634] flex items-center">
          <button
            onClick={() => setViewMode('owner')}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-md text-xs font-medium transition ${
              viewMode === 'owner'
                ? 'bg-[#4C4643] text-[#F0EFED] shadow-sm font-semibold'
                : 'text-[#A5A78F] hover:text-[#F0EFED]'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Owner View</span>
          </button>
          <button
            onClick={() => setViewMode('mechanic')}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-md text-xs font-medium transition ${
              viewMode === 'mechanic'
                ? 'bg-[#4C4643] text-[#F0EFED] shadow-sm font-semibold'
                : 'text-[#A5A78F] hover:text-[#F0EFED]'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Mechanic View</span>
          </button>
        </div>

        {/* User / Logout */}
        <div className="flex items-center space-x-3 border-l border-[#3A3634] pl-4">
          <div className="hidden sm:block text-right">
            <div className="text-xs font-semibold text-[#F0EFED]">{user?.full_name || 'Automotive User'}</div>
            <div className="text-[11px] text-[#A5A78F] font-mono capitalize">{user?.role || 'owner'}</div>
          </div>
          <button
            onClick={logout}
            className="p-2 rounded-lg bg-[#4C4643]/50 hover:bg-[#4C4643] text-[#A5A78F] hover:text-[#F0EFED] border border-[#3A3634] transition"
            title="Log out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
