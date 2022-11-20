const moment = require('moment')
const router = require("express").Router();

const { createPasswordHash, comparePassword, generateAccessToken, authorize } = require('../controllers/userController')
const { sendConsentCreationEmail } = require('../mailer')
const { saveAdminUser, fetchUser ,updateUser} = require('../repo/agent')
const { fetchAgentHostel } = require('../repo/hostel')
const { fetchAgentEnduser } = require('../repo/enduser')
const { saveCode, verifyCode } = require('../repo/code')
const { validateEmailInput, validateUserData, verifyLoginData, validateCode, validateForgetPasswordInput, editUser } = require('../validation/validations')

const config = require('../config')
const fetch = require("node-fetch")
const MAIN_HOST = config.MAIN_HOST; 
const querystring = require('query-string');


// ====================================================================

router.post('/create-agent', async (req, res) => {     // for internal purpose
    const { name, email, password} = req.body;

    const { errors, isValid } = validateUserData(req.body);
    if (!isValid) return res.status(400).json({errors, message: "Validation error"});
   
    let isUserExist = await fetchUser({ email })
    
    if (!!isUserExist && isUserExist.status === '01'){
        res.status(400).json({
            message: 'user already exists with this email'
        })
            
     }else{

        const passHash = await createPasswordHash(password)              
        const result = await saveAdminUser({
            name,
            email,
            password: passHash,                 
        
        })

        res.status(200).send(           
            result
        )

        await sendConsentCreationEmail(email, req.userId, name, email, password)

        
     }   
})


// ============================================================


router.post('/login', async (req, res) => {
    const { email, password } = req.body

    // verify login data
    const { errors, isValid } = verifyLoginData(req.body);
    if (!isValid) return res.status(400).json({errors, message: "Validation error"});

    let result = await fetchUser({ "email": email })
    let user = await updateUser({ email: email }, { status: 'active' })
   
    console.log(result)
    if (!!result && result.status && result.status === '01') {
        const passHash = await comparePassword(password, result.user.password)
        if (passHash) {
            // Generate JWT Token
            const token = generateAccessToken({ userId: result.user._id, name: result.user.name, email: result.user.email})
            res.status(200).send({ token: token, message: "success" , user})
        } else res.status(400).send({ message: 'Incorrect password!' })
    } else {
        res.status(400).send({
            result,
            message: 'No user with this email'
            
        })
    }
})

// ======================================================================================

router.get('/agent-hostels', authorize, async (req, res) => {    
    let hostelResult = await fetchAgentHostel(req.userId)
        
    if(hostelResult.length>0 ) {    
        res.status(200).send(hostelResult) 
            
       
    } else {
        res.status(400).send({           
            message: 'No Hostel attached'
            
        })
    }      
})


router.get('/agent-endusers', authorize, async (req, res) => {    
   
    let endUserResult = await fetchAgentEnduser(req.userId)
    
    if( endUserResult.length>0) {    
        res.status(200).send(endUserResult)     
  
    } else {
        res.status(400).send({           
            message: 'No EndUser attached'
            
        })
    }      
})

// =========================================================================

router.post('/resend-verification-code', async (req, res) => {
    const { email } = req.body;

    // Handle empty email and invalid email
    const { errors, isValid } = validateEmailInput(req.body);
    if (!isValid) return res.status(400).json({errors, message: "Validation error"});

    await saveCode(email)
    res.status(200).send({ message: 'Verification code is sent!' })
})

// ================================================================


router.post('/verify-code', async (req, res) => {
    const { code, email } = req.body;
   
    const { errors, isValid } = validateCode(req.body);
    if (!isValid) return res.status(400).json({errors, message: "Validation error"});

    let latestCode = await verifyCode(email)

    if (latestCode !== code) {
        res.status(400).send({ message: 'Wrong Code!' })
    } else {
            res.status(200).send({
            message: 'Verification-code is verified.'
           
        })
    }
})


// ==============================================================

router.post('/forget-password', async (req, res) => {
    const { password, email } = req.body;

    const { errors, isValid } = validateForgetPasswordInput(req.body);
    if (!isValid) return res.status(400).json({errors, message: "Validation error"});
   
        const passHash = await createPasswordHash(password)
    try{        
        const user = await updateUser({ email }, { password: passHash })
        res.status(200).send({
            message: 'Password is changed now.',
            user
        })
    } catch {
        res.status(400).send({           
            message: 'Error found'
            
        })
    }  
})

// ============================================================================

module.exports = router;