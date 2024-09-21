import { NextResponse } from 'next/server';
import TransactionModel from '@/models/transaction';
import  connectToDatabase  from '@/app/lib/connectDB'; // Assuming you have this function to connect to your MongoDB

// Handle PUT (Update) Request
export async function PUT(request: Request) {
    try {
        await connectToDatabase(); // Ensure you're connected to MongoDB

        const transactionId = new URL(request.url).pathname.split('/').pop(); // Extract transaction ID from the URL
        const data = await request.json(); // Get the updated data from the request body

        // Find and update the transaction
        const updatedTransaction = await TransactionModel.findByIdAndUpdate(transactionId, data, {
            new: true, // Return the updated document
        });

        if (!updatedTransaction) {
            return NextResponse.json({ message: "Transaction not found" }, { status: 404 });
        }

        return NextResponse.json(updatedTransaction);
    } catch (error) {
        console.error("Error updating transaction:", error);
        return NextResponse.json({ message: "Failed to update transaction" }, { status: 500 });
    }
}

// Handle DELETE Request
export async function DELETE(request: Request) {
    try {
        await connectToDatabase(); // Ensure you're connected to MongoDB

        const transactionId = new URL(request.url).pathname.split('/').pop(); // Extract transaction ID from the URL

        // Find and delete the transaction
        const deletedTransaction = await TransactionModel.findByIdAndDelete(transactionId);

        if (!deletedTransaction) {
            return NextResponse.json({ message: "Transaction not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Transaction deleted successfully" });
    } catch (error) {
        console.error("Error deleting transaction:", error);
        return NextResponse.json({ message: "Failed to delete transaction" }, { status: 500 });
    }
}
