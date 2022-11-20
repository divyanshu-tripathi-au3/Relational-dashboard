const generateVerificationCode = () => Math.random().toString().substr(2, 6)





module.exports = { 
    generateVerificationCode,
    
}