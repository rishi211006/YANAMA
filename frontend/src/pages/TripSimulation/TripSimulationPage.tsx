import React, { useState, useEffect } from 'react';
import { useVehicle } from '../../context/VehicleContext';
import api from '../../services/api';
import { TripSimulationResult } from '../../types';
import { AIInsightBox } from '../../components/common/AIInsightBox';
import {
  MapPin,
  Sliders,
  ShieldCheck,
  AlertTriangle,
  Fuel,
  Wrench,
  CheckCircle2,
  Mountain,
  Building2,
  Compass,
  ArrowRight,
  TrendingDown
} from 'lucide-react';

export const TripSimulationPage: React.FC = () => {
  const { selectedVehicle, viewMode } = useVehicle();
  const [distanceKm, setDistanceKm] = useState<number>(450);
  const [terrain, setTerrain] = useState<string>('mixed');
  const [load, setLoad] = useState<string>('medium');
  const [durationDays, setDurationDays] = useState<number>(2);
  const [result, setResult] = useState<TripSimulationResult | null>(null);
  const [loading, setLoading] = useState(false);

  const runSimulation = async () => {
    if (!selectedVehicle) return;
    setLoading(true);
    try {
      const res = await api.post(`/analytics/${selectedVehicle.id}/trip/simulate`, {
        trip_distance_km: distanceKm,
        terrain_type: terrain,
        load_condition: load,
        duration_days: durationDays
      });
      setResult(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runSimulation();
  }, [selectedVehicle, distanceKm, terrain, load, durationDays]);

  if (!selectedVehicle) {
    return <div className="text-center p-8 text-[#A5A78F]">No vehicle selected.</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#000000] border border-[#3A3634] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-[#A5A78F] mb-1">
            <span>PREDICTIVE SIMULATION</span>
            <span>&bull;</span>
            <span className="text-[#A5A78F] font-semibold">TRIP PLANNING ENGINE</span>
          </div>
          <h1 className="text-2xl font-bold font-mono text-[#F0EFED]">
            Road Trip Simulation & Readiness Audit
          </h1>
          <p className="text-xs text-[#A5A78F] mt-1 max-w-2xl">
            Simulates mechanical durability, fuel burn, and thermal strain comparing your vehicle's current condition against a fully serviced condition.
          </p>
        </div>

        <div className="text-right font-mono text-xs text-[#A5A78F] hidden sm:block">
          <div>Vehicle: <span className="text-[#F0EFED] font-semibold">{selectedVehicle.registration_number}</span></div>
          <div>Fuel: <span className="uppercase text-emerald-400">{selectedVehicle.fuel_type}</span></div>
        </div>
      </div>

      {/* Trip Configuration Form Controls */}
      <div className="p-6 rounded-2xl bg-[#000000] border border-[#3A3634]">
        <h3 className="text-sm font-semibold font-mono uppercase text-[#F0EFED] mb-4 flex items-center space-x-2">
          <Sliders className="w-4 h-4 text-[#A5A78F]" />
          <span>Configure Journey Parameters</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Distance Input */}
          <div>
            <div className="flex items-center justify-between text-xs font-mono mb-2">
              <span className="text-[#A5A78F]">Distance:</span>
              <span className="font-bold text-[#F0EFED] text-sm">{distanceKm} km</span>
            </div>
            <input
              type="range"
              min="50"
              max="2000"
              step="25"
              value={distanceKm}
              onChange={(e) => setDistanceKm(Number(e.target.value))}
              className="w-full accent-[#A5A78F] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#A5A78F] font-mono mt-1">
              <span>50 km</span>
              <span>1,000 km</span>
              <span>2,000 km</span>
            </div>
          </div>

          {/* Terrain Selector */}
          <div>
            <label className="block text-xs font-mono text-[#A5A78F] mb-2">Terrain Profile:</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'highway', label: 'Highway' },
                { id: 'mixed', label: 'Mixed' },
                { id: 'city', label: 'City' },
                { id: 'mountain', label: 'Mountain' }
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTerrain(t.id)}
                  className={`py-1.5 px-2 rounded-lg text-xs font-mono font-medium transition ${
                    terrain === t.id
                      ? 'bg-[#4C4643] border border-[#A5A78F] text-[#F0EFED]'
                      : 'bg-[#1D1D1D] border border-[#3A3634] text-[#A5A78F] hover:text-[#F0EFED]'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Payload Condition */}
          <div>
            <label className="block text-xs font-mono text-[#A5A78F] mb-2">Vehicle Payload:</label>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: 'light', label: 'Light' },
                { id: 'medium', label: 'Med' },
                { id: 'heavy', label: 'Heavy' }
              ].map((l) => (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => setLoad(l.id)}
                  className={`py-1.5 px-2 rounded-lg text-xs font-mono font-medium transition ${
                    load === l.id
                      ? 'bg-[#4C4643] border border-[#A5A78F] text-[#F0EFED]'
                      : 'bg-[#1D1D1D] border border-[#3A3634] text-[#A5A78F] hover:text-[#F0EFED]'
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-xs font-mono text-[#A5A78F] mb-2">Trip Duration:</label>
            <select
              value={durationDays}
              onChange={(e) => setDurationDays(Number(e.target.value))}
              className="w-full py-2 px-3 rounded-lg bg-[#1D1D1D] border border-[#3A3634] text-xs font-mono text-[#F0EFED] focus:outline-none focus:border-[#A5A78F]"
            >
              <option value={1}>Single Day (1 day)</option>
              <option value={2}>Weekend Getaway (2 days)</option>
              <option value={4}>Multi-Day Tour (4 days)</option>
              <option value={7}>Long Expedition (7 days)</option>
            </select>
          </div>
        </div>
      </div>

      {/* AI Recommendation Box */}
      {result && (
        <AIInsightBox
          title="AI Trip Readiness & Service Advisor Agent"
          subtitle={`Customized strategic appraisal for a ${distanceKm} km journey on ${terrain.toUpperCase()} terrain`}
          badge="AI SIMULATION AGENT"
          ownerText={result.ai_recommendation_owner}
          mechanicText={result.ai_recommendation_mechanic}
          onRefresh={runSimulation}
        />
      )}

      {/* Side-by-Side Comparison: Current Condition vs Serviced Condition */}
      {result && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Current Vehicle Condition */}
          <div className="p-6 rounded-2xl bg-[#000000] border border-[#3A3634] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#3A3634]">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold block">
                    CURRENT STATE
                  </span>
                  <h3 className="text-base font-bold font-mono text-[#F0EFED]">As-Is Vehicle Condition</h3>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black font-mono text-amber-400">
                    {result.current_readiness_score.toFixed(0)}
                  </span>
                  <span className="text-xs text-[#A5A78F] font-mono">/ 100</span>
                  <div className="text-[10px] text-[#A5A78F] font-mono">Readiness Index</div>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                <div className="flex items-center justify-between text-xs py-1 border-b border-[#3A3634]/60">
                  <span className="text-[#A5A78F]">Estimated Fuel Consumption:</span>
                  <span className="font-mono font-bold text-[#F0EFED]">{result.current_fuel_needed_liters} Litres</span>
                </div>
                <div className="flex items-center justify-between text-xs py-1 border-b border-[#3A3634]/60">
                  <span className="text-[#A5A78F]">Estimated Fuel Cost:</span>
                  <span className="font-mono font-bold text-[#F0EFED]">₹{result.current_fuel_cost_est.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-xs py-1 border-b border-[#3A3634]/60">
                  <span className="text-[#A5A78F]">Thermal Strain Margin:</span>
                  <span className="font-mono font-bold text-amber-400">Degraded Under Sustained Load</span>
                </div>
              </div>
            </div>

            <div className="mt-6 p-3 rounded-xl bg-amber-950/20 border border-amber-800/30 text-xs text-amber-300">
              Risk: Unresolved faults will accelerate mechanical degradation over {distanceKm} km.
            </div>
          </div>

          {/* Card 2: Serviced Vehicle Condition */}
          <div className="p-6 rounded-2xl bg-[#000000] border border-emerald-800/40 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#3A3634]">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold block">
                    RECOMMENDED STATE
                  </span>
                  <h3 className="text-base font-bold font-mono text-[#F0EFED]">Fully Serviced Condition</h3>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black font-mono text-emerald-400">
                    {result.serviced_readiness_score.toFixed(0)}
                  </span>
                  <span className="text-xs text-[#A5A78F] font-mono">/ 100</span>
                  <div className="text-[10px] text-emerald-400 font-mono">Optimal Safety</div>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                <div className="flex items-center justify-between text-xs py-1 border-b border-[#3A3634]/60">
                  <span className="text-[#A5A78F]">Estimated Fuel Consumption:</span>
                  <span className="font-mono font-bold text-emerald-400">{result.serviced_fuel_needed_liters} Litres</span>
                </div>
                <div className="flex items-center justify-between text-xs py-1 border-b border-[#3A3634]/60">
                  <span className="text-[#A5A78F]">Estimated Fuel Cost:</span>
                  <span className="font-mono font-bold text-emerald-400">₹{result.serviced_fuel_cost_est.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-xs py-1 border-b border-[#3A3634]/60">
                  <span className="text-[#A5A78F]">Potential Fuel Savings:</span>
                  <span className="font-mono font-bold text-emerald-400 flex items-center">
                    <TrendingDown className="w-3.5 h-3.5 mr-1" />
                    ₹{result.potential_fuel_savings.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 p-3 rounded-xl bg-emerald-950/30 border border-emerald-800/40 text-xs text-emerald-300">
              Benefit: Completing pre-trip service restores full engine cooling capacity and peak fuel economy.
            </div>
          </div>
        </div>
      )}

      {/* Required Services Before Journey */}
      {result && (
        <div className="p-6 rounded-2xl bg-[#000000] border border-[#3A3634]">
          <h3 className="text-sm font-semibold font-mono uppercase text-[#F0EFED] mb-1 flex items-center space-x-2">
            <Wrench className="w-4 h-4 text-[#A5A78F]" />
            <span>AI Recommended Pre-Trip Service Checklist</span>
          </h3>
          <p className="text-xs text-[#A5A78F] mb-4">
            Custom-tailored checklist derived from active OBD alerts, overdue schedules, and the intended {terrain} terrain.
          </p>

          <div className="space-y-3">
            {result.required_services.map((svc, i) => (
              <div key={i} className="p-4 rounded-xl bg-[#1D1D1D] border border-[#3A3634] flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-start space-x-3">
                  <div className="mt-0.5">
                    {svc.urgency === 'Mandatory' ? (
                      <AlertTriangle className="w-4 h-4 text-red-400" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-[#A5A78F]" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-bold text-[#F0EFED]">{svc.service}</span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-semibold ${
                        svc.urgency === 'Mandatory'
                          ? 'bg-red-950 text-red-300 border border-red-800/50'
                          : 'bg-[#4C4643] text-[#F0EFED] border border-[#3A3634]'
                      }`}>
                        {svc.urgency}
                      </span>
                    </div>
                    <p className="text-xs text-[#A5A78F] mt-1">{svc.benefit}</p>
                  </div>
                </div>

                <div className="text-right font-mono self-start md:self-auto">
                  <div className="text-xs font-bold text-[#F0EFED]">₹{svc.estimated_cost.toLocaleString()}</div>
                  <div className="text-[10px] text-[#A5A78F]">Est. Service Cost</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Risk Factors Breakdown */}
      {result && result.risk_factors.length > 0 && (
        <div className="p-6 rounded-2xl bg-[#000000] border border-[#3A3634]">
          <h3 className="text-sm font-semibold font-mono uppercase text-[#F0EFED] mb-3 flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>Identified Route & Duty Cycle Risk Factors</span>
          </h3>

          <div className="grid md:grid-cols-2 gap-4">
            {result.risk_factors.map((rf, i) => (
              <div key={i} className="p-4 rounded-xl bg-[#1D1D1D] border border-[#3A3634]">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono text-xs font-bold text-[#F0EFED]">{rf.name}</span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                    rf.severity === 'Critical' ? 'bg-red-950 text-red-300 border border-red-800' :
                    rf.severity === 'High' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                    'bg-slate-800 text-slate-300'
                  }`}>
                    {rf.severity} Risk
                  </span>
                </div>
                <p className="text-xs text-[#A5A78F] leading-relaxed">{rf.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
