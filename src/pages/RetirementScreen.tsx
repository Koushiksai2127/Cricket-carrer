import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import pb from '@/lib/pocketbaseClient';
import { DEFAULT_USER_ID } from '@/lib/defaultUser';
import Header from '@/components/Header';
import { Helmet } from 'react-helmet-async';
import { LogOut, Trophy, Star, Heart, History, Award, DollarSign, TrendingUp, Target, Zap, Globe, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion, AnimatePresence } from 'motion/react';

const RetirementScreen = () => {
  const [player, setPlayer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showSummary, setShowSummary] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const playerData = await pb.collection('players').getFullList({
        filter: `userId = "${DEFAULT_USER_ID}"`,
      });
      if (playerData.length > 0) {
        setPlayer(playerData[0]);
      }
    } catch (error) {
      console.error('Failed to load player:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateLegacyScore = () => {
    if (!player) return 0;
    // Legacy Score = (Runs * 0.5) + (Wickets * 50) + (Centuries * 100) + (Greatness Index * 10)
    return Math.floor((player.greatness_index || 0) * 10 + (player.popularity || 0) * 5);
  };

  const confirmRetirement = async () => {
    await pb.resetCareer(DEFAULT_USER_ID);
    setShowSummary(true);
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

  const legacyScore = calculateLegacyScore();
  const isHallOfFame = legacyScore > 5000;

  return (
    <>
      <Helmet>
        <title>Retirement | Cricket Career</title>
      </Helmet>
      <div className="min-h-screen bg-[#0f172a] text-white selection:bg-red-500/30">
        <Header />
        
        <main className="max-w-6xl mx-auto px-4 py-12">
          <AnimatePresence mode="wait">
            {!showSummary ? (
              <motion.div 
                key="confirm"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="bg-[#1e293b] rounded-[3rem] border border-white/5 overflow-hidden shadow-2xl"
              >
                <div className="bg-gradient-to-r from-red-600 to-rose-700 p-16 text-center relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <History className="w-96 h-96 -ml-20 -mt-20" />
                  </div>
                  <LogOut className="w-24 h-24 mx-auto mb-8 text-white opacity-80 animate-pulse" />
                  <h1 className="text-6xl font-black mb-4 tracking-tighter uppercase italic">End of an Era</h1>
                  <p className="text-2xl text-red-100 font-medium max-w-2xl mx-auto">
                    Are you sure you want to hang up your boots, <span className="text-white font-black">{player.name}</span>? 
                    Your legacy will be etched in history forever.
                  </p>
                </div>

                <div className="p-16 space-y-16">
                  <div className="grid md:grid-cols-4 gap-8">
                    <div className="bg-slate-900/50 p-8 rounded-[2rem] border border-white/5 text-center group hover:bg-slate-800 transition-all">
                      <Trophy className="w-10 h-10 text-yellow-500 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                      <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-2">Peak Ranking</p>
                      <p className="text-4xl font-black tracking-tighter">N/A</p>
                    </div>
                    <div className="bg-slate-900/50 p-8 rounded-[2rem] border border-white/5 text-center group hover:bg-slate-800 transition-all">
                      <Star className="w-10 h-10 text-blue-500 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                      <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-2">Records Held</p>
                      <p className="text-4xl font-black tracking-tighter">0</p>
                    </div>
                    <div className="bg-slate-900/50 p-8 rounded-[2rem] border border-white/5 text-center group hover:bg-slate-800 transition-all">
                      <DollarSign className="w-10 h-10 text-emerald-500 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                      <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-2">Net Worth</p>
                      <p className="text-4xl font-black tracking-tighter">${(player.net_worth || 0).toLocaleString()}</p>
                    </div>
                    <div className="bg-slate-900/50 p-8 rounded-[2rem] border border-white/5 text-center group hover:bg-slate-800 transition-all">
                      <Award className="w-10 h-10 text-indigo-500 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                      <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-2">Legacy Score</p>
                      <p className="text-4xl font-black tracking-tighter text-indigo-400">{legacyScore}</p>
                    </div>
                  </div>

                  <div className="bg-slate-900/30 p-10 rounded-[2.5rem] border border-white/5 relative group">
                    <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
                      <Heart className="w-32 h-32" />
                    </div>
                    <h2 className="text-3xl font-black mb-6 flex items-center tracking-tight">
                      <Heart className="w-8 h-8 mr-4 text-rose-500" />
                      Final Message to Fans
                    </h2>
                    <p className="text-slate-400 text-xl leading-relaxed italic font-medium">
                      "It's been an incredible journey. From the dusty grounds of my hometown to the hallowed turf of Lord's, 
                      I've lived my dream. Thank you to the fans, my teammates, and the game of cricket for everything. 
                      I leave with no regrets, only gratitude."
                    </p>
                  </div>

                  <div className="flex space-x-6">
                    <Button 
                      onClick={() => navigate('/')} 
                      variant="outline" 
                      className="flex-1 py-10 text-2xl font-black border-white/10 hover:bg-white/5 rounded-3xl uppercase tracking-widest transition-all hover:-translate-y-1"
                    >
                      Not Yet
                    </Button>
                    <Button 
                      onClick={confirmRetirement} 
                      className="flex-1 py-10 text-2xl font-black bg-red-600 hover:bg-red-700 rounded-3xl uppercase tracking-widest shadow-[0_20px_50px_rgba(220,38,38,0.3)] transition-all hover:-translate-y-1"
                    >
                      Confirm Retirement
                    </Button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="summary"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-12"
              >
                <div className="text-center mb-16">
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 10 }}
                    className="w-48 h-48 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full mx-auto mb-8 flex items-center justify-center text-8xl font-black border-8 border-white/10 shadow-2xl"
                  >
                    {player.name.charAt(0)}
                  </motion.div>
                  <h1 className="text-7xl font-black tracking-tighter mb-4 uppercase italic">{player.name}</h1>
                  <div className="flex items-center justify-center space-x-6 text-slate-400 font-black uppercase tracking-[0.2em] text-sm">
                    <span>2024 - 2040</span>
                    <span className="w-2 h-2 bg-slate-700 rounded-full" />
                    <span>{player.country} Legend</span>
                    <span className="w-2 h-2 bg-slate-700 rounded-full" />
                    <span className="text-blue-400">Hall of Fame Eligible</span>
                  </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                  <Card className="lg:col-span-2 bg-[#1e293b] border-white/5 rounded-[3rem] overflow-hidden shadow-2xl text-white">
                    <CardHeader className="p-10 border-b border-white/5 bg-slate-900/30">
                      <CardTitle className="text-2xl font-black uppercase tracking-widest flex items-center">
                        <History className="w-6 h-6 mr-3 text-blue-400" />
                        Career Highlights
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-10 space-y-8">
                      <div className="text-center py-12 text-slate-500 font-medium">
                        No significant career highlights recorded yet.
                      </div>
                    </CardContent>
                  </Card>

                  <div className="space-y-8">
                    <Card className="bg-gradient-to-br from-indigo-600 to-blue-700 border-none rounded-[3rem] overflow-hidden shadow-2xl text-white p-10 text-center">
                      <Award className="w-16 h-16 mx-auto mb-6 text-blue-200" />
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-200 mb-2">Legacy Status</p>
                      <h3 className="text-4xl font-black mb-4 italic uppercase tracking-tighter">Immortal</h3>
                      <div className="w-full bg-black/20 h-2 rounded-full mb-4 overflow-hidden">
                        <div className="w-full h-full bg-white" />
                      </div>
                      <p className="text-sm font-medium text-blue-100">Your name will be remembered alongside the greatest of all time.</p>
                    </Card>

                    <Card className="bg-[#1e293b] border-white/5 rounded-[3rem] overflow-hidden shadow-2xl text-white p-10">
                      <h3 className="text-xl font-black mb-6 uppercase tracking-widest flex items-center">
                        <Shield className="w-5 h-5 mr-3 text-emerald-400" />
                        Final Stats
                      </h3>
                      <div className="space-y-6">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400 font-bold uppercase text-xs">Centuries</span>
                          <span className="text-2xl font-black">0</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400 font-bold uppercase text-xs">Average</span>
                          <span className="text-2xl font-black">0.0</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400 font-bold uppercase text-xs">Wickets</span>
                          <span className="text-2xl font-black">0</span>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>

                <div className="flex justify-center pt-12">
                  <Button 
                    onClick={() => navigate('/career-creation')} 
                    className="px-16 py-10 text-2xl font-black bg-white text-slate-900 hover:bg-slate-100 rounded-3xl uppercase tracking-widest shadow-2xl transition-all hover:-translate-y-2"
                  >
                    Start New Legacy
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </>
  );
};

export default RetirementScreen;
