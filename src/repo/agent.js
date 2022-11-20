const { Agent } = require('../config/dbConfig')


const saveAdminUser = async (data) => {
    const adminData = new Agent({
        name: data.name,
        email: data.email,       
        password: data.password,
        status: 'AccountCreated'

    
    })
    return await adminData.save()
}

const fetchUser = async condition => {
    try {
        let user = await Agent.findOne({ ...condition })                  
        if(!!user) return { status: '01', user }
        return 'No user found '
    } catch (error) {
        console.log('Error while user login!')
    }
}


const updateUser = async (condition, data) => {
    try {
        const doc = await Agent.findOneAndUpdate({ ...condition }, { ...data }, { new: true });
        return doc
    } catch (error) {
        console.log('Error While updating user!')
    }
}

module.exports = {
    saveAdminUser, 
    fetchUser ,
    updateUser
}