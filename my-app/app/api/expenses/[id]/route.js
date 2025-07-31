import { db, expenses } from '../../../../lib/db/index.js';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    
    const result = await db.delete(expenses)
      .where(eq(expenses.id, parseInt(id)))
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