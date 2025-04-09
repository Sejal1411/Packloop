import mongoose from 'mongoose';

const walletSchema = new mongoose.Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    balance: { type: Number, default: 0 },
    lastUpdated: { type: Date, default: Date.now },
});

// Method to deduct funds from the wallet
walletSchema.methods.deductFunds = async function (amount) {
    if (this.balance < amount) {
        throw new Error('Insufficient wallet balance');
    }
    this.balance -= amount;
    this.lastUpdated = Date.now();
    await this.save();
};

const Wallet = mongoose.model('Wallet', walletSchema);
export default Wallet;