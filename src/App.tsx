import React from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import ScrollToTop from './components/ScrollToTop';
import HomePage from './pages/HomePage';
import CareerCreationWizard from './pages/CareerCreationWizard';
import MatchSimulationEngine from './pages/MatchSimulationEngine';
import PostMatchSummary from './pages/PostMatchSummary';
import StatisticsPage from './pages/StatisticsPage';
import RankingsPage from './pages/RankingsPage';
import PlayerProfilePage from './pages/PlayerProfilePage';
import ContractsAndFinancePage from './pages/ContractsAndFinancePage';
import InjuryAndFitnessPage from './pages/InjuryAndFitnessPage';
import AuctionScreen from './pages/AuctionScreen';
import DecisionScreen from './pages/DecisionScreen';
import RecordsPage from './pages/RecordsPage';
import RetirementScreen from './pages/RetirementScreen';
import FranchiseHistoryPage from './pages/FranchiseHistoryPage';
import { Toaster } from './components/ui/toaster';

function App() {
  return (
    <HelmetProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/career-creation" element={<CareerCreationWizard />} />
          <Route path="/matches" element={<MatchSimulationEngine />} />
          <Route path="/post-match-summary" element={<PostMatchSummary />} />
          <Route path="/statistics" element={<StatisticsPage />} />
          <Route path="/rankings" element={<RankingsPage />} />
          <Route path="/profile" element={<PlayerProfilePage />} />
          <Route path="/contracts" element={<ContractsAndFinancePage />} />
          <Route path="/fitness" element={<InjuryAndFitnessPage />} />
          <Route path="/auction" element={<AuctionScreen />} />
          <Route path="/decisions" element={<DecisionScreen />} />
          <Route path="/records" element={<RecordsPage />} />
          <Route path="/retirement" element={<RetirementScreen />} />
          <Route path="/franchise-history" element={<FranchiseHistoryPage />} />
        </Routes>
        <Toaster />
      </Router>
    </HelmetProvider>
  );
}

export default App;
