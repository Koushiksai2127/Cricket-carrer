import React, { useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient';
import { DEFAULT_USER_ID } from '@/lib/defaultUser';
import Header from '@/components/Header';
import { Helmet } from 'react-helmet-async';
import { DollarSign, FileText, Briefcase, TrendingUp, Landmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const ContractsAndFinancePage = () => {
  const [player, setPlayer] = useState<any>(null);
  const [contracts, setContracts] = useState<any[]>([]);
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
        const contractsData = await pb.collection('contracts').getFullList({
          filter: `player_id = "${playerData[0].id}"`,
        });
        setContracts(contractsData);
      }
    } catch (error) {
      console.error('Failed to load finance data:', error);
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
        <title>Contracts & Finance - Cricket Career Manager</title>
      </Helmet>
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Landmark className="w-8 h-8 mr-3 text-emerald-600" />
              Contracts & Finance
            </h1>
            <p className="text-gray-600 mt-1">Manage your professional earnings and commitments</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-blue-600" />
                    Active Contracts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {contracts.length > 0 ? (
                    <div className="space-y-4">
                      {contracts.map((contract) => (
                        <div key={contract.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                          <div>
                            <h3 className="font-bold text-gray-900">{contract.team_name}</h3>
                            <p className="text-sm text-gray-500">{contract.contract_type} • {contract.duration} Years</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-emerald-600">${contract.salary.toLocaleString()}</p>
                            <p className="text-xs text-gray-400">Expires: {contract.expiry_year}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                      <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">No active contracts found.</p>
                      <Button variant="link" className="mt-2">Look for opportunities</Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-indigo-600" />
                    Earnings History
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-64 flex items-center justify-center text-gray-400">
                  [Chart Placeholder: Earnings over time]
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-1 space-y-8">
              <Card className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <DollarSign className="w-5 h-5 mr-2" />
                    Net Worth
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold mb-2">${(player.earnings || 0).toLocaleString()}</p>
                  <div className="space-y-2 text-emerald-100 text-sm">
                    <div className="flex justify-between">
                      <span>Match Fees</span>
                      <span>$420,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Endorsements</span>
                      <span>$150,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Bonuses</span>
                      <span>$85,000</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Lifestyle & Expenses</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 bg-gray-50 rounded-lg flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-gray-900">Training Camp</p>
                      <p className="text-xs text-gray-500">Improves attributes</p>
                    </div>
                    <Button size="sm" variant="outline">-$5,000</Button>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-gray-900">Personal PR Agent</p>
                      <p className="text-xs text-gray-500">Boosts popularity</p>
                    </div>
                    <Button size="sm" variant="outline">-$2,000/mo</Button>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-gray-900">Physiotherapy</p>
                      <p className="text-xs text-gray-500">Reduces injury risk</p>
                    </div>
                    <Button size="sm" variant="outline">-$3,500</Button>
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

export default ContractsAndFinancePage;
