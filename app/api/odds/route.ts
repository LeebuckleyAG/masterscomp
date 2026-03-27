import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

interface Golfer {
  name: string;
  odds: number;
  oddsDisplay: string;
  rank: number;
  category: 'banker' | 'stronglyFancied' | 'goodLad' | 'outsider';
}

// Real Masters 2026 data - updated from masters.xlsx
// Tier 1 (Ranks 1-10): Bankers - must select 2
// Tier 2 (Ranks 11-26): Strongly Fancied - must select 4  
// Tier 3 (Ranks 27-50): Good Lads - must select 4
// Tier 4 (Ranks 51+): Outsiders - must select 2
const MOCK_GOLFERS: Omit<Golfer, 'category'>[] = [
  { name: 'Scottie Scheffler', odds: 4, oddsDisplay: '4/1', rank: 1 },
  { name: 'Rory McIlroy', odds: 7, oddsDisplay: '7/1', rank: 2 },
  { name: 'Bryson DeChambeau', odds: 10, oddsDisplay: '10/1', rank: 3 },
  { name: 'Jon Rahm', odds: 12, oddsDisplay: '12/1', rank: 4 },
  { name: 'Ludvig Aberg', odds: 16, oddsDisplay: '16/1', rank: 5 },
  { name: 'Tommy Fleetwood', odds: 18, oddsDisplay: '18/1', rank: 6 },
  { name: 'Xander Schauffele', odds: 18, oddsDisplay: '18/1', rank: 7 },
  { name: 'Collin Morikawa', odds: 22, oddsDisplay: '22/1', rank: 8 },
  { name: 'Cameron Young', odds: 27, oddsDisplay: '27/1', rank: 9 },
  { name: 'Matt Fitzpatrick', odds: 30, oddsDisplay: '30/1', rank: 10 },
  { name: 'Justin Rose', odds: 30, oddsDisplay: '30/1', rank: 11 },
  { name: 'Patrick Reed', odds: 30, oddsDisplay: '30/1', rank: 12 },
  { name: 'Chris Gotterup', odds: 35, oddsDisplay: '35/1', rank: 13 },
  { name: 'Hideki Matsuyama', odds: 35, oddsDisplay: '35/1', rank: 14 },
  { name: 'Viktor Hovland', odds: 35, oddsDisplay: '35/1', rank: 15 },
  { name: 'Brooks Koepka', odds: 38, oddsDisplay: '38/1', rank: 16 },
  { name: 'Robert MacIntyre', odds: 40, oddsDisplay: '40/1', rank: 17 },
  { name: 'Justin Thomas', odds: 40, oddsDisplay: '40/1', rank: 18 },
  { name: 'Tyrrell Hatton', odds: 40, oddsDisplay: '40/1', rank: 19 },
  { name: 'Jordan Spieth', odds: 40, oddsDisplay: '40/1', rank: 20 },
  { name: 'Shane Lowry', odds: 45, oddsDisplay: '45/1', rank: 21 },
  { name: 'Patrick Cantlay', odds: 50, oddsDisplay: '50/1', rank: 22 },
  { name: 'Ben Griffin', odds: 55, oddsDisplay: '55/1', rank: 23 },
  { name: 'Akshay Bhatia', odds: 60, oddsDisplay: '60/1', rank: 24 },
  { name: 'Si Woo Kim', odds: 60, oddsDisplay: '60/1', rank: 25 },
  { name: 'Corey Conners', odds: 60, oddsDisplay: '60/1', rank: 26 },
  { name: 'Russell Henley', odds: 66, oddsDisplay: '66/1', rank: 27 },
  { name: 'Min Woo Lee', odds: 66, oddsDisplay: '66/1', rank: 28 },
  { name: 'Jason Day', odds: 66, oddsDisplay: '66/1', rank: 29 },
  { name: 'Adam Scott', odds: 66, oddsDisplay: '66/1', rank: 30 },
  { name: 'Max Homa', odds: 66, oddsDisplay: '66/1', rank: 31 },
  { name: 'Cameron Smith', odds: 66, oddsDisplay: '66/1', rank: 32 },
  { name: 'Sepp Straka', odds: 70, oddsDisplay: '70/1', rank: 33 },
  { name: 'Sam Burns', odds: 70, oddsDisplay: '70/1', rank: 34 },
  { name: 'Marco Penge', odds: 80, oddsDisplay: '80/1', rank: 35 },
  { name: 'Sungjae Im', odds: 80, oddsDisplay: '80/1', rank: 36 },
  { name: 'Wyndham Clark', odds: 80, oddsDisplay: '80/1', rank: 37 },
  { name: 'J.J. Spaun', odds: 90, oddsDisplay: '90/1', rank: 38 },
  { name: 'Jacob Bridgeman', odds: 90, oddsDisplay: '90/1', rank: 39 },
  { name: 'Harris English', odds: 90, oddsDisplay: '90/1', rank: 40 },
  { name: 'Dustin Johnson', odds: 90, oddsDisplay: '90/1', rank: 41 },
  { name: 'Alexander Noren', odds: 100, oddsDisplay: '100/1', rank: 42 },
  { name: 'Sergio Garcia', odds: 100, oddsDisplay: '100/1', rank: 43 },
  { name: 'Maverick McNealy', odds: 110, oddsDisplay: '110/1', rank: 44 },
  { name: 'Ryan Gerard', odds: 110, oddsDisplay: '110/1', rank: 45 },
  { name: 'Keegan Bradley', odds: 120, oddsDisplay: '120/1', rank: 46 },
  { name: 'Ryan Fox', odds: 120, oddsDisplay: '120/1', rank: 47 },
  { name: 'Aaron Rai', odds: 130, oddsDisplay: '130/1', rank: 48 },
  { name: 'Harry Hall', odds: 130, oddsDisplay: '130/1', rank: 49 },
  { name: 'Rasmus Neergaard-Petersen', odds: 130, oddsDisplay: '130/1', rank: 50 },
  { name: 'John Keefer', odds: 130, oddsDisplay: '130/1', rank: 51 },
  { name: 'Tom McKibbin', odds: 140, oddsDisplay: '140/1', rank: 52 },
  { name: 'Kurt Kitayama', odds: 150, oddsDisplay: '150/1', rank: 53 },
  { name: 'Nicolas Echavarria', odds: 150, oddsDisplay: '150/1', rank: 54 },
  { name: 'Brian Harman', odds: 150, oddsDisplay: '150/1', rank: 55 },
  { name: 'Sam Stevens', odds: 150, oddsDisplay: '150/1', rank: 56 },
  { name: 'Rasmus Hojgaard', odds: 150, oddsDisplay: '150/1', rank: 57 },
  { name: 'Casey Jarvis', odds: 150, oddsDisplay: '150/1', rank: 58 },
  { name: 'Carlos Ortiz', odds: 150, oddsDisplay: '150/1', rank: 59 },
  { name: 'Tiger Woods', odds: 150, oddsDisplay: '150/1', rank: 60 },
  { name: 'Andrew Novak', odds: 200, oddsDisplay: '200/1', rank: 61 },
  { name: 'Michael Kim', odds: 200, oddsDisplay: '200/1', rank: 62 },
  { name: 'Aldrich Potgieter', odds: 200, oddsDisplay: '200/1', rank: 63 },
  { name: 'Phil Mickelson', odds: 200, oddsDisplay: '200/1', rank: 64 },
  { name: 'Max Greyserman', odds: 250, oddsDisplay: '250/1', rank: 65 },
  { name: 'Nick Taylor', odds: 250, oddsDisplay: '250/1', rank: 66 },
  { name: 'Hao-Tong Li', odds: 250, oddsDisplay: '250/1', rank: 67 },
  { name: 'Bubba Watson', odds: 250, oddsDisplay: '250/1', rank: 68 },
  { name: 'Kristoffer Reitan', odds: 300, oddsDisplay: '300/1', rank: 69 },
  { name: 'Sami Valimaki', odds: 300, oddsDisplay: '300/1', rank: 70 },
  { name: 'Davis Riley', odds: 300, oddsDisplay: '300/1', rank: 71 },
  { name: 'Charl Schwartzel', odds: 350, oddsDisplay: '350/1', rank: 72 },
  { name: 'Michael Brennan', odds: 400, oddsDisplay: '400/1', rank: 73 },
  { name: 'Brian Campbell', odds: 400, oddsDisplay: '400/1', rank: 74 },
  { name: 'Zach Johnson', odds: 400, oddsDisplay: '400/1', rank: 75 },
  { name: 'Danny Willett', odds: 500, oddsDisplay: '500/1', rank: 76 },
  { name: 'Angel Cabrera', odds: 500, oddsDisplay: '500/1', rank: 77 },
  { name: 'Jackson Herrington', odds: 1000, oddsDisplay: '1000/1', rank: 78 },
  { name: 'Naoyuki Kataoka', odds: 1000, oddsDisplay: '1000/1', rank: 79 },
  { name: 'Mike Weir', odds: 1000, oddsDisplay: '1000/1', rank: 80 },
  { name: 'Brandon Holtz', odds: 1000, oddsDisplay: '1000/1', rank: 81 },
  { name: 'Fifa Laopakdee', odds: 1000, oddsDisplay: '1000/1', rank: 82 },
  { name: 'Mateo Pulcini', odds: 1000, oddsDisplay: '1000/1', rank: 83 },
  { name: 'Vijay Singh', odds: 1000, oddsDisplay: '1000/1', rank: 84 },
  { name: 'Mason Howell', odds: 1000, oddsDisplay: '1000/1', rank: 85 },
  { name: 'Ethan Fang', odds: 1000, oddsDisplay: '1000/1', rank: 86 },
  { name: 'Fred Couples', odds: 1000, oddsDisplay: '1000/1', rank: 87 },
  { name: 'Jose Maria Olazabal', odds: 2000, oddsDisplay: '2000/1', rank: 88 },
];

export async function GET() {
  try {
    // Assign categories based on rank (from your tier system)
    const golfers: Golfer[] = MOCK_GOLFERS.map((golfer) => {
      let category: 'banker' | 'stronglyFancied' | 'goodLad' | 'outsider';
      
      if (golfer.rank <= 10) {
        category = 'banker';
      } else if (golfer.rank <= 26) {
        category = 'stronglyFancied';
      } else if (golfer.rank <= 50) {
        category = 'goodLad';
      } else {
        category = 'outsider';
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
