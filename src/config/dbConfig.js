const mongoose = require('mongoose');
const config = require('./index');

// Load schemas 
const agentSchema = require('../models/Agent')
const hostelSchema = require('../models/hostel')
const enduserSchema = require('../models/enduser')
const codeSchema = require('../models/Code')

const MONGO_URI = config.MONGO_URI+"/odrDb"

const connection = mongoose.createConnection(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,       
})


const Agent = connection.model('Agent', agentSchema)
const Hostel = connection.model('Hostel', hostelSchema)
const Enduser = connection.model('Enduser', enduserSchema)
const Code = connection.model('Code', codeSchema)


module.exports = {
    Agent,
    Hostel,
    Enduser,
    Code
    
}