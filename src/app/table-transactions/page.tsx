"use client";
import React, { useEffect, useState } from "react";
import { Transaction } from "@/app/types/index";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button"; // Assuming you have a button component
import EditTransactionModal from "@/components/EditTransactionModal"; // A modal component for editing

const TableTransaction = () => {
    const [data, setData] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedMonth, setSelectedMonth] = useState<string>(() => {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    });

    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null); // For updating
    const [isEditing, setIsEditing] = useState(false); // Modal open/close state

    // Fetch transactions
    const getTransaction = async (month: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`https://money-monitor-nextjs14.vercel.app/api/transactions?month=${month}`);
            if (!response.ok) {
                throw new Error("Failed to fetch transactions");
            }
            const transactionData = await response.json();
            setData(transactionData);
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error("Failed to fetch transactions:", error.message);
                setError(error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    // Update a transaction
    const handleUpdateTransaction = async (updatedTransaction: Transaction) => {
        try {
            const response = await fetch(`/api/transactions/${updatedTransaction._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedTransaction),
            });

            if (!response.ok) {
                throw new Error("Failed to update transaction");
            }

            // Update the transaction in the state
            setData((prevData) =>
                prevData.map((transaction) =>
                    transaction._id === updatedTransaction._id ? updatedTransaction : transaction
                )
            );

            setIsEditing(false); // Close modal after update
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error("Failed to update transactions:", error.message);
                setError(error.message);
            }
        }
    };

    // Delete a transaction
    const handleDeleteTransaction = async (transactionId: string) => {
        try {
            const response = await fetch(`/api/transactions/${transactionId}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Failed to delete transaction");
            }

            // Remove the deleted transaction from the state
            setData((prevData) => prevData.filter((transaction) => transaction._id !== transactionId));
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error("Failed to delete transactions:", error.message);
                setError(error.message);
            }
        }
    };

    useEffect(() => {
        const month = selectedMonth.split("-")[1];
        getTransaction(month);
    }, [selectedMonth]);

    return (
        <div className="bg-gray-50 py-5 px-5 rounded-md shadow-md container mx-auto">
            <header>
                <label htmlFor="monthPicker" className="mr-2">
                    Select Month:
                </label>
                <Input
                    type="month"
                    id="monthPicker"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="bg-white cursor-pointer p-2 mb-4"
                />
            </header>
            <main>
                {loading ? (
                    <p className="text-center">Loading transactions...</p>
                ) : error ? (
                    <p>Error: {error}</p>
                ) : data.length === 0 ? (
                    <p>No transactions found for the selected month.</p>
                ) : (
                    <Table>
                        <TableCaption>A list of your recent transactions.</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">ID</TableHead>
                                <TableHead>Title</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.map((transaction) => (
                                <TableRow key={transaction._id}>
                                    <TableCell>{transaction._id}</TableCell>
                                    <TableCell>{transaction.title}</TableCell>
                                    <TableCell>{transaction.type}</TableCell>
                                    <TableCell>{transaction.date}</TableCell>
                                    <TableCell className="text-right">${transaction.amount}</TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            onClick={() => {
                                                setSelectedTransaction(transaction);
                                                setIsEditing(true);
                                            }}
                                            className="mr-2"
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            onClick={() => handleDeleteTransaction(transaction._id)}
                                        >
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </main>

            {/* Modal for Editing */}
            {isEditing && selectedTransaction && (
                <EditTransactionModal
                    transaction={selectedTransaction}
                    onSave={handleUpdateTransaction}
                    onClose={() => setIsEditing(false)}
                />
            )}
        </div>
    );
};

export default TableTransaction;
