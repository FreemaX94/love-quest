import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { performWeeklyMatching } from '@/lib/matching/algorithm'

// This API route should be called by a cron job every Sunday at midnight
// You can use Vercel Cron Jobs or an external service like cron-job.org

export async function POST(request: Request) {
  try {
    // Verify the request is authorized (add your own secret)
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET || 'your-secret-key'
    
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Perform the weekly matching
    const matches = await performWeeklyMatching()
    
    return NextResponse.json({
      success: true,
      message: `Created ${matches?.length || 0} new matches`,
      matches
    })
  } catch (error: any) {
    console.error('Weekly matching error:', error)
    return NextResponse.json(
      { error: error.message || 'Matching failed' },
      { status: 500 }
    )
  }
}

// Manual trigger for testing
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const testMode = searchParams.get('test') === 'true'
  
  if (!testMode) {
    return NextResponse.json({ 
      message: 'Weekly matching endpoint. POST with authorization to trigger.' 
    })
  }

  // For testing: Create a sample match
  try {
    const supabase = await createClient()
    
    // Get two users without active matches for testing
    const { data: availableUsers } = await supabase
      .from('profiles')
      .select('id')
      .eq('onboarding_complete', true)
      .limit(2)
    
    if (!availableUsers || availableUsers.length < 2) {
      return NextResponse.json({ 
        error: 'Not enough users for matching. Need at least 2 users with completed onboarding.' 
      }, { status: 400 })
    }

    // Create a test match
    const { data: match, error } = await supabase
      .from('matches')
      .insert({
        user1_id: availableUsers[0].id,
        user2_id: availableUsers[1].id,
        week_number: new Date().getWeek(),
        compatibility_score: 85,
        status: 'active',
        current_day: 1
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      success: true,
      message: 'Test match created',
      match
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Test matching failed' },
      { status: 500 }
    )
  }
}

// Helper to get week number
declare global {
  interface Date {
    getWeek(): number
  }
}

Date.prototype.getWeek = function() {
  const date = new Date(this.getTime())
  date.setHours(0, 0, 0, 0)
  date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7)
  const week1 = new Date(date.getFullYear(), 0, 4)
  return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7)
}