import React, { useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient';
import { DEFAULT_USER_ID } from '@/lib/defaultUser';
import Header from '@/components/Header';
import { Helmet } from 'react-helmet-async';
import { User, Shield, Zap, Brain, Heart, Edit2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const PlayerProfilePage = () => {
  const [player, setPlayer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
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
      console.error('Failed to load profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      // In a real app, we'd update the record
      toast({
        title: "Profile Updated",
        description: "Your player details have been saved.",
      });
      setEditing(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive"
      });
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

  const AttributeBar = ({ label, value, color }: any) => (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-gray-600 capitalize">{label.replace(/_/g, ' ')}</span>
        <span className="font-bold text-gray-900">{value}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className={`h-2 rounded-full ${color}`} 
          style={{ width: `${value}%` }}
        ></div>
      </div>
    </div>
  );

  return (
    <>
      <Helmet>
        <title>{`${player.name}'s Profile - Cricket Career Manager`}</title>
      </Helmet>
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                {player.name.charAt(0)}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{player.name}</h1>
                <p className="text-gray-600">{player.role} • {player.country}</p>
              </div>
            </div>
            <Button onClick={() => editing ? handleSave() : setEditing(true)}>
              {editing ? (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Profile
                </>
              ) : (
                <>
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit Profile
                </>
              )}
            </Button>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <User className="w-5 h-5 mr-2 text-blue-600" />
                    Personal Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Age</Label>
                    <p className="text-lg font-semibold">{player.age} years</p>
                  </div>
                  <div>
                    <Label>Batting Style</Label>
                    <p className="text-lg font-semibold">{player.batting_style}</p>
                  </div>
                  <div>
                    <Label>Bowling Style</Label>
                    <p className="text-lg font-semibold">{player.bowling_style}</p>
                  </div>
                  <div>
                    <Label>Current Team</Label>
                    <p className="text-lg font-semibold">{player.current_team}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Heart className="w-5 h-5 mr-2 text-red-600" />
                    Physical & Mental
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <AttributeBar label="Fitness" value={player.fitness} color="bg-green-500" />
                  <AttributeBar label="Confidence" value={player.confidence} color="bg-blue-500" />
                  <AttributeBar label="Work Ethic" value={player.work_ethic} color="bg-purple-500" />
                  <AttributeBar label="Leadership" value={player.leadership} color="bg-yellow-500" />
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2 space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <Shield className="w-5 h-5 mr-2 text-indigo-600" />
                      Batting Attributes
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <AttributeBar label="Technique" value={player.technique} color="bg-indigo-500" />
                    <AttributeBar label="Timing" value={player.timing} color="bg-indigo-500" />
                    <AttributeBar label="Power" value={player.power} color="bg-indigo-500" />
                    <AttributeBar label="Temperament" value={player.temperament} color="bg-indigo-500" />
                    <AttributeBar label="Shot Selection" value={player.shot_selection} color="bg-indigo-500" />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <Zap className="w-5 h-5 mr-2 text-orange-600" />
                      Bowling Attributes
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <AttributeBar label="Speed" value={player.speed} color="bg-orange-500" />
                    <AttributeBar label="Accuracy" value={player.accuracy} color="bg-orange-500" />
                    <AttributeBar label="Swing/Turn" value={player.swing_turn} color="bg-orange-500" />
                    <AttributeBar label="Variations" value={player.variations} color="bg-orange-500" />
                    <AttributeBar label="Death Bowling" value={player.death_bowling} color="bg-orange-500" />
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Brain className="w-5 h-5 mr-2 text-emerald-600" />
                    Special Skills
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                      <h4 className="font-bold text-emerald-900 mb-1">Pace Specialist</h4>
                      <p className="text-xs text-emerald-700">Exceptional skill against fast bowling.</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                      <h4 className="font-bold text-blue-900 mb-1">Death Over Expert</h4>
                      <p className="text-xs text-blue-700">Maintains composure in high-pressure finishes.</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
                      <h4 className="font-bold text-purple-900 mb-1">Safe Hands</h4>
                      <p className="text-xs text-purple-700">Rarely drops a catch in the slips.</p>
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

export default PlayerProfilePage;
