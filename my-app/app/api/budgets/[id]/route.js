import { NextResponse } from 'next/server';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { sql, eq } from 'drizzle-orm';
import { budgets, Expenses } from '/lib/db/schema';
import { getTableColumns } from 'drizzle-orm';

// Database connection
const connectionString = 'postgresql://neondb_owner:npg_ubR4Q3gUZYOJ@ep-noisy-mouse-a1tuaq3h.ap-southeast-1.aws.neon.tech/Expense-tracker?sslmode=require&channel_binding=require';
const client = postgres(connectionString);
const db = drizzle(client, { schema: { budgets, Expenses } });

export async function GET(request, { params }) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const budgetId = params.id;

    if (!email || !budgetId) {
      return NextResponse.json({ error: 'Email and budget ID are required' }, { status: 400 });
    }

    const result = await db.select({
      ...getTableColumns(budgets),
      totalSpend: sql`COALESCE(sum(${Expenses.amount}), 0)`.mapWith(Number),
      totalBudget: sql`count(${Expenses.id})`.mapWith(Number),
    })
    .from(budgets)
    .leftJoin(Expenses, eq(budgets.id, Expenses.budgetId))
    .where(eq(budgets.id, parseInt(budgetId)))
    .where(eq(budgets.createdBy, email))
    .groupBy(budgets.id, budgets.name, budgets.amount, budgets.icon, budgets.createdBy);

    if (result.length === 0) {
      return NextResponse.json({ error: 'Budget not found' }, { status: 404 });
    }

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('Error fetching budget:', error);
    return NextResponse.json({ error: 'Failed to fetch budget' }, { status: 500 });
  }
} 