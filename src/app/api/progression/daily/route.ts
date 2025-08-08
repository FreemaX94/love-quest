import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// This API route should be called by a cron job every day at midnight
// It advances all active matches to the next day

export async function POST(request: Request) {
  try {
    // Verify the request is authorized
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET || 'your-secret-key'
    
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = await createClient()
    
    // Get all active matches
    const { data: activeMatches, error: fetchError } = await supabase
      .from('matches')
      .select('*')
      .eq('status', 'active')
      .lt('current_day', 7)
    
    if (fetchError) throw fetchError
    
    if (!activeMatches || activeMatches.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No active matches to update'
      })
    }
    
    // Update each match to next day
    const updates = activeMatches.map(match => ({
      id: match.id,
      current_day: match.current_day + 1
    }))
    
    // Batch update
    for (const update of updates) {
      const { error: updateError } = await supabase
        .from('matches')
        .update({ current_day: update.current_day })
        .eq('id', update.id)
      
      if (updateError) {
        console.error(`Failed to update match ${update.id}:`, updateError)
      }
    }
    
    // Check for matches that reached day 7 and need decisions
    const completedMatches = activeMatches.filter(m => m.current_day + 1 === 7)
    
    if (completedMatches.length > 0) {
      // Send notifications for decision day (implement notification system)
      console.log(`${completedMatches.length} matches reached decision day`)
    }
    
    return NextResponse.json({
      success: true,
      message: `Updated ${updates.length} matches to next day`,
      completedMatches: completedMatches.length
    })
    
  } catch (error: any) {
    console.error('Daily progression error:', error)
    return NextResponse.json(
      { error: error.message || 'Progression failed' },
      { status: 500 }
    )
  }
}

// Manual trigger for testing
export async function GET() {
  return NextResponse.json({ 
    message: 'Daily progression endpoint. POST with authorization to trigger.',
    info: 'This advances all active matches to the next day (max day 7)'
  })
}