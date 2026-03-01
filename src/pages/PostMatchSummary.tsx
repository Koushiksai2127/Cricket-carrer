import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import pb from '@/lib/pocketbaseClient';
import { DEFAULT_USER_ID } from '@/lib/defaultUser';
import Header from '@/components/Header';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Award, DollarSign, TrendingUp, Star, MessageSquare, Zap, Target, Shield, ChevronRight, User, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useToast } from '@/hooks/use-toast';

const POST_MATCH_DECISIONS = [
  {
    id: 'humble_interview',
    title: 'Humble Response',
    description: 'Credit the team and the bowlers. Builds dressing room trust.',
    impact: { dressing_room_trust: +10, media_pressure: -5, popularity: +5 },
    icon: Shield,
    color: 'text-blue-500',
    bgColor: 'bg-blue-50'
  },
  {
    id: 'bold_statement',
    title: 'Bold Statement',
    description: 'Talk about your individual process and future goals. Boosts media presence.',
    impact: { media_pressure: +10, popularity: +20, confidence: +10 },
    icon: Zap,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-50'
  },
  {
    id: 'technical_focus',
    title: 'Technical Analysis',
    description: 'Discuss the pitch conditions and your batting technique. Improves skill focus.',
    impact: { technique: +2, temperament: +5, media_pressure: +2 },
    icon: Target,
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-50'
  }
];

const PostMatchSummary = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [player, setPlayer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [decisionMade, setDecisionMade] = useState<any>(null);

  const summary = location.state || {
    result: 'Match Drawn',
    playerRuns: 0,
    playerWickets: 0,
    manOfMatch: false,
    earnings: 0,
    format: 'T20I',
    opponent: 'Australia',
    venue: "Lord's"
  };

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

  const handleDecision = async (decision: any) => {
    try {
      setDecisionMade(decision);
      const updatedPlayer = { ...player };
      
      Object.entries(decision.impact).forEach(([key, value]: [string, any]) => {
        updatedPlayer[key] = (updatedPlayer[key] || 0) + value;
      });

      await pb.collection('players').create(updatedPlayer); // Using create to mimic update in this mock
      setPlayer(updatedPlayer);

      toast({
        title: "Interview Complete",
        description: `Your response has impacted your career attributes.`,
      });
    } catch (error) {
      console.error('Failed to update player:', error);
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

  return (
    <>
      <Helmet>
        <title>Match Summary | Cricket Career</title>
      </Helmet>
      <div className="min-h-screen bg-[#f8fafc] text-slate-900">
        <Header />
        
        <main className="max-w-5xl mx-auto px-4 py-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-12"
          >
            <div className="text-center space-y-4">
              <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto shadow-xl shadow-yellow-100/50">
                <Trophy className="w-12 h-12 text-yellow-600" />
              </div>
              <h1 className="text-5xl font-black tracking-tighter text-slate-900 uppercase italic">Match Summary</h1>
              <p className="text-2xl font-bold text-blue-600 tracking-tight">{summary.result}</p>
              <div className="flex items-center justify-center space-x-4 text-slate-400 font-black uppercase tracking-widest text-xs">
                <span>{summary.format}</span>
                <span className="w-1.5 h-1.5 bg-slate-200 rounded-full" />
                <span>{summary.venue}</span>
                <span className="w-1.5 h-1.5 bg-slate-200 rounded-full" />
                <span>vs {summary.opponent}</span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <Card className="bg-white border-slate-100 rounded-[2.5rem] shadow-xl shadow-slate-200/50 overflow-hidden">
                <CardHeader className="bg-slate-900 p-8 text-white">
                  <CardTitle className="text-lg font-black flex items-center uppercase tracking-widest italic">
                    <User className="w-5 h-5 mr-3 text-blue-400" />
                    {player.name}'s Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-10 space-y-8">
                  <div className="grid grid-cols-2 gap-8">
                    <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Runs Scored</p>
                      <p className="text-5xl font-black text-slate-900 tracking-tighter">{summary.playerRuns}</p>
                    </div>
                    <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Wickets</p>
                      <p className="text-5xl font-black text-slate-900 tracking-tighter">{summary.playerWickets}</p>
                    </div>
                  </div>
                  {summary.manOfMatch && (
                    <motion.div 
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      className="p-6 bg-yellow-50 rounded-3xl border border-yellow-100 flex items-center space-x-4"
                    >
                      <div className="w-12 h-12 bg-yellow-400 rounded-2xl flex items-center justify-center shadow-lg shadow-yellow-200">
                        <Star className="w-6 h-6 text-white fill-current" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-yellow-700 uppercase tracking-tight">Player of the Match</p>
                        <p className="text-xs text-yellow-600 font-medium">Exceptional performance in a high-pressure game.</p>
                      </div>
                    </motion.div>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-white border-slate-100 rounded-[2.5rem] shadow-xl shadow-slate-200/50 overflow-hidden">
                <CardHeader className="bg-emerald-600 p-8 text-white">
                  <CardTitle className="text-lg font-black flex items-center uppercase tracking-widest italic">
                    <DollarSign className="w-5 h-5 mr-3 text-emerald-200" />
                    Rewards & Progression
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-10 space-y-8">
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 font-bold uppercase text-xs tracking-widest">Match Earnings</span>
                      <span className="text-3xl font-black text-emerald-600 tracking-tighter">${summary.earnings.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 font-bold uppercase text-xs tracking-widest">Popularity Gain</span>
                      <span className="text-2xl font-black text-blue-600 tracking-tighter">+{summary.manOfMatch ? 25 : 10}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 font-bold uppercase text-xs tracking-widest">Form Score</span>
                      <div className="text-right">
                        <span className="text-2xl font-black text-indigo-600 tracking-tighter">82/100</span>
                        <TrendingUp className="w-4 h-4 text-emerald-500 inline ml-2" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Post-Match Narrative Decision */}
            <Card className="bg-white border-slate-100 rounded-[2.5rem] shadow-xl shadow-slate-200/50 overflow-hidden">
              <CardHeader className="bg-slate-900 p-8 text-white flex flex-row items-center justify-between">
                <CardTitle className="text-xl font-black flex items-center uppercase tracking-widest italic">
                  <MessageSquare className="w-6 h-6 mr-3 text-blue-400" />
                  Post-Match Interview
                </CardTitle>
                {decisionMade && <span className="px-4 py-1 bg-blue-600 text-white text-[10px] font-black uppercase rounded-full">Completed</span>}
              </CardHeader>
              <CardContent className="p-10">
                {!decisionMade ? (
                  <div className="space-y-8">
                    <p className="text-slate-500 font-medium text-lg">The media is waiting for your comments. How will you handle the press?</p>
                    <div className="grid md:grid-cols-3 gap-6">
                      {POST_MATCH_DECISIONS.map((decision) => (
                        <button
                          key={decision.id}
                          onClick={() => handleDecision(decision)}
                          className="p-8 rounded-[2rem] border-2 border-slate-100 hover:border-blue-600 hover:bg-blue-50 transition-all duration-300 text-left group"
                        >
                          <div className={`w-12 h-12 ${decision.bgColor} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                            <decision.icon className={`w-6 h-6 ${decision.color}`} />
                          </div>
                          <h3 className="font-black text-slate-900 uppercase tracking-tight mb-2">{decision.title}</h3>
                          <p className="text-xs text-slate-500 leading-relaxed">{decision.description}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-8 bg-blue-50 rounded-[2rem] border border-blue-100"
                  >
                    <div className="flex items-center space-x-6">
                      <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <decisionMade.icon className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-black text-blue-900 tracking-tight uppercase italic">{decisionMade.title}</h3>
                        <p className="text-blue-600 font-medium">Your response has been well-received by the fans and team.</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>

            <div className="flex space-x-6">
              <Button 
                onClick={() => navigate('/')} 
                className="flex-1 py-10 text-2xl font-black bg-white text-slate-900 border-2 border-slate-100 hover:bg-slate-50 rounded-[2rem] uppercase tracking-widest transition-all hover:-translate-y-1"
              >
                Back to Hub
              </Button>
              <Button 
                onClick={() => navigate('/matches')} 
                className="flex-1 py-10 text-2xl font-black bg-blue-600 hover:bg-blue-700 text-white rounded-[2rem] uppercase tracking-widest shadow-2xl transition-all hover:-translate-y-1"
              >
                Next Match
              </Button>
            </div>
          </motion.div>
        </main>
      </div>
    </>
  );
};

export default PostMatchSummary;
