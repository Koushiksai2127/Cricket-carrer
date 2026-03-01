import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import pb from '@/lib/pocketbaseClient';
import { DEFAULT_USER_ID } from '@/lib/defaultUser';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, TrendingUp, Calendar, Award, User, BarChart3, Brain, Activity, Users, Megaphone, Zap, BarChart, Target, Shield, Star, History, ChevronRight, DollarSign } from 'lucide-react';

const HomePage = () => {
  const [player, setPlayer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadPlayerData();
  }, []);

  const loadPlayerData = async () => {
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your career...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!player) {
    return (
      <>
        <Helmet>
          <title>Cricket Career Manager - Start Your Journey</title>
          <meta name="description" content="Create your cricket career and become a legend" />
        </Helmet>
        <div className="min-h-screen bg-gray-50">
          <Header />
          
          <div 
            className="relative h-[600px] bg-cover bg-center"
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('https://images.unsplash.com/photo-1695654812871-5890f332e60f')`
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white px-4 max-w-3xl">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Trophy className="w-24 h-24 mx-auto mb-8 text-yellow-500" />
                  <h1 className="text-6xl md:text-7xl font-black mb-6 tracking-tight">BECOME THE NEXT LEGEND</h1>
                  <p className="text-xl md:text-2xl mb-10 text-gray-300 font-light leading-relaxed">
                    Experience the most immersive cricket career simulation. From local grounds to World Cup finals.
                  </p>
                  <Button 
                    size="lg" 
                    className="text-xl px-12 py-8 bg-blue-600 hover:bg-blue-700 rounded-full shadow-2xl transition-all hover:scale-105"
                    onClick={() => navigate('/career-creation')}
                  >
                    Start Your Journey
                  </Button>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  const StatProgressBar = ({ label, value, color = "bg-blue-600", max = 100 }: any) => (
    <div className="space-y-1">
      <div className="flex justify-between text-xs font-medium uppercase tracking-wider text-gray-500">
        <span>{label}</span>
        <span>{value}/{max}</span>
      </div>
      <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${(value / max) * 100}%` }}
          className={`h-full ${color}`}
        />
      </div>
    </div>
  );

  return (
    <>
      <Helmet>
        <title>{`${player.name} - Dashboard`}</title>
      </Helmet>
      <div className="min-h-screen bg-[#f8fafc]">
        <Header />
        
        {/* Hero Section */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="flex items-center space-x-6">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center text-white shadow-lg">
                  <User className="w-12 h-12" />
                </div>
                <div>
                  <div className="flex items-center space-x-3 mb-1">
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">{player.name}</h1>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full uppercase tracking-widest">
                      {player.archetype || 'Balanced'}
                    </span>
                  </div>
                  <p className="text-lg text-gray-500 font-medium">
                    {player.role} • {player.country} • Age {player.age}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Net Worth</p>
                  <p className="text-3xl font-black text-green-600">${(player.net_worth || 0).toLocaleString()}</p>
                </div>
                <div className="h-12 w-px bg-gray-200 mx-4 hidden md:block" />
                <Button 
                  size="lg" 
                  onClick={() => navigate('/matches')}
                  className="bg-gray-900 hover:bg-black text-white px-8 py-6 rounded-xl font-bold text-lg shadow-xl transition-all hover:-translate-y-1"
                >
                  Next Match
                </Button>
                <Button 
                  variant="outline"
                  onClick={async () => {
                    if (confirm("Are you sure you want to delete all career data and start over? This cannot be undone.")) {
                      await pb.resetCareer(DEFAULT_USER_ID);
                      window.location.reload();
                    }
                  }}
                  className="px-6 py-6 rounded-xl font-bold text-red-600 border-red-100 hover:bg-red-50 transition-all"
                >
                  Reset Career
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="grid lg:grid-cols-12 gap-8">
            
            {/* Left Column: Status & Progression */}
            <div className="lg:col-span-8 space-y-8">
              
              {/* Primary Stats Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                
                {/* Mental Status Card */}
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-purple-50 rounded-xl">
                        <Brain className="w-6 h-6 text-purple-600" />
                      </div>
                      <h2 className="text-xl font-bold text-gray-900">Psychological State</h2>
                    </div>
                    {player.slump_active ? (
                      <span className="px-3 py-1 bg-red-100 text-red-700 text-[10px] font-black rounded-full uppercase">In Slump</span>
                    ) : (
                      <span className="px-3 py-1 bg-green-100 text-green-700 text-[10px] font-black rounded-full uppercase">Stable</span>
                    )}
                  </div>
                  <div className="space-y-6">
                    <StatProgressBar label="Confidence" value={player.confidence || 50} color="bg-purple-600" />
                    <StatProgressBar label="Media Pressure" value={player.media_pressure || 0} color="bg-orange-500" />
                    <div className="pt-2">
                      <p className="text-xs text-gray-400 font-medium uppercase tracking-widest mb-2">Mental Resilience</p>
                      <div className="flex items-center space-x-2">
                        <Zap className="w-4 h-4 text-yellow-500" />
                        <span className="text-lg font-bold text-gray-900">{player.temperament || 50}</span>
                        <span className="text-xs text-gray-400">/ 100</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Workload & Fitness Card */}
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                  <div className="flex items-center space-x-3 mb-8">
                    <div className="p-2 bg-red-50 rounded-xl">
                      <Activity className="w-6 h-6 text-red-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">Workload & Fitness</h2>
                  </div>
                  <div className="space-y-6">
                    <StatProgressBar label="Red-Ball Workload" value={player.workload_red || 0} color="bg-red-700" />
                    <StatProgressBar label="White-Ball Workload" value={player.workload_white || 0} color="bg-blue-500" />
                    <StatProgressBar label="Physical Fitness" value={player.fitness || 75} color="bg-green-500" />
                  </div>
                </div>
              </div>

              {/* Team Chemistry & Reputation */}
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-50 rounded-xl">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">Team Dynamics</h2>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Team Morale</p>
                    <p className="text-2xl font-black text-blue-600">{player.team_morale || 70}%</p>
                  </div>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Dressing Room Trust</p>
                    <div className="flex items-baseline space-x-1">
                      <span className="text-3xl font-black text-gray-900">{player.dressing_room_trust || 70}</span>
                      <span className="text-sm text-gray-400">/ 100</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Popularity Index</p>
                    <div className="flex items-baseline space-x-1">
                      <span className="text-3xl font-black text-gray-900">{player.popularity || 10}</span>
                      <span className="text-sm text-gray-400">/ 100</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Greatness Index</p>
                    <div className="flex items-baseline space-x-1">
                      <span className="text-3xl font-black text-indigo-600">{(player.greatness_index || 0).toFixed(1)}</span>
                      <span className="text-sm text-gray-400">/ 100</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Headlines */}
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <div className="flex items-center space-x-3 mb-6">
                  <Megaphone className="w-6 h-6 text-orange-600" />
                  <h2 className="text-xl font-bold text-gray-900">Media Headlines</h2>
                </div>
                <div className="space-y-4">
                  {[
                    { title: "Rising Star?", content: `${player.name} shows promise in recent training sessions.`, time: "2h ago", type: "positive" },
                    { title: "Selection Dilemma", content: "National selectors keeping a close eye on the youngster.", time: "5h ago", type: "neutral" }
                  ].map((news, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-bold text-gray-900">{news.title}</h3>
                        <span className="text-[10px] text-gray-400 font-bold uppercase">{news.time}</span>
                      </div>
                      <p className="text-sm text-gray-600">{news.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Quick Actions & Calendar */}
            <div className="lg:col-span-4 space-y-8">
              
              {/* Calendar Card */}
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <div className="flex items-center space-x-3 mb-6">
                  <Calendar className="w-6 h-6 text-blue-600" />
                  <h2 className="text-xl font-bold text-gray-900">Schedule</h2>
                </div>
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100">
                    <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-1">Upcoming Series</p>
                    <p className="font-bold text-gray-900">Domestic T20 League</p>
                    <p className="text-xs text-gray-500">Starts in 3 days</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 opacity-50">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Future Event</p>
                    <p className="font-bold text-gray-900">U19 World Cup</p>
                    <p className="text-xs text-gray-500">Next Month</p>
                  </div>
                </div>
              </div>

              {/* Quick Links Grid */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { to: "/statistics", label: "Stats", icon: <BarChart className="w-5 h-5" />, color: "bg-blue-50 text-blue-600" },
                  { to: "/rankings", label: "Rankings", icon: <Award className="w-5 h-5" />, color: "bg-yellow-50 text-yellow-600" },
                  { to: "/profile", label: "Profile", icon: <User className="w-5 h-5" />, color: "bg-purple-50 text-purple-600" },
                  { to: "/decisions", label: "Choices", icon: <Brain className="w-5 h-5" />, color: "bg-orange-50 text-orange-600" },
                ].map((link) => (
                  <Link 
                    key={link.to} 
                    to={link.to} 
                    className="flex flex-col items-center justify-center p-6 rounded-3xl bg-white shadow-sm border border-gray-100 hover:shadow-md transition-all hover:-translate-y-1"
                  >
                    <div className={`p-3 rounded-2xl ${link.color} mb-3`}>
                      {link.icon}
                    </div>
                    <span className="text-sm font-bold text-gray-900">{link.label}</span>
                  </Link>
                ))}
              </div>

              {/* Career Goal Card */}
              <div className="bg-gradient-to-br from-gray-900 to-blue-900 rounded-3xl p-8 text-white shadow-xl">
                <h3 className="text-lg font-bold mb-4">Current Objective</h3>
                <p className="text-gray-300 text-sm mb-6 leading-relaxed">
                  Perform consistently in the Domestic T20 league to catch the eye of national selectors for the upcoming U19 World Cup.
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    <span>Progress</span>
                    <span>40%</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full w-[40%] bg-blue-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
