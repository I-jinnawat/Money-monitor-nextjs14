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

const TableTransaction = () => {
    const [data, setData] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedMonth, setSelectedMonth] = useState<string>(() => {
        // Default to the current month on first render
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    });

    const getTransaction = async (month: string) => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(`/api/transactions?month=${month}`); // Pass month as query param
            if (!response.ok) {
                throw new Error("Failed to fetch transactions");
            }
            const transactionData = await response.json();

            setData(transactionData);
        } catch (error: any) {
            console.error("Failed to fetch transactions:", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    // Fetch transactions whenever the selected month changes
    useEffect(() => {
        const month = selectedMonth.split("-")[1]; // Extract the month (MM)
        getTransaction(month);
    }, [selectedMonth]);

    return (
        <div className="bg-gray-50 py-5 px-5 rounded-md shadow-md container mx-auto">
            <header>
                {/* Month Picker */}
                <label htmlFor="monthPicker" className="mr-2">
                    Select Month:
                </label>
                <Input
                    type="month"
                    id="monthPicker"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)} // Update selected month
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
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.map((transaction) => (
                                <TableRow key={transaction._id}> {/* Add unique key */}
                                    <TableCell>{transaction._id}</TableCell>
                                    <TableCell>{transaction.title}</TableCell>
                                    <TableCell>{transaction.type}</TableCell>
                                    <TableCell>{transaction.date}</TableCell>
                                    <TableCell className="text-right">${transaction.amount}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </main>
        </div>
    );
};

export default TableTransaction;
