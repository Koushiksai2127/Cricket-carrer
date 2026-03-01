import React, { useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient';
import { DEFAULT_USER_ID } from '@/lib/defaultUser';
import Header from '@/components/Header';
import { Helmet } from 'react-helmet-async';
import { Award, TrendingUp, TrendingDown, Minus, Globe, User, Star, Shield, Zap } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion, AnimatePresence } from 'motion/react';

const RankingsPage = () => {
  const [loading, setLoading] = useState(true);
  const [player, setPlayer] = useState<any>(null);
  const [aiPlayers, setAiPlayers] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [playerData, aiData] = await Promise.all([
        pb.collection('players').getFullList({
          filter: `userId = "${DEFAULT_USER_ID}"`,
        }),
        pb.collection('players').getFullList({
          filter: `userId = "AI_PLAYER"`,
        })
      ]);

      if (playerData.length > 0) {
        setPlayer(playerData[0]);
      }
      setAiPlayers(aiData);
    } catch (error) {
      console.error('Failed to load rankings data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc]">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  const RankingRow = ({ rank, name, country, rating, change, isUser }: any) => (
    <motion.tr 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`border-b border-slate-100 transition-all duration-300 ${isUser ? 'bg-blue-50/80' : 'hover:bg-slate-50'}`}
    >
      <td className="py-5 px-6">
        <div className="flex items-center">
          <span className={`w-8 h-8 flex items-center justify-center rounded-lg font-black text-sm ${rank <= 3 ? 'bg-yellow-100 text-yellow-700' : 'bg-slate-100 text-slate-500'}`}>
            {rank}
          </span>
        </div>
      </td>
      <td className="py-5 px-6">
        <div className="flex items-center">
          <div className={`w-10 h-10 rounded-xl mr-4 flex items-center justify-center ${isUser ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-slate-200 text-slate-500'}`}>
            {isUser ? <Star className="w-5 h-5" /> : <User className="w-5 h-5" />}
          </div>
          <div>
            <p className={`font-black tracking-tight ${isUser ? 'text-blue-700 text-lg' : 'text-slate-900'}`}>
              {name} {isUser && <span className="ml-2 px-2 py-0.5 bg-blue-600 text-white text-[8px] font-black uppercase rounded-full">YOU</span>}
            </p>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{country}</p>
          </div>
        </div>
      </td>
      <td className="py-5 px-6 font-black text-slate-700 text-lg tracking-tighter">{rating}</td>
      <td className="py-5 px-6">
        {change > 0 ? (
          <div className="flex items-center text-emerald-600 font-black text-xs">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span>+{change}</span>
          </div>
        ) : change < 0 ? (
          <div className="flex items-center text-rose-600 font-black text-xs">
            <TrendingDown className="w-4 h-4 mr-1" />
            <span>{change}</span>
          </div>
        ) : (
          <div className="flex items-center text-slate-300 font-black text-xs">
            <Minus className="w-4 h-4 mr-1" />
            <span>-</span>
          </div>
        )}
      </td>
    </motion.tr>
  );

  // Helper to generate rankings based on player stats
  const getRankings = (category: string) => {
    const all = [...aiPlayers];
    if (player) all.push(player);

    // Sort by a relevant stat for the category
    const sorted = all.sort((a, b) => {
      if (category === 'batting') return (b.technique || 0) - (a.technique || 0);
      if (category === 'bowling') return (b.accuracy || 0) - (a.accuracy || 0);
      return (b.greatness_index || 0) - (a.greatness_index || 0);
    });

    return sorted.slice(0, 10).map((p, idx) => ({
      rank: idx + 1,
      name: p.name,
      country: p.country,
      rating: category === 'batting' ? (p.technique * 9) : category === 'bowling' ? (p.accuracy * 8.5) : Math.floor((p.greatness_index || 0) / 10),
      change: Math.floor(Math.random() * 5) - 2,
      isUser: p.userId === DEFAULT_USER_ID
    }));
  };

  return (
    <>
      <Helmet>
        <title>ICC World Rankings | Cricket Career</title>
      </Helmet>
      <div className="min-h-screen bg-[#f8fafc] text-slate-900">
        <Header />
        
        <main className="max-w-7xl mx-auto px-4 py-12">
          <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-5xl font-black tracking-tighter text-slate-900 mb-3 flex items-center uppercase italic">
                <Award className="w-12 h-12 mr-4 text-blue-600" />
                ICC World Rankings
              </h1>
              <p className="text-slate-500 font-medium text-lg">Official player standings across all international formats.</p>
            </div>
            <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Last Updated</p>
                <p className="text-sm font-black text-slate-900">March 2026</p>
              </div>
            </div>
          </div>

          <Tabs defaultValue="test" className="space-y-12">
            <TabsList className="bg-white border border-slate-100 p-2 rounded-[2rem] shadow-sm inline-flex">
              <TabsTrigger value="test" className="rounded-2xl px-10 py-3 data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all font-black uppercase tracking-widest text-xs">Test</TabsTrigger>
              <TabsTrigger value="odi" className="rounded-2xl px-10 py-3 data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all font-black uppercase tracking-widest text-xs">ODI</TabsTrigger>
              <TabsTrigger value="t20i" className="rounded-2xl px-10 py-3 data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all font-black uppercase tracking-widest text-xs">T20I</TabsTrigger>
            </TabsList>

            {['test', 'odi', 't20i'].map((format) => (
              <TabsContent key={format} value={format} className="grid lg:grid-cols-3 gap-8">
                {/* Batting Card */}
                <Card className="bg-white border-slate-100 rounded-[2.5rem] shadow-xl shadow-slate-200/50 overflow-hidden">
                  <CardHeader className="bg-slate-900 p-8 text-white">
                    <CardTitle className="text-xl font-black flex items-center uppercase tracking-widest italic">
                      <Zap className="w-6 h-6 mr-3 text-yellow-400" />
                      Batting
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <table className="w-full text-left">
                      <thead className="bg-slate-50 text-[10px] text-slate-400 uppercase font-black tracking-widest">
                        <tr>
                          <th className="py-4 px-6">#</th>
                          <th className="py-4 px-6">Player</th>
                          <th className="py-4 px-6">Rating</th>
                          <th className="py-4 px-6">+/-</th>
                        </tr>
                      </thead>
                      <tbody>
                        {getRankings('batting').map((r: any) => (
                          <RankingRow key={r.name} {...r} />
                        ))}
                      </tbody>
                    </table>
                  </CardContent>
                </Card>

                {/* Bowling Card */}
                <Card className="bg-white border-slate-100 rounded-[2.5rem] shadow-xl shadow-slate-200/50 overflow-hidden">
                  <CardHeader className="bg-blue-700 p-8 text-white">
                    <CardTitle className="text-xl font-black flex items-center uppercase tracking-widest italic">
                      <Shield className="w-6 h-6 mr-3 text-blue-200" />
                      Bowling
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <table className="w-full text-left">
                      <thead className="bg-slate-50 text-[10px] text-slate-400 uppercase font-black tracking-widest">
                        <tr>
                          <th className="py-4 px-6">#</th>
                          <th className="py-4 px-6">Player</th>
                          <th className="py-4 px-6">Rating</th>
                          <th className="py-4 px-6">+/-</th>
                        </tr>
                      </thead>
                      <tbody>
                        {getRankings('bowling').map((r: any) => (
                          <RankingRow key={r.name} {...r} />
                        ))}
                      </tbody>
                    </table>
                  </CardContent>
                </Card>

                {/* All-Rounder Card */}
                <Card className="bg-white border-slate-100 rounded-[2.5rem] shadow-xl shadow-slate-200/50 overflow-hidden">
                  <CardHeader className="bg-indigo-800 p-8 text-white">
                    <CardTitle className="text-xl font-black flex items-center uppercase tracking-widest italic">
                      <Star className="w-6 h-6 mr-3 text-indigo-300" />
                      All-Rounder
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <table className="w-full text-left">
                      <thead className="bg-slate-50 text-[10px] text-slate-400 uppercase font-black tracking-widest">
                        <tr>
                          <th className="py-4 px-6">#</th>
                          <th className="py-4 px-6">Player</th>
                          <th className="py-4 px-6">Rating</th>
                          <th className="py-4 px-6">+/-</th>
                        </tr>
                      </thead>
                      <tbody>
                        {getRankings('all_rounder').map((r: any) => (
                          <RankingRow key={r.name} {...r} />
                        ))}
                      </tbody>
                    </table>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </main>
      </div>
    </>
  );
};

export default RankingsPage;
