import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

interface Team {
  id: string;
  teamName: string;
  email: string;
  bankers: string[]; // 2 golfers
  stronglyFancied: string[]; // 4 golfers
  goodLads: string[]; // 4 golfers
  outsiders: string[]; // 2 golfers
  createdAt: string;
}

// In-memory storage (use a database in production)
let teams: Team[] = [];

export async function GET() {
  return NextResponse.json({ teams });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const { teamName, email, bankers, stronglyFancied, goodLads, outsiders } = body;
    
    // Validation
    if (!teamName || !email) {
      return NextResponse.json({ error: 'Team name and email are required' }, { status: 400 });
    }
    
    if (bankers?.length !== 2) {
      return NextResponse.json({ error: 'Must select exactly 2 bankers' }, { status: 400 });
    }
    
    if (stronglyFancied?.length !== 4) {
      return NextResponse.json({ error: 'Must select exactly 4 strongly fancied golfers' }, { status: 400 });
    }
    
    if (goodLads?.length !== 4) {
      return NextResponse.json({ error: 'Must select exactly 4 good lads' }, { status: 400 });
    }
    
    if (outsiders?.length !== 2) {
      return NextResponse.json({ error: 'Must select exactly 2 outsiders' }, { status: 400 });
    }
    
    // Check for duplicate email
    if (teams.some(t => t.email.toLowerCase() === email.toLowerCase())) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
    }
    
    const newTeam: Team = {
      id: Date.now().toString(),
      teamName,
      email,
      bankers,
      stronglyFancied,
      goodLads,
      outsiders,
      createdAt: new Date().toISOString()
    };
    
    teams.push(newTeam);
    
    return NextResponse.json({ success: true, team: newTeam });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to create team', details: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Team ID required' }, { status: 400 });
    }
    
    teams = teams.filter(t => t.id !== id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to delete team' }, { status: 500 });
  }
}
