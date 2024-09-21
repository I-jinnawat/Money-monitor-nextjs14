"use client"
import React, { useEffect, useState } from 'react'
import { ReportData } from '@/app/types/index'
import { Input } from "@/components/ui/input";

const Summary = () => {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();
    let monthName = months[currentDate.getMonth()];

    const [report, setReport] = useState<ReportData>()
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [selectedMonth, setSelectedMonth] = useState<string>(() => {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    });

    useEffect(() => {
        const getReport = async (month: string) => {
            setIsLoading(true); // Reset loading state on month change
            try {
                const res = await fetch(`http://localhost:3000/api/report?month=${month}`)
                if (!res.ok) {
                    throw new Error("Failed to fetch report")
                }
                const data = await res.json()
                setReport(data.summary)
            } catch (e: any) {
                console.error(e.message)
            } finally {
                setIsLoading(false)
            }
        }
        const month = selectedMonth.split("-")[1];
        getReport(month)
    }, [selectedMonth])

    return (
        <div className=' bg-gray-50 py-5 px-5 rounded-md shadow-md container mx-auto' >
            {isLoading && (
                <div className="text-center text-xl">Loading report...</div>
            )}
            {!isLoading && report && (
                <>
                    <header>
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
                    <hr className="h-px bg-gray-300 border-0 dark:bg-gray-700" />
                    <main>
                        <p>Total income: {report.totalIncome}</p>
                        <p>Total outcome: {report.totalOutcome}</p>
                        <p className={report.balance < 0 ? 'text-red-500' : 'text-green-800'}>
                            Total balance: {report.balance}
                        </p>
                    </main>
                </>
            )}
        </div>
    )
}

export default Summary
