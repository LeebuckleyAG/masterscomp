import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

interface Golfer {
  name: string;
  odds: number;
  oddsDisplay: string;
  rank: number;
  category: 'banker' | 'stronglyFancied' | 'goodLad' | 'outsider';
}

// Mock data for now - you can replace this with actual scraping later
const MOCK_GOLFERS: Omit<Golfer, 'category'>[] = [
  { name: 'Scottie Scheffler', odds: 5.5, oddsDisplay: '11/2', rank: 1 },
  { name: 'Rory McIlroy', odds: 7, oddsDisplay: '7/1', rank: 2 },
  { name: 'Jon Rahm', odds: 8, oddsDisplay: '8/1', rank: 3 },
  { name: 'Brooks Koepka', odds: 12, oddsDisplay: '12/1', rank: 4 },
  { name: 'Viktor Hovland', odds: 14, oddsDisplay: '14/1', rank: 5 },
  { name: 'Xander Schauffele', odds: 16, oddsDisplay: '16/1', rank: 6 },
  { name: 'Collin Morikawa', odds: 18, oddsDisplay: '18/1', rank: 7 },
  { name: 'Justin Thomas', odds: 20, oddsDisplay: '20/1', rank: 8 },
  { name: 'Patrick Cantlay', odds: 22, oddsDisplay: '22/1', rank: 9 },
  { name: 'Jordan Spieth', odds: 25, oddsDisplay: '25/1', rank: 10 },
  { name: 'Max Homa', odds: 28, oddsDisplay: '28/1', rank: 11 },
  { name: 'Tommy Fleetwood', odds: 30, oddsDisplay: '30/1', rank: 12 },
  { name: 'Tyrrell Hatton', odds: 35, oddsDisplay: '35/1', rank: 13 },
  { name: 'Cameron Young', odds: 40, oddsDisplay: '40/1', rank: 14 },
  { name: 'Russell Henley', odds: 45, oddsDisplay: '45/1', rank: 15 },
  { name: 'Tony Finau', odds: 50, oddsDisplay: '50/1', rank: 16 },
  { name: 'Hideki Matsuyama', odds: 55, oddsDisplay: '55/1', rank: 17 },
  { name: 'Sam Burns', odds: 60, oddsDisplay: '60/1', rank: 18 },
  { name: 'Sahith Theegala', odds: 66, oddsDisplay: '66/1', rank: 19 },
  { name: 'Shane Lowry', odds: 70, oddsDisplay: '70/1', rank: 20 },
  { name: 'Min Woo Lee', odds: 80, oddsDisplay: '80/1', rank: 21 },
  { name: 'Adam Scott', odds: 90, oddsDisplay: '90/1', rank: 22 },
  { name: 'Byeong Hun An', odds: 100, oddsDisplay: '100/1', rank: 23 },
  { name: 'Jason Day', odds: 125, oddsDisplay: '125/1', rank: 24 },
  { name: 'Justin Rose', odds: 150, oddsDisplay: '150/1', rank: 25 },
  { name: 'Gary Woodland', odds: 200, oddsDisplay: '200/1', rank: 26 },
  { name: 'Phil Mickelson', odds: 250, oddsDisplay: '250/1', rank: 27 },
  { name: 'Patrick Reed', odds: 300, oddsDisplay: '300/1', rank: 28 },
  { name: 'Sergio Garcia', odds: 350, oddsDisplay: '350/1', rank: 29 },
  { name: 'Bubba Watson', odds: 400, oddsDisplay: '400/1', rank: 30 },
];

export async function GET() {
  try {
    // Add categories to golfers
    const totalGolfers = MOCK_GOLFERS.length;
    const golfers: Golfer[] = MOCK_GOLFERS.map((golfer, idx) => {
      let category: 'banker' | 'stronglyFancied' | 'goodLad' | 'outsider';
      
      if (golfer.rank <= 5) {
        category = 'banker';
      } else if (golfer.rank <= 12) {
        category = 'stronglyFancied';
      } else if (idx >= totalGolfers - 10) {
        category = 'outsider';
      } else {
        category = 'goodLad';
      }
      
      return { ...golfer, category };
    });
    
    return NextResponse.json({ golfers, lastUpdated: new Date().toISOString() });
  } catch (error: any) {
    console.error('Error fetching odds:', error);
    return NextResponse.json(
      { error: 'Failed to fetch odds', details: error.message },
      { status: 500 }
    );
  }
}
