import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    mcpId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },

    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    pickupPartnerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },

    status: {
        type: String,
        enum: ['PENDING', 'ASSIGNED', 'COMPLETED', 'IN PROGRESS', 'CANCELLED'],
        default: 'PENDING',
    },

    amount: {
        type: Number,
        required: true,
        default: 0,
    },

    commission: {
        type: Number,
        required: true,
        min: 0,
    },

    scheduledTime: {
        type: Date,
        required: true,
    },

    completedTime: Date,
    customerNotes: String,
    partnerNotes: String,

    statusHistory: [{
        status: {
            type: String,
            enum: ['PENDING', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']
        },
        timestamp: {
            type: Date,
            default: Date.now
        },
        note: String
    }],

    paymentStaus: {
        type: String,
        enum: ['PENDING', 'COMPLETED', 'FAILED'],
        default: 'PENDING',

    },
    
    createdAt: {
        type: Date,
        default: Date.now,
    },

    upDatedAt: {
        type: Date,
        default: Date.now,
    },
});

orderSchema.index({ mcpId: 1, status: 1});
orderSchema.index({ pickupPartnerId: 1, status: 1 });
orderSchema.index({ customerId: 1 });
orderSchema.index({ scheduledTime: 1 });
orderSchema.index({ status: 1, scheduledTime: 1 });

orderSchema.pre('save', function(next) {
    this.upDatedAt = Date.now();
    next();
});

orderSchema.methods.updateStatus  = function(newStatus, note = '') {
    this.status = newStatus;
    this.statusHistory.push({
        status: newStatus,
        note: note
    });

    if(newStatus === 'COMPLETED') {
        this.completedTime = Date.now();
    }

    return this.save();
}

orderSchema.methods.assignPartner = function(partnerId) {
    this.pickupPartnerId = partnerId;
    this.status = 'ASSIGNED';
    this.statusHistory.push({
        status: 'ASSIGNED',
        note: `Assigned to partner ${partnerId}`
    });

    return this.save();
};

const Order = mongoose.model('Order', orderSchema);
export default Order;
