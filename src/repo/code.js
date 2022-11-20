const { Code } = require('../config/dbConfig')
const { generateVerificationCode } = require('../utils')
const { sendVerificationMail } = require('../mailer')

const saveCode = async email => {
    const verificationCode = generateVerificationCode()
    const codeData = new Code({
        email,
        code: verificationCode
    })
    try {
        const result = await codeData.save()
        if(!!result) {
            await sendVerificationMail(email, result.code)
            return result.code
        }
    } catch (error) {
        return 'Error while saving code'
    }
}



const verifyCode = async (email, code) => {
    try {
        return (await Code.findOne({ email }, {}, { sort: { 'createdAt' : -1 } })).code
    } catch (error) {
        console.log('Error while fetching code!')
    }
}

module.exports = {
    saveCode,
    verifyCode
   
    
}