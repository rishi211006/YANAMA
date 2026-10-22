import React, { useState } from 'react';
import { useVehicle } from '../../context/VehicleContext';
import api from '../../services/api';
import { Car, Plus, Fuel, Wrench, Calendar, Check, X } from 'lucide-react';

export const VehicleProfilePage: React.FC = () => {
  const { vehicles, selectedVehicle, selectVehicle, refreshVehicles } = useVehicle();
  const [modalOpen, setModalOpen] = useState(false);

  // Form states
  const [regNo, setRegNo] = useState('');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState(2023);
  const [fuelType, setFuelType] = useState<'petrol' | 'diesel'>('petrol');
  const [capacity, setCapacity] = useState(1498);
  const [transmission, setTransmission] = useState('manual');
  const [odometer, setOdometer] = useState(30000);
  const [vin, setVin] = useState('');
  const [nickname, setNickname] = useState('');

  const handleAddVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/vehicles', {
        registration_number: regNo,
        manufacturer: make,
        model: model,
        year: year,
        fuel_type: fuelType,
        engine_capacity_cc: capacity,
        transmission: transmission,
        odometer_km: odometer,
        vin: vin || undefined,
        nickname: nickname || undefined
      });
      setModalOpen(false);
      refreshVehicles();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#000000] border border-[#3A3634] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-[#A5A78F] mb-1">
            <span>FLEET MANAGEMENT</span>
            <span>&bull;</span>
            <span>VEHICLE REGISTRY</span>
          </div>
          <h1 className="text-2xl font-bold font-mono text-[#F0EFED]">Vehicle Fleet Management</h1>
          <p className="text-xs text-[#A5A78F] mt-1 max-w-2xl">
            Register and manage petrol and diesel vehicles under your YANAMA profile. Switch between active vehicles to inspect their respective telemetry intelligence.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-[#A5A78F] hover:bg-[#F0EFED] text-[#1D1D1D] font-bold text-xs uppercase tracking-wider transition flex items-center space-x-2 shadow self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Vehicle</span>
        </button>
      </div>

      {/* Vehicles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {vehicles.map((v) => {
          const isSelected = selectedVehicle?.id === v.id;
          return (
            <div
              key={v.id}
              className={`p-6 rounded-2xl bg-[#000000] border transition flex flex-col justify-between ${
                isSelected ? 'border-[#A5A78F] shadow-lg ring-1 ring-[#A5A78F]/30' : 'border-[#3A3634]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[#3A3634]">
                  <div>
                    <span className="font-mono text-xs font-bold text-[#A5A78F] block">
                      {v.nickname || `${v.manufacturer} ${v.model}`}
                    </span>
                    <h3 className="text-lg font-bold font-mono text-[#F0EFED] mt-0.5">
                      {v.registration_number}
                    </h3>
                  </div>

                  <span className={`px-2.5 py-1 rounded text-xs font-mono font-bold uppercase ${
                    v.fuel_type === 'petrol'
                      ? 'bg-amber-950/60 text-amber-300 border border-amber-700/50'
                      : 'bg-blue-950/60 text-blue-300 border border-blue-700/50'
                  }`}>
                    {v.fuel_type}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[11px] text-[#A5A78F] font-mono block">Make & Model</span>
                    <span className="font-semibold text-[#F0EFED]">{v.manufacturer} {v.model}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-[#A5A78F] font-mono block">Model Year</span>
                    <span className="font-semibold text-[#F0EFED]">{v.year}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-[#A5A78F] font-mono block">Engine Displacement</span>
                    <span className="font-semibold text-[#F0EFED]">{v.engine_capacity_cc} cc</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-[#A5A78F] font-mono block">Transmission</span>
                    <span className="font-semibold text-[#F0EFED] capitalize">{v.transmission}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-[#A5A78F] font-mono block">Odometer Reading</span>
                    <span className="font-semibold text-[#F0EFED]">{v.odometer_km.toLocaleString()} km</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-[#A5A78F] font-mono block">VIN</span>
                    <span className="font-mono text-[11px] text-[#A5A78F]">{v.vin || 'N/A'}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#3A3634] flex items-center justify-between">
                {isSelected ? (
                  <span className="text-xs font-mono font-semibold text-emerald-400 flex items-center">
                    <Check className="w-3.5 h-3.5 mr-1" />
                    Currently Selected
                  </span>
                ) : (
                  <button
                    onClick={() => selectVehicle(v)}
                    className="px-3.5 py-1.5 rounded-lg bg-[#4C4643] hover:bg-[#59524e] text-xs font-mono font-semibold text-[#F0EFED] border border-[#3A3634] transition"
                  >
                    Set as Active Vehicle
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Vehicle Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#000000] border border-[#3A3634] rounded-2xl shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#3A3634] mb-4">
              <h3 className="text-sm font-bold font-mono uppercase text-[#F0EFED]">Register Vehicle</h3>
              <button onClick={() => setModalOpen(false)} className="text-[#A5A78F] hover:text-[#F0EFED]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddVehicle} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-[#A5A78F] mb-1">Registration No.</label>
                  <input
                    type="text"
                    required
                    placeholder="KA-01-AB-1234"
                    value={regNo}
                    onChange={(e) => setRegNo(e.target.value.toUpperCase())}
                    className="w-full py-2 px-3 rounded-xl bg-[#1D1D1D] border border-[#3A3634] text-xs font-mono text-[#F0EFED] focus:outline-none focus:border-[#A5A78F]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-[#A5A78F] mb-1">Vehicle Nickname</label>
                  <input
                    type="text"
                    placeholder="e.g. Daily Commuter"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    className="w-full py-2 px-3 rounded-xl bg-[#1D1D1D] border border-[#3A3634] text-xs text-[#F0EFED] focus:outline-none focus:border-[#A5A78F]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-[#A5A78F] mb-1">Manufacturer</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Honda / Mahindra"
                    value={make}
                    onChange={(e) => setMake(e.target.value)}
                    className="w-full py-2 px-3 rounded-xl bg-[#1D1D1D] border border-[#3A3634] text-xs text-[#F0EFED] focus:outline-none focus:border-[#A5A78F]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-[#A5A78F] mb-1">Model</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. City / XUV700"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="w-full py-2 px-3 rounded-xl bg-[#1D1D1D] border border-[#3A3634] text-xs text-[#F0EFED] focus:outline-none focus:border-[#A5A78F]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-mono text-[#A5A78F] mb-1">Year</label>
                  <input
                    type="number"
                    required
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    className="w-full py-2 px-3 rounded-xl bg-[#1D1D1D] border border-[#3A3634] text-xs font-mono text-[#F0EFED] focus:outline-none focus:border-[#A5A78F]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-[#A5A78F] mb-1">Fuel Type</label>
                  <select
                    value={fuelType}
                    onChange={(e) => setFuelType(e.target.value as any)}
                    className="w-full py-2 px-3 rounded-xl bg-[#1D1D1D] border border-[#3A3634] text-xs font-mono text-[#F0EFED] focus:outline-none focus:border-[#A5A78F]"
                  >
                    <option value="petrol">Petrol</option>
                    <option value="diesel">Diesel</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-mono text-[#A5A78F] mb-1">Capacity (cc)</label>
                  <input
                    type="number"
                    required
                    value={capacity}
                    onChange={(e) => setCapacity(Number(e.target.value))}
                    className="w-full py-2 px-3 rounded-xl bg-[#1D1D1D] border border-[#3A3634] text-xs font-mono text-[#F0EFED] focus:outline-none focus:border-[#A5A78F]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-[#A5A78F] mb-1">Transmission</label>
                  <select
                    value={transmission}
                    onChange={(e) => setTransmission(e.target.value)}
                    className="w-full py-2 px-3 rounded-xl bg-[#1D1D1D] border border-[#3A3634] text-xs font-mono text-[#F0EFED] focus:outline-none focus:border-[#A5A78F]"
                  >
                    <option value="manual">Manual</option>
                    <option value="automatic">Automatic</option>
                    <option value="cvt">CVT</option>
                    <option value="dct">DCT</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-mono text-[#A5A78F] mb-1">Odometer (km)</label>
                  <input
                    type="number"
                    required
                    value={odometer}
                    onChange={(e) => setOdometer(Number(e.target.value))}
                    className="w-full py-2 px-3 rounded-xl bg-[#1D1D1D] border border-[#3A3634] text-xs font-mono text-[#F0EFED] focus:outline-none focus:border-[#A5A78F]"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-[#3A3634]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#1D1D1D] border border-[#3A3634] text-xs text-[#A5A78F] hover:text-[#F0EFED]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#A5A78F] text-[#1D1D1D] font-bold text-xs uppercase tracking-wider hover:bg-[#F0EFED]"
                >
                  Save Vehicle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
