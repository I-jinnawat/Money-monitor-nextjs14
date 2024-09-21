import { NextResponse } from 'next/server';
import TransactionModel from '@/models/transaction';

export async function GET(request: Request) {
    try {
        const {searchParams} = new URL(request.url);
        let month = searchParams.get('month');

        if(!month){
            const currenDate = new Date()
            month = (currenDate.getMonth() + 1).toString()
        }

        const query = {
        $expr: {
            $eq: [
            { $month: { $dateFromString: { dateString: "$date" } } }, 
            parseInt(month)
            ]
        }
        };

        const transactions = await TransactionModel.find(query).exec();

        let totalIncome:number = 0;
		let totalOutcome:number = 0;

        	transactions.forEach((transaction) => {
			if (transaction.type === "income") {
				totalIncome += transaction.amount;
			} else if (transaction.type === "expense") {
				totalOutcome += transaction.amount;
			}
        })

        const balance:number = totalIncome - totalOutcome;

        return NextResponse.json({
            transactions,
			summary: {
				totalIncome,
				totalOutcome,
				balance,
			},},{
                status: 200,
            })
		
    } catch (e) {
          if (e instanceof Error) {
            console.error(e.message);
        return NextResponse.json({ message: 'An error occurred' }, { status: 500 });
            }
        
    }
}