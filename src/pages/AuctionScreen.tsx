import React, { useState, useEffect, useRef } from 'react';
import pb from '@/lib/pocketbaseClient';
import { DEFAULT_USER_ID } from '@/lib/defaultUser';
import Header from '@/components/Header';
import { Helmet } from 'react-helmet-async';
import { Gavel, Users, DollarSign, TrendingUp, Timer, Shield, Zap, Target, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'motion/react';

const TEAMS = [
  { id: 'mi', name: 'Mumbai Indians', budget: 45000000, reputation: 95, needs: ['Batter', 'All-Rounder'] },
  { id: 'csk', name: 'Chennai Super Kings', budget: 42000000, reputation: 94, needs: ['All-Rounder', 'Bowler'] },
  { id: 'rcb', name: 'Royal Challengers Bangalore', budget: 38000000, reputation: 90, needs: ['Batter', 'Bowler'] },
  { id: 'kkr', name: 'Kolkata Knight Riders', budget: 40000000, reputation: 88, needs: ['Bowler', 'All-Rounder'] },
  { id: 'dc', name: 'Delhi Capitals', budget: 35000000, reputation: 85, needs: ['Batter'] },
  { id: 'gt', name: 'Gujarat Titans', budget: 41000000, reputation: 89, needs: ['All-Rounder'] },
  { id: 'lsg', name: 'Lucknow Super Giants', budget: 37000000, reputation: 84, needs: ['Bowler'] },
  { id: 'rr', name: 'Rajasthan Royals', budget: 36000000, reputation: 86, needs: ['Batter', 'Bowler'] },
  { id: 'pk', name: 'Punjab Kings', budget: 48000000, reputation: 80, needs: ['All-Rounder', 'Batter'] },
  { id: 'srh', name: 'Sunrisers Hyderabad', budget: 39000000, reputation: 82, needs: ['Bowler'] }
];

const AuctionScreen = () => {
  const [player, setPlayer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [auctionState, setAuctionState] = useState<'idle' | 'bidding' | 'finished' | 'negotiating'>('idle');
  const [currentBid, setCurrentBid] = useState(0);
  const [highestBidder, setHighestBidder] = useState<any>(null);
  const [bidHistory, setBidHistory] = useState<any[]>([]);
  const [valuation, setValuation] = useState(0);
  const { toast } = useToast();
  const auctionInterval = useRef<any>(null);

  useEffect(() => {
    loadData();
    return () => clearInterval(auctionInterval.current);
  }, []);

  const loadData = async () => {
    try {
      const playerData = await pb.collection('players').getFullList({
        filter: `userId = "${DEFAULT_USER_ID}"`,
      });
      if (playerData.length > 0) {
        const p = playerData[0];
        setPlayer(p);
        
        // Dynamic Valuation Formula
        // Base = (Technique + Power + Timing) * Popularity * 100
        const baseVal = (p.technique + p.power + p.timing) * (p.popularity || 10) * 150;
        setValuation(baseVal);
        setCurrentBid(Math.floor(baseVal * 0.4)); // Base price is 40% of valuation
      }
    } catch (error) {
      console.error('Failed to load auction:', error);
    } finally {
      setLoading(false);
    }
  };

  const processBid = () => {
    // AI Bidding Logic
    const activeTeams = TEAMS.filter(t => 
      t.budget > currentBid && 
      (t.needs.includes(player.role) || Math.random() > 0.7)
    );

    if (activeTeams.length === 0 || (currentBid > valuation * 1.5 && Math.random() > 0.8)) {
      finishAuction();
      return;
    }

    // Select a team to bid
    const biddingTeam = activeTeams[Math.floor(Math.random() * activeTeams.length)];
    if (biddingTeam.id === highestBidder?.id) {
      // Don't bid against yourself, wait for another team
      if (Math.random() > 0.5) finishAuction();
      return;
    }

    const increment = Math.floor(currentBid * 0.05) + 10000;
    const newBid = currentBid + increment;

    setCurrentBid(newBid);
    setHighestBidder(biddingTeam);
    setBidHistory(prev => [{ team: biddingTeam.name, amount: newBid, time: new Date().toLocaleTimeString() }, ...prev].slice(0, 5));
  };

  const startAuction = () => {
    setAuctionState('bidding');
    setBidHistory([]);
    auctionInterval.current = setInterval(processBid, 1500);
  };

  const finishAuction = () => {
    clearInterval(auctionInterval.current);
    setAuctionState('finished');
    toast({
      title: "Auction Hammer Down!",
      description: highestBidder 
        ? `Sold to ${highestBidder.name} for $${currentBid.toLocaleString()}`
        : "Player Unsold",
    });
  };

  const handleNegotiation = async (accept: boolean) => {
    if (accept) {
      try {
        await pb.collection('franchise_contracts').create({
          player_id: player.id,
          team_id: highestBidder.id,
          contract_value: currentBid,
          duration: 3,
          status: 'active',
          earnings_to_date: 0
        });
        
        // Update player's current team
        await pb.collection('players').create({
          ...player,
          current_team: highestBidder.name,
          net_worth: (player.net_worth || 0) + (currentBid * 0.1) // Signing bonus
        });

        toast({
          title: "Contract Signed!",
          description: `Welcome to ${highestBidder.name}!`,
        });
        setAuctionState('idle');
        loadData();
      } catch (e) {
        console.error(e);
      }
    } else {
      setAuctionState('idle');
      toast({
        title: "Offer Rejected",
        description: "You will enter the next auction session.",
      });
    }
  };

  if (loading || !player) {
    return (
      <div className="min-h-screen bg-[#0f172a]">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Franchise Auction | Cricket Career</title>
      </Helmet>
      <div className="min-h-screen bg-[#0f172a] text-white selection:bg-blue-500/30">
        <Header />
        
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-12 gap-8">
            
            {/* Main Auction Stage */}
            <div className="lg:col-span-8">
              <div className="bg-[#1e293b] rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
                
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-10 flex justify-between items-center">
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <Gavel className="w-8 h-8 text-yellow-400" />
                      <h1 className="text-4xl font-black tracking-tighter uppercase italic">Premier League Auction</h1>
                    </div>
                    <p className="text-blue-100/70 font-medium tracking-widest uppercase text-xs">Season 2026 • Live Bidding Session</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center justify-end space-x-2 mb-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                      <span className="text-xs font-black uppercase tracking-widest text-red-200">Live Broadcast</span>
                    </div>
                    <div className="px-4 py-2 bg-black/20 rounded-full backdrop-blur-md border border-white/10">
                      <span className="text-xl font-mono font-bold">SET 01 • PLAYER 04</span>
                    </div>
                  </div>
                </div>

                {/* Player Display */}
                <div className="p-12">
                  <div className="flex flex-col items-center text-center mb-12">
                    <motion.div 
                      layoutId="player-avatar"
                      className="w-40 h-40 bg-gradient-to-br from-slate-700 to-slate-800 rounded-full mb-8 flex items-center justify-center text-6xl font-black border-8 border-blue-500/20 shadow-2xl relative"
                    >
                      {player.name.charAt(0)}
                      <div className="absolute -bottom-2 -right-2 bg-blue-600 p-3 rounded-2xl shadow-xl">
                        <Shield className="w-6 h-6 text-white" />
                      </div>
                    </motion.div>
                    <h2 className="text-5xl font-black mb-3 tracking-tight">{player.name}</h2>
                    <div className="flex items-center space-x-4 text-slate-400 font-bold uppercase tracking-widest text-sm">
                      <span>{player.role}</span>
                      <span className="w-1.5 h-1.5 bg-slate-600 rounded-full" />
                      <span>{player.country}</span>
                      <span className="w-1.5 h-1.5 bg-slate-600 rounded-full" />
                      <span className="text-blue-400">Base: ${(currentBid * 0.4).toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Bidding Area */}
                  <div className="grid md:grid-cols-2 gap-8 mb-12">
                    <div className="bg-slate-900/50 p-8 rounded-[2rem] border border-white/5 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <DollarSign className="w-20 h-20" />
                      </div>
                      <p className="text-slate-500 uppercase text-[10px] font-black tracking-[0.2em] mb-4">Current Highest Bid</p>
                      <AnimatePresence mode="wait">
                        <motion.p 
                          key={currentBid}
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          className="text-6xl font-black text-emerald-400 tracking-tighter"
                        >
                          ${currentBid.toLocaleString()}
                        </motion.p>
                      </AnimatePresence>
                    </div>
                    <div className="bg-slate-900/50 p-8 rounded-[2rem] border border-white/5 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Users className="w-20 h-20" />
                      </div>
                      <p className="text-slate-500 uppercase text-[10px] font-black tracking-[0.2em] mb-4">Leading Franchise</p>
                      <AnimatePresence mode="wait">
                        <motion.p 
                          key={highestBidder?.id}
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          className="text-3xl font-black text-blue-400 tracking-tight"
                        >
                          {highestBidder?.name || 'Waiting for Bids...'}
                        </motion.p>
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col items-center">
                    {auctionState === 'idle' && (
                      <Button 
                        onClick={startAuction} 
                        className="px-16 py-10 text-2xl font-black bg-blue-600 hover:bg-blue-700 rounded-3xl shadow-[0_20px_50px_rgba(37,99,235,0.3)] transition-all hover:-translate-y-2 uppercase tracking-widest"
                      >
                        Enter Auction
                      </Button>
                    )}

                    {auctionState === 'bidding' && (
                      <div className="flex flex-col items-center space-y-6">
                        <div className="flex space-x-3">
                          <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce" />
                          <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce [animation-delay:-.3s]" />
                          <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce [animation-delay:-.5s]" />
                        </div>
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-sm animate-pulse">Bidding War in Progress...</p>
                      </div>
                    )}

                    {auctionState === 'finished' && highestBidder && (
                      <div className="w-full max-w-md bg-blue-600/10 border border-blue-500/20 p-8 rounded-3xl text-center">
                        <h3 className="text-2xl font-black mb-4">Final Offer Received!</h3>
                        <p className="text-slate-400 mb-8">
                          {highestBidder.name} has won the bid. Do you accept the 3-year contract worth <span className="text-white font-bold">${currentBid.toLocaleString()}</span>?
                        </p>
                        <div className="flex space-x-4">
                          <Button onClick={() => handleNegotiation(true)} className="flex-1 bg-emerald-600 hover:bg-emerald-700 font-bold py-6 rounded-2xl">Accept</Button>
                          <Button onClick={() => handleNegotiation(false)} variant="outline" className="flex-1 border-white/10 hover:bg-white/5 font-bold py-6 rounded-2xl">Reject</Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar: Market & History */}
            <div className="lg:col-span-4 space-y-8">
              
              {/* Market Value Analysis */}
              <Card className="bg-[#1e293b] border-white/5 rounded-[2rem] overflow-hidden shadow-xl text-white">
                <CardHeader className="p-8 pb-4">
                  <CardTitle className="text-sm font-black uppercase tracking-[0.2em] text-slate-500 flex items-center">
                    <TrendingUp className="w-4 h-4 mr-2 text-blue-400" />
                    Market Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 pt-0 space-y-6">
                  <div className="flex justify-between items-center p-4 bg-slate-900/50 rounded-2xl border border-white/5">
                    <span className="text-slate-400 text-xs font-bold uppercase">Valuation</span>
                    <span className="font-black text-xl text-blue-400">${valuation.toLocaleString()}</span>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500 font-medium">Demand Level</span>
                      <span className="text-orange-400 font-black uppercase tracking-widest">Extreme</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500 font-medium">Scout Interest</span>
                      <span className="text-white font-black">9/10 Teams</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Live Bid History */}
              <Card className="bg-[#1e293b] border-white/5 rounded-[2rem] overflow-hidden shadow-xl text-white">
                <CardHeader className="p-8 pb-4">
                  <CardTitle className="text-sm font-black uppercase tracking-[0.2em] text-slate-500 flex items-center">
                    <History className="w-4 h-4 mr-2 text-indigo-400" />
                    Live Bid Log
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 pt-0">
                  <div className="space-y-4">
                    <AnimatePresence initial={false}>
                      {bidHistory.length > 0 ? bidHistory.map((bid, i) => (
                        <motion.div 
                          key={bid.amount}
                          initial={{ x: 20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          className={`flex justify-between items-center p-4 rounded-2xl border ${i === 0 ? 'bg-blue-600/10 border-blue-500/30' : 'bg-slate-900/30 border-white/5 opacity-60'}`}
                        >
                          <div>
                            <p className="font-bold text-sm">{bid.team}</p>
                            <p className="text-[10px] text-slate-500 font-medium">{bid.time}</p>
                          </div>
                          <span className="font-black text-emerald-400">${bid.amount.toLocaleString()}</span>
                        </motion.div>
                      )) : (
                        <div className="text-center py-8 text-slate-500 font-medium italic text-sm">
                          Waiting for first bid...
                        </div>
                      )}
                    </AnimatePresence>
                  </div>
                </CardContent>
              </Card>

              {/* Team Needs Panel */}
              <Card className="bg-[#1e293b] border-white/5 rounded-[2rem] overflow-hidden shadow-xl text-white">
                <CardHeader className="p-8 pb-4">
                  <CardTitle className="text-sm font-black uppercase tracking-[0.2em] text-slate-500 flex items-center">
                    <Target className="w-4 h-4 mr-2 text-red-400" />
                    Top Contenders
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 pt-0">
                  <div className="space-y-3">
                    {TEAMS.slice(0, 4).map(team => (
                      <div key={team.id} className="flex items-center justify-between p-4 bg-slate-900/30 rounded-2xl border border-white/5">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center text-[10px] font-black">{team.id.toUpperCase()}</div>
                          <span className="text-xs font-bold">{team.name}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Zap className={`w-3 h-3 ${team.needs.includes(player.role) ? 'text-yellow-400' : 'text-slate-600'}`} />
                          <span className="text-[10px] font-black text-slate-500">${(team.budget / 1000000).toFixed(1)}M</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuctionScreen;
