import React, { useState, useEffect } from 'react';
import { useVehicle } from '../../context/VehicleContext';
import api from '../../services/api';
import { EngineSummary } from '../../types';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import { Gauge, Flame, Zap, Activity, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

export const EngineAnalyticsPage: React.FC = () => {
  const { selectedVehicle, viewMode } = useVehicle();
  const [data, setData] = useState<EngineSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!selectedVehicle) return;
    const fetchEngineData = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/analytics/${selectedVehicle.id}/engine`);
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEngineData();
  }, [selectedVehicle]);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-[#A5A78F] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Format readings for charts
  const chartData = data.readings.map((r, i) => ({
    index: i + 1,
    rpm: r.rpm,
    torque: r.torque_nm,
    hp: r.horsepower,
    coolant: r.coolant_temp_c,
    engineTemp: r.engine_temp_c,
    load: r.engine_load_pct,
    throttle: r.throttle_pos_pct,
    speed: r.speed_kmph
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#000000] border border-[#3A3634] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-[#A5A78F] mb-1">
            <span>POWERTRAIN TELEMETRY</span>
            <span>&bull;</span>
            <span>ENGINE PERFORMANCE MONITOR</span>
          </div>
          <h1 className="text-2xl font-bold font-mono text-[#F0EFED]">Engine Dynamic Telemetry</h1>
          <p className="text-xs text-[#A5A78F] mt-1">
            Continuous evaluation of Torque (Nm), Power (HP), RPM sweep, and thermal dissipation margins.
          </p>
        </div>

        <Link
          to="/engine/statistics"
          className="px-4 py-2.5 rounded-xl bg-[#A5A78F] text-[#1D1D1D] font-bold text-xs uppercase tracking-wider hover:bg-[#F0EFED] transition flex items-center space-x-2 shadow self-start md:self-auto"
        >
          <span>Open Statistical Engine</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#1D1D1D] text-[#F0EFED] font-mono">NEW AI</span>
        </Link>
      </div>

      {/* KPI Tiles */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="p-4 rounded-xl bg-[#000000] border border-[#3A3634]">
          <span className="text-[11px] font-mono uppercase text-[#A5A78F]">Peak Torque</span>
          <div className="text-xl font-bold font-mono text-[#F0EFED] mt-1">{data.max_torque} <span className="text-xs text-[#A5A78F]">Nm</span></div>
          <div className="text-[10px] text-[#A5A78F] mt-0.5">Mean: {data.avg_torque} Nm</div>
        </div>

        <div className="p-4 rounded-xl bg-[#000000] border border-[#3A3634]">
          <span className="text-[11px] font-mono uppercase text-[#A5A78F]">Max Power</span>
          <div className="text-xl font-bold font-mono text-[#F0EFED] mt-1">{data.max_horsepower} <span className="text-xs text-[#A5A78F]">HP</span></div>
          <div className="text-[10px] text-[#A5A78F] mt-0.5">Mean: {data.avg_horsepower} HP</div>
        </div>

        <div className="p-4 rounded-xl bg-[#000000] border border-[#3A3634]">
          <span className="text-[11px] font-mono uppercase text-[#A5A78F]">Max RPM</span>
          <div className="text-xl font-bold font-mono text-[#F0EFED] mt-1">{data.max_rpm} <span className="text-xs text-[#A5A78F]">RPM</span></div>
          <div className="text-[10px] text-[#A5A78F] mt-0.5">Mean: {data.avg_rpm} RPM</div>
        </div>

        <div className="p-4 rounded-xl bg-[#000000] border border-[#3A3634]">
          <span className="text-[11px] font-mono uppercase text-[#A5A78F]">Max Coolant</span>
          <div className="text-xl font-bold font-mono text-[#F0EFED] mt-1">{data.max_coolant_temp} <span className="text-xs text-[#A5A78F]">°C</span></div>
          <div className="text-[10px] text-[#A5A78F] mt-0.5">Mean: {data.avg_coolant_temp} °C</div>
        </div>

        <div className="p-4 rounded-xl bg-[#000000] border border-[#3A3634]">
          <span className="text-[11px] font-mono uppercase text-[#A5A78F]">Thermal Alerts</span>
          <div className={`text-xl font-bold font-mono mt-1 ${data.thermal_stress_events > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
            {data.thermal_stress_events} <span className="text-xs">events</span>
          </div>
          <div className="text-[10px] text-[#A5A78F] mt-0.5">&gt;102°C threshold</div>
        </div>
      </div>

      {/* Chart 1: Torque & Horsepower Delivery Curves */}
      <div className="p-6 rounded-2xl bg-[#000000] border border-[#3A3634]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold font-mono uppercase text-[#F0EFED]">
              Torque (Nm) & Horsepower (HP) Delivery Profile
            </h3>
            <p className="text-xs text-[#A5A78F] mt-0.5">
              Derived HP calculated as (Torque &times; RPM) / 7120.7
            </p>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="torqueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#A5A78F" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#A5A78F" stopOpacity={0.0}/>
                </linearGradient>
                <linearGradient id="hpGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F0EFED" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#F0EFED" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#3A3634" />
              <XAxis dataKey="index" stroke="#A5A78F" fontSize={11} tickLine={false} />
              <YAxis stroke="#A5A78F" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1D1D1D', borderColor: '#3A3634', borderRadius: '8px', fontSize: '12px' }}
                labelStyle={{ color: '#F0EFED', fontFamily: 'monospace' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', color: '#A5A78F' }} />
              <Area type="monotone" dataKey="torque" name="Torque (Nm)" stroke="#A5A78F" fillOpacity={1} fill="url(#torqueGrad)" strokeWidth={2} />
              <Area type="monotone" dataKey="hp" name="Horsepower (HP)" stroke="#F0EFED" fillOpacity={1} fill="url(#hpGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2 & 3: RPM Sweep and Thermal Delta */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* RPM Sweep */}
        <div className="p-6 rounded-2xl bg-[#000000] border border-[#3A3634]">
          <h3 className="text-sm font-semibold font-mono uppercase text-[#F0EFED] mb-3">
            Engine Revolutions (RPM) Sequence
          </h3>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#3A3634" />
                <XAxis dataKey="index" stroke="#A5A78F" fontSize={11} tickLine={false} />
                <YAxis stroke="#A5A78F" fontSize={11} tickLine={false} domain={[1000, 'auto']} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1D1D1D', borderColor: '#3A3634', borderRadius: '8px', fontSize: '12px' }}
                />
                <Line type="monotone" dataKey="rpm" name="Engine RPM" stroke="#f59e0b" dot={false} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Thermal Delta */}
        <div className="p-6 rounded-2xl bg-[#000000] border border-[#3A3634]">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold font-mono uppercase text-[#F0EFED]">
              Thermal Dynamics (°C)
            </h3>
            <span className="text-[10px] font-mono text-[#A5A78F]">Redline Threshold: 102°C</span>
          </div>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#3A3634" />
                <XAxis dataKey="index" stroke="#A5A78F" fontSize={11} tickLine={false} />
                <YAxis stroke="#A5A78F" fontSize={11} tickLine={false} domain={[70, 115]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1D1D1D', borderColor: '#3A3634', borderRadius: '8px', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', color: '#A5A78F' }} />
                <Line type="monotone" dataKey="coolant" name="Coolant Temp (°C)" stroke="#ef4444" dot={false} strokeWidth={2} />
                <Line type="monotone" dataKey="engineTemp" name="Engine Temp (°C)" stroke="#A5A78F" dot={false} strokeWidth={1.5} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
