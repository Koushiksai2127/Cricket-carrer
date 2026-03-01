import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, User, BarChart3, Award, DollarSign, Heart, Gavel, BrainCircuit, Briefcase, Sunset, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { to: "/", label: "Dashboard", icon: null },
    { to: "/matches", label: "Matches", icon: <Trophy className="w-4 h-4" /> },
    { to: "/statistics", label: "Stats", icon: <BarChart3 className="w-4 h-4" /> },
    { to: "/records", label: "Records", icon: <Award className="w-4 h-4" /> },
    { to: "/auction", label: "Auction", icon: <Gavel className="w-4 h-4" /> },
    { to: "/franchise-history", label: "Franchise", icon: <Briefcase className="w-4 h-4" /> },
    { to: "/decisions", label: "Decisions", icon: <BrainCircuit className="w-4 h-4" /> },
    { to: "/profile", label: "Profile", icon: <User className="w-4 h-4" /> },
    { to: "/retirement", label: "Retire", icon: <Sunset className="w-4 h-4" />, color: "text-red-600 hover:text-red-700" },
  ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <Trophy className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">Cricket Career</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center space-x-4 text-sm">
            {navLinks.map((link) => (
              <Link 
                key={link.to} 
                to={link.to} 
                className={`${link.color || 'text-gray-700 hover:text-blue-600'} transition-colors font-medium flex items-center space-x-1`}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            ))}
          </nav>
          
          {/* Mobile Menu Toggle */}
          <div className="xl:hidden flex items-center">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-gray-100 transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 xl:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-64 bg-white shadow-2xl z-50 xl:hidden overflow-y-auto"
            >
              <div className="p-6 space-y-6">
                <div className="flex justify-between items-center border-b pb-4">
                  <span className="font-bold text-lg">Menu</span>
                  <button onClick={() => setIsMenuOpen(false)}>
                    <X className="w-6 h-6 text-gray-400" />
                  </button>
                </div>
                <nav className="flex flex-col space-y-4">
                  {navLinks.map((link) => (
                    <Link 
                      key={link.to} 
                      to={link.to} 
                      onClick={() => setIsMenuOpen(false)}
                      className={`${link.color || 'text-gray-700 hover:text-blue-600'} transition-colors font-medium flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50`}
                    >
                      <span className="p-2 bg-gray-100 rounded-lg text-blue-600">
                        {link.icon || <Trophy className="w-4 h-4" />}
                      </span>
                      <span className="text-base">{link.label}</span>
                    </Link>
                  ))}
                </nav>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
