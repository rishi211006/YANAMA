import React, { useState, useEffect } from 'react';
import { useVehicle } from '../../context/VehicleContext';
import api from '../../services/api';
import { FinancialSummary } from '../../types';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from 'recharts';
import { IndianRupee, Plus, Receipt, TrendingUp, X } from 'lucide-react';

export const FinancialPage: React.FC = () => {
  const { selectedVehicle } = useVehicle();
  const [data, setData] = useState<FinancialSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  // Form states
  const [expenseType, setExpenseType] = useState('fuel');
  const [amount, setAmount] = useState(3500);
  const [description, setDescription] = useState('');
  const [odometerKm, setOdometerKm] = useState(selectedVehicle?.odometer_km || 0);

  const loadFinancials = async () => {
    if (!selectedVehicle) return;
    setLoading(true);
    try {
      const res = await api.get(`/financial/${selectedVehicle.id}`);
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFinancials();
  }, [selectedVehicle]);

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVehicle) return;
    try {
      await api.post(`/financial/${selectedVehicle.id}`, {
        expense_type: expenseType,
        amount: amount,
        description: description,
        odometer_km: odometerKm
      });
      setModalOpen(false);
      setDescription('');
      loadFinancials();
    } catch (err) {
      console.error(err);
    }
  };

  if (!selectedVehicle) return <div className="text-center p-8 text-[#A5A78F]">No vehicle selected.</div>;
  if (loading || !data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-[#A5A78F] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const breakdownData = Object.entries(data.category_breakdown).map(([cat, amt]) => ({
    name: cat,
    amount: amt
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#000000] border border-[#3A3634] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-[#A5A78F] mb-1">
            <span>TOTAL COST OF OWNERSHIP</span>
            <span>&bull;</span>
            <span>EXPENDITURE ANALYTICS</span>
          </div>
          <h1 className="text-2xl font-bold font-mono text-[#F0EFED]">Vehicle Financial Analytics</h1>
          <p className="text-xs text-[#A5A78F] mt-1">
            Track fuel expenses, routine service outlays, running cost per kilometer, and comprehensive fleet spend.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-[#A5A78F] hover:bg-[#F0EFED] text-[#1D1D1D] font-bold text-xs uppercase tracking-wider transition flex items-center space-x-2 shadow self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Expense</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl bg-[#000000] border border-[#3A3634]">
          <span className="text-[11px] font-mono uppercase text-[#A5A78F]">Total Expenditure</span>
          <div className="text-2xl font-bold font-mono text-[#F0EFED] mt-1">
            ₹{data.total_expenses.toLocaleString()}
          </div>
          <div className="text-[10px] text-[#A5A78F] mt-1">All logged lifetime entries</div>
        </div>

        <div className="p-5 rounded-xl bg-[#000000] border border-[#3A3634]">
          <span className="text-[11px] font-mono uppercase text-[#A5A78F]">Running Cost per KM</span>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
            ₹{data.cost_per_km} <span className="text-xs text-[#A5A78F]">/ km</span>
          </div>
          <div className="text-[10px] text-[#A5A78F] mt-1">Total spend &divide; current odometer</div>
        </div>

        <div className="p-5 rounded-xl bg-[#000000] border border-[#3A3634]">
          <span className="text-[11px] font-mono uppercase text-[#A5A78F]">Recorded Invoices</span>
          <div className="text-2xl font-bold font-mono text-[#F0EFED] mt-1">{data.records_count}</div>
          <div className="text-[10px] text-[#A5A78F] mt-1">Fuel, maintenance, insurance</div>
        </div>
      </div>

      {/* Breakdown Chart */}
      <div className="p-6 rounded-2xl bg-[#000000] border border-[#3A3634]">
        <h3 className="text-sm font-semibold font-mono uppercase text-[#F0EFED] mb-3">
          Expense Allocation by Category (₹)
        </h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={breakdownData} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#3A3634" />
              <XAxis dataKey="name" stroke="#A5A78F" fontSize={11} tickLine={false} />
              <YAxis stroke="#A5A78F" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1D1D1D', borderColor: '#3A3634', borderRadius: '8px', fontSize: '12px' }}
                formatter={(val: any) => [`₹${val.toLocaleString()}`, 'Spent']}
              />
              <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                {breakdownData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#A5A78F' : '#4C4643'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chronological Ledger Table */}
      <div className="p-6 rounded-2xl bg-[#000000] border border-[#3A3634]">
        <h3 className="text-sm font-semibold font-mono uppercase text-[#F0EFED] mb-4">
          Chronological Expense Ledger
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#1D1D1D] text-[#A5A78F] font-mono uppercase">
              <tr>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Description</th>
                <th className="py-2.5 px-3">Odometer</th>
                <th className="py-2.5 px-3">Amount (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3A3634]">
              {data.records.map((r) => (
                <tr key={r.id} className="hover:bg-[#1D1D1D]/50 transition font-mono">
                  <td className="py-2.5 px-3 text-[#A5A78F]">{new Date(r.date).toLocaleDateString()}</td>
                  <td className="py-2.5 px-3 uppercase text-[#F0EFED] font-bold">{r.expense_type}</td>
                  <td className="py-2.5 px-3 text-[#A5A78F] font-sans text-[11px]">{r.description || '-'}</td>
                  <td className="py-2.5 px-3 text-[#A5A78F]">{r.odometer_km ? `${r.odometer_km.toLocaleString()} km` : '-'}</td>
                  <td className="py-2.5 px-3 text-emerald-400 font-bold">₹{r.amount.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Expense Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#000000] border border-[#3A3634] rounded-2xl shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#3A3634] mb-4">
              <h3 className="text-sm font-bold font-mono uppercase text-[#F0EFED]">Log Vehicle Expense</h3>
              <button onClick={() => setModalOpen(false)} className="text-[#A5A78F] hover:text-[#F0EFED]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddExpense} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-[#A5A78F] mb-1">Expense Category</label>
                <select
                  value={expenseType}
                  onChange={(e) => setExpenseType(e.target.value)}
                  className="w-full py-2 px-3 rounded-xl bg-[#1D1D1D] border border-[#3A3634] text-xs font-mono text-[#F0EFED] focus:outline-none focus:border-[#A5A78F]"
                >
                  <option value="fuel">Fuel</option>
                  <option value="maintenance">Maintenance & Service</option>
                  <option value="insurance">Insurance Premium</option>
                  <option value="tax">Road Tax / Toll</option>
                  <option value="repair">Unscheduled Repair</option>
                  <option value="other">Accessories / Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-[#A5A78F] mb-1">Amount (₹)</label>
                <input
                  type="number"
                  required
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full py-2 px-3 rounded-xl bg-[#1D1D1D] border border-[#3A3634] text-xs font-mono text-[#F0EFED] focus:outline-none focus:border-[#A5A78F]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#A5A78F] mb-1">Odometer Reading (km)</label>
                <input
                  type="number"
                  value={odometerKm}
                  onChange={(e) => setOdometerKm(Number(e.target.value))}
                  className="w-full py-2 px-3 rounded-xl bg-[#1D1D1D] border border-[#3A3634] text-xs font-mono text-[#F0EFED] focus:outline-none focus:border-[#A5A78F]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#A5A78F] mb-1">Description / Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Full tank 95 Octane petrol"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
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
                  Save Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
