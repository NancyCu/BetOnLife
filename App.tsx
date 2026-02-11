import React, { useState, useEffect } from 'react';
import { Ticker } from './components/Ticker';
import AncestorProp from './components/AncestorProp';
import { BettingCard } from './components/BettingCard';
import { SurvivorSplit } from './components/SurvivorSplit';
import { TabSection } from './components/TabSection';
import { BottomNav } from './components/BottomNav';
import { PaymentModal } from './components/PaymentModal';
import { CountdownTimer } from './components/CountdownTimer';
import { MockDB, MockAuth } from './services/mockFirebase';
import { TabView, User } from './types';
import { TARGET_DATE } from './constants';
import { Info, Share2, Wallet } from 'lucide-react';

const App: React.FC = () => {
  // Cholesterol level now goes from 200 (Healthy) to 600 (Danger)
  const [cholesterolLevel, setCholesterolLevel] = useState(350);
  const LIMIT_LINE = 385;
  
  const [totalPot, setTotalPot] = useState(0);
  const [user, setUser] = useState<User | null>(null);
  const [hasBet, setHasBet] = useState(false);
  const [currentTab, setCurrentTab] = useState<TabView>(TabView.WAITING_ROOM);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [entryFee] = useState(5); // Fixed $5 Entry Fee

  // Initialize Data
  useEffect(() => {
    const init = async () => {
      const loggedUser = await MockAuth.login();
      setUser(loggedUser);
      
      // Check if user has already bet (Enforce One Bet Rule)
      const existingBet = await MockDB.getUserBet(loggedUser.uid);
      if (existingBet) {
        setHasBet(true);
        // Set visualizer to their bet if they want (Optional, but lets keep it interactive)
        // setCholesterolLevel(existingBet.targetValue); 
      }
    };

    init();
    
    // Subscribe to Pot Updates
    const unsubscribe = MockDB.subscribeToPot(setTotalPot);
    return () => unsubscribe();
  }, []);

  // Background opacity logic
  // Map 200-600 to 0-1 opacity intensity for the red background
  const bgOverlayOpacity = Math.max(0, (cholesterolLevel - 200) / 400);

  const handlePlaceBet = () => {
    if (hasBet) return; // Logic double check
    setIsModalOpen(true);
  };

  const handleConfirmBet = async () => {
    if (!user) return;
    const team = cholesterolLevel > LIMIT_LINE ? 'TALLOW' : 'RABBIT_FOOD';
    
    try {
      await MockDB.placeBet(user, team, cholesterolLevel);
      // Optimistic update
      setHasBet(true);
      setTotalPot(prev => prev + entryFee);
      setIsModalOpen(false);
    } catch (e) {
      alert("Error placing bet: " + e);
    }
  };

  return (
    <div className="min-h-screen relative pb-20 transition-colors duration-1000 ease-in-out font-sans">
      
      {/* Dynamic Background Effect */}
      <div 
        className="fixed inset-0 pointer-events-none transition-opacity duration-500 ease-linear z-0"
        style={{
          background: `radial-gradient(circle at 50% 30%, rgba(239, 68, 68, ${bgOverlayOpacity * 0.8}) 0%, transparent 70%)`
        }}
      />
      
      {/* Scanline texture */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0" style={{ backgroundImage: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))', backgroundSize: '100% 2px, 3px 100%' }}></div>

      <div className="relative z-10">
        <Ticker />

        {/* Header Area */}
        <div className="px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            {/* Mascot Image Replacement */}
            <div className="relative group cursor-pointer">
              <div className="absolute inset-0 bg-yellow-500/50 rounded-full blur-md group-hover:bg-yellow-400/80 transition-all duration-300"></div>
              <img 
                src="https://cdn-icons-png.flaticon.com/512/3076/3076134.png" 
                alt="Mascot" 
                className="w-12 h-12 rounded-full border-2 border-[#0f0f1b] bg-yellow-100 object-cover relative z-10 shadow-lg transform group-hover:scale-105 transition-transform duration-200"
              />
              <div className="absolute -bottom-1 -right-1 z-20 text-xs animate-bounce">🍚</div>
            </div>
            
            <div>
              <h1 className="text-sm font-bold tracking-widest text-white">LIPID LOTTO</h1>
              <div className="text-[10px] text-slate-400">Edition: Asian Parent</div>
            </div>
          </div>
          <div className="flex gap-4">
            {/* Status Indicator */}
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wide transition-all ${
              hasBet 
              ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' 
              : 'bg-red-500/10 border-red-500/50 text-red-400 animate-pulse'
            }`}>
              <Wallet size={12} />
              {hasBet ? 'Status: INVESTOR' : 'Status: DEBTOR'}
            </div>
            <button className="text-slate-400 hover:text-white"><Info size={20} /></button>
          </div>
        </div>

        {/* Countdown Timer */}
        <CountdownTimer targetDate={TARGET_DATE} />

        {/* The New Ancestor Visualizer */}
        <AncestorProp 
          currentValue={cholesterolLevel} 
          line={LIMIT_LINE} 
          onChange={setCholesterolLevel} 
        />

        {/* Pot Card */}
        <BettingCard 
          totalPot={totalPot} 
          entryFee={entryFee} 
          onPlaceBet={handlePlaceBet}
          isLocked={hasBet} 
        />

        {/* Payout Info */}
        <SurvivorSplit totalPot={totalPot} />

        {/* Tabs */}
        <TabSection currentTab={currentTab} onTabChange={setCurrentTab} />

        {/* Modal */}
        <PaymentModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleConfirmBet}
          amount={entryFee}
          team={cholesterolLevel > LIMIT_LINE ? 'TALLOW' : 'RABBIT_FOOD'}
          targetValue={cholesterolLevel}
        />
      </div>

      <BottomNav />
    </div>
  );
};

export default App;