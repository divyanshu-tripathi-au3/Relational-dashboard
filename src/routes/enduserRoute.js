const moment = require('moment')
const router = require("express").Router();
const config = require('../config')
const _ = require("lodash")
const { Enduser } = require('../config/dbConfig')

const { authorize } = require('../controllers/userController')
const { saveEnduser} = require('../repo/enduser')
const { fetchHostelnew } = require('../repo/hostel')
const { fetchHostelEnduser, fetchEnduser, updateEnduser } = require('../repo/enduser')
const { validateEndUser } = require('../validation/validations')




// ===========================================================================================

router.post('/add-enduser/:hostel_number', authorize, async (req, res) => {     
    const {nickName, email, roomNumber, meterId} = req.body;
    let hostelNumber = req.params.hostel_number;    

    const { errors, isValid } = validateEndUser(req.body);
    if (!isValid) return res.status(400).json({errors, message: "Validation error"});
   
    let ishostelExist = await fetchHostelnew({ "$and": [
        { "hostelNumber": hostelNumber},
        { "agent": req.userId}] })  
   
    if(ishostelExist){  
        let isenduserExist = await fetchEnduser({ "$or": [
            { "meterId": meterId},
            { "email": email}] }) 
        if(!isenduserExist){    
            const enduserresult = await saveEnduser({              
                nickName,
                email,
                roomNumber,
                meterId,                           
                hostelId: ishostelExist._id,
                agentId: req.userId

            })        
            
            res.status(200).send(                
                enduserresult
            )  
        } else {
            res.status(400).send({           
                message: 'Meter is already Assigned or Email is already defined'            
            })
        }         
    } else {
        res.status(400).send({           
            message: 'hostel is not present'            
        })
    }  
    
})

// ==============================================================

router.get('/hostel-endusers/:hostel_number', authorize, async (req, res) => {

    let hostelNumber = req.params.hostel_number; 
    let ishostelExist = await fetchHostelnew({ "$and": [
        { "hostelNumber": hostelNumber},
        { "agent": req.userId}] }) 

    try{
        let hostelid  = ishostelExist._id;      
        let result = await fetchHostelEnduser(hostelid)

        let totalEnergy = result.reduce(function(prev, cur) {
            return prev + parseFloat(cur.electricityConsumed);
        }, 0);
        
        if(result.length>0) {    
            res.status(200).send({               
                result,
                totalEnergy
               
            })
        } else {
            res.status(400).send({           
                message: 'No Enduser attached'
                
            })
        } 
    } catch (err) {
        res.status(400).json({ message:"Wrong Information provided. Please check UserInfo and HostelNumber"});
     }
       
})

// ====================================================================


router.get('/hostel-totalEC/:hostel_number', authorize, async (req, res) => {

    let hostelNumber = req.params.hostel_number; 
    let ishostelExist = await fetchHostelnew({ "$and": [
        { "hostelNumber": hostelNumber},
        { "agent": req.userId}] }) 

     try{
        let hostelid  = ishostelExist._id;      
        let result = await fetchHostelEnduser(hostelid)

        let totalEnergy = result.reduce(function(prev, cur) {
            return prev + parseFloat(cur.electricityConsumed);
        }, 0);
        
        if(result.length>0) {    
            res.status(200).send({
                totalEnergy
            })
        } else {
            res.status(400).send({           
                message: 'No Enduser attached for TotalEC'
                
            })
        } 
    } catch (err) {
        res.status(400).json({ message:"Wrong Information provided. Please check UserInfo and HostelNumber"});
     }
       
})


// ===========================================================
router.get("/fetch-end-user-by-id:/:user_id", authorize, async(req ,res) => {
    try {
        let user = await fetchEnduser({ "_id" : req.params.user_id })
        return res.json(user)
    } catch (e) {
        return res.status(400).json({ message : e.message })
    }
})

router.put("/create-bill-entry/:user_id", async(req ,res) => {
    try {
        let user = await updateEnduser({ "_id" : req.params.user_id })
        return res.json(user)
    } catch (e) {
        return res.status(400).json({ message : e.message })
    }
})

router.post('/edit-enduser/:meter_id', authorize, async (req, res) => {
    const { email , billingDate} = req.body;
    let meterId = req.params.meter_id;

    const { errors, isValid } = validateEndUser(req.body);
    if (!isValid) return res.status(400).json({errors, message: "Validation error"});

  try{
  
    const user = await updateEnduser({"meterId": meterId }, { email: email , billingDate: billingDate })    
        res.status(200).send({
            message: 'user info updated!',
        })
    
    } catch (err) {
        res.status(400).json({ message:"Please provide unique EmailId"});
    }
})

// ====================================================================


router.get("/find-end-user",authorize,async (req,res)=>{

    let page = parseInt(req.query.page) || 0
    let chunk = parseInt(req.query.chunk) || 10


    let hostelId = req.query.hostel_id;
    let params = req.query
    let search = new RegExp(params["search"], "gi")
        
    let query = {
        "agent": req.userId,
        "$or" : [
            {nickName:search},
            {roomNumber: search},
            {meterId: search}
        ]
    }
    if(!_.isEmpty(hostelId)){
        query["hostel"] = hostelId
    }

    try{   
        let data = await Enduser.find(query)
            .skip(page * chunk)
            .limit(chunk)
        
        res.status(200).send(data);
    } catch (err) {
        res.status(400).json({ message : err.message});
    }
})



// ===================================================================

module.exports = router;