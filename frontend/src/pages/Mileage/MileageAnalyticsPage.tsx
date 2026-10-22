import React, { useState, useEffect } from 'react';
import { useVehicle } from '../../context/VehicleContext';
import api from '../../services/api';
import { MileageAnalyticsData } from '../../types';
import { AIInsightBox } from '../../components/common/AIInsightBox';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Fuel,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Award
} from 'lucide-react';

export const MileageAnalyticsPage: React.FC = () => {
  const { selectedVehicle, viewMode } = useVehicle();
  const [data, setData] = useState<MileageAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchMileageData = async () => {
    if (!selectedVehicle) return;
    setLoading(true);
    try {
      const res = await api.get(`/analytics/${selectedVehicle.id}/mileage/analysis`);
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMileageData();
  }, [selectedVehicle]);

  if (!selectedVehicle) {
    return <div className="text-center p-8 text-[#A5A78F]">No vehicle selected.</div>;
  }

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-[#A5A78F] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#000000] border border-[#3A3634] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-[#A5A78F] mb-1">
            <span>FUEL INTELLIGENCE</span>
            <span>&bull;</span>
            <span className="text-emerald-400 font-semibold">MILEAGE OPTIMIZATION ENGINE</span>
          </div>
          <h1 className="text-2xl font-bold font-mono text-[#F0EFED]">
            Vehicle Mileage Intelligence & Efficiency
          </h1>
          <p className="text-xs text-[#A5A78F] mt-1 max-w-2xl">
            Real-time km/L telemetry analysis. Identifies the specific engineering and driving reasons for fuel economy drops or rises, with AI recommendations to recover up to +3.5 km/L.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-xl bg-[#1D1D1D] border border-[#3A3634] text-right font-mono">
            <span className="text-[10px] text-[#A5A78F] uppercase block">Rating</span>
            <span className="text-sm font-bold text-emerald-400">{data.efficiency_rating}</span>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-[#000000] border border-[#3A3634]">
          <span className="text-[11px] font-mono uppercase text-[#A5A78F]">Running Average</span>
          <div className="text-2xl font-bold font-mono text-[#F0EFED] mt-1">
            {data.current_average_kmpl} <span className="text-xs text-[#A5A78F]">km/L</span>
          </div>
          <div className="text-[10px] text-[#A5A78F] mt-1">Current telemetry baseline</div>
        </div>

        <div className="p-5 rounded-xl bg-[#000000] border border-[#3A3634]">
          <span className="text-[11px] font-mono uppercase text-[#A5A78F]">Historical Peak</span>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
            {data.historical_peak_kmpl} <span className="text-xs text-[#A5A78F]">km/L</span>
          </div>
          <div className="text-[10px] text-[#A5A78F] mt-1">Optimal highway benchmark</div>
        </div>

        <div className="p-5 rounded-xl bg-[#000000] border border-[#3A3634]">
          <span className="text-[11px] font-mono uppercase text-[#A5A78F]">Trend Trajectory</span>
          <div className={`text-2xl font-bold font-mono mt-1 flex items-center ${data.recent_trend_pct >= 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
            {data.recent_trend_pct >= 0 ? (
              <ArrowUpRight className="w-5 h-5 mr-1" />
            ) : (
              <ArrowDownRight className="w-5 h-5 mr-1" />
            )}
            <span>{data.recent_trend_pct > 0 ? `+${data.recent_trend_pct}%` : `${data.recent_trend_pct}%`}</span>
          </div>
          <div className="text-[10px] text-[#A5A78F] mt-1">Compared to early baseline</div>
        </div>

        <div className="p-5 rounded-xl bg-[#000000] border border-[#3A3634]">
          <span className="text-[11px] font-mono uppercase text-[#A5A78F]">Recovery Potential</span>
          <div className="text-2xl font-bold font-mono text-[#F0EFED] mt-1">
            +3.5 <span className="text-xs text-[#A5A78F]">km/L</span>
          </div>
          <div className="text-[10px] text-emerald-400 mt-1">Est. ~₹14,000/yr fuel savings</div>
        </div>
      </div>

      {/* AI Text Agent Box */}
      <AIInsightBox
        title="AI Mileage Intelligence Agent"
        subtitle={`Volumetric fuel efficiency diagnosis for ${selectedVehicle.manufacturer} ${selectedVehicle.model}`}
        badge="AI OPTIMIZER"
        ownerText={data.ai_narrative_owner}
        mechanicText={data.ai_narrative_mechanic}
        onRefresh={fetchMileageData}
      />

      {/* Mileage History Chart */}
      <div className="p-6 rounded-2xl bg-[#000000] border border-[#3A3634]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold font-mono uppercase text-[#F0EFED] flex items-center space-x-2">
              <Fuel className="w-4 h-4 text-[#A5A78F]" />
              <span>Mileage (km/L) & Speed (km/h) Chronological Trend</span>
            </h3>
            <p className="text-xs text-[#A5A78F] mt-0.5">
              Instantaneous fuel economy tracked against vehicle road speed.
            </p>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.trip_history} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#3A3634" />
              <XAxis dataKey="index" stroke="#A5A78F" fontSize={11} tickLine={false} />
              <YAxis stroke="#A5A78F" fontSize={11} tickLine={false} domain={[0, 'auto']} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1D1D1D', borderColor: '#3A3634', borderRadius: '8px', fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', color: '#A5A78F' }} />
              <Line type="monotone" dataKey="mileage_kmpl" name="Mileage (km/L)" stroke="#22c55e" strokeWidth={2.5} dot={{ r: 2 }} />
              <Line type="monotone" dataKey="speed_kmph" name="Speed (km/h)" stroke="#A5A78F" strokeWidth={1.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Reasons for Drop or Rise */}
      <div className="p-6 rounded-2xl bg-[#000000] border border-[#3A3634]">
        <h3 className="text-sm font-semibold font-mono uppercase text-[#F0EFED] mb-1">
          Identified Factors Influencing Mileage (Drop & Rise Analysis)
        </h3>
        <p className="text-xs text-[#A5A78F] mb-4">
          Parametric attribution calculated by cross-correlating throttle position, engine temperature, and maintenance state.
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          {data.drop_rise_factors.map((factor, i) => (
            <div key={i} className="p-4 rounded-xl bg-[#1D1D1D] border border-[#3A3634] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold text-[#F0EFED]">{factor.factor}</span>
                  <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                    factor.direction === 'drop'
                      ? 'bg-red-950/60 text-red-400 border border-red-800/50'
                      : 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/50'
                  }`}>
                    {factor.impact}
                  </span>
                </div>
                <p className="text-xs text-[#A5A78F] leading-relaxed">{factor.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Recommendations to Improve Mileage */}
      <div className="p-6 rounded-2xl bg-[#000000] border border-[#3A3634]">
        <div className="flex items-center space-x-2 mb-1">
          <Sparkles className="w-4 h-4 text-[#A5A78F]" />
          <h3 className="text-sm font-semibold font-mono uppercase text-[#F0EFED]">
            AI Recommended Actions to Maximize Fuel Efficiency
          </h3>
        </div>
        <p className="text-xs text-[#A5A78F] mb-4">
          High-yield behavioral and maintenance adjustments to recover lost mileage.
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          {data.ai_actionable_recommendations.map((rec, i) => (
            <div key={i} className="p-4 rounded-xl bg-[#1D1D1D] border border-[#3A3634] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold text-[#F0EFED]">{rec.action}</span>
                  <span className="text-xs font-mono font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-950/40 border border-emerald-800/50">
                    {rec.potential_gain}
                  </span>
                </div>
                <p className="text-xs text-[#A5A78F] leading-relaxed">{rec.description}</p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-[#3A3634] flex items-center justify-between text-[11px] font-mono text-[#A5A78F]">
                <span>Effort / Investment:</span>
                <span className="text-[#F0EFED] font-semibold">{rec.difficulty}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
