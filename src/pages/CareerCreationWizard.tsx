import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import pb from '@/lib/pocketbaseClient';
import { DEFAULT_USER_ID } from '@/lib/defaultUser';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import Header from '@/components/Header';
import { Helmet } from 'react-helmet-async';
import { useToast } from '@/hooks/use-toast';

const COUNTRIES = [
  'India', 'Australia', 'England', 'Pakistan', 'South Africa', 'West Indies',
  'New Zealand', 'Sri Lanka', 'Bangladesh', 'Zimbabwe', 'Afghanistan', 'Ireland',
  'Netherlands', 'Oman', 'UAE', 'Scotland', 'Namibia', 'PNG', 'USA'
];

const ROLES = ['Batter', 'Bowler', 'All-Rounder', 'Wicket-Keeper'];
const BATTING_STYLES = ['Aggressive', 'Balanced', 'Defensive'];
const BOWLING_STYLES = ['Fast', 'Medium', 'Spin'];

const ATTRIBUTES: Record<string, string[]> = {
  batting: ['technique', 'timing', 'power', 'temperament', 'spin_skill', 'pace_skill', 'shot_selection'],
  bowling: ['speed', 'accuracy', 'swing_turn', 'variations', 'death_bowling', 'stamina'],
  fielding: ['catching', 'throw_accuracy', 'reflex', 'agility'],
  mental: ['confidence', 'work_ethic', 'leadership', 'big_match_temperament'],
  physical: ['fitness', 'injury_resistance', 'recovery_speed']
};

const CareerCreationWizard = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    country: '',
    role: '',
    batting_style: '',
    bowling_style: '',
    age: 15
  });

  const [attributes, setAttributes] = useState<Record<string, number>>({
    technique: 50, timing: 50, power: 50, temperament: 50, spin_skill: 50, pace_skill: 50, shot_selection: 50,
    speed: 50, accuracy: 50, swing_turn: 50, variations: 50, death_bowling: 50, stamina: 50,
    catching: 50, throw_accuracy: 50, reflex: 50, agility: 50,
    confidence: 50, work_ethic: 50, leadership: 50, big_match_temperament: 50,
    fitness: 50, injury_resistance: 50, recovery_speed: 50
  });

  const totalPoints: number = (Object.values(attributes) as number[]).reduce((sum: number, val: number) => sum + val, 0);
  const remainingPoints = 7000 - totalPoints; // Increased to 7000 as per user request

  const handleAttributeChange = (attr: string, value: number[]) => {
    const newValue = value[0];
    const maxValue = 100; // Allow full maxing out with 7000 points
    
    if (newValue > maxValue) return;
    
    const diff = newValue - attributes[attr];
    if (remainingPoints - diff < 0) return;
    
    setAttributes({ ...attributes, [attr]: newValue });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const playerData = {
        userId: DEFAULT_USER_ID,
        name: formData.name,
        country: formData.country,
        role: formData.role,
        batting_style: formData.batting_style,
        bowling_style: formData.bowling_style,
        age: 15,
        status: 'active',
        current_team: `${formData.country} U19`,
        net_worth: 0,
        popularity: 10,
        form_score: 50,
        media_pressure: 0,
        slump_active: 0,
        slump_duration: 0,
        slump_penalty: 0,
        workload_red: 0,
        workload_white: 0,
        team_morale: 70,
        dressing_room_trust: 70,
        archetype: 'Balanced',
        greatness_index: 0,
        ...attributes
      };

      await pb.collection('players').create(playerData);
      
      toast({
        title: "Career Created!",
        description: "Your cricket career has begun. Good luck!",
      });
      
      navigate('/');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create career",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Create Your Career - Cricket Career Manager</title>
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Header />
        
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-3xl font-bold text-gray-900">Create Your Career</h1>
                <span className="text-sm text-gray-500">Step {step} of 3</span>
              </div>
              <div className="flex space-x-2">
                {[1, 2, 3].map((s) => (
                  <div key={s} className={`h-2 flex-1 rounded-full ${s <= step ? 'bg-blue-600' : 'bg-gray-200'}`} />
                ))}
              </div>
            </div>

            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Basic Information</h2>
                
                <div>
                  <Label htmlFor="name">Player Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your player name"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="country">Country</Label>
                  <select
                    id="country"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Country</option>
                    {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <Label htmlFor="role">Role</Label>
                  <select
                    id="role"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Role</option>
                    {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>

                <div>
                  <Label htmlFor="batting_style">Batting Style</Label>
                  <select
                    id="batting_style"
                    value={formData.batting_style}
                    onChange={(e) => setFormData({ ...formData, batting_style: e.target.value })}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Batting Style</option>
                    {BATTING_STYLES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div>
                  <Label htmlFor="bowling_style">Bowling Style</Label>
                  <select
                    id="bowling_style"
                    value={formData.bowling_style}
                    onChange={(e) => setFormData({ ...formData, bowling_style: e.target.value })}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Bowling Style</option>
                    {BOWLING_STYLES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <Button 
                  onClick={() => setStep(2)} 
                  className="w-full"
                  disabled={!formData.name || !formData.country || !formData.role}
                >
                  Next: Attributes
                </Button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold text-gray-900">Attribute Allocation</h2>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Remaining Points</p>
                    <p className={`text-3xl font-bold ${remainingPoints < 0 ? 'text-red-600' : 'text-blue-600'}`}>
                      {remainingPoints}
                    </p>
                  </div>
                </div>

                {Object.entries(ATTRIBUTES).map(([category, attrs]) => (
                  <div key={category} className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 capitalize border-b pb-2">{category}</h3>
                    {attrs.map(attr => (
                      <div key={attr} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <Label className="capitalize">{attr.replace(/_/g, ' ')}</Label>
                          <span className="text-sm font-semibold text-gray-700">{attributes[attr]}</span>
                        </div>
                        <Slider
                          value={[attributes[attr]]}
                          onValueChange={(value) => handleAttributeChange(attr, value)}
                          max={100}
                          step={1}
                          className="w-full"
                        />
                      </div>
                    ))}
                  </div>
                ))}

                <div className="flex space-x-4">
                  <Button onClick={() => setStep(1)} variant="outline" className="flex-1">
                    Back
                  </Button>
                  <Button 
                    onClick={() => setStep(3)} 
                    className="flex-1"
                    disabled={remainingPoints < 0}
                  >
                    Next: Preview
                  </Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Preview Your Player</h2>
                
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{formData.name}</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Country</p>
                      <p className="font-semibold text-gray-900">{formData.country}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Role</p>
                      <p className="font-semibold text-gray-900">{formData.role}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Batting Style</p>
                      <p className="font-semibold text-gray-900">{formData.batting_style}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Bowling Style</p>
                      <p className="font-semibold text-gray-900">{formData.bowling_style}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Age</p>
                      <p className="font-semibold text-gray-900">15 years</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Initial Team</p>
                      <p className="font-semibold text-gray-900">{formData.country} U19</p>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <Button onClick={() => setStep(2)} variant="outline" className="flex-1">
                    Back
                  </Button>
                  <Button onClick={handleSubmit} className="flex-1" disabled={loading}>
                    {loading ? 'Creating Career...' : 'Start Career'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CareerCreationWizard;
