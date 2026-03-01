import React, { useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient';
import { DEFAULT_USER_ID } from '@/lib/defaultUser';
import Header from '@/components/Header';
import { Helmet } from 'react-helmet-async';
import { Heart, Activity, ShieldAlert, Zap, Thermometer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const InjuryAndFitnessPage = () => {
  const [player, setPlayer] = useState<any>(null);
  const [injuries, setInjuries] = useState<any[]>([]);
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
        const injuriesData = await pb.collection('injuries').getFullList({
          filter: `player_id = "${playerData[0].id}"`,
        });
        setInjuries(injuriesData);
      }
    } catch (error) {
      console.error('Failed to load fitness data:', error);
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

  const activeInjury = injuries.find(i => i.status === 'Active');

  return (
    <>
      <Helmet>
        <title>Injury & Fitness - Cricket Career Manager</title>
      </Helmet>
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Heart className="w-8 h-8 mr-3 text-red-600" />
              Injury & Fitness
            </h1>
            <p className="text-gray-600 mt-1">Monitor your physical condition and recovery</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-8">
              <Card className={activeInjury ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <ShieldAlert className={`w-5 h-5 mr-2 ${activeInjury ? 'text-red-600' : 'text-green-600'}`} />
                    Current Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {activeInjury ? (
                    <div className="space-y-4">
                      <p className="text-2xl font-bold text-red-900">{activeInjury.injury_type}</p>
                      <div className="flex justify-between text-sm text-red-700">
                        <span>Recovery Progress</span>
                        <span>{activeInjury.recovery_progress}%</span>
                      </div>
                      <div className="w-full bg-red-200 rounded-full h-3">
                        <div 
                          className="bg-red-600 h-3 rounded-full" 
                          style={{ width: `${activeInjury.recovery_progress}%` }}
                        ></div>
                      </div>
                      <p className="text-sm text-red-600">Estimated return: {activeInjury.estimated_return_weeks} weeks</p>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <Zap className="w-12 h-12 text-green-600 mx-auto mb-3" />
                      <p className="text-2xl font-bold text-green-900">Fully Fit</p>
                      <p className="text-sm text-green-700 mt-1">Ready for selection</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Thermometer className="w-5 h-5 mr-2 text-orange-600" />
                    Fatigue Levels
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Red Ball Workload</span>
                      <span className="font-bold">45/100</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full w-[45%]"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">White Ball Workload</span>
                      <span className="font-bold">78/100</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-orange-600 h-2 rounded-full w-[78%]"></div>
                    </div>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-xl border border-orange-100">
                    <p className="text-sm text-orange-800 font-medium">
                      High white-ball workload detected. Consider resting for the next domestic T20 match to avoid injury.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2 space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Activity className="w-5 h-5 mr-2 text-blue-600" />
                    Medical History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {injuries.length > 0 ? injuries.map((injury) => (
                      <div key={injury.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <div>
                          <h3 className="font-bold text-gray-900">{injury.injury_type}</h3>
                          <p className="text-sm text-gray-500">{new Date(injury.created).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            injury.status === 'Recovered' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {injury.status}
                          </span>
                        </div>
                      </div>
                    )) : (
                      <p className="text-center py-12 text-gray-400">No medical history recorded.</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recovery & Prevention</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 border border-gray-100 rounded-xl hover:border-blue-200 transition-colors cursor-pointer group">
                      <h4 className="font-bold text-gray-900 group-hover:text-blue-600">Intensive Rehab</h4>
                      <p className="text-sm text-gray-500 mb-4">Speed up recovery by 25% but costs $10,000.</p>
                      <Button size="sm" className="w-full">Start Session</Button>
                    </div>
                    <div className="p-4 border border-gray-100 rounded-xl hover:border-blue-200 transition-colors cursor-pointer group">
                      <h4 className="font-bold text-gray-900 group-hover:text-blue-600">Yoga & Flexibility</h4>
                      <p className="text-sm text-gray-500 mb-4">Reduces future injury risk by 15%.</p>
                      <Button size="sm" variant="outline" className="w-full">Book Class</Button>
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

export default InjuryAndFitnessPage;
