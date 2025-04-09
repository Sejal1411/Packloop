import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    email: { type: String, unique: true },
    password: { type: String, required: true },

    role: { type: String, enum: ["MCP", "Partner"], required: true },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    
    commissionRate: Number,
    paymentType: { type: String, enum: ['fixed', 'per-order'], default: 'per-order' },
}, { timestamps: true });

// module.exports = mongoose.model('User', userSchema);
const User = mongoose.model('User', userSchema);
export default User;