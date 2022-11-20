const fetch = require("node-fetch")
const config = require('../config/index');
const MAIN_HOST = config.MAIN_HOST; 
const moment = require('moment')
const querystring = require('query-string');

const fs = require('fs');
const { updateEnduser,fetchEnduser} = require('../repo/enduser')
const { fetchHostelnew } = require('../repo/hostel')
const { Enduser } = require('../config/dbConfig')



// =====================================================

const getEnergyConsumption = async (req, res) => {
    let meterId = req.params.meter_id   
    
   
    // ======================= totalEC fetch
    
    try{
        let queryString = querystring.stringify(req.query);   
            let response = await fetch(`${MAIN_HOST}/getEnergyConsumption/${meterId}?${queryString}`);      
            response = await response.json();
        
            
        let endUser = await updateEnduser({"meterId": meterId }, { "electricityConsumed": response.totalEC })   //response.totalEC      
     
        let isEndUserExist = await fetchEnduser(meterId)        
        let ishostelExist = await fetchHostelnew(isEndUserExist.hostel._id)
        
           // ======================================== matching with slab range
              
           electricityPrice = 0;

            if(ishostelExist.fixedSlab > 0)  {  
                electricityPrice = parseFloat(ishostelExist.fixedSlab * (endUser.electricityConsumed)).toFixed(2)
          
            } else {  
                let functioncheck = () => {
                
                        let total = endUser.electricityConsumed                                         
                        let slabs = ishostelExist.variableSlab                     
                        let rate = ishostelExist.variableRate
                      
                    //  for three layer slabs only. if more than 3 slabs are there then loop option 
                        if (total > slabs[3]) {
                            amount = slabs[0] * rate[0] + (slabs[1] - slabs[0]) * rate[1] +(slabs[2] - slabs[1]) * rate[2] + (slabs[3] - slabs[2]) * rate[3] + (total - slabs[3]) * rate[4];
                        }else if (total > slabs[2]) {
                            amount = slabs[0] * rate[0] + (slabs[1] - slabs[0]) * rate[1] +(slabs[2] - slabs[1]) * rate[2] + (total - slabs[2]) * rate[3];
                        } else if (total > slabs[1]) {
                            amount = slabs[0] * rate[0] + (slabs[1] - slabs[0]) * rate[1] + (total - slabs[1]) * rate[2];
                        } else if (total > slabs[0]) {
                            amount = slabs[0] * rate[0] + (total - slabs[0]) * rate[1];
                        } else {
                            amount = total * rate[0];
                        }

                        return amount
                    }

                    functioncheck()                    
                    electricityPrice = parseFloat(amount).toFixed(2)    
                    
            }


        // ========================================= update hostel and end user database with price
        
        let endUserPrice = await updateEnduser({"meterId": meterId }, { "electricityPrice": electricityPrice })        
        
       
        // ====================================================

        // return res.json(response)
        res.status(200).send(                          
            endUserPrice
        )   
     } catch (err) {
        res.status(400).json({ message:"Plesae check inputs again for User, hostelnumber and meterId"});
     }
}


// ==========================================================================================

const getMonthlyEnergyConsumption = async (req, res) => {
    let meterId = req.params.meter_id   
   
    // ======================= totalEC fetch   
    
        let queryString = querystring.stringify(req.query);   
            let response = await fetch(`${MAIN_HOST}/getEnergyConsumptionMonth/${meterId}?${queryString}`);      
            response = await response.json();
            return res.json(response)
 
}


// =========================================================================


module.exports = {
    
    getEnergyConsumption,
    getMonthlyEnergyConsumption    
}