const router = require("express").Router();

const {  get3MinuteWiseDetails, get3MinuteWiseDetailsNew } = require('../controllers/botDetailsController')


// ===================================================================

router.route('/get3MinuteWiseDetails/:meter_id')
 .get( get3MinuteWiseDetails);

 router.route('/get3MinuteWiseDetailsNew')
 .get( get3MinuteWiseDetailsNew);

//  router.route('/get3MinuteWiseDetailsClusterWise')
//  .get( get3MinuteWiseDetailsClusterWise);

// =================================================================

module.exports = router;