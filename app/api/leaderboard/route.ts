import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

interface TeamScore {
  teamName: string;
  email: string;
  totalPoints: number;
  breakdown: {
    bankers: { golfer: string; points: number }[];
    stronglyFancied: { golfer: string; points: number }[];
    goodLads: { golfer: string; points: number }[];
    outsiders: { golfer: string; points: number }[];
  };
}

// This would integrate with your teams API and odds API
// For now, returning mock data structure
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const results = searchParams.get('results'); // JSON string of results
    
    // In production, fetch teams from database
    const teamsResponse = await fetch(`${request.url.split('/api')[0]}/api/teams`);
    const { teams } = await teamsResponse.json();
    
    // Fetch current odds
    const oddsResponse = await fetch(`${request.url.split('/api')[0]}/api/odds`);
    const { golfers } = await oddsResponse.json();
    
    // Create odds lookup
    const oddsMap = new Map(golfers.map((g: any) => [g.name, g.odds]));
    
    // Calculate scores for each team
    const leaderboard: TeamScore[] = teams.map((team: any) => {
      const breakdown = {
        bankers: team.bankers.map((name: string) => ({
          golfer: name,
          points: oddsMap.get(name) || 0
        })),
        stronglyFancied: team.stronglyFancied.map((name: string) => ({
          golfer: name,
          points: oddsMap.get(name) || 0
        })),
        goodLads: team.goodLads.map((name: string) => ({
          golfer: name,
          points: oddsMap.get(name) || 0
        })),
        outsiders: team.outsiders.map((name: string) => ({
          golfer: name,
          points: oddsMap.get(name) || 0
        }))
      };
      
      const totalPoints = [
        ...breakdown.bankers,
        ...breakdown.stronglyFancied,
        ...breakdown.goodLads,
        ...breakdown.outsiders
      ].reduce((sum, item) => sum + item.points, 0);
      
      return {
        teamName: team.teamName,
        email: team.email,
        totalPoints,
        breakdown
      };
    });
    
    // Sort by total points descending
    leaderboard.sort((a, b) => b.totalPoints - a.totalPoints);
    
    return NextResponse.json({ leaderboard });
  } catch (error: any) {
    console.error('Leaderboard error:', error);
    return NextResponse.json(
      { error: 'Failed to generate leaderboard', details: error.message },
      { status: 500 }
    );
  }
}
