import React, { useState, useEffect } from 'react';
import { useVehicle } from '../../context/VehicleContext';
import api from '../../services/api';
import { HealthScore, DiagnosticAlert, Recommendation, EngineSummary } from '../../types';
import { AIInsightBox } from '../../components/common/AIInsightBox';
import {
  Gauge,
  Zap,
  Wrench,
  AlertTriangle,
  TrendingUp,
  FileText,
  Upload,
  CheckCircle2,
  Clock,
  ChevronRight,
  ShieldAlert,
  ArrowUpRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const { selectedVehicle, viewMode } = useVehicle();
  const [health, setHealth] = useState<HealthScore | null>(null);
  const [alerts, setAlerts] = useState<DiagnosticAlert[]>([]);
  const [recs, setRecs] = useState<Recommendation[]>([]);
  const [engineSummary, setEngineSummary] = useState<EngineSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!selectedVehicle) return;
    const loadDashboard = async () => {
      setLoading(true);
      try {
        const [healthRes, alertsRes, recsRes, engineRes] = await Promise.all([
          api.get(`/analytics/${selectedVehicle.id}/health`),
          api.get(`/diagnostics/${selectedVehicle.id}/alerts`),
          api.get(`/recommendations/${selectedVehicle.id}`),
          api.get(`/analytics/${selectedVehicle.id}/engine`)
        ]);
        setHealth(healthRes.data);
        setAlerts(alertsRes.data.filter((a: DiagnosticAlert) => a.status === 'active'));
        setRecs(recsRes.data);
        setEngineSummary(engineRes.data);
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, [selectedVehicle]);

  if (loading || !selectedVehicle) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-[#A5A78F] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const score = health?.overall_score ?? 85;
  const grade = health?.grade ?? 'B';

  return (
    <div className="space-y-6">
      {/* Top Banner: Vehicle Snapshot & Actions */}
      <div className="p-6 rounded-2xl bg-[#000000] border border-[#3A3634] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-[#A5A78F]">
            <span>REGISTRATION</span>
            <span>&bull;</span>
            <span className="text-emerald-400 font-semibold">{selectedVehicle.fuel_type.toUpperCase()} POWERTRAIN</span>
          </div>
          <h1 className="text-2xl font-bold font-mono text-[#F0EFED] mt-0.5">
            {selectedVehicle.registration_number} &mdash; {selectedVehicle.manufacturer} {selectedVehicle.model}
          </h1>
          <p className="text-xs text-[#A5A78F] mt-1">
            Manufacturing Year: {selectedVehicle.year} | Engine: {selectedVehicle.engine_capacity_cc}cc | Odometer: {selectedVehicle.odometer_km.toLocaleString()} km
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            to="/upload"
            className="px-4 py-2 rounded-xl bg-[#4C4643] hover:bg-[#59524e] text-xs font-semibold text-[#F0EFED] border border-[#3A3634] transition flex items-center space-x-1.5"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload CSV</span>
          </Link>
          <a
            href={`/api/reports/${selectedVehicle.id}/pdf`}
            download
            className="px-4 py-2 rounded-xl bg-[#A5A78F] hover:bg-[#F0EFED] text-xs font-semibold text-[#1D1D1D] transition flex items-center space-x-1.5 shadow"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Download Audit PDF</span>
          </a>
        </div>
      </div>

      {/* Main Health Card + Subsystem Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Health Score Dial */}
        <div className="p-6 rounded-2xl bg-[#000000] border border-[#3A3634] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold font-mono uppercase tracking-wider text-[#A5A78F]">
              Overall Vehicle Health
            </h3>
            <span className={`px-2.5 py-0.5 rounded text-xs font-mono font-bold ${
              score >= 85 ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-700/50' :
              score >= 70 ? 'bg-amber-950/60 text-amber-300 border border-amber-700/50' :
              'bg-red-950/60 text-red-300 border border-red-700/50'
            }`}>
              GRADE {grade}
            </span>
          </div>

          <div className="my-6 flex items-center justify-center">
            <div className="relative w-44 h-44 flex items-center justify-center rounded-full border-8 border-[#3A3634] bg-[#1D1D1D]/50 shadow-inner">
              <div className="text-center">
                <span className="text-5xl font-black font-mono tracking-tight text-[#F0EFED]">{score.toFixed(0)}</span>
                <span className="text-xs text-[#A5A78F] block font-mono">/ 100</span>
                <span className="text-[11px] font-semibold text-[#A5A78F] uppercase tracking-wider block mt-1">
                  {health?.status || 'Good Condition'}
                </span>
              </div>
            </div>
          </div>

          <p className="text-xs text-[#A5A78F] leading-relaxed text-center font-sans">
            {health?.summary}
          </p>
        </div>

        {/* Subsystem Health Cards Grid (2 cols) */}
        <div className="lg:col-span-2 grid grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-[#000000] border border-[#3A3634] flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-lg bg-[#4C4643] flex items-center justify-center text-[#F0EFED]">
                <Gauge className="w-4 h-4" />
              </div>
              <span className="text-base font-bold font-mono text-[#F0EFED]">{health?.engine_score}%</span>
            </div>
            <div>
              <div className="text-xs font-semibold text-[#F0EFED] font-mono mt-3">Powertrain & Engine</div>
              <p className="text-[11px] text-[#A5A78F] mt-1">
                Avg Coolant: {engineSummary?.avg_coolant_temp ?? 88}°C | Max RPM: {engineSummary?.max_rpm ?? 3200}
              </p>
            </div>
            <Link to="/engine" className="text-[11px] font-medium text-[#A5A78F] hover:text-[#F0EFED] mt-3 inline-flex items-center">
              View Curves &rarr;
            </Link>
          </div>

          <div className="p-5 rounded-2xl bg-[#000000] border border-[#3A3634] flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-lg bg-[#4C4643] flex items-center justify-center text-[#F0EFED]">
                <Zap className="w-4 h-4" />
              </div>
              <span className="text-base font-bold font-mono text-[#F0EFED]">{health?.electrical_score}%</span>
            </div>
            <div>
              <div className="text-xs font-semibold text-[#F0EFED] font-mono mt-3">Electrical System</div>
              <p className="text-[11px] text-[#A5A78F] mt-1">
                12V Battery Health & Alternator Voltage Stability
              </p>
            </div>
            <Link to="/electrical" className="text-[11px] font-medium text-[#A5A78F] hover:text-[#F0EFED] mt-3 inline-flex items-center">
              Inspect Voltages &rarr;
            </Link>
          </div>

          <div className="p-5 rounded-2xl bg-[#000000] border border-[#3A3634] flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-lg bg-[#4C4643] flex items-center justify-center text-[#F0EFED]">
                <Wrench className="w-4 h-4" />
              </div>
              <span className="text-base font-bold font-mono text-[#F0EFED]">{health?.maintenance_score}%</span>
            </div>
            <div>
              <div className="text-xs font-semibold text-[#F0EFED] font-mono mt-3">Maintenance Compliance</div>
              <p className="text-[11px] text-[#A5A78F] mt-1">
                Interval tracking for engine oil, air filter, and brakes
              </p>
            </div>
            <Link to="/maintenance" className="text-[11px] font-medium text-[#A5A78F] hover:text-[#F0EFED] mt-3 inline-flex items-center">
              View Service Schedule &rarr;
            </Link>
          </div>

          <div className="p-5 rounded-2xl bg-[#000000] border border-[#3A3634] flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-lg bg-[#4C4643] flex items-center justify-center text-[#F0EFED]">
                <TrendingUp className="w-4 h-4" />
              </div>
              <span className="text-base font-bold font-mono text-[#F0EFED]">{health?.fuel_score}%</span>
            </div>
            <div>
              <div className="text-xs font-semibold text-[#F0EFED] font-mono mt-3">Fuel Economy Optimization</div>
              <p className="text-[11px] text-[#A5A78F] mt-1">
                AI factor attribution for drops and mileage recovery
              </p>
            </div>
            <Link to="/mileage-analysis" className="text-[11px] font-medium text-[#A5A78F] hover:text-[#F0EFED] mt-3 inline-flex items-center">
              Analyze Mileage &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* AI Intelligence Text Box Agent */}
      <AIInsightBox
        title="Vehicle Health Intelligence Agent"
        subtitle={`Synthesis for ${selectedVehicle.manufacturer} ${selectedVehicle.model} (${selectedVehicle.registration_number})`}
        ownerText={
          health?.overall_score && health.overall_score > 80
            ? "Your vehicle's primary subsystems are running harmoniously with healthy cooling margins and normal electrical output. Continue regular maintenance checks to sustain top efficiency."
            : "Attention is advised on your vehicle. Our rule-based diagnostic engine flagged elevated coolant temperatures or overdue service intervals. Addressing these items now will prevent higher maintenance expenses and improve daily mileage."
        }
        mechanicText={
          `TELEMETRY AUDIT: Health Score = ${health?.overall_score}/100. Powertrain stress index = ${health?.engine_score}%. ` +
          `Active diagnostic fault count = ${alerts.length}. Electrical health = ${health?.electrical_score}%. ` +
          `Review coolant loop pressure integrity and verify service log compliance.`
        }
      />

      {/* Active Diagnostic Alerts Section */}
      {alerts.length > 0 && (
        <div className="p-6 rounded-2xl bg-red-950/20 border border-red-800/40">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <ShieldAlert className="w-5 h-5 text-red-400" />
              <h3 className="text-sm font-bold font-mono text-[#F0EFED] uppercase">
                Active Diagnostic Alerts ({alerts.length})
              </h3>
            </div>
            <Link to="/diagnostics" className="text-xs text-[#A5A78F] hover:text-[#F0EFED]">
              Diagnostics Console &rarr;
            </Link>
          </div>

          <div className="space-y-3">
            {alerts.map((alert) => (
              <div key={alert.id} className="p-4 rounded-xl bg-[#000000]/80 border border-[#3A3634] flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-red-900/50 text-red-300 border border-red-700/50">
                      {alert.rule_code}
                    </span>
                    <span className="text-sm font-semibold text-[#F0EFED]">{alert.title}</span>
                  </div>
                  <p className="text-xs text-[#A5A78F] mt-1.5">
                    {viewMode === 'mechanic' ? alert.message_mechanic : alert.message_owner}
                  </p>
                </div>
                <Link
                  to="/diagnostics"
                  className="px-3 py-1.5 rounded-lg bg-[#4C4643] hover:bg-[#59524e] text-xs font-semibold text-[#F0EFED] whitespace-nowrap self-start md:self-auto"
                >
                  Inspect & Resolve
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Intelligent Recommendations */}
      <div className="p-6 rounded-2xl bg-[#000000] border border-[#3A3634]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold font-mono text-[#F0EFED] uppercase tracking-wider">
            Intelligent Priority Actions
          </h3>
          <Link to="/recommendations" className="text-xs text-[#A5A78F] hover:text-[#F0EFED]">
            View All ({recs.length}) &rarr;
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {recs.slice(0, 4).map((rec) => (
            <div key={rec.id} className="p-4 rounded-xl bg-[#1D1D1D] border border-[#3A3634] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded ${
                    rec.priority === 'high' ? 'bg-red-900/40 text-red-300 border border-red-700/50' : 'bg-amber-900/40 text-amber-300 border border-amber-700/50'
                  }`}>
                    {rec.priority} PRIORITY &bull; {rec.category}
                  </span>
                  <span className="text-xs font-mono font-semibold text-emerald-400">
                    Est. Savings: ₹{rec.estimated_savings.toLocaleString()}
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-[#F0EFED] font-mono">{rec.title}</h4>
                <p className="text-xs text-[#A5A78F] mt-1 leading-relaxed">
                  {viewMode === 'mechanic' ? rec.description_mechanic : rec.description_owner}
                </p>
              </div>
              <div className="mt-3 pt-2.5 border-t border-[#3A3634] flex items-center justify-between text-xs">
                <span className="text-[#A5A78F] font-mono text-[11px]">Action: {rec.action_needed}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
