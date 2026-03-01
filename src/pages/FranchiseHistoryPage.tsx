import React, { useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient';
import { DEFAULT_USER_ID } from '@/lib/defaultUser';
import Header from '@/components/Header';
import { Helmet } from 'react-helmet-async';
import { Shield, Trophy, Users, History, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const FranchiseHistoryPage = () => {
  const [player, setPlayer] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
        const historyData = await pb.collection('franchise_contracts').getFullList({
          filter: `player_id = "${playerData[0].id}"`,
          sort: '-created'
        });
        setHistory(historyData);
      }
    } catch (error) {
      console.error('Failed to load franchise history:', error);
    } finally {
      setLoading(false);
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
        <title>Franchise History - Cricket Career Manager</title>
      </Helmet>
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Shield className="w-8 h-8 mr-3 text-blue-600" />
              Franchise History
            </h1>
            <p className="text-gray-600 mt-1">Your journey through global T20 leagues</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {history.length > 0 ? history.map((entry) => (
                <Card key={entry.id} className="overflow-hidden">
                  <div className="flex">
                    <div className="w-2 bg-blue-600"></div>
                    <div className="flex-1 p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{entry.team_name}</h3>
                          <p className="text-sm text-gray-500">{entry.league_name} • {entry.season}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-emerald-600">${entry.salary.toLocaleString()}</p>
                          <p className="text-xs text-gray-400">Contract: {entry.status}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-4 gap-4 pt-4 border-t border-gray-100">
                        <div className="text-center">
                          <p className="text-xs text-gray-400 uppercase font-bold">Matches</p>
                          <p className="font-bold">14</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-400 uppercase font-bold">Runs</p>
                          <p className="font-bold">452</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-400 uppercase font-bold">SR</p>
                          <p className="font-bold">162.4</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-400 uppercase font-bold">Wickets</p>
                          <p className="font-bold">12</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              )) : (
                <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
                  <History className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h2 className="text-xl font-bold text-gray-900">No Franchise History</h2>
                  <p className="text-gray-500 mt-2">You haven't played in any franchise leagues yet.</p>
                </div>
              )}
            </div>

            <div className="lg:col-span-1 space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
                    Franchise Honors
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                    <Star className="w-5 h-5 text-yellow-600 fill-current" />
                    <div>
                      <p className="font-bold text-yellow-900">IPL Champion</p>
                      <p className="text-xs text-yellow-700">Mumbai Indians, 2023</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <Award className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-bold text-blue-900">Orange Cap</p>
                      <p className="text-xs text-blue-700">BBL, 2022</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Users className="w-5 h-5 mr-2 text-indigo-600" />
                    Teammate Chemistry
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Mumbai Indians</span>
                      <span className="font-bold">92%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full w-[92%]"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Sydney Sixers</span>
                      <span className="font-bold">65%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full w-[65%]"></div>
                    </div>
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

const Award = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <circle cx="12" cy="8" r="7" />
    <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
  </svg>
);

export default FranchiseHistoryPage;
