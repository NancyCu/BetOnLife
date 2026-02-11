import React from 'react';
import { Home, Trophy, Gamepad2, User, Activity } from 'lucide-react';

export const BottomNav: React.FC = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#0f0f1b]/95 backdrop-blur-md border-t border-slate-800 pb-safe pt-2 z-40">
      <div className="flex justify-around items-end px-2 pb-2">
        <NavButton icon={<Home size={20} />} label="HOME" active />
        <NavButton icon={<Trophy size={20} />} label="WINNERS" />
        
        {/* Center Action Button */}
        <div className="relative -top-5">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#1e3a8a] to-[#2563eb] border-4 border-[#0f0f1b] flex items-center justify-center shadow-lg shadow-blue-500/30">
             <Activity className="text-white w-8 h-8 animate-pulse" />
          </div>
          <div className="text-[10px] font-bold text-center text-blue-400 mt-1 tracking-wider">LIVE</div>
        </div>

        <NavButton icon={<Gamepad2 size={20} />} label="PLAY" />
        <NavButton icon={<User size={20} />} label="YOU" />
      </div>
    </div>
  );
};

const NavButton: React.FC<{ icon: React.ReactNode; label: string; active?: boolean }> = ({ icon, label, active }) => (
  <button className={`flex flex-col items-center gap-1 p-2 w-16 ${active ? 'text-slate-100' : 'text-slate-500'}`}>
    {icon}
    <span className="text-[9px] font-bold tracking-widest">{label}</span>
  </button>
);