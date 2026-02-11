import React, { useState, useEffect } from 'react';
import { TICKER_MESSAGES } from '../constants';
import { Activity } from 'lucide-react';

export const Ticker: React.FC = () => {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setOffset((prev) => prev - 1);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-slate-900 border-b border-slate-800 h-10 overflow-hidden flex items-center relative z-20">
      <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-[#0f0f1b] to-transparent z-10"></div>
      <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[#0f0f1b] to-transparent z-10"></div>
      
      <div className="flex items-center whitespace-nowrap" style={{ transform: `translateX(${offset}px)` }}>
        {[...TICKER_MESSAGES, ...TICKER_MESSAGES, ...TICKER_MESSAGES].map((msg, i) => (
          <div key={i} className="flex items-center mx-8 text-xs font-mono text-[#00e676]">
            <Activity className="w-3 h-3 mr-2 animate-pulse" />
            <span className="uppercase tracking-widest">{msg}</span>
          </div>
        ))}
      </div>
    </div>
  );
};