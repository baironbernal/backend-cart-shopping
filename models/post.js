const { Schema, model } = require('mongoose');

const PostSchema = Schema({
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    date_at: {
        type: Date,
        required: true
    }
});

module.exports = model('Post', PostSchema);