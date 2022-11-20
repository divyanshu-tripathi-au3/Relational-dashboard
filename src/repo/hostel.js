const { Hostel } = require('../config/dbConfig')

// ------------------------------------------------------------------

const saveHostel = async (data) => {
    const hostelData = new Hostel({
        hostelName: data.hostelName,
        hostelNumber: data.hostelNumber, 
        hostelPin:data.hostelPin,
        fixedSlab: data.fixedSlab,
        variableSlab: data.variableSlab,
        variableRate: data.variableRate,     
        agent: data.agent,
        status: 'Notadded'
     
        })
    return await hostelData.save()
}

// -----------------------------------------------------------------

const fetchHostel = async condition => {
    try {
        let hostel = await Hostel.findOne({ ...condition }) 
        if(!!hostel) return { status: '01', hostel}         
         return 'No hostel found '
    } catch (error) {
        console.log('Error while adding hostel!')
    }
}

const fetchHostelnew = async condition => {
    try {
        let hostel = await Hostel.findOne({ ...condition })  
        if(hostel) return  hostel    
         
    } catch (error) {
        console.log('Error while fetching!')
    }
}

// ------------------------------------------------------------------

const fetchAgentHostel = async agentid => await Hostel.find({ agent: agentid })



const updateHostel = async (condition, data) => {
    try {
        const doc = await Hostel.findOneAndUpdate({ ...condition }, { ...data }, { new: true });
        return doc
    } catch (error) {
        console.log('Error While updating hostel!')
    }
}

// --------------------------------------------------------------

module.exports = {
    saveHostel,
    fetchHostel,
    fetchAgentHostel,
    updateHostel,
    fetchHostelnew,      

}