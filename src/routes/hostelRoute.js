const moment = require('moment')
const router = require("express").Router();
const { saveHostel, fetchHostel, updateHostel,fetchHostelnew} = require('../repo/hostel')
const config = require('../config')
const { Hostel, Enduser } = require('../config/dbConfig')
const _ = require('lodash');

const { authorize } = require('../controllers/userController')




// =================================================================

 router.post('/addhostels',authorize, async (req, res) => {     // for internal purpose
    const { hostelName, hostelNumber, hostelPin, fixedSlab, variableSlab, variableRate} = req.body;
   
    //  let ishostelExist = await fetchHostel({"hostelnumber": hostelnumber }) 
    
    let ishostelExist = await fetchHostel({ "$and": [
        { "hostelNumber": hostelNumber},
        { "agent": req.userId}] })
       
     if (!!ishostelExist && ishostelExist.status === '01' ){
        res.status(400).json({
            message: 'This Hostel already allocated'
       })
     }else{
        
        const result = await saveHostel({                
            hostelName,
            hostelNumber,
            hostelPin,
            fixedSlab,
            variableSlab,
            variableRate,          
            agent: req.userId,
                                      
         })        

         let hostel = await updateHostel({ "hostelNumber": hostelNumber }, { status: 'added' })
        res.status(200).send(           
            hostel
        )   
       
    }
 
})

// ========================================================================================

// router.get("/findbyhostel",authorize,async (req,res)=>{

   
//         let params = req.query
        
//         let search = new RegExp(params["search"], "gi")
        
//         let query = {
//             "$or" : [
//                 {hostelname:search},
//                 {hostelnumber: search},
//                 {hostelpin: search}
//             ]
//         }

//         // if(hostelNo){
//         //     query["$and"].push({hostelnumber: hostelNo})
//         // }

//         // if(hostelpin){
//         //     query["$and"].push({hostelpin: hostelpin})
//         // }
    
//         // let data = await Hostel.find({query})
//         let data = await Hostel.find( { "$and": [query,{ "agent": req.userId}]}) 

//         if (data.length> 0) {       
//             res.status(200).json({data});
//         } else {
//             res.status(400).json({ message:"No record found"});
//         }
    
// })


// ==========================================================================


// router.get('/agent-hostels-meters',authorize, async (req, res) => {
//     let {agent} = req.userId
//     try {
//        const data = await Hostel.find(agent)
//                                   .populate({path: 'enduseralloted', select: 'nickname meter_id electricityConsumed electricityPrice '});
//        res.status(200).json({data});
//     } catch (err) {
//        res.status(400).json({ message:err.message});
//     }
//  })


// ===========================================================

router.post('/edit-hostel/:hostel_number', authorize, async (req, res) => {
    const { hostelName, fixedSlab } = req.body;
    let hostelNumber = req.params.hostel_number;

    let user = await updateHostel({"hostelNumber": hostelNumber }, { hostelName: hostelName , fixedSlab: fixedSlab})
    if(!!user) {
        res.status(200).send({
            message: 'user info updated!',
        })
    } else {
        res.status(400).send({
            message: 'Something went wrong. Inputs are wrong'
        })
    }
})


// =======================================================================


module.exports = router;