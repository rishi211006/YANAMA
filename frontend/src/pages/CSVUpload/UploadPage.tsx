import React, { useState, useEffect } from 'react';
import { useVehicle } from '../../context/VehicleContext';
import api from '../../services/api';
import { Upload, FileSpreadsheet, Download, CheckCircle2, AlertCircle, RefreshCw, FileText } from 'lucide-react';

const CATEGORIES = [
  { id: 'engine', label: 'Engine Performance Data', desc: 'RPM, Torque (Nm), Coolant Temp, Throttle, Load', file: 'engine_data.csv' },
  { id: 'fuel', label: 'Fuel Telemetry Data', desc: 'Fuel Rate (L/h), Speed, Fuel Level, Mileage (km/L)', file: 'fuel_data.csv' },
  { id: 'electrical', label: 'Electrical System Data', desc: 'Battery Voltage, Alternator Voltage, Current Draw, SoC', file: 'electrical_data.csv' },
  { id: 'maintenance', label: 'Maintenance Records', desc: 'Service Name, Odometer, Cost, Status, Notes', file: 'maintenance_data.csv' },
  { id: 'diagnostic', label: 'Diagnostic DTC / Alerts', desc: 'Rule Code, Component, Severity, Thresholds', file: 'diagnostic_data.csv' },
];

export const UploadPage: React.FC = () => {
  const { selectedVehicle } = useVehicle();
  const [selectedCategory, setSelectedCategory] = useState('engine');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<any[]>([]);

  const loadHistory = async () => {
    if (!selectedVehicle) return;
    try {
      const res = await api.get(`/uploads/${selectedVehicle.id}/history`);
      setHistory(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadHistory();
  }, [selectedVehicle]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
      setUploadResult(null);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !selectedVehicle) return;

    setUploading(true);
    setError(null);
    setUploadResult(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('file_type', selectedCategory);

    try {
      const res = await api.post(`/uploads/${selectedVehicle.id}/csv`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setUploadResult(res.data);
      setFile(null);
      loadHistory();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to parse and upload CSV.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#000000] border border-[#3A3634]">
        <div className="flex items-center space-x-2 text-xs font-mono text-[#A5A78F] mb-1">
          <span>DATA PIPELINE</span>
          <span>&bull;</span>
          <span>CSV INGESTION ENGINE</span>
        </div>
        <h1 className="text-2xl font-bold font-mono text-[#F0EFED]">Vehicle Telemetry CSV Upload</h1>
        <p className="text-xs text-[#A5A78F] mt-1 max-w-2xl">
          Upload hardware-generated CSV logs directly into the YANAMA intelligence pipeline. The engine validates column syntax, calculates derived metrics (such as HP and km/L), and evaluates rule-based diagnostics.
        </p>
      </div>

      {/* Main Upload Box & Template Downloads */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Form (2 cols) */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-[#000000] border border-[#3A3634]">
          <h3 className="text-sm font-semibold font-mono uppercase text-[#F0EFED] mb-4">
            1. Select Telemetry Category
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`p-3.5 rounded-xl border text-left transition flex flex-col justify-between ${
                  selectedCategory === cat.id
                    ? 'bg-[#4C4643] border-[#A5A78F] text-[#F0EFED] shadow-sm'
                    : 'bg-[#1D1D1D] border-[#3A3634] text-[#A5A78F] hover:border-[#4C4643]'
                }`}
              >
                <div className="font-mono text-xs font-semibold text-[#F0EFED]">{cat.label}</div>
                <div className="text-[11px] text-[#A5A78F] mt-1">{cat.desc}</div>
              </button>
            ))}
          </div>

          <h3 className="text-sm font-semibold font-mono uppercase text-[#F0EFED] mb-3">
            2. Choose CSV File
          </h3>

          <form onSubmit={handleUpload} className="space-y-4">
            <div className="border-2 border-dashed border-[#3A3634] hover:border-[#A5A78F] rounded-2xl p-8 text-center bg-[#1D1D1D]/50 transition cursor-pointer relative">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Upload className="w-10 h-10 text-[#A5A78F] mx-auto mb-3" />
              {file ? (
                <div>
                  <span className="font-mono text-sm font-semibold text-[#F0EFED] block">{file.name}</span>
                  <span className="text-xs text-[#A5A78F]">{(file.size / 1024).toFixed(1)} KB ready for processing</span>
                </div>
              ) : (
                <div>
                  <span className="font-semibold text-sm text-[#F0EFED] block">Click to select or drag CSV file here</span>
                  <span className="text-xs text-[#A5A78F] mt-1 block">Compatible with UTF-8 comma-separated automotive logs</span>
                </div>
              )}
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-950/40 border border-red-700/50 flex items-center space-x-2 text-xs text-red-300">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {uploadResult && (
              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-700/50 flex items-start space-x-3 text-xs text-emerald-300">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5 text-emerald-400" />
                <div>
                  <div className="font-semibold text-emerald-200">{uploadResult.message}</div>
                  <div className="mt-1 text-[11px] text-emerald-400">
                    Category: {uploadResult.file_type} &bull; Valid Rows: {uploadResult.valid_rows} &bull; Invalid: {uploadResult.invalid_rows}
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={!file || uploading}
              className="w-full py-3 rounded-xl bg-[#A5A78F] text-[#1D1D1D] font-bold text-xs uppercase tracking-wider hover:bg-[#F0EFED] transition flex items-center justify-center space-x-2 disabled:opacity-40"
            >
              <span>{uploading ? 'Processing Telemetry...' : 'Process & Ingest CSV Data'}</span>
              <FileSpreadsheet className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Template Downloads & Pre-Packaged Demo Datasets */}
        <div className="p-6 rounded-2xl bg-[#000000] border border-[#3A3634] flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold font-mono uppercase text-[#F0EFED] mb-2">
              Official CSV Templates
            </h3>
            <p className="text-xs text-[#A5A78F] mb-4">
              Download pre-configured CSV templates formatted with required and optional automotive headers.
            </p>

            <div className="space-y-2.5">
              {CATEGORIES.map((cat) => (
                <a
                  key={cat.id}
                  href={`/api/templates/${cat.id}`}
                  download
                  className="p-3 rounded-xl bg-[#1D1D1D] hover:bg-[#4C4643] border border-[#3A3634] flex items-center justify-between text-xs transition group"
                >
                  <div className="flex items-center space-x-2.5">
                    <FileText className="w-4 h-4 text-[#A5A78F] group-hover:text-[#F0EFED]" />
                    <span className="font-mono text-[#F0EFED]">{cat.file}</span>
                  </div>
                  <Download className="w-3.5 h-3.5 text-[#A5A78F]" />
                </a>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#3A3634] text-[11px] text-[#A5A78F]">
            Tip: You can find pre-generated sample data for testing in <code className="text-[#F0EFED] font-mono">/sample_data/petrol</code> and <code className="text-[#F0EFED] font-mono">/sample_data/diesel</code>.
          </div>
        </div>
      </div>

      {/* Upload History Table */}
      <div className="p-6 rounded-2xl bg-[#000000] border border-[#3A3634]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold font-mono uppercase text-[#F0EFED]">
            Telemetry Ingestion Audit History
          </h3>
          <button onClick={loadHistory} className="text-xs text-[#A5A78F] hover:text-[#F0EFED] flex items-center space-x-1">
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
        </div>

        {history.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#1D1D1D] text-[#A5A78F] font-mono uppercase">
                <tr>
                  <th className="py-2.5 px-3">File Name</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Valid Rows</th>
                  <th className="py-2.5 px-3">Invalid</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Uploaded At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#3A3634]">
                {history.map((h) => (
                  <tr key={h.id} className="hover:bg-[#1D1D1D]/50 transition font-mono">
                    <td className="py-2.5 px-3 font-semibold text-[#F0EFED]">{h.file_name}</td>
                    <td className="py-2.5 px-3 uppercase text-[#A5A78F]">{h.file_type}</td>
                    <td className="py-2.5 px-3 text-emerald-400">{h.valid_rows}</td>
                    <td className="py-2.5 px-3 text-[#A5A78F]">{h.invalid_rows}</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950/60 text-emerald-300 border border-emerald-700/50">
                        {h.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-[#A5A78F]">
                      {new Date(h.uploaded_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-xs text-[#A5A78F] font-mono">No telemetry files uploaded yet for this vehicle.</p>
        )}
      </div>
    </div>
  );
};
