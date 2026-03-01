import React, { useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient';
import { DEFAULT_USER_ID } from '@/lib/defaultUser';
import Header from '@/components/Header';
import { Helmet } from 'react-helmet-async';
import { Book, Trophy, Star, History, Target, Zap, Globe, Award, TrendingUp, User, Shield, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion, AnimatePresence } from 'motion/react';

const RecordsPage = () => {
  const [loading, setLoading] = useState(true);
  const [player, setPlayer] = useState<any>(null);
  const [worldRecords, setWorldRecords] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [playerData, recordsData] = await Promise.all([
        pb.collection('players').getFullList({
          filter: `userId = "${DEFAULT_USER_ID}"`,
        }),
        pb.collection('world_records').getFullList()
      ]);

      if (playerData.length > 0) {
        setPlayer(playerData[0]);
      }
      setWorldRecords(recordsData);
    } catch (error) {
      console.error('Failed to load records data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !player) {
    return (
      <div className="min-h-screen bg-[#f8fafc]">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  const RecordItem = ({ title, holder, value, year, impact, format }: any) => (
    <motion.div 
      whileHover={{ scale: 1.02, x: 5 }}
      className="flex items-center justify-between p-6 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 group"
    >
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:bg-blue-50 transition-colors">
          <Globe className={`w-6 h-6 ${format === 'Test' ? 'text-rose-400' : format === 'ODI' ? 'text-blue-400' : 'text-emerald-400'} group-hover:scale-110 transition-transform`} />
        </div>
        <div>
          <h4 className="font-black text-slate-900 tracking-tight">{title}</h4>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{holder} • {format}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-2xl font-black text-slate-900 tracking-tighter group-hover:text-blue-600 transition-colors">{value}</p>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{year || 'All-Time'}</p>
      </div>
    </motion.div>
  );

  const getRecordsByCategory = (category: string, format?: string) => {
    return worldRecords.filter(r => r.category === category && (!format || r.format === format));
  };

  return (
    <>
      <Helmet>
        <title>Hall of Records | Cricket Career</title>
      </Helmet>
      <div className="min-h-screen bg-[#f8fafc] text-slate-900">
        <Header />
        
        <main className="max-w-7xl mx-auto px-4 py-12">
          <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-5xl font-black tracking-tighter text-slate-900 mb-3 flex items-center uppercase italic">
                <Award className="w-12 h-12 mr-4 text-blue-600" />
                Hall of Records
              </h1>
              <p className="text-slate-500 font-medium text-lg">Historical milestones and your path to immortality.</p>
            </div>
            <div className="flex items-center space-x-6 bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50">
              <div className="text-right">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Legacy Score</p>
                <p className="text-3xl font-black text-blue-600 tracking-tighter">{(player.greatness_index || 0).toLocaleString()}</p>
              </div>
              <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>

          <Tabs defaultValue="batting" className="space-y-12">
            <TabsList className="bg-white border border-slate-100 p-2 rounded-[2rem] shadow-sm inline-flex">
              <TabsTrigger value="batting" className="rounded-2xl px-10 py-3 data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all font-black uppercase tracking-widest text-xs">Batting</TabsTrigger>
              <TabsTrigger value="bowling" className="rounded-2xl px-10 py-3 data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all font-black uppercase tracking-widest text-xs">Bowling</TabsTrigger>
              <TabsTrigger value="personal" className="rounded-2xl px-10 py-3 data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all font-black uppercase tracking-widest text-xs">My Legacy</TabsTrigger>
            </TabsList>

            <TabsContent value="batting" className="grid lg:grid-cols-2 gap-8">
              <Card className="bg-white border-slate-100 rounded-[2.5rem] shadow-xl shadow-slate-200/50 overflow-hidden">
                <CardHeader className="bg-slate-900 p-8 text-white">
                  <CardTitle className="text-xl font-black flex items-center uppercase tracking-widest italic">
                    <Trophy className="w-6 h-6 mr-3 text-yellow-500" />
                    Test Milestones
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-4">
                  {getRecordsByCategory('batting', 'Test').map(r => (
                    <RecordItem key={r.id} title={r.record_name} holder={r.holder_name} value={`${r.value} ${r.unit}`} format={r.format} />
                  ))}
                  <RecordItem title="Highest Average" holder="Don Bradman" value="99.94" year="1928-1948" format="Test" />
                </CardContent>
              </Card>

              <Card className="bg-white border-slate-100 rounded-[2.5rem] shadow-xl shadow-slate-200/50 overflow-hidden">
                <CardHeader className="bg-blue-700 p-8 text-white">
                  <CardTitle className="text-xl font-black flex items-center uppercase tracking-widest italic">
                    <Star className="w-6 h-6 mr-3 text-blue-200" />
                    ODI Milestones
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-4">
                  {getRecordsByCategory('batting', 'ODI').map(r => (
                    <RecordItem key={r.id} title={r.record_name} holder={r.holder_name} value={`${r.value} ${r.unit}`} format={r.format} />
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="bowling" className="grid lg:grid-cols-2 gap-8">
              <Card className="bg-white border-slate-100 rounded-[2.5rem] shadow-xl shadow-slate-200/50 overflow-hidden">
                <CardHeader className="bg-indigo-800 p-8 text-white">
                  <CardTitle className="text-xl font-black flex items-center uppercase tracking-widest italic">
                    <Zap className="w-6 h-6 mr-3 text-indigo-300" />
                    Bowling Legends
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-4">
                  {getRecordsByCategory('bowling').map(r => (
                    <RecordItem key={r.id} title={r.record_name} holder={r.holder_name} value={`${r.value} ${r.unit}`} format={r.format} />
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-white border-slate-100 rounded-[2.5rem] shadow-xl shadow-slate-200/50 overflow-hidden">
                <CardHeader className="bg-slate-50 p-8 border-b border-slate-100">
                  <CardTitle className="text-xl font-black flex items-center uppercase tracking-widest italic text-slate-400">
                    <Shield className="w-6 h-6 mr-3" />
                    Fielding Records
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-4">
                  <RecordItem title="Most Career Catches" holder="Mahela Jayawardene" value="440" year="1997-2015" format="All" />
                  <RecordItem title="Most Wicketkeeping Dismissals" holder="Mark Boucher" value="998" year="1997-2012" format="All" />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="personal">
              <Card className="bg-white border-slate-100 rounded-[3rem] shadow-xl shadow-slate-200/50 overflow-hidden">
                <CardHeader className="bg-gradient-to-br from-slate-900 to-blue-900 p-12 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-12 opacity-10">
                    <History className="w-48 h-48" />
                  </div>
                  <div className="relative z-10">
                    <CardTitle className="text-4xl font-black flex items-center uppercase tracking-tighter italic">
                      <History className="w-10 h-10 mr-5 text-blue-400" />
                      {player.name}'s Career Legacy
                    </CardTitle>
                    <p className="text-blue-100 mt-4 font-medium text-lg max-w-2xl">Tracking your path to greatness and record-breaking alerts. Every run, every wicket, every moment counts towards your immortality.</p>
                  </div>
                </CardHeader>
                <CardContent className="p-12">
                  <div className="grid md:grid-cols-3 gap-10">
                    <motion.div 
                      whileHover={{ y: -10 }}
                      className="p-10 bg-blue-50 rounded-[3rem] border border-blue-100 text-center group transition-all"
                    >
                      <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg group-hover:bg-blue-600 transition-colors">
                        <Target className="w-8 h-8 text-blue-600 group-hover:text-white" />
                      </div>
                      <p className="text-[10px] text-blue-600 font-black uppercase tracking-[0.2em] mb-3">Highest Score</p>
                      <p className="text-6xl font-black text-blue-900 tracking-tighter">0</p>
                      <div className="mt-6 pt-6 border-t border-blue-100">
                        <p className="text-xs text-blue-400 font-bold uppercase tracking-widest">No matches played</p>
                      </div>
                    </motion.div>

                    <motion.div 
                      whileHover={{ y: -10 }}
                      className="p-10 bg-emerald-50 rounded-[3rem] border border-emerald-100 text-center group transition-all"
                    >
                      <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg group-hover:bg-emerald-600 transition-colors">
                        <Zap className="w-8 h-8 text-emerald-600 group-hover:text-white" />
                      </div>
                      <p className="text-[10px] text-emerald-600 font-black uppercase tracking-[0.2em] mb-3">Best Bowling</p>
                      <p className="text-6xl font-black text-emerald-900 tracking-tighter">0/0</p>
                      <div className="mt-6 pt-6 border-t border-emerald-100">
                        <p className="text-xs text-emerald-400 font-bold uppercase tracking-widest">No matches played</p>
                      </div>
                    </motion.div>

                    <motion.div 
                      whileHover={{ y: -10 }}
                      className="p-10 bg-indigo-50 rounded-[3rem] border border-indigo-100 text-center group transition-all"
                    >
                      <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg group-hover:bg-indigo-600 transition-colors">
                        <Star className="w-8 h-8 text-indigo-600 group-hover:text-white" />
                      </div>
                      <p className="text-[10px] text-indigo-600 font-black uppercase tracking-[0.2em] mb-3">Fastest 50</p>
                      <p className="text-6xl font-black text-indigo-900 tracking-tighter">N/A</p>
                      <div className="mt-6 pt-6 border-t border-indigo-100">
                        <p className="text-xs text-indigo-400 font-bold uppercase tracking-widest">No matches played</p>
                      </div>
                    </motion.div>
                  </div>

                  <div className="mt-16 p-12 bg-slate-900 rounded-[3rem] text-white relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 p-12 opacity-10">
                      <Award className="w-48 h-48" />
                    </div>
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-8">
                        <h3 className="text-3xl font-black flex items-center uppercase italic tracking-tighter">
                          <TrendingUp className="w-8 h-8 mr-4 text-blue-400" />
                          Next Record Target
                        </h3>
                        <span className="px-6 py-2 bg-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest">Priority Target</span>
                      </div>
                      <p className="text-slate-400 font-medium text-xl mb-10 max-w-2xl">You are <span className="text-white font-black">15,921 runs</span> away from breaking Sachin Tendulkar's record for Most Test Runs.</p>
                      <div className="w-full bg-white/10 h-4 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: '0%' }}
                          className="h-full bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.5)]"
                        />
                      </div>
                      <div className="flex justify-between mt-4 text-xs font-black uppercase tracking-widest text-slate-500">
                        <span>Current: 0</span>
                        <span>Target: 15,921</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </>
  );
};

export default RecordsPage;
