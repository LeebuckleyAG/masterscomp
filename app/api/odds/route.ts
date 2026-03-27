import { NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';

export const dynamic = 'force-dynamic';

interface Golfer {
  name: string;
  odds: number;
  oddsDisplay: string;
  rank: number;
  category: 'banker' | 'stronglyFancied' | 'goodLad' | 'outsider';
}

export async function GET() {
  try {
    const response = await axios.get('https://www.oddschecker.com/golf/the-masters/winner', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    const $ = cheerio.load(response.data);
    const golfers: Golfer[] = [];
    
    // Parse the odds table - OddsChecker structure
    $('.diff-row').each((index, element) => {
      const name = $(element).find('.bc-participant-link').text().trim();
      const oddsText = $(element).find('.bc-odds').first().text().trim();
      
      if (name && oddsText) {
        // Convert fractional odds to decimal for points (e.g., "500/1" -> 500)
        const oddsParts = oddsText.split('/');
        let odds = 0;
        if (oddsParts.length === 2) {
          odds = parseInt(oddsParts[0]) / parseInt(oddsParts[1]);
        } else if (oddsText.includes('/')) {
          odds = parseFloat(oddsText);
        }
        
        const rank = index + 1;
        let category: 'banker' | 'stronglyFancied' | 'goodLad' | 'outsider' = 'outsider';
        
        if (rank <= 5) category = 'banker';
        else if (rank <= 12) category = 'stronglyFancied';
        else if (rank <= golfers.length - 10) category = 'goodLad';
        
        golfers.push({
          name,
          odds,
          oddsDisplay: oddsText,
          rank,
          category
        });
      }
    });
    
    // Categorize outsiders (bottom 10)
    const totalGolfers = golfers.length;
    golfers.forEach((golfer, idx) => {
      if (idx >= totalGolfers - 10) {
        golfer.category = 'outsider';
      } else if (idx >= 12 && golfer.category === 'outsider') {
        golfer.category = 'goodLad';
      }
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
