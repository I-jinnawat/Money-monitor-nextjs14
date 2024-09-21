import mongoose from 'mongoose'

const TransactionSchema  =new mongoose.Schema(
    {
   		 date: { type: String },
		type: { type: String },
		title: { type: String },
		amount: { type: Number },
		duedate: { type: String },
},{timestamps:true}
)
const TransactionModel = mongoose.models.Transaction || mongoose.model('Transaction', TransactionSchema);
export default TransactionModel;