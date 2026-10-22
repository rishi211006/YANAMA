import React, { useState, useEffect } from 'react';
import { useVehicle } from '../../context/VehicleContext';
import api from '../../services/api';
import { MaintenanceRecord, MaintenanceScheduleItem } from '../../types';
import { Wrench, Plus, CheckCircle2, AlertTriangle, Clock, Calendar, IndianRupee, X } from 'lucide-react';

export const MaintenancePage: React.FC = () => {
  const { selectedVehicle } = useVehicle();
  const [schedule, setSchedule] = useState<MaintenanceScheduleItem[]>([]);
  const [history, setHistory] = useState<MaintenanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  // Form states
  const [serviceName, setServiceName] = useState('');
  const [serviceType, setServiceType] = useState('routine');
  const [odometerKm, setOdometerKm] = useState(selectedVehicle?.odometer_km || 0);
  const [cost, setCost] = useState(2500);
  const [notes, setNotes] = useState('');

  const loadData = async () => {
    if (!selectedVehicle) return;
    setLoading(true);
    try {
      const [schedRes, histRes] = await Promise.all([
        api.get(`/maintenance/${selectedVehicle.id}/schedule`),
        api.get(`/maintenance/${selectedVehicle.id}`)
      ]);
      setSchedule(schedRes.data);
      setHistory(histRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    if (selectedVehicle) {
      setOdometerKm(selectedVehicle.odometer_km);
    }
  }, [selectedVehicle]);

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVehicle) return;
    try {
      await api.post(`/maintenance/${selectedVehicle.id}`, {
        service_name: serviceName,
        service_type: serviceType,
        odometer_km: odometerKm,
        cost: cost,
        status: 'completed',
        notes: notes
      });
      setModalOpen(false);
      setServiceName('');
      setNotes('');
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  if (!selectedVehicle) {
    return <div className="text-center p-8 text-[#A5A78F]">No vehicle selected.</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#000000] border border-[#3A3634] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-[#A5A78F] mb-1">
            <span>PREVENTATIVE CARE</span>
            <span>&bull;</span>
            <span>MAINTENANCE TRACKER</span>
          </div>
          <h1 className="text-2xl font-bold font-mono text-[#F0EFED]">
            Vehicle Maintenance & Service Schedule
          </h1>
          <p className="text-xs text-[#A5A78F] mt-1">
            Track odometer-based service intervals, log workshop workorders, and keep your vehicle operating within factory tolerances.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-[#A5A78F] hover:bg-[#F0EFED] text-[#1D1D1D] font-bold text-xs uppercase tracking-wider transition flex items-center space-x-2 shadow self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Log Completed Service</span>
        </button>
      </div>

      {/* Service Schedule Status Grid */}
      <div className="p-6 rounded-2xl bg-[#000000] border border-[#3A3634]">
        <h3 className="text-sm font-semibold font-mono uppercase text-[#F0EFED] mb-4">
          Factory Service Schedule & Compliance
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {schedule.map((item, i) => (
            <div key={i} className="p-4 rounded-xl bg-[#1D1D1D] border border-[#3A3634] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded ${
                    item.status === 'overdue' ? 'bg-red-950 text-red-300 border border-red-800' :
                    item.status === 'due' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                    'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  }`}>
                    {item.status}
                  </span>
                  <span className="text-xs font-mono text-[#A5A78F]">
                    Interval: {item.interval_km.toLocaleString()} km
                  </span>
                </div>
                <h4 className="text-sm font-bold font-mono text-[#F0EFED]">{item.service_name}</h4>
                <div className="text-[11px] text-[#A5A78F] mt-1">
                  Est. Service Cost: ₹{item.estimated_cost.toLocaleString()}
                </div>
              </div>

              <div className="mt-4 pt-2.5 border-t border-[#3A3634] flex items-center justify-between text-xs">
                <span className="text-[11px] text-[#A5A78F] font-mono">Cycle: Every {item.interval_days} days</span>
                {item.status === 'overdue' && (
                  <span className="text-red-400 font-bold text-[11px] flex items-center">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    Immediate Action
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Maintenance History Table */}
      <div className="p-6 rounded-2xl bg-[#000000] border border-[#3A3634]">
        <h3 className="text-sm font-semibold font-mono uppercase text-[#F0EFED] mb-4">
          Historical Workshop Invoices & Records
        </h3>

        {history.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#1D1D1D] text-[#A5A78F] font-mono uppercase">
                <tr>
                  <th className="py-2.5 px-3">Service Name</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Odometer</th>
                  <th className="py-2.5 px-3">Cost (₹)</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#3A3634]">
                {history.map((rec) => (
                  <tr key={rec.id} className="hover:bg-[#1D1D1D]/50 transition font-mono">
                    <td className="py-2.5 px-3 font-semibold text-[#F0EFED]">{rec.service_name}</td>
                    <td className="py-2.5 px-3 uppercase text-[#A5A78F]">{rec.service_type}</td>
                    <td className="py-2.5 px-3 text-[#F0EFED]">{rec.odometer_km.toLocaleString()} km</td>
                    <td className="py-2.5 px-3 text-emerald-400">₹{rec.cost.toLocaleString()}</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950/60 text-emerald-300 border border-emerald-700/50">
                        {rec.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-[#A5A78F]">{new Date(rec.service_date).toLocaleDateString()}</td>
                    <td className="py-2.5 px-3 text-[#A5A78F] font-sans text-[11px] max-w-xs truncate">{rec.notes || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-xs text-[#A5A78F] font-mono">No maintenance records logged yet.</p>
        )}
      </div>

      {/* Log Service Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#000000] border border-[#3A3634] rounded-2xl shadow-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#3A3634] mb-4">
              <h3 className="text-sm font-bold font-mono uppercase text-[#F0EFED]">Log Completed Maintenance</h3>
              <button onClick={() => setModalOpen(false)} className="text-[#A5A78F] hover:text-[#F0EFED]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddService} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-[#A5A78F] mb-1">Service Name / Item</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Engine Oil & Filter Renewal"
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  className="w-full py-2 px-3 rounded-xl bg-[#1D1D1D] border border-[#3A3634] text-xs text-[#F0EFED] focus:outline-none focus:border-[#A5A78F]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-[#A5A78F] mb-1">Service Type</label>
                  <select
                    value={serviceType}
                    onChange={(e) => setServiceType(e.target.value)}
                    className="w-full py-2 px-3 rounded-xl bg-[#1D1D1D] border border-[#3A3634] text-xs font-mono text-[#F0EFED] focus:outline-none focus:border-[#A5A78F]"
                  >
                    <option value="routine">Routine</option>
                    <option value="repair">Repair</option>
                    <option value="inspection">Inspection</option>
                    <option value="recall">Recall</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#A5A78F] mb-1">Odometer (km)</label>
                  <input
                    type="number"
                    required
                    value={odometerKm}
                    onChange={(e) => setOdometerKm(Number(e.target.value))}
                    className="w-full py-2 px-3 rounded-xl bg-[#1D1D1D] border border-[#3A3634] text-xs font-mono text-[#F0EFED] focus:outline-none focus:border-[#A5A78F]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-[#A5A78F] mb-1">Total Cost (₹)</label>
                <input
                  type="number"
                  required
                  value={cost}
                  onChange={(e) => setCost(Number(e.target.value))}
                  className="w-full py-2 px-3 rounded-xl bg-[#1D1D1D] border border-[#3A3634] text-xs font-mono text-[#F0EFED] focus:outline-none focus:border-[#A5A78F]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#A5A78F] mb-1">Workshop Notes</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Synthetic 5W-30 replaced, drain washer renewed"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full py-2 px-3 rounded-xl bg-[#1D1D1D] border border-[#3A3634] text-xs text-[#F0EFED] focus:outline-none focus:border-[#A5A78F]"
                />
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
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
