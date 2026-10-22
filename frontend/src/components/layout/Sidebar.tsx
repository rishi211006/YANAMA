import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Upload,
  Gauge,
  BarChart3,
  MapPin,
  TrendingUp,
  Zap,
  AlertTriangle,
  Wrench,
  Sparkles,
  IndianRupee,
  FileText,
  Car
} from 'lucide-react';

interface NavItem {
  name: string;
  path: string;
  icon: React.ElementType;
  badge?: string;
  isNew?: boolean;
}

const navSections: { title: string; items: NavItem[] }[] = [
  {
    title: 'Core Telemetry',
    items: [
      { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
      { name: 'CSV Upload & Parser', path: '/upload', icon: Upload },
      { name: 'Engine Performance', path: '/engine', icon: Gauge },
    ]
  },
  {
    title: 'AI Intelligence & Simulation',
    items: [
      { name: 'Statistical Engine', path: '/engine/statistics', icon: BarChart3, badge: 'AI STATS', isNew: true },
      { name: 'Trip Simulation', path: '/trip-simulator', icon: MapPin, badge: 'AI AGENT', isNew: true },
      { name: 'Mileage Analytics', path: '/mileage-analysis', icon: TrendingUp, badge: 'AI OPTIMIZER', isNew: true },
    ]
  },
  {
    title: 'Subsystems & Health',
    items: [
      { name: 'Electrical System', path: '/electrical', icon: Zap },
      { name: 'Diagnostics & Alerts', path: '/diagnostics', icon: AlertTriangle },
      { name: 'Maintenance Tracker', path: '/maintenance', icon: Wrench },
      { name: 'Recommendations', path: '/recommendations', icon: Sparkles },
    ]
  },
  {
    title: 'Management & Reports',
    items: [
      { name: 'Financial Analytics', path: '/financial', icon: IndianRupee },
      { name: 'Audit Reports (PDF/CSV)', path: '/reports', icon: FileText },
      { name: 'Vehicle Fleet', path: '/vehicles', icon: Car },
    ]
  }
];

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-[#000000] border-r border-[#3A3634] flex flex-col h-screen sticky top-0">
      {/* Brand Logo Header */}
      <div className="h-16 flex items-center px-6 border-b border-[#3A3634]">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#4C4643] border border-[#A5A78F]/40 flex items-center justify-center font-bold text-[#F0EFED] tracking-wider text-base shadow-inner">
            Y
          </div>
          <div>
            <span className="font-bold tracking-widest text-[#F0EFED] text-base font-mono">YANAMA</span>
            <span className="block text-[10px] text-[#A5A78F] font-sans tracking-tight uppercase -mt-0.5">
              Vehicle Intelligence
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Sections */}
      <nav className="flex-1 overflow-y-auto px-3.5 py-4 space-y-6">
        {navSections.map((section, idx) => (
          <div key={idx}>
            <div className="px-3 mb-2 text-[10px] font-mono uppercase tracking-wider text-[#A5A78F]/70 font-semibold">
              {section.title}
            </div>
            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition duration-150 ${
                        isActive
                          ? 'bg-[#4C4643] text-[#F0EFED] shadow-sm font-semibold border border-[#A5A78F]/30'
                          : 'text-[#A5A78F] hover:bg-[#1D1D1D] hover:text-[#F0EFED]'
                      }`
                    }
                  >
                    <div className="flex items-center space-x-2.5">
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      <span>{item.name}</span>
                    </div>
                    {item.badge && (
                      <span className="px-1.5 py-0.5 text-[9px] font-mono tracking-wider font-semibold rounded bg-[#A5A78F]/20 text-[#A5A78F] border border-[#A5A78F]/30">
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer System Status */}
      <div className="p-3.5 border-t border-[#3A3634] bg-[#1D1D1D]/50 text-xs">
        <div className="flex items-center justify-between text-[#A5A78F] text-[11px] font-mono">
          <span className="flex items-center">
            <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-ping" />
            OBD/CAN ENGINE
          </span>
          <span>v1.0.0</span>
        </div>
      </div>
    </aside>
  );
};
