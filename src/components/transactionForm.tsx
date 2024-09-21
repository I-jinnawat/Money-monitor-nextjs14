"use client";
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import Swal from 'sweetalert2';

export default function TransactionForm() {

    const [type, setType] = useState('');
    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState('');
    const [loading, setLoading] = useState(false); // New state to handle form submission

    // SweetAlert2 toast configuration
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-right',
        iconColor: 'white',
        customClass: {
            popup: 'colored-toast',
        },
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!type || !title || !amount || !date) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid Submission',
                text: 'Please fill in all required fields.',
            });
            return;
        }

        setLoading(true); // Set loading state to true during submission

        // Create the form data object
        const formData = {
            type,
            title,
            amount,
            date,
        };

        try {
            // Send the form data to the server-side API
            const response = await fetch('/api/transactions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Failed to add transaction');
            }

            await Toast.fire({
                icon: 'success',
                title: 'Transaction added!',
            });

            // Reset the form after submission
            setType('');
            setTitle('');
            setAmount('');
            setDate('');
        } catch (error) {
            console.error("Error adding transaction:", error);
            Swal.fire({
                icon: 'error',
                title: 'Failed to Add',
                text: 'Error adding transaction. Please try again later.',
            });
        } finally {
            setLoading(false); // Reset loading state
        }
    };

    return (
        <div className='w-full bg-gray-50 py-5 px-5 rounded-md shadow-md'>
            <form onSubmit={handleSubmit}>
                <div className="grid md:grid-cols-2 gap-5">
                    <Select onValueChange={setType} value={type}>
                        <SelectTrigger className="bg-white">
                            <SelectValue placeholder="Select Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="income">Income</SelectItem>
                            <SelectItem value="expense">Expense</SelectItem>
                        </SelectContent>
                    </Select>
                    <Input
                        onChange={(e) => setTitle(e.target.value)}
                        className='bg-white'
                        type="text"
                        name="title"
                        placeholder="Enter transaction title"
                        required
                        value={title}
                    />
                    <Input
                        onChange={(e) => setAmount(e.target.value)}
                        className='bg-white'
                        type="number"
                        name="amount"
                        placeholder="Enter transaction amount"
                        required
                        value={amount}
                    />
                    <Input
                        onChange={(e) => setDate(e.target.value)}
                        type='datetime-local'
                        className='bg-white'
                        name="date"
                        value={date}
                        required
                    />
                </div>
                <div className="flex justify-center mt-5">
                    <button
                        type="submit"
                        className={`w-full md:w-60 items-center text-white ${loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'} rounded-md px-4 py-2`}
                        disabled={loading}
                    >
                        {loading ? 'Submitting...' : 'Add Transaction'}
                    </button>
                </div>
            </form>
        </div>
    );
}
