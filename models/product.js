const { Schema, model } = require('mongoose');

const ProductSchema = Schema({
    title: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        get: getPrice, set: setPrice,
        required: true, 
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
},{
    timestamps: true
  });

function getPrice(num) {
    return (num/100).toFixed(2);
}

function setPrice(num) {
    return num*100;
}

module.exports = model('Product', ProductSchema);