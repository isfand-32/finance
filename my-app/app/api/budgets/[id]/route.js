import { NextResponse } from 'next/server';
import { sql, eq, and } from 'drizzle-orm';
import { db, budgets, expenses } from '../../../../lib/db/index.js';
import { getTableColumns } from 'drizzle-orm';

export async function GET(request, { params }) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const budgetId = params.id;

    console.log('API: Requested budget ID:', budgetId);
    console.log('API: User email:', email);

    if (!email || !budgetId) {
      return NextResponse.json({ error: 'Email and budget ID are required' }, { status: 400 });
    }

    // First get the budget
    const budgetResult = await db.select()
      .from(budgets)
      .where(and(
        eq(budgets.id, parseInt(budgetId)),
        eq(budgets.createdBy, email)
      ));

    if (budgetResult.length === 0) {
      return NextResponse.json({ error: 'Budget not found' }, { status: 404 });
    }

    const budget = budgetResult[0];

    // Then get expenses for this budget
    const expensesResult = await db.select({
      totalSpend: sql`COALESCE(sum(${expenses.amount}), 0)`.mapWith(Number),
      expenseCount: sql`count(${expenses.id})`.mapWith(Number),
    })
    .from(expenses)
    .where(eq(expenses.budgetId, parseInt(budgetId)));

    const result = {
      ...budget,
      totalSpend: expensesResult[0]?.totalSpend || 0,
      expenseCount: expensesResult[0]?.expenseCount || 0,
    };

    console.log('API: Final result:', result);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching budget:', error);
    return NextResponse.json({ error: 'Failed to fetch budget' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const budgetId = parseInt(params.id);
    
    if (isNaN(budgetId)) {
      return NextResponse.json({ error: 'Invalid budget ID' }, { status: 400 });
    }

    // First delete all expenses associated with this budget
    await db.delete(expenses)
      .where(eq(expenses.budgetId, budgetId));

    // Then delete the budget
    const result = await db.delete(budgets)
      .where(eq(budgets.id, budgetId))
      .returning();

    if (result && result.length > 0) {
      return NextResponse.json({ success: true, message: 'Budget deleted successfully' });
    } else {
      return NextResponse.json({ error: 'Budget not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error deleting budget:', error);
    return NextResponse.json(
      { error: 'Failed to delete budget' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const { name, amount, icon } = await request.json();

    const result = await db.update(budgets)
      .set({
        name: name,
        amount: amount,
        icon: icon,
      })
      .where(eq(budgets.id, parseInt(id)))
      .returning();

    if (result && result.length > 0) {
      return NextResponse.json({ success: true, budget: result[0] });
    } else {
      return NextResponse.json({ success: false, error: 'Budget not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error updating budget:', error);
    return NextResponse.json({ success: false, error: 'Failed to update budget' }, { status: 500 });
  }
} 