import React, { useState, useEffect } from 'react';
import { useVehicle } from '../../context/VehicleContext';
import api from '../../services/api';
import { ElectricalSummary } from '../../types';
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
import { Zap, BatteryCharging, ShieldCheck, AlertCircle, Activity } from 'lucide-react';

export const ElectricalPage: React.FC = () => {
  const { selectedVehicle } = useVehicle();
  const [data, setData] = useState<ElectricalSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!selectedVehicle) return;
    const fetchElectrical = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/analytics/${selectedVehicle.id}/electrical`);
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchElectrical();
  }, [selectedVehicle]);

  if (!selectedVehicle) return <div className="text-center p-8 text-[#A5A78F]">No vehicle selected.</div>;
  if (loading || !data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-[#A5A78F] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const chartData = data.readings.map((r, i) => ({
    index: i + 1,
    batVolt: r.battery_voltage,
    altVolt: r.alternator_voltage,
    amps: r.current_draw_amps,
    soc: r.battery_soc_pct
  }));

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl bg-[#000000] border border-[#3A3634]">
        <div className="flex items-center space-x-2 text-xs font-mono text-[#A5A78F] mb-1">
          <span>ELECTRICAL SUBSYSTEM</span>
          <span>&bull;</span>
          <span>BATTERY & CHARGING SYSTEM</span>
        </div>
        <h1 className="text-2xl font-bold font-mono text-[#F0EFED]">Electrical Telemetry & Storage</h1>
        <p className="text-xs text-[#A5A78F] mt-1 max-w-2xl">
          Monitors 12V lead-acid/AGM open-circuit terminal potential, charging alternator voltage regulation, and parasitic parasitic draws.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-[#000000] border border-[#3A3634]">
          <span className="text-[11px] font-mono uppercase text-[#A5A78F]">Battery Health</span>
          <div className="text-2xl font-bold font-mono text-[#F0EFED] mt-1">{data.battery_health_pct}%</div>
          <div className="text-[10px] text-[#A5A78F] mt-1">Min V: {data.min_battery_voltage}V</div>
        </div>

        <div className="p-5 rounded-xl bg-[#000000] border border-[#3A3634]">
          <span className="text-[11px] font-mono uppercase text-[#A5A78F]">Alternator Status</span>
          <div className="text-sm font-bold font-mono text-emerald-400 mt-2 truncate">{data.alternator_status}</div>
          <div className="text-[10px] text-[#A5A78F] mt-1">Mean: {data.avg_alternator_voltage}V</div>
        </div>

        <div className="p-5 rounded-xl bg-[#000000] border border-[#3A3634]">
          <span className="text-[11px] font-mono uppercase text-[#A5A78F]">Mean Current Draw</span>
          <div className="text-2xl font-bold font-mono text-[#F0EFED] mt-1">{data.avg_current_draw} <span className="text-xs text-[#A5A78F]">A</span></div>
          <div className="text-[10px] text-[#A5A78F] mt-1">Electrical accessories load</div>
        </div>

        <div className="p-5 rounded-xl bg-[#000000] border border-[#3A3634]">
          <span className="text-[11px] font-mono uppercase text-[#A5A78F]">Voltage Stability</span>
          <div className="text-2xl font-bold font-mono text-[#F0EFED] mt-1">{data.voltage_stability_score} <span className="text-xs text-[#A5A78F]">/100</span></div>
          <div className="text-[10px] text-[#A5A78F] mt-1">Rectifier ripple index</div>
        </div>
      </div>

      {/* Voltage Chart */}
      <div className="p-6 rounded-2xl bg-[#000000] border border-[#3A3634]">
        <h3 className="text-sm font-semibold font-mono uppercase text-[#F0EFED] mb-3">
          Battery Voltage vs Alternator Output (V)
        </h3>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#3A3634" />
              <XAxis dataKey="index" stroke="#A5A78F" fontSize={11} tickLine={false} />
              <YAxis stroke="#A5A78F" fontSize={11} tickLine={false} domain={[11.0, 15.0]} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1D1D1D', borderColor: '#3A3634', borderRadius: '8px', fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', color: '#A5A78F' }} />
              <Line type="monotone" dataKey="altVolt" name="Alternator (V)" stroke="#38bdf8" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="batVolt" name="Battery (V)" stroke="#f59e0b" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
