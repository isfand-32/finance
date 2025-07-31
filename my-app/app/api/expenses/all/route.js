import { NextResponse } from 'next/server';
import { db, budgets, expenses } from '../../../../lib/db';
import { eq, desc } from 'drizzle-orm';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: 'Email parameter is required' }, { status: 400 });
    }

    // First get all budgets for the user
    const userBudgets = await db.select({
      id: budgets.id,
      name: budgets.name,
    }).from(budgets)
    .where(eq(budgets.createdBy, email));

    // Then get all expenses for these budgets
    const allExpenses = [];
    
    for (const budget of userBudgets) {
      const budgetExpenses = await db.select({
        id: expenses.id,
        name: expenses.name,
        amount: expenses.amount,
        createdAt: expenses.createdAt,
        budgetId: expenses.budgetId,
      }).from(expenses)
      .where(eq(expenses.budgetId, budget.id))
      .orderBy(desc(expenses.createdAt));

      // Add budget name to each expense
      budgetExpenses.forEach(expense => {
        allExpenses.push({
          ...expense,
          budgetName: budget.name,
        });
      });
    }

    // Sort all expenses by date (newest first)
    allExpenses.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return NextResponse.json(allExpenses);
  } catch (error) {
    console.error('Error fetching all expenses:', error);
    return NextResponse.json({ error: 'Failed to fetch expenses' }, { status: 500 });
  }
} 