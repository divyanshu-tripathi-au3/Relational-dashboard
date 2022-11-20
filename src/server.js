const express = require('express')
const bodyParser = require('body-parser')
const config = require('./config')

const agentRoutes = require('./routes/agent');
const MonitorBotsRoute = require('./routes/MonitorBotsRoute')
const hostelRoutes = require('./routes/hostelRoute');
const enduserRoutes = require('./routes/enduserRoute');
const botdetailsRoutes = require('./routes/botDetailsRoute');

const cors = require('cors')
const app = express();


// body-parser setup
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// Route configuration
app.get('/', (req, res) => res.send('Welcome ODR'))
app.use("/api/agent", agentRoutes);
app.use("/api/monitorbots", MonitorBotsRoute);
app.use("/api/hostel", hostelRoutes);
app.use("/api/enduser", enduserRoutes);
app.use("/api/botDetails", botdetailsRoutes);



app.listen(config.PORT, () => console.log(`Server is running at http://localhost:${config.PORT}`))