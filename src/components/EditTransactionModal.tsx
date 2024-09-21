import React, { useState } from "react";
import { Transaction } from "@/app/types/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface EditTransactionModalProps {
    transaction: Transaction;
    onSave: (updatedTransaction: Transaction) => void;
    onClose: () => void;
}

const EditTransactionModal: React.FC<EditTransactionModalProps> = ({ transaction, onSave, onClose }) => {
    const [title, setTitle] = useState(transaction.title);
    const [amount, setAmount] = useState(transaction.amount);
    const [type, setType] = useState(transaction.type);

    const handleSave = () => {
        onSave({
            ...transaction,
            title,
            amount,
            type,
        });
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>Edit Transaction</h2>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
                <Input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount" type="number" />
                <Input value={type} onChange={(e) => setType(e.target.value)} placeholder="Type" />

                <div className="modal-actions">
                    <Button onClick={handleSave}>Save</Button>
                    <Button variant="secondary" onClick={onClose}>Cancel</Button>
                </div>
            </div>
        </div>
    );
};

export default EditTransactionModal;
