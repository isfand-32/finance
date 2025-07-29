import { db } from '/lib/db';
import { budgets, Expenses } from '/lib/db/schema';
import { eq, desc, sql } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userEmail = searchParams.get('userEmail');
    
    if (!userEmail) {
      return NextResponse.json({ success: false, message: 'User email is required' }, { status: 400 });
    }

    // First, let's try a simple query to see if the connection works
    const result = await db.select()
      .from(budgets)
      .where(eq(budgets.createdBy, userEmail))
      .orderBy(desc(budgets.id));

    console.log('Query result:', result);

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Error fetching budgets with expenses:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
} 