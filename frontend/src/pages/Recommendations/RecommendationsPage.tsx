import React, { useState, useEffect } from 'react';
import { useVehicle } from '../../context/VehicleContext';
import api from '../../services/api';
import { Recommendation } from '../../types';
import { Sparkles, Check, IndianRupee, ShieldAlert, ArrowRight } from 'lucide-react';

export const RecommendationsPage: React.FC = () => {
  const { selectedVehicle, viewMode } = useVehicle();
  const [recs, setRecs] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);

  const loadRecs = async () => {
    if (!selectedVehicle) return;
    setLoading(true);
    try {
      const res = await api.get(`/recommendations/${selectedVehicle.id}`);
      setRecs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecs();
  }, [selectedVehicle]);

  const handleApply = async (recId: number) => {
    if (!selectedVehicle) return;
    try {
      await api.post(`/recommendations/${selectedVehicle.id}/${recId}/status?status=applied`);
      loadRecs();
    } catch (err) {
      console.error(err);
    }
  };

  if (!selectedVehicle) return <div className="text-center p-8 text-[#A5A78F]">No vehicle selected.</div>;

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl bg-[#000000] border border-[#3A3634]">
        <div className="flex items-center space-x-2 text-xs font-mono text-[#A5A78F] mb-1">
          <span>INTELLIGENT ADVISORY</span>
          <span>&bull;</span>
          <span>PROACTIVE RECOMMENDATIONS</span>
        </div>
        <h1 className="text-2xl font-bold font-mono text-[#F0EFED]">Intelligent Vehicle Recommendations</h1>
        <p className="text-xs text-[#A5A78F] mt-1 max-w-2xl">
          Automated action items prioritized by potential economic savings and vehicle reliability impact.
        </p>
      </div>

      <div className="space-y-4">
        {recs.map((rec) => (
          <div key={rec.id} className="p-6 rounded-2xl bg-[#000000] border border-[#3A3634] flex flex-col justify-between">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div className="flex items-center space-x-2">
                  <span className={`text-[10px] font-mono uppercase font-bold px-2.5 py-0.5 rounded ${
                    rec.priority === 'high' ? 'bg-red-950 text-red-300 border border-red-800' :
                    rec.priority === 'medium' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                    'bg-slate-800 text-slate-300'
                  }`}>
                    {rec.priority} Priority &bull; {rec.category}
                  </span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                    rec.status === 'applied' ? 'bg-emerald-950 text-emerald-300' : 'bg-[#1D1D1D] text-[#A5A78F]'
                  }`}>
                    Status: {rec.status}
                  </span>
                </div>
                <span className="text-sm font-mono font-bold text-emerald-400">
                  Est. Annual Savings: ₹{rec.estimated_savings.toLocaleString()}
                </span>
              </div>

              <h3 className="text-base font-bold font-mono text-[#F0EFED]">{rec.title}</h3>
              <p className="text-xs text-[#A5A78F] mt-2 leading-relaxed">
                {viewMode === 'mechanic' ? rec.description_mechanic : rec.description_owner}
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-[#3A3634] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <span className="font-mono text-[#F0EFED] font-semibold">
                Action Required: <span className="text-[#A5A78F] font-normal font-sans">{rec.action_needed}</span>
              </span>

              {rec.status === 'pending' && (
                <button
                  onClick={() => handleApply(rec.id)}
                  className="px-4 py-1.5 rounded-xl bg-[#4C4643] hover:bg-[#59524e] text-xs font-semibold text-[#F0EFED] border border-[#3A3634] transition flex items-center space-x-1.5 self-start sm:self-auto"
                >
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Mark as Implemented</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
