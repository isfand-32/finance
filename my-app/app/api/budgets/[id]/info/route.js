import { db } from '/lib/db';
import { budgets, Expenses } from '/lib/db/schema';
import { eq, desc, sql } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const userEmail = searchParams.get('userEmail');
    
    if (!userEmail) {
      return NextResponse.json({ success: false, message: 'User email is required' }, { status: 400 });
    }

    // Get budget info
    const budgetResult = await db.select()
      .from(budgets)
      .where(eq(budgets.id, parseInt(id)))
      .where(eq(budgets.createdBy, userEmail));

    if (budgetResult.length === 0) {
      return NextResponse.json({ success: false, message: 'Budget not found' }, { status: 404 });
    }

    const budget = budgetResult[0];
    
    // Get expenses for this budget
    const expensesResult = await db.select()
      .from(Expenses)
      .where(eq(Expenses.budgetId, parseInt(id)))
      .orderBy(desc(Expenses.id));

    // Get total spend for this budget
    const spendResult = await db.select({
      totalSpend: sql`COALESCE(sum(${Expenses.amount}), 0)`.mapWith(Number),
      totalExpenses: sql`count(${Expenses.id})`.mapWith(Number),
    })
      .from(Expenses)
      .where(eq(Expenses.budgetId, parseInt(id)));

    const totalSpend = spendResult[0]?.totalSpend || 0;
    const totalExpenses = spendResult[0]?.totalExpenses || 0;

    const budgetInfo = {
      ...budget,
      totalSpend: totalSpend,
      totalBudget: totalExpenses,
    };

    return NextResponse.json({ 
      success: true, 
      data: {
        budgetInfo,
        expenses: expensesResult
      }
    });
  } catch (error) {
    console.error('Error fetching budget info:', error);
    return NextResponse.json({ success: false, message: 'Error fetching budget info' }, { status: 500 });
  }
} 