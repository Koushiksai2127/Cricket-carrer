import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import pb from '@/lib/pocketbaseClient';
import { DEFAULT_USER_ID } from '@/lib/defaultUser';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import { Helmet } from 'react-helmet-async';
import { useToast } from '@/hooks/use-toast';
import { Trophy, Cloud, MapPin, Zap, Brain, Target, Shield, Award, MessageSquare, ChevronRight, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const PRE_MATCH_DECISIONS = [
  {
    id: 'aggressive_start',
    title: 'Aggressive Intent',
    description: 'Take the attack to the bowlers from ball one. High risk, high reward.',
    impact: { technique: -2, confidence: +10, power: +5 },
    icon: Zap,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-50'
  },
  {
    id: 'cautious_approach',
    title: 'Solid Defense',
    description: 'Focus on leaving the ball and building a long innings. Low risk, steady growth.',
    impact: { technique: +5, confidence: +2, temperament: +5 },
    icon: Shield,
    color: 'text-blue-500',
    bgColor: 'bg-blue-50'
  },
  {
    id: 'balanced_mindset',
    title: 'Balanced Game',
    description: 'React to the ball and play on merit. Optimal for long-term consistency.',
    impact: { technique: +1, confidence: +5, shot_selection: +5 },
    icon: Brain,
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-50'
  }
];

const MatchSimulationEngine = () => {
  const [player, setPlayer] = useState<any>(null);
  const [stadiums, setStadiums] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [matchSetup, setMatchSetup] = useState({
    format: 'T20I',
    matchType: 'International',
    teamA: '',
    teamB: '',
    stadium: '',
    tossWon: false,
    battingFirst: false
  });
  const [preMatchDecision, setPreMatchDecision] = useState<any>(null);
  const [simulating, setSimulating] = useState(false);
  const [matchStarted, setMatchStarted] = useState(false);
  const [simProgress, setSimProgress] = useState(0);
  const [commentary, setCommentary] = useState<string[]>([]);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const playerData = await pb.collection('players').getFullList({
        filter: `userId = "${DEFAULT_USER_ID}"`,
      });

      if (playerData.length === 0) {
        navigate('/career-creation');
        return;
      }

      const stadiumsData = await pb.collection('stadiums').getFullList();
      const teamsData = await pb.collection('teams').getFullList();

      setPlayer(playerData[0]);
      setStadiums(stadiumsData);
      setTeams(teamsData);
      setMatchSetup(prev => ({
        ...prev,
        teamA: playerData[0].current_team || playerData[0].country,
        teamB: teamsData.find(t => t.team_name !== (playerData[0].current_team || playerData[0].country))?.team_name || 'Australia'
      }));
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load match data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTossDecision = (battingFirst: boolean) => {
    setMatchSetup({ ...matchSetup, tossWon: true, battingFirst });
  };

  const startMatch = () => {
    if (!preMatchDecision) {
      toast({
        title: "Decision Required",
        description: "Please select your pre-match mindset first.",
        variant: "destructive"
      });
      return;
    }

    setMatchStarted(true);
    setSimulating(true);
    
    const commentaryLines = [
      `The players are walking out to the middle at ${stadiums[0]?.name || "Lord's"}.`,
      `${player.name} looks focused in the dugout.`,
      `The new ball is shared. Here we go!`,
      `${player.name} comes to the crease. The crowd erupts!`,
      `Beautiful drive through the covers! That's four!`,
      `A huge appeal for LBW! Not out says the umpire.`,
      `The simulation is reaching its climax...`
    ];

    let currentLine = 0;
    const interval = setInterval(() => {
      setSimProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          finishMatch();
          return 100;
        }
        if (prev % 15 === 0 && currentLine < commentaryLines.length) {
          setCommentary(c => [commentaryLines[currentLine], ...c]);
          currentLine++;
        }
        return prev + 2;
      });
    }, 100);
  };

  const finishMatch = () => {
    const runs = Math.floor(Math.random() * 100) + (preMatchDecision.id === 'aggressive_start' ? 30 : 10);
    const wickets = Math.floor(Math.random() * 3);
    
    navigate('/post-match-summary', {
      state: {
        result: Math.random() > 0.4 ? 'Won by 25 runs' : 'Lost by 3 wickets',
        playerRuns: runs,
        playerWickets: wickets,
        manOfMatch: runs > 80 || (runs > 50 && wickets > 1),
        earnings: 50000,
        format: matchSetup.format,
        opponent: matchSetup.teamB,
        venue: stadiums[0]?.name || "Lord's"
      }
    });
  };

  if (loading || !player) {
    return (
      <div className="min-h-screen bg-[#f8fafc]">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Preparing Match Engine...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Match Simulation | Cricket Career</title>
      </Helmet>
      <div className="min-h-screen bg-[#f8fafc] text-slate-900">
        <Header />
        
        <main className="max-w-6xl mx-auto px-4 py-12">
          {!matchStarted ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-12"
            >
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                  <h1 className="text-5xl font-black tracking-tighter text-slate-900 mb-3 flex items-center uppercase italic">
                    <Zap className="w-12 h-12 mr-4 text-blue-600" />
                    Match Day
                  </h1>
                  <p className="text-slate-500 font-medium text-lg">Prepare for your next appearance on the world stage.</p>
                </div>
                <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 flex items-center space-x-8">
                  <div className="text-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{matchSetup.teamA}</p>
                    <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto">
                      <Shield className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="text-2xl font-black text-slate-300 italic">VS</div>
                  <div className="text-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{matchSetup.teamB}</p>
                    <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto">
                      <Shield className="w-6 h-6 text-rose-600" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                  {/* Pre-Match Narrative Decisions */}
                  <Card className="bg-white border-slate-100 rounded-[2.5rem] shadow-xl shadow-slate-200/50 overflow-hidden">
                    <CardHeader className="bg-slate-900 p-8 text-white">
                      <CardTitle className="text-xl font-black flex items-center uppercase tracking-widest italic">
                        <Brain className="w-6 h-6 mr-3 text-blue-400" />
                        Pre-Match Mindset
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8">
                      <div className="grid md:grid-cols-3 gap-6">
                        {PRE_MATCH_DECISIONS.map((decision) => (
                          <button
                            key={decision.id}
                            onClick={() => setPreMatchDecision(decision)}
                            className={`p-6 rounded-3xl border-2 text-left transition-all duration-300 group ${preMatchDecision?.id === decision.id ? 'border-blue-600 bg-blue-50 shadow-lg' : 'border-slate-100 hover:border-slate-200 bg-white'}`}
                          >
                            <div className={`w-12 h-12 ${decision.bgColor} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                              <decision.icon className={`w-6 h-6 ${decision.color}`} />
                            </div>
                            <h3 className="font-black text-slate-900 uppercase tracking-tight mb-2">{decision.title}</h3>
                            <p className="text-xs text-slate-500 leading-relaxed">{decision.description}</p>
                          </button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Toss & Setup */}
                  <Card className="bg-white border-slate-100 rounded-[2.5rem] shadow-xl shadow-slate-200/50 overflow-hidden">
                    <CardContent className="p-10">
                      {!matchSetup.tossWon ? (
                        <div className="text-center space-y-8">
                          <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
                            <Zap className="w-10 h-10 text-yellow-600" />
                          </div>
                          <div>
                            <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase italic">The Toss</h2>
                            <p className="text-slate-500 font-medium">You won the toss at {stadiums[0]?.name || "Lord's"}! What is your call?</p>
                          </div>
                          <div className="flex justify-center space-x-6">
                            <Button onClick={() => handleTossDecision(true)} className="px-12 py-8 text-xl font-black bg-blue-600 hover:bg-blue-700 rounded-3xl uppercase tracking-widest shadow-xl">
                              Bat First
                            </Button>
                            <Button onClick={() => handleTossDecision(false)} variant="outline" className="px-12 py-8 text-xl font-black border-slate-200 hover:bg-slate-50 rounded-3xl uppercase tracking-widest">
                              Bowl First
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center space-y-8">
                          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                            <Trophy className="w-10 h-10 text-blue-600" />
                          </div>
                          <div>
                            <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase italic">Ready to Play</h2>
                            <p className="text-slate-500 font-medium">You've decided to {matchSetup.battingFirst ? 'Bat' : 'Bowl'} first. The team is ready.</p>
                          </div>
                          <Button onClick={startMatch} className="px-20 py-10 text-3xl font-black bg-gray-900 hover:bg-black text-white rounded-[2rem] uppercase tracking-[0.2em] shadow-2xl transition-all hover:-translate-y-2">
                            Start Simulation
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-8">
                  <Card className="bg-white border-slate-100 rounded-[2.5rem] shadow-xl shadow-slate-200/50 overflow-hidden">
                    <CardHeader className="bg-slate-50 p-8 border-b border-slate-100">
                      <CardTitle className="text-lg font-black flex items-center uppercase tracking-widest">
                        <MapPin className="w-5 h-5 mr-3 text-slate-400" />
                        Venue Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 space-y-6">
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Stadium</p>
                        <p className="font-bold text-slate-900">{stadiums[0]?.name || "Lord's Cricket Ground"}</p>
                      </div>
                      <div className="flex justify-between">
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Weather</p>
                          <div className="flex items-center text-slate-900 font-bold">
                            <Cloud className="w-4 h-4 mr-2 text-blue-400" />
                            Overcast
                          </div>
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Pitch</p>
                          <p className="font-bold text-slate-900">Green Top</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] p-8 text-white shadow-xl">
                    <h3 className="text-xl font-black mb-4 uppercase tracking-widest italic">Match Context</h3>
                    <p className="text-blue-100 font-medium leading-relaxed">
                      A crucial {matchSetup.format} match against {matchSetup.teamB}. A win here would significantly boost your ICC ranking and team morale.
                    </p>
                    <div className="mt-6 pt-6 border-t border-white/10">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-black uppercase tracking-widest text-blue-200">Win Probability</span>
                        <span className="text-2xl font-black">54%</span>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="max-w-4xl mx-auto space-y-12">
              <div className="text-center space-y-8">
                <div className="relative inline-block">
                  <div className="w-32 h-32 border-8 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-black text-blue-600 tracking-tighter">{simProgress}%</span>
                  </div>
                </div>
                <div>
                  <h2 className="text-5xl font-black text-slate-900 tracking-tighter uppercase italic">Match in Progress</h2>
                  <p className="text-xl text-slate-500 font-medium">Simulating every ball, every decision, every moment...</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <Card className="bg-slate-900 border-none rounded-[3rem] shadow-2xl overflow-hidden h-[400px] flex flex-col">
                  <CardHeader className="p-8 border-b border-white/5">
                    <CardTitle className="text-white font-black uppercase tracking-widest flex items-center">
                      <MessageSquare className="w-5 h-5 mr-3 text-blue-400" />
                      Live Commentary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8 overflow-y-auto flex-1 space-y-4 scrollbar-hide">
                    <AnimatePresence>
                      {commentary.map((line, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className={`p-4 rounded-2xl ${i === 0 ? 'bg-blue-600 text-white' : 'bg-white/5 text-slate-400'}`}
                        >
                          <p className="text-sm font-medium">{line}</p>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </CardContent>
                </Card>

                <div className="space-y-8">
                  <Card className="bg-white border-slate-100 rounded-[3rem] shadow-xl p-8">
                    <h3 className="text-lg font-black mb-6 uppercase tracking-widest flex items-center">
                      <Target className="w-5 h-5 mr-3 text-rose-500" />
                      Live Score Simulation
                    </h3>
                    <div className="space-y-6">
                      <div className="flex justify-between items-end">
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{matchSetup.teamA}</p>
                          <p className="text-4xl font-black text-slate-900 tracking-tighter">142/4</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Overs</p>
                          <p className="text-2xl font-black text-slate-900 tracking-tighter">16.4</p>
                        </div>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${simProgress}%` }}
                          className="h-full bg-blue-600"
                        />
                      </div>
                    </div>
                  </Card>

                  <Card className="bg-white border-slate-100 rounded-[3rem] shadow-xl p-8">
                    <h3 className="text-lg font-black mb-6 uppercase tracking-widest flex items-center">
                      <User className="w-5 h-5 mr-3 text-blue-500" />
                      Your Performance
                    </h3>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="p-4 bg-slate-50 rounded-2xl">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Runs</p>
                        <p className="text-3xl font-black text-slate-900 tracking-tighter">42*</p>
                      </div>
                      <div className="p-4 bg-slate-50 rounded-2xl">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Balls</p>
                        <p className="text-3xl font-black text-slate-900 tracking-tighter">28</p>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default MatchSimulationEngine;
