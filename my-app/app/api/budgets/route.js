import { NextResponse } from 'next/server';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { sql, eq, desc } from 'drizzle-orm';
import { budgets, Expenses } from '/lib/db/schema';
import { getTableColumns } from 'drizzle-orm';

// Database connection
const connectionString = 'postgresql://neondb_owner:npg_ubR4Q3gUZYOJ@ep-noisy-mouse-a1tuaq3h.ap-southeast-1.aws.neon.tech/Expense-tracker?sslmode=require&channel_binding=require';
const client = postgres(connectionString);
const db = drizzle(client, { schema: { budgets, Expenses } });

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
      totalSpend: sql`COALESCE(sum(${Expenses.amount}), 0)`.mapWith(Number),
      totalBudget: sql`count(${Expenses.id})`.mapWith(Number),
    })
    .from(budgets)
    .leftJoin(Expenses, eq(budgets.id, Expenses.budgetId))
    .where(eq(budgets.createdBy, email))
    .groupBy(budgets.id, budgets.name, budgets.amount, budgets.icon, budgets.createdBy)
    .orderBy(desc(budgets.id));

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching budgets:', error);
    return NextResponse.json({ error: 'Failed to fetch budgets' }, { status: 500 });
  }
} 