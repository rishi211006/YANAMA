import React from 'react';
import { Link } from 'react-router-dom';
import {
  Gauge,
  BarChart3,
  MapPin,
  TrendingUp,
  Cpu,
  ShieldCheck,
  FileSpreadsheet,
  ArrowRight,
  CheckCircle2,
  Car
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#1D1D1D] text-[#F0EFED] selection:bg-[#A5A78F] selection:text-[#1D1D1D]">
      {/* Navigation */}
      <header className="border-b border-[#3A3634] bg-[#000000]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-[#4C4643] border border-[#A5A78F]/40 flex items-center justify-center font-bold text-lg font-mono">
              Y
            </div>
            <div>
              <span className="font-bold tracking-widest text-lg font-mono text-[#F0EFED]">YANAMA</span>
              <span className="hidden sm:inline-block text-xs text-[#A5A78F] ml-2 font-mono">
                Vehicle Intelligence & Analytics
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              to="/login"
              className="text-sm px-4 py-2 rounded-lg text-[#F0EFED] hover:bg-[#4C4643] transition border border-transparent hover:border-[#3A3634]"
            >
              Sign In
            </Link>
            <Link
              to="/login"
              className="text-sm px-4 py-2 rounded-lg bg-[#A5A78F] text-[#1D1D1D] font-semibold hover:bg-[#F0EFED] transition shadow-lg flex items-center space-x-1.5"
            >
              <span>Launch Console</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-24 border-b border-[#3A3634]">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#4C4643]/60 border border-[#A5A78F]/40 text-xs text-[#F0EFED] font-mono mb-8">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>OBD / CAN TELEMETRY ANALYTICS PLATFORM</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-[#F0EFED] max-w-4xl mx-auto leading-tight font-sans">
            Understand Your Vehicle. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F0EFED] via-[#A5A78F] to-[#F9F8F3]">
              Drive with Absolute Confidence.
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-[#A5A78F] max-w-2xl mx-auto leading-relaxed">
            YANAMA analyzes real-world vehicle data uploaded from onboard hardware.
            Get instant health scoring, rule-based diagnostics, trip simulation, and AI-guided efficiency improvements.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              to="/login"
              className="px-6 py-3.5 rounded-xl bg-[#A5A78F] text-[#1D1D1D] font-bold text-sm hover:bg-[#F0EFED] transition shadow-xl flex items-center space-x-2"
            >
              <span>Explore Interactive Demo</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#architecture"
              className="px-6 py-3.5 rounded-xl bg-[#4C4643] text-[#F0EFED] font-semibold text-sm hover:bg-[#59524e] border border-[#3A3634] transition"
            >
              View System Architecture
            </a>
          </div>

          {/* Quick Stats Pill */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[
              { label: 'Supported Fuels', val: 'Petrol & Diesel' },
              { label: 'Telemetry Channels', val: 'OBD, Fuel, Electric' },
              { label: 'Intelligence Engine', val: 'Rules + Statistical AI' },
              { label: 'Hardware Live Dependency', val: '0% (CSV-First)' },
            ].map((stat, i) => (
              <div key={i} className="p-4 rounded-xl bg-[#000000]/60 border border-[#3A3634] text-center">
                <div className="text-lg font-bold font-mono text-[#F0EFED]">{stat.val}</div>
                <div className="text-xs text-[#A5A78F] mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Capabilities */}
      <section className="py-20 border-b border-[#3A3634] bg-[#1D1D1D]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-mono uppercase tracking-widest text-[#A5A78F]">ENGINEERING DEPTH</span>
            <h2 className="text-3xl font-bold text-[#F0EFED] mt-2 font-mono">Platform Capabilities</h2>
            <p className="text-sm text-[#A5A78F] mt-3">
              Purpose-built for both everyday car owners wanting peace of mind and trainee mechanics needing raw parametric scrutiny.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-[#000000] border border-[#3A3634] hover:border-[#A5A78F]/50 transition">
              <div className="w-10 h-10 rounded-xl bg-[#4C4643] flex items-center justify-center text-[#F0EFED] mb-4">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#F0EFED] font-mono">Statistical Engine Intelligence</h3>
              <p className="text-xs text-[#A5A78F] mt-2 leading-relaxed">
                Distribution histograms, P25-P95 percentiles, linear regression slope, and real-time AI textual agent synthesis for each telemetry metric.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#000000] border border-[#3A3634] hover:border-[#A5A78F]/50 transition">
              <div className="w-10 h-10 rounded-xl bg-[#4C4643] flex items-center justify-center text-[#F0EFED] mb-4">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#F0EFED] font-mono">Trip Simulation & Pre-Trip Audit</h3>
              <p className="text-xs text-[#A5A78F] mt-2 leading-relaxed">
                Simulate trip feasibility across Highway, City, and Mountain terrains under varying loads. Side-by-side comparison of current vs serviced condition.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#000000] border border-[#3A3634] hover:border-[#A5A78F]/50 transition">
              <div className="w-10 h-10 rounded-xl bg-[#4C4643] flex items-center justify-center text-[#F0EFED] mb-4">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#F0EFED] font-mono">Mileage Analytics & Recovery</h3>
              <p className="text-xs text-[#A5A78F] mt-2 leading-relaxed">
                Attribution vectors for fuel economy drops (throttle aggression, overdue oil drag, thermal loss) with prioritized AI steps to regain +3.5 km/L.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Architecture & CSV Workflow */}
      <section id="architecture" className="py-20 border-b border-[#3A3634] bg-[#000000]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-mono uppercase tracking-widest text-[#A5A78F]">INDEPENDENT DATA PIPELINE</span>
            <h2 className="text-3xl font-bold text-[#F0EFED] mt-2 font-mono">How YANAMA Works</h2>
            <p className="text-sm text-[#A5A78F] mt-3">
              No continuous hardware tethering needed. Simply export CSV logs from your vehicle logger and upload.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Collect Data', desc: 'Hardware logs engine, fuel, and electrical parameters to a standard micro-SD or mobile cache.' },
              { step: '02', title: 'Upload CSV', desc: 'Secure web interface parses and validates raw telemetry with automatic column mapping.' },
              { step: '03', title: 'Compute & Score', desc: 'Rule-based diagnostics and statistical models compute health scores and identify active anomalies.' },
              { step: '04', title: 'Act & Save', desc: 'Receive owner-friendly advice or technical mechanic reports, along with downloadable audit PDFs.' }
            ].map((s, i) => (
              <div key={i} className="p-5 rounded-xl bg-[#1D1D1D] border border-[#3A3634]">
                <div className="text-2xl font-black font-mono text-[#A5A78F]">{s.step}</div>
                <h4 className="text-sm font-bold text-[#F0EFED] mt-2 font-mono">{s.title}</h4>
                <p className="text-xs text-[#A5A78F] mt-2 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-[#000000] border-t border-[#3A3634] text-xs text-[#A5A78F]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-[#F0EFED] font-mono">YANAMA</span>
            <span>&mdash; Full-Stack Automotive Intelligence and Analytics Platform</span>
          </div>
          <div className="flex items-center space-x-6">
            <Link to="/login" className="hover:text-[#F0EFED] transition">Console Login</Link>
            <span>&bull;</span>
            <span>Petrol & Diesel Architecture v1.0.0</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
