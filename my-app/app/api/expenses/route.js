import { NextResponse } from 'next/server';
import { db, expenses } from '../../../lib/db/index.js';
import { eq } from 'drizzle-orm';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const budgetId = searchParams.get('budgetId');

    if (!budgetId) {
      return NextResponse.json({ error: 'Budget ID is required' }, { status: 400 });
    }

    const result = await db.select()
      .from(expenses)
      .where(eq(expenses.budgetId, parseInt(budgetId)))
      .orderBy(expenses.createdAt);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching expenses:', error);
    return NextResponse.json({ error: 'Failed to fetch expenses' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, amount, budgetId } = body;

    if (!name || !amount || !budgetId) {
      return NextResponse.json(
        { success: false, error: 'Name, amount, and budgetId are required' },
        { status: 400 }
      );
    }

    const result = await db.insert(expenses)
      .values({
        name: name,
        amount: amount,
        budgetId: parseInt(budgetId),
      })
      .returning({ insertedId: expenses.id });

    return NextResponse.json({ success: true, data: result[0] });
  } catch (error) {
    console.error('Error creating expense:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create expense' },
      { status: 500 }
    );
  }
} 