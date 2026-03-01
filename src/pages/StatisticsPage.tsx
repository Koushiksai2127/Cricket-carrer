import React, { useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient';
import { DEFAULT_USER_ID } from '@/lib/defaultUser';
import Header from '@/components/Header';
import { Helmet } from 'react-helmet-async';
import { BarChart3, TrendingUp, Filter } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const StatisticsPage = () => {
  const [player, setPlayer] = useState<any>(null);
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
      }
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  const formats = [
    { id: 'first_class', label: 'First Class' },
    { id: 'list_a', label: 'List A' },
    { id: 'domestic_t20', label: 'Domestic T20' },
    { id: 'franchise', label: 'Franchise' },
    { id: 'test', label: 'Test' },
    { id: 'odi', label: 'ODI' },
    { id: 't20i', label: 'T20I' },
  ];

  return (
    <>
      <Helmet>
        <title>Career Statistics - Cricket Career Manager</title>
      </Helmet>
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="flex items-center mb-8">
              <BarChart3 className="w-8 h-8 mr-3 text-blue-600" />
              <h1 className="text-4xl font-bold text-gray-900">Career Statistics</h1>
            </div>

            <Tabs defaultValue="test" className="space-y-8">
              <div className="flex justify-center mb-8">
                <TabsList className="bg-transparent border-none flex flex-wrap justify-center gap-2">
                  {formats.map((format) => (
                    <TabsTrigger 
                      key={format.id} 
                      value={format.id}
                      className="px-10 py-3 text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:border border-gray-100 rounded-md transition-all text-gray-600 data-[state=active]:text-gray-900"
                    >
                      {format.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              {formats.map((format) => (
                <TabsContent key={format.id} value={format.id} className="space-y-8">
                  {/* Summary Section */}
                  <div className="bg-[#f0f7ff] rounded-xl p-10">
                    <h2 className="text-2xl font-bold text-gray-900 mb-8 capitalize">{format.label} Career</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
                      <div className="space-y-2">
                        <p className="text-gray-500 text-sm font-medium">Matches</p>
                        <p className="text-4xl font-bold text-gray-900">0</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-gray-500 text-sm font-medium">Innings</p>
                        <p className="text-4xl font-bold text-gray-900">0</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-gray-500 text-sm font-medium">Runs</p>
                        <p className="text-4xl font-bold text-gray-900">0</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-gray-500 text-sm font-medium">Average</p>
                        <p className="text-4xl font-bold text-gray-900">0.00</p>
                      </div>
                    </div>
                  </div>

                  {/* Detailed Stats Grid */}
                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Batting Statistics */}
                    <Card className="border-gray-100 shadow-none bg-white">
                      <CardHeader className="pb-6">
                        <CardTitle className="text-2xl font-bold text-gray-900">Batting Statistics</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-5">
                        <div className="flex justify-between items-center text-lg">
                          <span className="text-gray-600">Strike Rate</span>
                          <span className="font-bold">0.00</span>
                        </div>
                        <div className="flex justify-between items-center text-lg">
                          <span className="text-gray-600">Centuries</span>
                          <span className="font-bold">0</span>
                        </div>
                        <div className="flex justify-between items-center text-lg">
                          <span className="text-gray-600">Half-Centuries</span>
                          <span className="font-bold">0</span>
                        </div>
                        <div className="flex justify-between items-center text-lg">
                          <span className="text-gray-600">Ducks</span>
                          <span className="font-bold">0</span>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Bowling & Fielding */}
                    <Card className="border-gray-100 shadow-none bg-white">
                      <CardHeader className="pb-6">
                        <CardTitle className="text-2xl font-bold text-gray-900">Bowling & Fielding</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-5">
                        <div className="flex justify-between items-center text-lg">
                          <span className="text-gray-600">Wickets</span>
                          <span className="font-bold">0</span>
                        </div>
                        <div className="flex justify-between items-center text-lg">
                          <span className="text-gray-600">Economy</span>
                          <span className="font-bold">0.00</span>
                        </div>
                        <div className="flex justify-between items-center text-lg">
                          <span className="text-gray-600">Best Figures</span>
                          <span className="font-bold">N/A</span>
                        </div>
                        <div className="flex justify-between items-center text-lg">
                          <span className="text-gray-600">Catches</span>
                          <span className="font-bold">0</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="text-center py-16 text-gray-400 text-lg">
                    No statistics available for this format yet.
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
};

export default StatisticsPage;
