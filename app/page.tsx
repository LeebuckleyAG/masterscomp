'use client';

import { useState, useEffect } from 'react';

interface Golfer {
  name: string;
  odds: number;
  oddsDisplay: string;
  rank: number;
  category: 'banker' | 'stronglyFancied' | 'goodLad' | 'outsider';
}

interface Team {
  teamName: string;
  email: string;
  totalPoints: number;
  breakdown: any;
}

export default function Home() {
  const [golfers, setGolfers] = useState<Golfer[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'rules' | 'entry' | 'leaderboard'>('rules');
  
  // Form state
  const [teamName, setTeamName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedBankers, setSelectedBankers] = useState<string[]>([]);
  const [selectedStronglyFancied, setSelectedStronglyFancied] = useState<string[]>([]);
  const [selectedGoodLads, setSelectedGoodLads] = useState<string[]>([]);
  const [selectedOutsiders, setSelectedOutsiders] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  // Leaderboard state
  const [leaderboard, setLeaderboard] = useState<Team[]>([]);

  useEffect(() => {
    fetchOdds();
    if (activeTab === 'leaderboard') {
      fetchLeaderboard();
    }
  }, [activeTab]);

  const fetchOdds = async () => {
    try {
      const res = await fetch('/api/odds');
      const data = await res.json();
      setGolfers(data.golfers || []);
    } catch (error) {
      console.error('Error fetching odds:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const res = await fetch('/api/leaderboard');
      const data = await res.json();
      setLeaderboard(data.leaderboard || []);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    }
  };

  const toggleSelection = (
    golfer: string,
    category: 'banker' | 'stronglyFancied' | 'goodLad' | 'outsider',
    maxSelections: number
  ) => {
    let selected: string[];
    let setSelected: (val: string[]) => void;

    switch (category) {
      case 'banker':
        selected = selectedBankers;
        setSelected = setSelectedBankers;
        break;
      case 'stronglyFancied':
        selected = selectedStronglyFancied;
        setSelected = setSelectedStronglyFancied;
        break;
      case 'goodLad':
        selected = selectedGoodLads;
        setSelected = setSelectedGoodLads;
        break;
      case 'outsider':
        selected = selectedOutsiders;
        setSelected = setSelectedOutsiders;
        break;
    }

    if (selected.includes(golfer)) {
      setSelected(selected.filter(g => g !== golfer));
    } else if (selected.length < maxSelections) {
      setSelected([...selected, golfer]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      const res = await fetch('/api/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teamName,
          email,
          bankers: selectedBankers,
          stronglyFancied: selectedStronglyFancied,
          goodLads: selectedGoodLads,
          outsiders: selectedOutsiders
        })
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: 'success', text: 'Team entered successfully!' });
        // Reset form
        setTeamName('');
        setEmail('');
        setSelectedBankers([]);
        setSelectedStronglyFancied([]);
        setSelectedGoodLads([]);
        setSelectedOutsiders([]);
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to submit team' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  const bankers = golfers.filter(g => g.category === 'banker');
  const stronglyFancied = golfers.filter(g => g.category === 'stronglyFancied');
  const goodLads = golfers.filter(g => g.category === 'goodLad');
  const outsiders = golfers.filter(g => g.category === 'outsider');

  const renderGolferList = (
    golfersList: Golfer[],
    category: 'banker' | 'stronglyFancied' | 'goodLad' | 'outsider',
    maxSelections: number,
    selectedList: string[]
  ) => (
    <div className="space-y-2">
      {golfersList.map(golfer => (
        <button
          key={golfer.name}
          type="button"
          onClick={() => toggleSelection(golfer.name, category, maxSelections)}
          className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
            selectedList.includes(golfer.name)
              ? 'border-yellow-400 bg-yellow-50 shadow-md'
              : 'border-gray-200 hover:border-yellow-300 hover:bg-gray-50'
          }`}
          disabled={!selectedList.includes(golfer.name) && selectedList.length >= maxSelections}
        >
          <div className="flex justify-between items-center">
            <div>
              <div className="font-semibold text-green-900">{golfer.name}</div>
              <div className="text-sm text-gray-600">Rank #{golfer.rank}</div>
            </div>
            <div className="text-right">
              <div className="font-bold text-lg text-green-700">{golfer.oddsDisplay}</div>
              <div className="text-xs text-gray-500">{Math.round(golfer.odds)} pts</div>
            </div>
          </div>
        </button>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading odds...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen" style={{ background: 'linear-gradient(to bottom, #006747, #004d35)' }}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8 relative">
          {/* Yellow Flags Decoration */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 flex gap-8 -mt-4">
            <svg className="w-12 h-16" viewBox="0 0 40 60" fill="none">
              <rect x="18" y="0" width="4" height="60" fill="#f7c948"/>
              <path d="M22 5 L35 12 L22 19 Z" fill="#f7c948"/>
            </svg>
            <svg className="w-12 h-16" viewBox="0 0 40 60" fill="none">
              <rect x="18" y="0" width="4" height="60" fill="#f7c948"/>
              <path d="M22 5 L35 12 L22 19 Z" fill="#f7c948"/>
            </svg>
            <svg className="w-12 h-16" viewBox="0 0 40 60" fill="none">
              <rect x="18" y="0" width="4" height="60" fill="#f7c948"/>
              <path d="M22 5 L35 12 L22 19 Z" fill="#f7c948"/>
            </svg>
          </div>
          
          <h1 className="text-5xl font-bold mb-2 text-yellow-400 pt-16">
            The Masters Competition
          </h1>
          <p className="text-yellow-200 text-lg">Build your dream team and compete!</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 bg-green-800 rounded-t-xl p-2">
          <button
            onClick={() => setActiveTab('rules')}
            className={`flex-1 px-6 py-3 font-semibold transition-all rounded-lg ${
              activeTab === 'rules'
                ? 'bg-yellow-400 text-green-900'
                : 'text-yellow-200 hover:bg-green-700'
            }`}
          >
            How It Works
          </button>
          <button
            onClick={() => setActiveTab('entry')}
            className={`flex-1 px-6 py-3 font-semibold transition-all rounded-lg ${
              activeTab === 'entry'
                ? 'bg-yellow-400 text-green-900'
                : 'text-yellow-200 hover:bg-green-700'
            }`}
          >
            Enter Team
          </button>
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`flex-1 px-6 py-3 font-semibold transition-all rounded-lg ${
              activeTab === 'leaderboard'
                ? 'bg-yellow-400 text-green-900'
                : 'text-yellow-200 hover:bg-green-700'
            }`}
          >
            Leaderboard
          </button>
        </div>

        {/* Rules Tab */}
        {activeTab === 'rules' && (
          <div className="space-y-6">
            {/* Overview */}
            <div className="bg-white rounded-xl shadow-2xl p-8">
              <div className="flex items-start gap-4 mb-6">
                <svg className="w-16 h-20 flex-shrink-0" viewBox="0 0 40 60" fill="none">
                  <rect x="18" y="0" width="4" height="60" fill="#f7c948"/>
                  <path d="M22 5 L35 12 L22 19 Z" fill="#f7c948"/>
                </svg>
                <div>
                  <h2 className="text-3xl font-bold mb-2" style={{ color: '#006747' }}>
                    Welcome to The Masters Competition
                  </h2>
                  <p className="text-gray-700 text-lg">
                    Build your ultimate 12-golfer fantasy team and compete for glory! Points are awarded based on the betting odds of each golfer you select.
                  </p>
                </div>
              </div>
            </div>

            {/* Team Composition */}
            <div className="bg-white rounded-xl shadow-2xl p-8">
              <h3 className="text-2xl font-bold mb-6" style={{ color: '#006747' }}>
                Team Composition (12 Golfers)
              </h3>
              
              <div className="grid gap-6 md:grid-cols-2">
                {/* Bankers */}
                <div className="border-2 border-yellow-400 rounded-lg p-6 bg-yellow-50">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-yellow-400 text-green-900 font-bold rounded-full w-10 h-10 flex items-center justify-center text-lg">
                      2
                    </div>
                    <h4 className="text-xl font-bold" style={{ color: '#006747' }}>Bankers</h4>
                  </div>
                  <p className="text-gray-700 mb-2"><strong>Who:</strong> Top 5 shortest odds (favorites)</p>
                  <p className="text-gray-700"><strong>Strategy:</strong> Safe picks, lower points but more likely to perform</p>
                </div>

                {/* Strongly Fancied */}
                <div className="border-2 border-yellow-400 rounded-lg p-6 bg-yellow-50">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-yellow-400 text-green-900 font-bold rounded-full w-10 h-10 flex items-center justify-center text-lg">
                      4
                    </div>
                    <h4 className="text-xl font-bold" style={{ color: '#006747' }}>Strongly Fancied</h4>
                  </div>
                  <p className="text-gray-700 mb-2"><strong>Who:</strong> Golfers ranked 6th-12th in odds</p>
                  <p className="text-gray-700"><strong>Strategy:</strong> Balanced risk/reward contenders</p>
                </div>

                {/* Good Lads */}
                <div className="border-2 border-yellow-400 rounded-lg p-6 bg-yellow-50">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-yellow-400 text-green-900 font-bold rounded-full w-10 h-10 flex items-center justify-center text-lg">
                      4
                    </div>
                    <h4 className="text-xl font-bold" style={{ color: '#006747' }}>Good Lads</h4>
                  </div>
                  <p className="text-gray-700 mb-2"><strong>Who:</strong> Mid-field runners (13th onwards)</p>
                  <p className="text-gray-700"><strong>Strategy:</strong> Solid performers with decent point potential</p>
                </div>

                {/* Outsiders */}
                <div className="border-2 border-yellow-400 rounded-lg p-6 bg-yellow-50">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-yellow-400 text-green-900 font-bold rounded-full w-10 h-10 flex items-center justify-center text-lg">
                      2
                    </div>
                    <h4 className="text-xl font-bold" style={{ color: '#006747' }}>Outsiders</h4>
                  </div>
                  <p className="text-gray-700 mb-2"><strong>Who:</strong> Bottom 10 golfers (longshots)</p>
                  <p className="text-gray-700"><strong>Strategy:</strong> High risk, massive point potential!</p>
                </div>
              </div>
            </div>

            {/* Scoring System */}
            <div className="bg-white rounded-xl shadow-2xl p-8">
              <h3 className="text-2xl font-bold mb-6" style={{ color: '#006747' }}>
                How Scoring Works
              </h3>
              
              <div className="bg-green-50 border-2 border-green-600 rounded-lg p-6 mb-6">
                <h4 className="text-xl font-bold mb-4 text-green-900">
                  Points = Betting Odds
                </h4>
                <p className="text-gray-800 text-lg mb-4">
                  Each golfer you select earns points equal to their betting odds. The higher the odds, the more points you score!
                </p>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-yellow-400 rounded-full w-8 h-8 flex items-center justify-center font-bold">✓</div>
                    <p className="text-gray-800">
                      <strong>500/1 outsider</strong> = <strong className="text-green-700 text-xl">500 points</strong>
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-yellow-400 rounded-full w-8 h-8 flex items-center justify-center font-bold">✓</div>
                    <p className="text-gray-800">
                      <strong>50/1 good lad</strong> = <strong className="text-green-700 text-xl">50 points</strong>
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-yellow-400 rounded-full w-8 h-8 flex items-center justify-center font-bold">✓</div>
                    <p className="text-gray-800">
                      <strong>5/1 banker</strong> = <strong className="text-green-700 text-xl">5 points</strong>
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-6">
                <h4 className="text-xl font-bold mb-3 text-yellow-900">
                  Total Team Score
                </h4>
                <p className="text-gray-800 text-lg">
                  Your total score = <strong>sum of all 12 golfers' odds</strong>
                </p>
                <p className="text-gray-600 mt-2">
                  Highest total score wins the competition!
                </p>
              </div>
            </div>

            {/* How to Enter */}
            <div className="bg-white rounded-xl shadow-2xl p-8">
              <h3 className="text-2xl font-bold mb-6" style={{ color: '#006747' }}>
                How to Enter
              </h3>
              
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="bg-yellow-400 text-green-900 font-bold rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h5 className="font-bold text-lg mb-1">Go to "Enter Team" Tab</h5>
                    <p className="text-gray-700">Fill in your team name and email address</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="bg-yellow-400 text-green-900 font-bold rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h5 className="font-bold text-lg mb-1">Select Your 12 Golfers</h5>
                    <p className="text-gray-700">Choose 2 Bankers, 4 Strongly Fancied, 4 Good Lads, and 2 Outsiders</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="bg-yellow-400 text-green-900 font-bold rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h5 className="font-bold text-lg mb-1">Submit Your Entry</h5>
                    <p className="text-gray-700">Your team is locked in and appears on the leaderboard</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="bg-yellow-400 text-green-900 font-bold rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0">
                    4
                  </div>
                  <div>
                    <h5 className="font-bold text-lg mb-1">Watch the Leaderboard</h5>
                    <p className="text-gray-700">Check your ranking and compete for the top spot!</p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center">
              <button
                onClick={() => setActiveTab('entry')}
                className="bg-yellow-400 text-green-900 px-12 py-4 rounded-lg font-bold text-xl hover:bg-yellow-500 transition-all transform hover:scale-105 shadow-lg"
              >
                Enter Your Team Now!
              </button>
            </div>
          </div>
        )}

        {/* Entry Form */}
        {activeTab === 'entry' && (
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Team Details */}
            <div className="bg-white rounded-xl shadow-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <svg className="w-12 h-16" viewBox="0 0 40 60" fill="none">
                  <rect x="18" y="0" width="4" height="60" fill="#f7c948"/>
                  <path d="M22 5 L35 12 L22 19 Z" fill="#f7c948"/>
                </svg>
                <h2 className="text-2xl font-bold" style={{ color: '#006747' }}>Team Details</h2>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">Team Name</label>
                  <input
                    type="text"
                    value={teamName}
                    onChange={e => setTeamName(e.target.value)}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                    placeholder="The Eagle Hunters"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Bankers */}
            <div className="bg-white rounded-xl shadow-2xl p-6 border-l-8 border-yellow-400">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                  <svg className="w-10 h-14" viewBox="0 0 40 60" fill="none">
                    <rect x="18" y="0" width="4" height="60" fill="#f7c948"/>
                    <path d="M22 5 L35 12 L22 19 Z" fill="#f7c948"/>
                  </svg>
                  <h2 className="text-2xl font-bold" style={{ color: '#006747' }}>Bankers</h2>
                </div>
                <span className="text-sm font-semibold text-white bg-green-700 px-4 py-2 rounded-full">
                  {selectedBankers.length}/2 selected
                </span>
              </div>
              <p className="text-gray-600 mb-4">Top 5 shortest odds (pick 2)</p>
              {renderGolferList(bankers, 'banker', 2, selectedBankers)}
            </div>

            {/* Strongly Fancied */}
            <div className="bg-white rounded-xl shadow-2xl p-6 border-l-8 border-yellow-400">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                  <svg className="w-10 h-14" viewBox="0 0 40 60" fill="none">
                    <rect x="18" y="0" width="4" height="60" fill="#f7c948"/>
                    <path d="M22 5 L35 12 L22 19 Z" fill="#f7c948"/>
                  </svg>
                  <h2 className="text-2xl font-bold" style={{ color: '#006747' }}>Strongly Fancied</h2>
                </div>
                <span className="text-sm font-semibold text-white bg-green-700 px-4 py-2 rounded-full">
                  {selectedStronglyFancied.length}/4 selected
                </span>
              </div>
              <p className="text-gray-600 mb-4">Ranks 6-12 (pick 4)</p>
              {renderGolferList(stronglyFancied, 'stronglyFancied', 4, selectedStronglyFancied)}
            </div>

            {/* Good Lads */}
            <div className="bg-white rounded-xl shadow-2xl p-6 border-l-8 border-yellow-400">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                  <svg className="w-10 h-14" viewBox="0 0 40 60" fill="none">
                    <rect x="18" y="0" width="4" height="60" fill="#f7c948"/>
                    <path d="M22 5 L35 12 L22 19 Z" fill="#f7c948"/>
                  </svg>
                  <h2 className="text-2xl font-bold" style={{ color: '#006747' }}>Good Lads</h2>
                </div>
                <span className="text-sm font-semibold text-white bg-green-700 px-4 py-2 rounded-full">
                  {selectedGoodLads.length}/4 selected
                </span>
              </div>
              <p className="text-gray-600 mb-4">Mid-field runners (pick 4)</p>
              {renderGolferList(goodLads, 'goodLad', 4, selectedGoodLads)}
            </div>

            {/* Outsiders */}
            <div className="bg-white rounded-xl shadow-2xl p-6 border-l-8 border-yellow-400">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                  <svg className="w-10 h-14" viewBox="0 0 40 60" fill="none">
                    <rect x="18" y="0" width="4" height="60" fill="#f7c948"/>
                    <path d="M22 5 L35 12 L22 19 Z" fill="#f7c948"/>
                  </svg>
                  <h2 className="text-2xl font-bold" style={{ color: '#006747' }}>Outsiders</h2>
                </div>
                <span className="text-sm font-semibold text-white bg-green-700 px-4 py-2 rounded-full">
                  {selectedOutsiders.length}/2 selected
                </span>
              </div>
              <p className="text-gray-600 mb-4">Bottom 10 longshots (pick 2)</p>
              {renderGolferList(outsiders, 'outsider', 2, selectedOutsiders)}
            </div>

            {/* Message */}
            {message && (
              <div
                className={`p-4 rounded-lg font-semibold ${
                  message.type === 'success' 
                    ? 'bg-yellow-400 text-green-900 border-2 border-yellow-500' 
                    : 'bg-red-100 text-red-800 border-2 border-red-300'
                }`}
              >
                {message.text}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 bg-yellow-400 text-green-900 font-bold text-lg rounded-lg hover:bg-yellow-500 transition-all disabled:opacity-50 transform hover:scale-105 shadow-xl"
            >
              {submitting ? 'Submitting...' : '🏌️ Submit Team'}
            </button>
          </form>
        )}

        {/* Leaderboard */}
        {activeTab === 'leaderboard' && (
          <div className="bg-white rounded-xl shadow-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <svg className="w-12 h-16" viewBox="0 0 40 60" fill="none">
                <rect x="18" y="0" width="4" height="60" fill="#f7c948"/>
                <path d="M22 5 L35 12 L22 19 Z" fill="#f7c948"/>
              </svg>
              <h2 className="text-2xl font-bold" style={{ color: '#006747' }}>Competition Leaderboard</h2>
            </div>
            {leaderboard.length === 0 ? (
              <div className="text-center py-12">
                <svg className="w-20 h-28 mx-auto mb-4 opacity-20" viewBox="0 0 40 60" fill="none">
                  <rect x="18" y="0" width="4" height="60" fill="#006747"/>
                  <path d="M22 5 L35 12 L22 19 Z" fill="#006747"/>
                </svg>
                <p className="text-gray-500 text-lg">No teams entered yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {leaderboard.map((team, index) => (
                  <div
                    key={team.email}
                    className={`p-6 rounded-lg border-2 transition-all ${
                      index === 0 
                        ? 'border-yellow-400 bg-yellow-50 shadow-xl transform scale-105' 
                        : 'border-gray-200 hover:border-yellow-300'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <div className={`text-4xl font-bold ${
                          index === 0 ? 'text-yellow-500' : 'text-gray-400'
                        }`}>
                          #{index + 1}
                        </div>
                        {index === 0 && (
                          <svg className="w-8 h-12" viewBox="0 0 40 60" fill="none">
                            <rect x="18" y="0" width="4" height="60" fill="#f7c948"/>
                            <path d="M22 5 L35 12 L22 19 Z" fill="#f7c948"/>
                          </svg>
                        )}
                        <div>
                          <div className="font-bold text-xl" style={{ color: '#006747' }}>
                            {team.teamName}
                          </div>
                          <div className="text-sm text-gray-600">{team.email}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-4xl font-bold ${
                          index === 0 ? 'text-yellow-500' : 'text-green-700'
                        }`}>
                          {Math.round(team.totalPoints)}
                        </div>
                        <div className="text-sm text-gray-500 font-semibold">points</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
