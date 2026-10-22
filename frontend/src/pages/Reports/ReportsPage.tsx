import React, { useState, useEffect } from 'react';
import { useVehicle } from '../../context/VehicleContext';
import api from '../../services/api';
import { FileText, Download, FileSpreadsheet, ShieldCheck, CheckCircle2, History } from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const { selectedVehicle } = useVehicle();
  const [history, setHistory] = useState<any[]>([]);
  const [downloading, setDownloading] = useState<string | null>(null);

  const loadHistory = async () => {
    if (!selectedVehicle) return;
    try {
      const res = await api.get(`/reports/${selectedVehicle.id}/history`);
      setHistory(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadHistory();
  }, [selectedVehicle]);

  const handleDownloadPdf = () => {
    if (!selectedVehicle) return;
    setDownloading('pdf');
    window.location.href = `/api/reports/${selectedVehicle.id}/pdf`;
    setTimeout(() => {
      setDownloading(null);
      loadHistory();
    }, 2000);
  };

  const handleDownloadCsv = (type: string) => {
    if (!selectedVehicle) return;
    setDownloading(type);
    window.location.href = `/api/reports/${selectedVehicle.id}/csv/${type}`;
    setTimeout(() => {
      setDownloading(null);
    }, 1500);
  };

  if (!selectedVehicle) return <div className="text-center p-8 text-[#A5A78F]">No vehicle selected.</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#000000] border border-[#3A3634]">
        <div className="flex items-center space-x-2 text-xs font-mono text-[#A5A78F] mb-1">
          <span>VEHICLE AUDIT EXPORTS</span>
          <span>&bull;</span>
          <span>REPORT GENERATION</span>
        </div>
        <h1 className="text-2xl font-bold font-mono text-[#F0EFED]">Vehicle Reports & Dataset Exports</h1>
        <p className="text-xs text-[#A5A78F] mt-1 max-w-2xl">
          Generate comprehensive PDF vehicle audit reports or export raw and processed telemetry datasets for offline engineering analysis.
        </p>
      </div>

      {/* Main Report Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* PDF Health Report Card */}
        <div className="p-6 rounded-2xl bg-[#000000] border border-[#3A3634] flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-xl bg-[#4C4643] flex items-center justify-center text-[#F0EFED] mb-4">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold font-mono text-[#F0EFED]">
              Official PDF Vehicle Health & Diagnostic Audit
            </h3>
            <p className="text-xs text-[#A5A78F] mt-2 leading-relaxed">
              Produces a publication-ready automotive audit document formatted with vehicle metadata, overall health score grade, active diagnostic fault codes, and prioritized maintenance recommendations.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-[#3A3634]">
            <button
              onClick={handleDownloadPdf}
              disabled={downloading === 'pdf'}
              className="w-full py-3 rounded-xl bg-[#A5A78F] text-[#1D1D1D] font-bold text-xs uppercase tracking-wider hover:bg-[#F0EFED] transition flex items-center justify-center space-x-2 shadow"
            >
              <Download className="w-4 h-4" />
              <span>{downloading === 'pdf' ? 'Generating PDF Document...' : 'Generate & Download PDF Audit'}</span>
            </button>
          </div>
        </div>

        {/* CSV Telemetry Exports */}
        <div className="p-6 rounded-2xl bg-[#000000] border border-[#3A3634] flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-xl bg-[#4C4643] flex items-center justify-center text-[#F0EFED] mb-4">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold font-mono text-[#F0EFED]">
              Processed Telemetry Datasets (CSV)
            </h3>
            <p className="text-xs text-[#A5A78F] mt-2 leading-relaxed">
              Export parsed and derived OBD/CAN telemetry for workshop diagnostics, spreadsheet analysis, or external research tools.
            </p>

            <div className="grid grid-cols-2 gap-2 mt-4">
              {[
                { id: 'engine', label: 'Engine Telemetry' },
                { id: 'fuel', label: 'Fuel & Mileage' },
                { id: 'electrical', label: 'Electrical Voltages' },
                { id: 'maintenance', label: 'Maintenance Log' },
              ].map((exp) => (
                <button
                  key={exp.id}
                  onClick={() => handleDownloadCsv(exp.id)}
                  disabled={downloading === exp.id}
                  className="p-2.5 rounded-lg bg-[#1D1D1D] hover:bg-[#4C4643] border border-[#3A3634] text-xs font-mono text-left transition flex items-center justify-between"
                >
                  <span className="text-[#F0EFED]">{exp.label}</span>
                  <Download className="w-3.5 h-3.5 text-[#A5A78F]" />
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#3A3634] text-[11px] font-mono text-[#A5A78F]">
            Format: Standard RFC 4180 CSV with UTF-8 character encoding.
          </div>
        </div>
      </div>

      {/* Generated Reports History */}
      <div className="p-6 rounded-2xl bg-[#000000] border border-[#3A3634]">
        <h3 className="text-sm font-semibold font-mono uppercase text-[#F0EFED] mb-4">
          Generated Document History
        </h3>

        {history.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#1D1D1D] text-[#A5A78F] font-mono uppercase">
                <tr>
                  <th className="py-2.5 px-3">Document Title</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">File Size</th>
                  <th className="py-2.5 px-3">Generated Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#3A3634]">
                {history.map((doc) => (
                  <tr key={doc.id} className="hover:bg-[#1D1D1D]/50 transition font-mono">
                    <td className="py-2.5 px-3 font-semibold text-[#F0EFED]">{doc.title}</td>
                    <td className="py-2.5 px-3 uppercase text-emerald-400">{doc.report_type}</td>
                    <td className="py-2.5 px-3 text-[#A5A78F]">{doc.file_size_kb} KB</td>
                    <td className="py-2.5 px-3 text-[#A5A78F]">{new Date(doc.generated_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-xs text-[#A5A78F] font-mono">No reports generated yet for this vehicle.</p>
        )}
      </div>
    </div>
  );
};
