const sgMail = require('@sendgrid/mail')
const config = require('./config')

sgMail.setApiKey(config.SENDGRID_API_KEY)

const sendEmail = async (to, subject, text) => {
    try {
        return await sgMail.send({ to, from: config.SENDGRID_FROM_EMAIL, subject, text })
    } catch (error) {
        console.log('Email send failed!')
    }
}

const sendVerificationMail = async (to, code) => {
    const message = {
        to,
        subject: 'Verification Code',
        text: `Here is your verification code ${code}

        Thanks & Regards
        `
    }
    return await sendEmail(to, message.subject, message.text)
}


const sendConsentCreationEmail = async (to, userId, name,  email, password) => {
   
    const message = {
        to,
        subject: 'Account Created: Success',
        text: `Hello User
        
        Your account is successfully created. You can use your credentials to Login.
        Your credentials are given below:
        
        Username: ${email}
        Password: ${password}

        
        Thanks & Regards
       
        `
      
    }
    return await sendEmail(to, message.subject, message.text)
}

module.exports = {
    sendConsentCreationEmail,
    sendVerificationMail
}