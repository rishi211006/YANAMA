import React, { useState } from 'react';
import { Sparkles, Brain, Copy, Check, ChevronRight, ShieldCheck } from 'lucide-react';
import { useVehicle } from '../../context/VehicleContext';

interface AIInsightBoxProps {
  title?: string;
  ownerText: string;
  mechanicText: string;
  subtitle?: string;
  badge?: string;
  className?: string;
  onRefresh?: () => void;
}

export const AIInsightBox: React.FC<AIInsightBoxProps> = ({
  title = "AI Analytical Intelligence Agent",
  ownerText,
  mechanicText,
  subtitle,
  badge = "ACTIVE INFERENCE",
  className = "",
  onRefresh
}) => {
  const { viewMode, toggleViewMode } = useVehicle();
  const [copied, setCopied] = useState(false);

  const activeText = viewMode === 'mechanic' ? mechanicText : ownerText;

  const handleCopy = () => {
    navigator.clipboard.writeText(activeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`relative overflow-hidden rounded-xl bg-gradient-to-br from-[#1D1D1D] via-[#262423] to-[#1D1D1D] border border-[#A5A78F]/30 p-5 shadow-xl ${className}`}>
      {/* Decorative subtle ambient glow */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#A5A78F]/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#3A3634]">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#A5A78F]/15 border border-[#A5A78F]/40 text-[#A5A78F]">
            <Brain className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h4 className="text-sm font-semibold tracking-wide text-[#F0EFED] uppercase font-mono">
                {title}
              </h4>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono tracking-wider font-semibold bg-[#A5A78F]/20 text-[#A5A78F] border border-[#A5A78F]/30">
                <Sparkles className="w-2.5 h-2.5 mr-1" />
                {badge}
              </span>
            </div>
            {subtitle && (
              <p className="text-xs text-[#A5A78F] font-sans mt-0.5">{subtitle}</p>
            )}
          </div>
        </div>

        {/* View Mode Tag & Copy Action */}
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleViewMode}
            className="text-xs px-2.5 py-1 rounded bg-[#4C4643]/70 hover:bg-[#4C4643] text-[#F0EFED] border border-[#3A3634] transition flex items-center space-x-1"
            title="Switch between simplified owner language and technical mechanic analysis"
          >
            <span className="text-[#A5A78F]">Mode:</span>
            <span className="font-semibold capitalize text-[#F0EFED]">{viewMode} View</span>
          </button>
          
          <button
            onClick={handleCopy}
            className="p-1.5 rounded bg-[#4C4643]/50 hover:bg-[#4C4643] text-[#A5A78F] hover:text-[#F0EFED] border border-[#3A3634] transition"
            title="Copy AI analysis text"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Narrative Display */}
      <div className="mt-3.5">
        <div className="flex items-start space-x-2 text-xs text-[#A5A78F] font-mono mb-1.5">
          <ShieldCheck className="w-3.5 h-3.5 mt-0.5 text-[#A5A78F]" />
          <span>Automotive Intelligence Heuristic Synthesis ({viewMode.toUpperCase()})</span>
        </div>
        <p className="text-sm leading-relaxed text-[#F0EFED] font-normal tracking-wide">
          {activeText}
        </p>
      </div>

      {/* Footer Meta */}
      <div className="mt-4 pt-2.5 border-t border-[#3A3634]/60 flex items-center justify-between text-[11px] text-[#A5A78F]">
        <span>Context-aware inference based on verified vehicle telemetry</span>
        <button
          onClick={toggleViewMode}
          className="hover:text-[#F0EFED] transition inline-flex items-center font-medium"
        >
          {viewMode === 'owner' ? 'View Mechanic Technical Diagnostics' : 'View Simplified Owner Insights'}
          <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
        </button>
      </div>
    </div>
  );
};
