'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import TransactionModel from '@/models/transaction';

interface Transaction {
  type: string;
  title: string;
  amount: number;
  date: string;
}

export async function createTransaction(formData: FormData) {
  try {
    const type = formData.get('type')?.toString();
    const title = formData.get('title')?.toString();
    const amount = parseFloat(formData.get('amount')?.toString() || '0');
    const date = formData.get('date')?.toString();

    // Validate the form data
    if (!type || !title || !amount || !date) {
      throw new Error('All fields are required');
    }

    // Create the transaction object
    const transaction: Transaction = {
      type,
      title,
      amount,
      date,
    };

    // Save the transaction to the database
    const createdTransaction = await TransactionModel.create({
      date: transaction.date,
      type: transaction.type,
      title: transaction.title,
      amount: transaction.amount,
      duedate: new Date().toISOString(), // Assuming you're also saving the due date
    });

    console.log('Transaction created successfully:', createdTransaction);

    // Revalidate and redirect after success
    revalidatePath('/');
    redirect(`/`);

  } catch (error) {
    // Handle and log the error
    console.error('Error creating transaction:', error);
    throw new Error('Failed to create transaction');
  }
}
