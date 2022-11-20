const mongoose = require('mongoose');
const { Schema } = mongoose;

const enduserSchema = new Schema({
    nickName: {
        type: String,
        required: false
    },
    email: {
        type: String,        
        required: true,
        validate: {
          validator: function(v) {
            return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v);
          },
          message: props => `${props.value} is not a valid email!`
        }
    },
    roomNumber:{
        type: String,
        required: false
    },
    meterId: {
        type: String,
        required: true
    },
    electricityConsumed:{
        type: Number,
        default:0,
        required: false 
    },
    electricityPrice:{
        type: Number,
        required: false 
    },
    paymentStatus: {
        type: String,        
        enum: {
            values: ['Pending', 'Successful', 'Unsuccessful']
        }
    },
    billingDate: {
        type: Number,
        default: 1           
    },
    hostel: {
        type: Schema.Types.ObjectId,
        ref: 'Hostel',
        required: true
     },
    agent: {
        type: Schema.Types.ObjectId,
        ref: 'Agent',
        required: true
     },
     pdfUrl : {
        type: String
     }
        
    
}, {
    timestamps: { createdAt: true, updatedAt: true }
})

module.exports = enduserSchema;