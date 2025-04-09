import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    from: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    to: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    amount: { type: Number, required: true },

    type: { type: String, enum: ['credit', 'debit'], required: true },

    description: String,

    relatedOrder: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
    
    status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
}, { timestamps: true });

const Transaction = mongoose.model('Transaction', transactionSchema);
export default Transaction;
