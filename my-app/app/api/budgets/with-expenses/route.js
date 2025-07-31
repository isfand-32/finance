import { NextResponse } from 'next/server';
import { db } from '../../../../lib/db';
import { budgets, expenses } from '../../../../lib/db';
import { sql, eq, desc } from 'drizzle-orm';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: 'Email parameter is required' }, { status: 400 });
    }

    console.log('Fetching budgets with expenses for email:', email);

    const result = await db.select({
      id: budgets.id,
      name: budgets.name,
      amount: budgets.amount,
      icon: budgets.icon,
      createdBy: budgets.createdBy,
      totalSpent: sql`COALESCE(sum(expenses.amount), 0)`.mapWith(Number),
      totalItem: sql`count(expenses.id)`.mapWith(Number),
    }).from(budgets)
    .leftJoin(expenses, eq(budgets.id, expenses.budgetId))
    .where(eq(budgets.createdBy, email))
    .groupBy(budgets.id, budgets.name, budgets.amount, budgets.icon, budgets.createdBy)
    .orderBy(desc(budgets.id));

    console.log('API result:', result);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in with-expenses API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 