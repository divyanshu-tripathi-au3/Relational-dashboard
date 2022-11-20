const { Enduser } = require('../config/dbConfig')

// ------------------------------------------------------------------

const saveEnduser = async (data) => {    
    const enduserData = new Enduser({
        nickName: data.nickName,
        email:    data.email, 
        meterId: data.meterId,
        roomNumber: data.roomNumber,
        billingDate: data.billingDate,     
        hostel: data.hostelId,
        agent: data.agentId
    })

    return await enduserData.save()
}

const updateEnduser = async (condition, data) => {
    try {
        const doc = await Enduser.findOneAndUpdate({ ...condition }, { ...data }, { new: true });
        return doc
    } catch (error) {
        console.log('Error While updating enduser!')
    }
}

const fetchEnduser = async condition => {
    try {
        let enduser = await Enduser.findOne({ ...condition })  
        if(enduser) return  enduser    
         
    } catch (error) {
        console.log('Error while fetching')
    }
}

const fetchHostelEnduser = async hostelid => await Enduser.find({ hostel: hostelid })
const fetchAgentEnduser = async agentid => await Enduser.find({ agent: agentid })

// --------------------------------------------------------------

module.exports = {
    saveEnduser,
    updateEnduser,
    fetchEnduser,
    fetchHostelEnduser,
    fetchAgentEnduser

}