import { db } from '/lib/db';
import { Expenses } from '/lib/db/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    
    const result = await db.delete(Expenses)
      .where(eq(Expenses.id, parseInt(id)))
      .returning();
    
    if (result && result.length > 0) {
      return NextResponse.json({ success: true, message: 'Expense deleted successfully' });
    } else {
      return NextResponse.json({ success: false, message: 'Expense not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error deleting expense:', error);
    return NextResponse.json({ success: false, message: 'Error deleting expense' }, { status: 500 });
  }
} 