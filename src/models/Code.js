const mongoose = require('mongoose');
const { Schema } = mongoose;

const codeSchema = new Schema({
    code: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    }
}, {
    timestamps: { createdAt: true, updatedAt: true }
})

module.exports = codeSchema;