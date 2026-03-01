import React, { useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient';
import { DEFAULT_USER_ID } from '@/lib/defaultUser';
import Header from '@/components/Header';
import { Helmet } from 'react-helmet-async';
import { Brain, MessageSquare, Target, Zap, TrendingUp, Shield, Star, Award, Globe, Activity, Users, Megaphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'motion/react';

const DECISIONS = [
  {
    id: 'mindset_1',
    category: 'Pre-Match Mindset',
    title: 'Upcoming Big Match',
    description: 'The series decider is tomorrow. How will you prepare?',
    icon: Brain,
    color: 'text-blue-500',
    options: [
      { id: 'aggressive', text: 'Intense Training (Aggressive)', impact: { technique: +2, fitness: -5, confidence: +10 }, icon: Zap },
      { id: 'balanced', text: 'Mental Visualization (Balanced)', impact: { technique: +1, confidence: +5 }, icon: Brain },
      { id: 'relaxed', text: 'Rest & Recovery (Relaxed)', impact: { fitness: +10, confidence: -2 }, icon: Shield }
    ]
  },
  {
    id: 'interview_1',
    category: 'Post-Match Interview',
    title: 'Media Pressure',
    description: 'A journalist asks about your recent slump. How do you respond?',
    icon: Megaphone,
    color: 'text-rose-500',
    options: [
      { id: 'confident', text: 'Deflect with Confidence', impact: { media_pressure: -5, confidence: +5 }, icon: Star },
      { id: 'honest', text: 'Acknowledge & Promise Work', impact: { dressing_room_trust: +5, media_pressure: +2 }, icon: MessageSquare },
      { id: 'aggressive_media', text: 'Shut down the question', impact: { media_pressure: +10, confidence: +10 }, icon: Zap }
    ]
  },
  {
    id: 'captaincy_1',
    category: 'Career Milestone',
    title: 'Captaincy Offer',
    description: 'The selectors are offering you the T20I captaincy. It adds pressure but builds legacy.',
    icon: Award,
    color: 'text-amber-500',
    options: [
      { id: 'accept', text: 'Accept the Responsibility', impact: { greatness_index: +50, media_pressure: +20, dressing_room_trust: +10 }, icon: Award },
      { id: 'decline', text: 'Focus on my Batting', impact: { technique: +5, confidence: +5 }, icon: Target }
    ]
  },
  {
    id: 'mindset_2',
    category: 'Pre-Match Mindset',
    title: 'Pitch Analysis',
    description: 'The pitch looks like a green top with significant movement expected. How will you adjust your technique?',
    icon: Target,
    color: 'text-emerald-500',
    options: [
      { id: 'late', text: 'Play Late & Close', impact: { technique: +5, timing: -2, temperament: +3 }, icon: Shield },
      { id: 'counter', text: 'Counter-Attack', impact: { power: +5, technique: -3, confidence: +5 }, icon: Zap },
      { id: 'natural', text: 'Natural Game', impact: { confidence: +2, timing: +2 }, icon: Star }
    ]
  },
  {
    id: 'interview_2',
    category: 'Post-Match Interview',
    title: 'Team Performance Critique',
    description: 'The team lost a close game. The media asks if the captain\'s decisions were to blame for the defeat.',
    icon: MessageSquare,
    color: 'text-indigo-500',
    options: [
      { id: 'support', text: 'Support the Captain', impact: { dressing_room_trust: +10, media_pressure: +5, leadership: +2 }, icon: Users },
      { id: 'individual', text: 'Focus on Errors', impact: { technique: +2, dressing_room_trust: -5, work_ethic: +2 }, icon: Target },
      { id: 'nocomment', text: 'No Comment', impact: { media_pressure: +2, temperament: +2 }, icon: Shield }
    ]
  },
  {
    id: 'milestone_2',
    category: 'Career Milestone',
    title: 'County Cricket Offer',
    description: 'An English County offers you a short-term contract. It promises to improve your technique in swing conditions but will increase your workload significantly.',
    icon: Globe,
    color: 'text-cyan-500',
    options: [
      { id: 'accept_county', text: 'Accept the Challenge', impact: { technique: +10, workload_red: +20, greatness_index: +20, stamina: -5 }, icon: Globe },
      { id: 'decline_county', text: 'Focus on Internationals', impact: { confidence: +5, workload_red: -10, fitness: +5 }, icon: Activity }
    ]
  }
];

const DecisionsPage = () => {
  const [player, setPlayer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

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

  const handleDecision = async (decision: any, option: any) => {
    try {
      const updatedPlayer = { ...player };
      
      // Apply impacts
      Object.entries(option.impact).forEach(([key, value]: [string, any]) => {
        updatedPlayer[key] = (updatedPlayer[key] || 0) + value;
      });

      await pb.collection('players').create(updatedPlayer);
      setPlayer(updatedPlayer);

      toast({
        title: "Decision Made",
        description: `Your choice has impacted your career attributes.`,
      });
    } catch (error) {
      console.error('Failed to update player:', error);
    }
  };

  if (loading || !player) {
    return (
      <div className="min-h-screen bg-gray-50">
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
        <title>Career Decisions | Cricket Career</title>
      </Helmet>
      <div className="min-h-screen bg-[#f8fafc] text-slate-900">
        <Header />
        
        <main className="max-w-5xl mx-auto px-4 py-12">
          <div className="mb-12">
            <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-2">Choice-Based Narrative</h1>
            <p className="text-slate-500 font-medium">Your decisions shape your legacy, reputation, and performance.</p>
          </div>

          <div className="grid gap-8">
            <AnimatePresence>
              {DECISIONS.map((decision, idx) => (
                <motion.div
                  key={decision.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card className="bg-white border-slate-200 rounded-[2rem] shadow-xl shadow-slate-200/50 overflow-hidden">
                    <div className="bg-slate-50 px-8 py-4 border-b border-slate-100 flex justify-between items-center">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{decision.category}</span>
                      {(() => {
                        const DecisionIcon = decision.icon;
                        return <DecisionIcon className={`w-4 h-4 ${decision.color} transition-colors`} />;
                      })()}
                    </div>
                    <CardContent className="p-8">
                      <div className="mb-8">
                        <h2 className="text-2xl font-black text-slate-900 mb-2">{decision.title}</h2>
                        <p className="text-slate-500 leading-relaxed">{decision.description}</p>
                      </div>

                      <div className="grid md:grid-cols-3 gap-4">
                        {decision.options.map((option) => {
                          const Icon = option.icon;
                          return (
                            <Button
                              key={option.id}
                              variant="outline"
                              onClick={() => handleDecision(decision, option)}
                              className="h-auto py-6 px-6 flex flex-col items-center text-center space-y-3 rounded-2xl border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition-all group"
                            >
                              <div className="p-3 bg-slate-100 rounded-xl group-hover:bg-blue-100 transition-colors">
                                <Icon className="w-6 h-6 text-slate-600 group-hover:text-blue-600" />
                              </div>
                              <span className="font-bold text-sm text-slate-700 group-hover:text-blue-700">{option.text}</span>
                            </Button>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </main>
      </div>
    </>
  );
};

export default DecisionsPage;
