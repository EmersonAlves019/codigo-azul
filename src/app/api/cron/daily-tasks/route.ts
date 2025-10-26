import { NextResponse } from 'next/server'
import { sendDailyTaskNotifications } from '@/lib/scheduler/notification-scheduler'

export async function GET() {
  try {
    await sendDailyTaskNotifications()
    return NextResponse.json({ 
      success: true, 
      message: 'Daily task notifications processed',
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Error processing daily tasks:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to process daily tasks' 
      },
      { status: 500 }
    )
  }
}

export const dynamic = 'force-dynamic'
