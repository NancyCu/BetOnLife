import React, { useRef, useEffect } from 'react';
import { Heart, UtensilsCrossed, AlertTriangle } from 'lucide-react';

interface ArteryVisualizerProps {
  value: number; // 0 to 100
  onChange: (val: number) => void;
}

export const ArteryVisualizer: React.FC<ArteryVisualizerProps> = ({ value, onChange }) => {
  const sliderRef = useRef<HTMLInputElement>(null);

  // Determine styles based on value
  const isHealthy = value < 50;
  const plaqueOpacity = Math.max(0, (value - 20) / 80); // Plaque starts showing at 20%
  const bloodFlowWidth = Math.max(2, 100 - value); // Blood flow constricts
  
  // Color interpolation for the track background
  // Green (Healthy) -> Yellow/Orange -> Red (Blocked)
  const getGradient = () => {
    if (value < 30) return `linear-gradient(90deg, #00e676, #ec4899)`;
    if (value < 70) return `linear-gradient(90deg, #ec4899, #facc15)`;
    return `linear-gradient(90deg, #facc15, #ef4444)`;
  };

  return (
    <div className="w-full p-4 relative select-none">
      <div className="flex justify-between mb-2 font-bold text-xs tracking-widest">
        <span className={`${value < 50 ? 'text-[#00e676]' : 'text-slate-500'} transition-colors flex items-center gap-1`}>
          <Heart className="w-3 h-3" /> TEAM RABBIT FOOD
        </span>
        <span className={`${value >= 50 ? 'text-[#ef4444]' : 'text-slate-500'} transition-colors flex items-center gap-1`}>
          TEAM TALLOW <UtensilsCrossed className="w-3 h-3" />
        </span>
      </div>

      {/* The Visual Container */}
      <div className="relative h-24 w-full rounded-2xl overflow-hidden bg-black/40 border border-slate-700 shadow-inner">
        
        {/* Animated Background Pulse */}
        <div className={`absolute inset-0 bg-red-900/20 ${isHealthy ? 'animate-pulse' : ''}`} />

        {/* The Artery Walls */}
        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
          {/* Top Wall Plaque */}
          <path 
            d={`M0,0 Q50,${value * 0.4} 100,0 V0 H0 Z`} 
            fill="#facc15" 
            fillOpacity={plaqueOpacity}
            vectorEffect="non-scaling-stroke"
            className="transition-all duration-300 ease-out"
          />
          {/* Bottom Wall Plaque */}
          <path 
            d={`M0,100 Q50,${100 - (value * 0.4)} 100,100 V100 H0 Z`} 
            fill="#facc15" 
            fillOpacity={plaqueOpacity}
            vectorEffect="non-scaling-stroke"
            className="transition-all duration-300 ease-out"
            transform="scale(1, -1) translate(0, -100)" 
            /* Note: SVG coordinate flip simulated for simplicity via path logic */
          />
          
          {/* Blood Flow Particles */}
          <line 
            x1="0" y1="50" x2="100%" y2="50" 
            stroke="#ef4444" 
            strokeWidth={bloodFlowWidth * 0.6} 
            strokeDasharray="10 5" 
            strokeLinecap="round"
            className="animate-flow opacity-80"
          />
          <line 
             x1="0" y1="50" x2="100%" y2="50" 
             stroke="#ff9999" 
             strokeWidth={bloodFlowWidth * 0.2} 
             strokeDasharray="5 15" 
             className="animate-flow opacity-60"
             style={{ animationDuration: isHealthy ? '0.5s' : '3s' }} // Slow flow when clogged
          />
        </svg>

        {/* Warning Icon Overlay when clogged */}
        {value > 80 && (
          <div className="absolute inset-0 flex items-center justify-center animate-bounce">
            <AlertTriangle className="w-8 h-8 text-yellow-500 drop-shadow-lg" />
          </div>
        )}

        {/* Slider Input Overlay - Invisible but interactive */}
        <input
          type="range"
          min="0"
          max="100"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
        />

        {/* Custom Thumb Visualizer (follows value) */}
        <div 
          className="absolute top-0 bottom-0 w-1 bg-white/50 pointer-events-none z-10 transition-all duration-75"
          style={{ left: `${value}%` }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 bg-white text-black text-[10px] font-bold px-2 py-1 rounded-full shadow-lg whitespace-nowrap">
            {value < 50 ? '< 385 mg/dL' : '> 385 mg/dL'}
          </div>
        </div>
      </div>

      <div className="mt-2 text-center text-xs text-slate-400 font-mono">
        {value < 20 && "Artery Status: Pristine Plumbing"}
        {value >= 20 && value < 50 && "Artery Status: Occasional Cheeseburger"}
        {value >= 50 && value < 80 && "Artery Status: Heavy Cream Latte"}
        {value >= 80 && "Artery Status: EMERGENCY BYPASS IMMINENT"}
      </div>
    </div>
  );
};