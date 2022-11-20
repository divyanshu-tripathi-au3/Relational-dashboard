const fetch = require("node-fetch")
const config = require('../config/index');
const MAIN_HOST = config.MAIN_HOST; 
// const moment = require('moment')
const querystring = require('query-string');

const fs = require('fs');





// =====================================================

const get3MinuteWiseDetails = async (req, res) => { 
    let meter_id = parseInt(req.params.meter_id)
    
    try {
           
                            
        let threeMinuteWiseResponse = await fetch(`http://influx-1:8086/query?db=sustlabs&q=SELECT last(*),DIFFERENCE(last("energy")) FROM "events.raw_values.${meter_id}" WHERE (time >= now()- 3d and time <= now() ) GROUP BY time(3m) fill(none);`, {
            method: 'get',              
            headers: { 'Content-Type': 'application/json' },
            
        });
        threeMinuteWiseResponse = await threeMinuteWiseResponse.json();  

        let getBotInfo = await fetch(`${MAIN_HOST}/getBotInfo/${meter_id}`);
        getBotInfo = await getBotInfo.json();       
        let getBotInfoState = getBotInfo.state

        res.status(200).send({          
             threeMinuteWiseResponse,
             getBotInfoState
        })   
        // return res.json(threeMinuteWiseResponse,getBotInfo)


    } catch (error) {       
        res.statusCode = 400;
        res.send({ message: 'Something went wrong. Details not present' })
    }    
}



// ============================== 2nd try======================================

const get3MinuteWiseDetailsNew = async (req, res) => { 
    
    try {
        req.query.source = "inepro"     // need to remove its just for testing 
        let queryString = querystring.stringify(req.query);            
        let response = await fetch(`${MAIN_HOST}/listMeters?${queryString}`);        
        response = await response.json();
     
        response.payload.meters = response.payload.meters.map(element => {
            const newElement =  { }            
            newElement["botid"]  = element.meter_id
            newElement["state"]  = element.state
            return newElement
        });

        let botIds = response.payload.meters
        let botArray = []  
        for(let i = 0; i< botIds.length; i++){
            botArray.push(botIds[i].botid)
        }
        console.log(botArray)
        
        try {   
              
            let threeMinuteWiseResponse
            let storage = []
                for(let j=0; j< botArray.length; j++) {
                    let botAray2 = botArray[j] 
                                     
                    threeMinuteWiseResponse = await fetch(`http://influx-1:8086/query?db=sustlabs&q=SELECT last(*),DIFFERENCE(last("energy")) FROM "events.raw_values.${botAray2}" WHERE time >= now()- 3d and time <= now() GROUP BY time(3m) fill(none);`)                  
                    threeMinuteWiseResponse = await threeMinuteWiseResponse.json();              
                    storage.push(threeMinuteWiseResponse)               
                    console.log(storage)
                }     
                
                
                res.status(200).json(storage)

            } catch (error) {       
                res.statusCode = 400;
                res.send({ message: 'Something went wrong. Details not present' })
            }    

        // return res.json({ "data": response.payload.meters,botArray}) 

    } catch (error) {       
        res.statusCode = 400;
        res.send({ message: 'Error in 1st Part' })
    }       

    
}


// ============================================================================





// =============================================================================

module.exports = {
    
    get3MinuteWiseDetails,
    get3MinuteWiseDetailsNew,
           
}