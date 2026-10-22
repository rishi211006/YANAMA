import React, { useState, useEffect } from 'react';
import { useVehicle } from '../../context/VehicleContext';
import api from '../../services/api';
import { StatisticalEngineData } from '../../types';
import { AIInsightBox } from '../../components/common/AIInsightBox';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell
} from 'recharts';
import {
  BarChart3,
  TrendingUp,
  Activity,
  Layers,
  Sparkles,
  AlertOctagon,
  RefreshCw,
  Sliders
} from 'lucide-react';

const METRICS = [
  { id: 'rpm', label: 'Engine RPM', unit: 'RPM' },
  { id: 'torque_nm', label: 'Torque', unit: 'Nm' },
  { id: 'horsepower', label: 'Horsepower', unit: 'HP' },
  { id: 'coolant_temp_c', label: 'Coolant Temp', unit: '°C' },
  { id: 'engine_load_pct', label: 'Engine Load', unit: '%' },
  { id: 'speed_kmph', label: 'Vehicle Speed', unit: 'km/h' }
];

export const StatisticalEnginePage: React.FC = () => {
  const { selectedVehicle, viewMode } = useVehicle();
  const [selectedMetric, setSelectedMetric] = useState('rpm');
  const [data, setData] = useState<StatisticalEngineData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    if (!selectedVehicle) return;
    setLoading(true);
    try {
      const res = await api.get(`/analytics/${selectedVehicle.id}/engine/statistical?metric=${selectedMetric}`);
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [selectedVehicle, selectedMetric]);

  if (!selectedVehicle) {
    return <div className="text-center p-8 text-[#A5A78F]">No vehicle selected.</div>;
  }

  const activeMetricObj = METRICS.find((m) => m.id === selectedMetric) || METRICS[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#000000] border border-[#3A3634] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-[#A5A78F] mb-1">
            <span>DATA ANALYTICS</span>
            <span>&bull;</span>
            <span className="text-[#A5A78F] font-semibold">STATISTICAL ENGINE INTELLIGENCE</span>
          </div>
          <h1 className="text-2xl font-bold font-mono text-[#F0EFED]">
            Parametric Frequency & Statistical Spectrum
          </h1>
          <p className="text-xs text-[#A5A78F] mt-1 max-w-2xl">
            Mathematical representation of historical telemetry through percentiles (P25 - P95), frequency distribution histograms, linear trend regression, and AI agent textual synthesis.
          </p>
        </div>

        <button
          onClick={fetchStats}
          className="px-4 py-2 rounded-xl bg-[#4C4643] hover:bg-[#59524e] text-xs font-semibold text-[#F0EFED] border border-[#3A3634] transition flex items-center space-x-1.5 self-start md:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Recalculate Stats</span>
        </button>
      </div>

      {/* Metric Selector Pills */}
      <div className="flex flex-wrap items-center gap-2 p-2 rounded-xl bg-[#000000] border border-[#3A3634]">
        <div className="flex items-center space-x-1.5 px-3 text-xs font-mono text-[#A5A78F]">
          <Sliders className="w-3.5 h-3.5" />
          <span>Active Metric:</span>
        </div>
        {METRICS.map((m) => (
          <button
            key={m.id}
            onClick={() => setSelectedMetric(m.id)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium transition ${
              selectedMetric === m.id
                ? 'bg-[#A5A78F] text-[#1D1D1D] font-bold shadow'
                : 'text-[#A5A78F] hover:bg-[#1D1D1D] hover:text-[#F0EFED]'
            }`}
          >
            {m.label} ({m.unit})
          </button>
        ))}
      </div>

      {/* AI Text Box Agent Interpreting the Selected Technique */}
      {data && (
        <AIInsightBox
          title={`AI Agent: ${activeMetricObj.label} Analytical Interpretation`}
          subtitle={`Mathematical synthesis of ${data.total_samples} historical datapoints`}
          badge="STATISTICAL INFERENCE"
          ownerText={data.ai_interpretation_owner}
          mechanicText={data.ai_interpretation_mechanic}
          onRefresh={fetchStats}
        />
      )}

      {/* Statistical Summary Cards */}
      {data && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="p-4 rounded-xl bg-[#000000] border border-[#3A3634]">
            <span className="text-[10px] font-mono uppercase text-[#A5A78F]">Median (P50)</span>
            <div className="text-xl font-bold font-mono text-[#F0EFED] mt-1">
              {data.p50} <span className="text-xs text-[#A5A78F] font-normal">{activeMetricObj.unit}</span>
            </div>
            <div className="text-[10px] text-[#A5A78F] mt-0.5">50th Percentile</div>
          </div>

          <div className="p-4 rounded-xl bg-[#000000] border border-[#3A3634]">
            <span className="text-[10px] font-mono uppercase text-[#A5A78F]">95th Percentile</span>
            <div className="text-xl font-bold font-mono text-[#F0EFED] mt-1">
              {data.p95} <span className="text-xs text-[#A5A78F] font-normal">{activeMetricObj.unit}</span>
            </div>
            <div className="text-[10px] text-[#A5A78F] mt-0.5">Top 5% boundary</div>
          </div>

          <div className="p-4 rounded-xl bg-[#000000] border border-[#3A3634]">
            <span className="text-[10px] font-mono uppercase text-[#A5A78F]">Mean (&mu;)</span>
            <div className="text-xl font-bold font-mono text-[#F0EFED] mt-1">
              {data.mean} <span className="text-xs text-[#A5A78F] font-normal">{activeMetricObj.unit}</span>
            </div>
            <div className="text-[10px] text-[#A5A78F] mt-0.5">Arithmetic Average</div>
          </div>

          <div className="p-4 rounded-xl bg-[#000000] border border-[#3A3634]">
            <span className="text-[10px] font-mono uppercase text-[#A5A78F]">Std Dev (&sigma;)</span>
            <div className="text-xl font-bold font-mono text-[#F0EFED] mt-1">
              &plusmn;{data.std_dev} <span className="text-xs text-[#A5A78F] font-normal">{activeMetricObj.unit}</span>
            </div>
            <div className="text-[10px] text-[#A5A78F] mt-0.5">Spread / Variance</div>
          </div>

          <div className="p-4 rounded-xl bg-[#000000] border border-[#3A3634]">
            <span className="text-[10px] font-mono uppercase text-[#A5A78F]">Regression Slope</span>
            <div className="text-xl font-bold font-mono text-[#F0EFED] mt-1">
              {data.trend_slope > 0 ? `+${data.trend_slope}` : data.trend_slope}
            </div>
            <div className="text-[10px] text-[#A5A78F] mt-0.5 capitalize">{data.trend_direction} drift</div>
          </div>

          <div className="p-4 rounded-xl bg-[#000000] border border-[#3A3634]">
            <span className="text-[10px] font-mono uppercase text-[#A5A78F]">Outlier Events</span>
            <div className={`text-xl font-bold font-mono mt-1 ${data.anomaly_count > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
              {data.anomaly_count} <span className="text-xs text-[#A5A78F] font-normal">pts</span>
            </div>
            <div className="text-[10px] text-[#A5A78F] mt-0.5">&gt; 2.2&sigma; deviation</div>
          </div>
        </div>
      )}

      {/* Main Visualizations: Histogram & Percentile Spectrum */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Frequency Distribution Histogram (2 cols) */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-[#000000] border border-[#3A3634]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold font-mono uppercase text-[#F0EFED] flex items-center space-x-2">
                <BarChart3 className="w-4 h-4 text-[#A5A78F]" />
                <span>Frequency Distribution Histogram</span>
              </h3>
              <p className="text-xs text-[#A5A78F] mt-0.5">
                Distribution of {activeMetricObj.label} across 8 equal data bins. Height denotes observation frequency.
              </p>
            </div>
          </div>

          {loading ? (
            <div className="h-72 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-[#A5A78F] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : data?.histogram && data.histogram.length > 0 ? (
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.histogram} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#3A3634" vertical={false} />
                  <XAxis
                    dataKey="bin"
                    stroke="#A5A78F"
                    fontSize={11}
                    tickLine={false}
                    angle={-20}
                    textAnchor="end"
                  />
                  <YAxis stroke="#A5A78F" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1D1D1D', borderColor: '#3A3634', borderRadius: '8px', fontSize: '12px' }}
                    formatter={(val: any) => [`${val} samples`, 'Count']}
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {data.histogram.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={index % 2 === 0 ? '#A5A78F' : '#4C4643'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-72 flex items-center justify-center text-xs text-[#A5A78F] font-mono">
              No telemetry distribution available.
            </div>
          )}
        </div>

        {/* Percentile Range Spectrum */}
        <div className="p-6 rounded-2xl bg-[#000000] border border-[#3A3634] flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold font-mono uppercase text-[#F0EFED] flex items-center space-x-2 mb-2">
              <Layers className="w-4 h-4 text-[#A5A78F]" />
              <span>Percentile Range Spectrum</span>
            </h3>
            <p className="text-xs text-[#A5A78F] mb-6">
              Empirical cumulative distribution breakdown for {activeMetricObj.label}.
            </p>

            {data && (
              <div className="space-y-4">
                {[
                  { label: 'Minimum Observed', val: data.min_val, pct: '0%' },
                  { label: '25th Percentile (P25)', val: data.p25, pct: '25%' },
                  { label: 'Median Value (P50)', val: data.p50, pct: '50%' },
                  { label: '75th Percentile (P75)', val: data.p75, pct: '75%' },
                  { label: '95th Percentile (P95)', val: data.p95, pct: '95%' },
                  { label: 'Maximum Peak', val: data.max_val, pct: '100%' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-[#3A3634]/60">
                    <span className="text-[#A5A78F] font-mono">{item.label}</span>
                    <span className="font-mono font-bold text-[#F0EFED]">
                      {item.val} {activeMetricObj.unit}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-[#3A3634] text-[11px] text-[#A5A78F] leading-relaxed">
            Interquartile Range (IQR): <span className="font-mono text-[#F0EFED]">{data ? (data.p75 - data.p25).toFixed(1) : 0} {activeMetricObj.unit}</span>.
            Represents the middle 50% core operating band.
          </div>
        </div>
      </div>
    </div>
  );
};
