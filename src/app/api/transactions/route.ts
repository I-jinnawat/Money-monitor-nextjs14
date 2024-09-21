import { NextResponse } from 'next/server';
import TransactionModel from '@/models/transaction';


export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    let month = searchParams.get('month');
    
    // Get current month if no month is provided
    if (!month) {
      const currentDate = new Date();
      month = (currentDate.getMonth() + 1).toString(); // getMonth() returns 0-indexed, so we add 1
    }

    const query = {
      $expr: {
        $eq: [
          { $month: { $dateFromString: { dateString: "$date" } } }, 
          parseInt(month)
        ]
      }
    };

    const transactions = await TransactionModel.find(query).exec();;

    return NextResponse.json(transactions, { status: 200 });
  } catch (e: unknown) {
    if (e instanceof Error) {
                console.error("Failed to fetch transactions:", e.message);
                return NextResponse.json({ error: e.message }, { status: 500 });
            }
  }
}


export async function POST(request: Request) {
    try {
        const { type, title, amount, date } = await request.json();

        // Create the transaction in the database
        const transaction = await TransactionModel.create({
            type,
            title,
            amount,
            date,
            duedate: new Date().toISOString(),
        });

        return NextResponse.json({ success: true, transaction });
    } catch (error) {
        console.error('Error creating transaction:', error);
        return NextResponse.json({ success: false, error: 'Error creating transaction' }, { status: 500 });
    }
}