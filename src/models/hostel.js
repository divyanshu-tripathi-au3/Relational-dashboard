const mongoose = require('mongoose');
const { Schema } = mongoose;

const hostelSchema = new Schema({
    hostelName: {
        type: String,        
        required: true
       
    },
    hostelNumber: {
        type: Number,
        required: true,
              
    }, 
    hostelPin: {
        type: Number,
        required: false              
    },
    state:{
        type: String,
        required: false
    },
    status: {
        type: String,        
        enum: {
            values: ['added', 'Notadded']
        }
    },    
    totalEC:{
        type: Number,
        required: false 
    },
    fixedSlab:{
        type: Number,
        default:0,
        required: false 
    },
    variableSlab:{
        type: [],
        required: false
    },
    variableRate:{
        type: [],
        required: false
    },        
    agent: {
        type: Schema.Types.ObjectId,
        ref: 'Agent',
        required: true
     }
   
}, {
    timestamps: { createdAt: true, updatedAt: true }
})


hostelSchema.virtual('enduseralloted', {
    ref: 'Enduser', //The Model to use
    localField: '_id', //Find in Model, where localField 
    foreignField: 'hostel', // is equal to foreignField
 });
 
 // Set Object and Json property to true. Default is set to false
 hostelSchema.set('toObject', { virtuals: true });
 hostelSchema.set('toJSON', { virtuals: true });


module.exports = hostelSchema;