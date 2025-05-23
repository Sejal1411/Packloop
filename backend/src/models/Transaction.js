import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    
    amount: { 
        type: Number, 
        required: true 
    },

    type: { 
        type: String, 
        enum: ['credit', 'debit'], 
        required: true 
    },

    description: {
        type: String,
        required: true,
    },
    
    status: { 
        type: String, 
        enum: ['pending', 'completed', 'failed'], 
        default: 'pending' 
    },

    balanceAfter: {
        type: Number,
        required: true
    }
}, { timestamps: true });






const Transaction = mongoose.model('Transaction', transactionSchema);
export default Transaction;
