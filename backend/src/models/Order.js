import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    customerName: String,
    pickupAddress: String,
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Pickup Partner
    assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // MCP
    status: { type: String, enum: ['pending', 'completed', 'In prgress', 'cancelled'], default: 'pending' },
    createdAt: { type: Date, default: Date.now },
    completedAt: { type: Date },
});

const Order = mongoose.model('Order', orderSchema);
export default Order;
