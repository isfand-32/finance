import { NextResponse } from 'next/server';
import { sql, eq, desc } from 'drizzle-orm';
import { db, budgets, expenses } from '../../../lib/db/index.js';
import { getTableColumns } from 'drizzle-orm';

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, amount, createdBy, icon } = body;

    const result = await db.insert(budgets)
      .values({
        name: name,
        amount: amount,
        createdBy: createdBy,
        icon: icon
      })
      .returning({ insertedId: budgets.id });

    return NextResponse.json({ success: true, data: result[0] });
  } catch (error) {
    console.error('Error creating budget:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create budget' },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const result = await db.select({
      ...getTableColumns(budgets),
      totalSpend: sql`COALESCE(sum(${expenses.amount}), 0)`.mapWith(Number),
      expenseCount: sql`count(${expenses.id})`.mapWith(Number),
    })
    .from(budgets)
    .leftJoin(expenses, eq(budgets.id, expenses.budgetId))
    .where(eq(budgets.createdBy, email))
    .groupBy(budgets.id, budgets.name, budgets.amount, budgets.icon, budgets.createdBy)
    .orderBy(desc(budgets.id));

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching budgets:', error);
    return NextResponse.json({ error: 'Failed to fetch budgets' }, { status: 500 });
  }
} 