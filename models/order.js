const { Schema, model } = require('mongoose');

const OrderSchema = Schema({
    timestamp: {
        type: Date,
        default: Date.now,
        required: true
    },
    customer: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [
        {
            product: {
                type: Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            quantity: {
                type: Number,
                required: true
            },
            price: {
                type: Number,
                required: true
            }
        }
    ],
    total: {
        type: Number,
        required: true
    },
    paymentMethod: {
        type: String,
        required: true
    },
    // ... other relevant information about the order
}, {
    timestamps: true
});

module.exports = model('Order', OrderSchema);
