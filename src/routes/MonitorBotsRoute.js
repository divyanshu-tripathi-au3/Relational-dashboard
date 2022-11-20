const router = require("express").Router();
 const {  getEnergyConsumption , getMonthlyEnergyConsumption } = require('../controllers/MonitorBotController')
 const {  verifyAccess, authorize } = require('../controllers/userController')
 

// ===================================================================

 router.route('/getEnergyConsumption/:meter_id')
 .get(authorize, getEnergyConsumption);

 router.route('/getMonthlyEnergyConsumption/:meter_id')
 .get(authorize, getMonthlyEnergyConsumption);

// =================================================================

module.exports = router;