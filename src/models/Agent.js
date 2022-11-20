const mongoose = require('mongoose');
const { Schema } = mongoose;

const agentSchema = new Schema({
    name: {
        type: String,
        required: false
    },
    email: {
        type: String,
        unique: true,
        required: true,
        validate: {
          validator: function(v) {
            return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v);
          },
          message: props => `${props.value} is not a valid email!`
        }
    },
    password: {
        type: String,
        required: true
    },
    status: {
        type: String,        
        enum: {
            values: ['active', 'AccountCreated']
        }
    },
    hostels: [{
        type: Schema.Types.ObjectId,
        ref: 'Hostel'
     }],
     price: {
        type: Number,
        required: false
     }
        
    
}, {
    timestamps: { createdAt: true, updatedAt: true }
})




module.exports = agentSchema;