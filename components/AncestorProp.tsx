import React, { useMemo, useState, useEffect, useRef } from 'react';
import { cn } from '../utils';

interface AncestorPropProps {
  currentValue: number;
  line?: number;
  onChange: (value: number) => void;
}

// Cubic Bezier Math to map the slider handle to the S-Curve
type Point = { x: number; y: number };
const P0 = { x: 0, y: 100 };   // Start
const P1 = { x: 300, y: -50 }; // Control Point 1 (Pulls up)
const P2 = { x: 300, y: 250 }; // Control Point 2 (Pulls down)
const P3 = { x: 600, y: 100 }; // End

// The SVG Path Definition
const ARTERY_PATH_D = `M${P0.x},${P0.y} C${P1.x},${P1.y} ${P2.x},${P2.y} ${P3.x},${P3.y}`;

const getCubicBezierPoint = (t: number): Point => {
  const cx = 3 * (P1.x - P0.x);
  const bx = 3 * (P2.x - P1.x) - cx;
  const ax = P3.x - P0.x - cx - bx;

  const cy = 3 * (P1.y - P0.y);
  const by = 3 * (P2.y - P1.y) - cy;
  const ay = P3.y - P0.y - cy - by;

  const x = (ax * Math.pow(t, 3)) + (bx * Math.pow(t, 2)) + (cx * t) + P0.x;
  const y = (ay * Math.pow(t, 3)) + (by * Math.pow(t, 2)) + (cy * t) + P0.y;

  return { x, y };
};

// "Dép Tổ Ong" (Honeycomb Sandal) Icon
const SandalIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 60" className={className} filter="drop-shadow(0px 4px 4px rgba(0,0,0,0.5))">
    {/* Sole */}
    <path 
      d="M10,30 Q15,10 40,10 L80,10 Q95,10 95,30 Q95,50 80,50 L40,50 Q15,50 10,30 Z" 
      fill="#fffae0" 
      stroke="#d4d4d8" 
      strokeWidth="1"
    />
    {/* Honeycomb Pattern (Holes) */}
    <g fill="#475569" opacity="0.3">
      <circle cx="30" cy="30" r="3" />
      <circle cx="45" cy="22" r="3" />
      <circle cx="45" cy="38" r="3" />
      <circle cx="60" cy="30" r="3" />
      <circle cx="75" cy="22" r="3" />
      <circle cx="75" cy="38" r="3" />
    </g>
    {/* Blue Strap */}
    <path 
      d="M40,10 Q60,15 65,50" 
      fill="none" 
      stroke="#2563eb" 
      strokeWidth="12" 
      strokeLinecap="round"
      opacity="0.9"
    />
    <path 
      d="M40,10 Q60,15 65,50" 
      fill="none" 
      stroke="#60a5fa" 
      strokeWidth="4" 
      strokeLinecap="round"
      opacity="0.6"
    />
  </svg>
);

export default function AncestorProp({ currentValue, line = 385, onChange }: AncestorPropProps) {
  const MIN_VAL = 100;
  const MAX_VAL = 600;
  
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isInteracting, setIsInteracting] = useState(false);
  const animationRef = useRef<number>(0);

  // Auto-Scan Animation Logic
  useEffect(() => {
    if (!isAutoPlaying) {
      cancelAnimationFrame(animationRef.current);
      return;
    }

    const animate = () => {
      const time = Date.now() / 2000; // Speed of auto-scan
      const normalized = (Math.sin(time) + 1) / 2;
      const nextVal = Math.round(MIN_VAL + (normalized * (MAX_VAL - MIN_VAL)));
      onChange(nextVal);
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationRef.current);
  }, [isAutoPlaying, onChange]);

  // Interaction Handlers
  const handleStart = () => {
    setIsAutoPlaying(false);
    setIsInteracting(true);
  };

  const handleEnd = () => {
    setIsInteracting(false);
  };

  // Derived Values
  const percentage = Math.max(0, Math.min(((currentValue - MIN_VAL) / (MAX_VAL - MIN_VAL)), 1));
  
  // Status Thresholds
  const isDanger = currentValue > 400; 
  const isWarning = currentValue > 250 && currentValue <= 400; 

  // Constriction Logic
  const maxStroke = 80;
  const bloodStrokeWidth = Math.max(5, maxStroke - (percentage * (maxStroke - 2)));
  const handlePos = useMemo(() => getCubicBezierPoint(percentage), [percentage]);

  // Dynamic Colors
  const wallColorMain = isDanger ? "#450a0a" : isWarning ? "#7f1d1d" : "#691e2c";
  const wallColorHighlight = isDanger ? "#991b1b" : isWarning ? "#b91c1c" : "#be123c";

  // Status Text
  let statusMsg = "";
  if (percentage < 0.3) statusMsg = "You eat it, you suffer, but you live. 'Cools the blood'.";
  else if (percentage < 0.6) statusMsg = "Delicious, but it speeds up the inheritance process.";
  else statusMsg = "Your blood has the consistency of cold gravy. Say hi to Grandpa.";

  let riskLabel = "";
  if (percentage < 0.3) riskLabel = "Safe (Khổ Qua)";
  else if (percentage < 0.6) riskLabel = "Risky (Nước Béo)";
  else riskLabel = "GẶP ÔNG BÀ SOON";

  // Platelet Animation Speed
  const plateletDurationBase = isDanger ? 12 : 4; 

  // Smart Positioning logic to prevent clipping
  const isLeftEdge = percentage < 0.2;
  const isRightEdge = percentage > 0.8;
  
  // Transform logic: 
  // Left edge -> shift right (translateX 0 or small positive)
  // Right edge -> shift left (translateX -100%)
  // Center -> centered (translateX -50%)
  const bubbleTransformClass = isLeftEdge 
    ? "-translate-x-2" 
    : isRightEdge 
      ? "-translate-x-[calc(100%-10px)]" 
      : "-translate-x-1/2";

  return (
    <div className={cn("w-full p-4 select-none relative z-10")}>
      <div className="w-full bg-[#0B0C15] rounded-xl border border-white/10 shadow-2xl font-sans relative overflow-visible pb-6 z-10">
        
        {/* HUGE STATIC BACKGROUND NUMBER */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none opacity-20 flex flex-col items-center">
          <span className={cn(
            "text-8xl font-black tabular-nums tracking-tighter transition-colors duration-300",
            isDanger ? "text-red-500" : "text-white"
          )}>
            {currentValue}
          </span>
          <span className="text-sm font-bold uppercase tracking-widest text-white/50">mg/dL</span>
        </div>

        {/* Header */}
        <div className="flex justify-between items-end p-4 pb-0 tracking-wide font-black uppercase z-20 relative pointer-events-none">
          <div className="text-emerald-400 text-xs flex flex-col">
            <span className="opacity-50 text-[10px] italic">Bitter Melon (Suffering Past)</span>
            <span className="text-sm">TEAM KHỔ QUA</span>
          </div>
          <div className="text-red-500 text-xs flex flex-col items-end">
            <span className="opacity-50 text-[10px] italic">Fatty Broth (Guilty Pleasure)</span>
            <span className="text-sm">TEAM NƯỚC BÉO</span>
          </div>
        </div>

        {/* The GROSS ORGANIC ARTERY Container */}
        <div className="relative h-48 w-full -my-4 group">
          
          <svg className="w-full h-full pointer-events-none" viewBox="0 0 600 200" preserveAspectRatio="xMidYMid meet">
            <defs>
              <filter id="plaqueTexture" x="0%" y="0%" width="100%" height="100%">
                <feTurbulence type="fractalNoise" baseFrequency="0.15" numOctaves="4" result="noise" />
                <feDisplacementMap in="SourceGraphic" in2="noise" scale="12" xChannelSelector="R" yChannelSelector="G" />
                <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" />
              </filter>
              <filter id="veinTexture">
                <feTurbulence type="turbulence" baseFrequency="0.05" numOctaves="2" result="turbulence"/>
                <feDisplacementMap in2="turbulence" in="SourceGraphic" scale="5" xChannelSelector="R" yChannelSelector="G"/>
              </filter>
              <clipPath id="jaggedEnds">
                <path d="M10,0 L600,0 L590,20 L600,40 L590,60 L600,80 L590,100 L600,120 L590,140 L600,160 L590,180 L600,200 L0,200 L10,180 L0,160 L10,140 L0,120 L10,100 L0,80 L10,60 L0,40 L10,20 L0,0 Z" />
              </clipPath>
              <path id="arteryPath" d={ARTERY_PATH_D} fill="none" />
            </defs>

            <g clipPath="url(#jaggedEnds)">
              <g className={cn("origin-center", isDanger ? "animate-[pulse_0.2s_ease-in-out_infinite]" : "animate-[pulse_3s_ease-in-out_infinite]")}>
                <use 
                  href="#arteryPath" 
                  stroke={wallColorMain} 
                  strokeWidth="110" 
                  strokeLinecap="butt"
                  filter="url(#veinTexture)"
                  className="opacity-90 transition-colors duration-500"
                />
                <use 
                  href="#arteryPath" 
                  stroke={wallColorHighlight} 
                  strokeWidth="100" 
                  strokeLinecap="butt"
                  className="opacity-40 transition-colors duration-500"
                />
              </g>

              <use 
                href="#arteryPath" 
                stroke="#facc15" 
                strokeWidth={90} 
                strokeLinecap="butt"
                filter="url(#plaqueTexture)"
                className="drop-shadow-lg"
              />
              
              <use 
                href="#arteryPath" 
                stroke="#7f1d1d" 
                strokeWidth={bloodStrokeWidth} 
                strokeLinecap="round"
                className="transition-[stroke-width] duration-75 ease-linear"
              />

              <g>
                 {[...Array(6)].map((_, i) => (
                    <circle key={`rbc-${i}`} r={4 + (i%3)} fill="#ef4444" opacity="0.8">
                      <animateMotion 
                        dur={`${plateletDurationBase + i}s`}
                        repeatCount="indefinite"
                        path={ARTERY_PATH_D}
                        begin={`-${i * 1.5}s`}
                        keyPoints="0;1" keyTimes="0;1" calcMode="linear"
                      />
                    </circle>
                 ))}
                 {[...Array(4)].map((_, i) => (
                    <ellipse key={`wbc-${i}`} rx="4" ry="3" fill="#fecaca" opacity="0.6">
                      <animateMotion 
                        dur={`${plateletDurationBase + 2 + i}s`}
                        repeatCount="indefinite"
                        path={ARTERY_PATH_D}
                        begin={`-${i * 2}s`}
                        rotate="auto"
                        keyPoints="0;1" keyTimes="0;1" calcMode="linear"
                      />
                    </ellipse>
                 ))}
              </g>
            </g>
          </svg>

          {/* Slider Handle Overlay */}
          <div className="absolute inset-0 pointer-events-none">
             <div 
               className="absolute w-1 h-1 transition-all duration-75 ease-out"
               style={{ 
                 left: 0, 
                 top: 0,
                 transform: `translate(${handlePos.x / 600 * 100}%, ${handlePos.y / 200 * 100}%)` 
               }}
             >
                <div className="relative">
                  {/* UNIFIED MARKER BUBBLE - ALWAYS VISIBLE */}
                  {/* Uses smart transform logic to stay on screen */}
                  <div className={cn(
                    "absolute -top-28 min-w-[140px] p-3 rounded-xl border-2 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8)] backdrop-blur-md transition-all duration-300 z-[100]",
                    bubbleTransformClass,
                    isDanger ? "bg-black/90 border-red-500 shadow-red-900/40" : "bg-black/90 border-emerald-500 shadow-emerald-900/40"
                  )}>
                    {/* Header: Locked or Dragging */}
                    <div className={cn("text-[10px] font-black uppercase tracking-widest mb-1", isDanger ? "text-red-400" : "text-emerald-400")}>
                      {!isAutoPlaying && !isInteracting ? "BET LOCKED" : "ANALYZING..."}
                    </div>

                    {/* Main Value Display */}
                    <div className="flex items-baseline gap-1 text-white">
                      <span className="text-3xl font-black font-mono tracking-tighter leading-none">{currentValue}</span>
                      <span className="text-[10px] font-bold opacity-60">mg/dL</span>
                    </div>

                    {/* Context Message */}
                    {!isAutoPlaying && !isInteracting && (
                      <div className="mt-2 pt-2 border-t border-white/10 text-[10px] font-medium leading-tight text-white/80">
                         {isDanger ? "WARNING: MÁ IS WATCHING." : "CONFIRM THIS NUMBER?"}
                      </div>
                    )}

                    {/* Decorative Connectors */}
                    <div className={cn(
                      "absolute bottom-[-8px] w-4 h-4 bg-black border-r-2 border-b-2 rotate-45",
                      isDanger ? "border-red-500" : "border-emerald-500",
                      // Arrow position also needs to be smart relative to the bubble
                      isLeftEdge ? "left-4" : isRightEdge ? "right-4" : "left-1/2 -translate-x-1/2"
                    )}></div>
                  </div>

                  {/* Sandal Icon */}
                  <div className={cn(
                    "absolute -top-10 -left-8 w-16 h-10 transition-transform duration-100 origin-center hover:scale-110",
                    isDanger ? "animate-[shake_0.1s_infinite]" : ""
                  )}>
                     <SandalIcon className="w-full h-full text-white drop-shadow-xl" />
                  </div>
                  
                  {/* Connection Line */}
                  <div className="absolute -top-2 left-0 h-4 w-0.5 bg-white/40 shadow-[0_0_5px_white]"></div>
                </div>
             </div>
          </div>

          {/* Interactive Range Input */}
          <input 
            type="range"
            min={MIN_VAL}
            max={MAX_VAL}
            value={currentValue}
            onChange={(e) => onChange(Number(e.target.value))}
            onMouseDown={handleStart}
            onTouchStart={handleStart}
            onMouseUp={handleEnd}
            onTouchEnd={handleEnd}
            className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-[200]"
            style={{ clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)' }}
          />
        </div>

        {/* Dynamic Status Footer */}
        <div className="px-4 mt-2 text-center pointer-events-none relative z-20">
          <div className="mb-2">
             <span className={cn(
               "text-xs font-bold uppercase tracking-widest px-2 py-0.5 rounded transition-all duration-300",
               percentage < 0.3 ? "bg-emerald-500/20 text-emerald-400" :
               percentage < 0.6 ? "bg-yellow-500/20 text-yellow-400" :
               "bg-red-900 text-red-100 animate-pulse border border-red-500"
             )}>
               STATUS: {riskLabel}
             </span>
          </div>
          <p className={cn(
             "text-sm font-medium italic transition-colors duration-300",
             isDanger ? "text-red-400 font-black drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]" : "text-slate-400"
          )}>
            "{statusMsg}"
          </p>
        </div>

      </div>
    </div>
  );
}