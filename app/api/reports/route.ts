import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

// GET: Fetch all reports
export async function GET(req: NextRequest) {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('reports')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ reports: data })
}

// POST: Create a new report
export async function POST(req: NextRequest) {
  const supabase = createServerClient()
  const body = await req.json()
  // You may want to validate body here
  const { data, error } = await supabase
    .from('reports')
    .insert([body])
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
  return NextResponse.json({ report: data }, { status: 201 })
} 