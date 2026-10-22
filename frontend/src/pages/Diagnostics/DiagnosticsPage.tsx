import React, { useState, useEffect } from 'react';
import { useVehicle } from '../../context/VehicleContext';
import api from '../../services/api';
import { DiagnosticAlert } from '../../types';
import { ShieldAlert, CheckCircle, AlertTriangle, Info, BookOpen, X, RefreshCw } from 'lucide-react';

export const DiagnosticsPage: React.FC = () => {
  const { selectedVehicle, viewMode } = useVehicle();
  const [alerts, setAlerts] = useState<DiagnosticAlert[]>([]);
  const [rules, setRules] = useState<any[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'resolved'>('all');
  const [rulesModal, setRulesModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadAlerts = async () => {
    if (!selectedVehicle) return;
    setLoading(true);
    try {
      const [alertRes, ruleRes] = await Promise.all([
        api.get(`/diagnostics/${selectedVehicle.id}/alerts`),
        api.get('/diagnostics/rules')
      ]);
      setAlerts(alertRes.data);
      setRules(ruleRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlerts();
  }, [selectedVehicle]);

  const handleResolve = async (alertId: number) => {
    if (!selectedVehicle) return;
    try {
      await api.post(`/diagnostics/${selectedVehicle.id}/alerts/${alertId}/resolve`);
      loadAlerts();
    } catch (err) {
      console.error(err);
    }
  };

  if (!selectedVehicle) return <div className="text-center p-8 text-[#A5A78F]">No vehicle selected.</div>;

  const filteredAlerts = alerts.filter((a) => {
    if (filter === 'active') return a.status === 'active';
    if (filter === 'resolved') return a.status === 'resolved';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#000000] border border-[#3A3634] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-[#A5A78F] mb-1">
            <span>RULE-BASED INTELLIGENCE</span>
            <span>&bull;</span>
            <span>FAULT ISOLATION MATRIX</span>
          </div>
          <h1 className="text-2xl font-bold font-mono text-[#F0EFED]">Vehicle Diagnostics & Fault Alerts</h1>
          <p className="text-xs text-[#A5A78F] mt-1 max-w-2xl">
            Real-time threshold evaluation across powertrain and electrical subsystems. Provides non-technical explanations for car owners and engineering telemetry details for mechanics.
          </p>
        </div>

        <div className="flex items-center space-x-3 self-start md:self-auto">
          <button
            onClick={() => setRulesModal(true)}
            className="px-4 py-2 rounded-xl bg-[#4C4643] hover:bg-[#59524e] text-xs font-semibold text-[#F0EFED] border border-[#3A3634] transition flex items-center space-x-1.5"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Rules Catalog ({rules.length})</span>
          </button>
          <button
            onClick={loadAlerts}
            className="p-2 rounded-xl bg-[#4C4643] hover:bg-[#59524e] text-[#F0EFED] border border-[#3A3634] transition"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 p-1.5 rounded-xl bg-[#000000] border border-[#3A3634] w-fit">
        {(['all', 'active', 'resolved'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase font-semibold transition ${
              filter === tab ? 'bg-[#4C4643] text-[#F0EFED] shadow' : 'text-[#A5A78F] hover:text-[#F0EFED]'
            }`}
          >
            {tab} Alerts ({tab === 'all' ? alerts.length : alerts.filter((a) => a.status === tab).length})
          </button>
        ))}
      </div>

      {/* Alerts Feed */}
      <div className="space-y-4">
        {filteredAlerts.length > 0 ? (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-5 rounded-2xl bg-[#000000] border transition ${
                alert.status === 'resolved'
                  ? 'border-[#3A3634] opacity-70'
                  : alert.severity === 'critical'
                  ? 'border-red-800/60 bg-red-950/10'
                  : 'border-amber-800/60 bg-amber-950/10'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-start space-x-3">
                  <div className="mt-1">
                    {alert.severity === 'critical' ? (
                      <ShieldAlert className="w-5 h-5 text-red-400" />
                    ) : alert.severity === 'warning' ? (
                      <AlertTriangle className="w-5 h-5 text-amber-400" />
                    ) : (
                      <Info className="w-5 h-5 text-blue-400" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#1D1D1D] text-[#F0EFED] border border-[#3A3634]">
                        {alert.rule_code}
                      </span>
                      <span className="text-sm font-bold font-mono text-[#F0EFED]">{alert.title}</span>
                      <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                        alert.status === 'active' ? 'bg-red-950 text-red-300' : 'bg-emerald-950 text-emerald-300'
                      }`}>
                        {alert.status}
                      </span>
                    </div>
                    <div className="text-[11px] font-mono text-[#A5A78F] mt-1">
                      Component: {alert.component} &bull; Logged: {new Date(alert.timestamp).toLocaleString()}
                    </div>
                  </div>
                </div>

                {alert.status === 'active' && (
                  <button
                    onClick={() => handleResolve(alert.id)}
                    className="px-3.5 py-1.5 rounded-lg bg-[#4C4643] hover:bg-[#59524e] text-xs font-mono font-semibold text-[#F0EFED] border border-[#3A3634] transition flex items-center space-x-1.5 self-start md:self-auto"
                  >
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Mark as Resolved</span>
                  </button>
                )}
              </div>

              {/* Explanations by View Mode */}
              <div className="mt-4 pt-3 border-t border-[#3A3634] grid md:grid-cols-2 gap-4 text-xs">
                <div className={`p-3 rounded-xl ${viewMode === 'owner' ? 'bg-[#1D1D1D] border border-[#A5A78F]/40' : 'bg-[#1D1D1D]/50 border border-[#3A3634]'}`}>
                  <span className="text-[10px] font-mono uppercase text-[#A5A78F] block mb-1">
                    Car Owner Explanation:
                  </span>
                  <p className="text-[#F0EFED] leading-relaxed">{alert.message_owner}</p>
                </div>

                <div className={`p-3 rounded-xl ${viewMode === 'mechanic' ? 'bg-[#1D1D1D] border border-[#A5A78F]/40' : 'bg-[#1D1D1D]/50 border border-[#3A3634]'}`}>
                  <span className="text-[10px] font-mono uppercase text-[#A5A78F] block mb-1">
                    Mechanic Technical Diagnostic:
                  </span>
                  <p className="text-[#F0EFED] font-mono leading-relaxed text-[11px]">{alert.message_mechanic}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 rounded-2xl bg-[#000000] border border-[#3A3634] text-center text-xs text-[#A5A78F] font-mono">
            No diagnostic alerts match this filter.
          </div>
        )}
      </div>

      {/* Rules Catalog Modal */}
      {rulesModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-[#000000] border border-[#3A3634] rounded-2xl shadow-2xl p-6 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-[#3A3634] mb-4">
              <h3 className="text-sm font-bold font-mono uppercase text-[#F0EFED]">
                Active Diagnostic Rules Catalog
              </h3>
              <button onClick={() => setRulesModal(false)} className="text-[#A5A78F] hover:text-[#F0EFED]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 overflow-y-auto pr-1">
              {rules.map((rule, i) => (
                <div key={i} className="p-3.5 rounded-xl bg-[#1D1D1D] border border-[#3A3634] text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono font-bold text-[#F0EFED]">{rule.code}: {rule.name}</span>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-red-950 text-red-300 font-bold">
                      {rule.severity}
                    </span>
                  </div>
                  <div className="text-[11px] font-mono text-[#A5A78F]">
                    Component: {rule.component} &bull; Threshold: {rule.operator} {rule.threshold} {rule.unit}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
