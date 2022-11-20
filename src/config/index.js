const config = {
    NODE_ENV: process.env.NODE_ENV || 'Dev',
    PORT: process.env.PORT || 3000,
    MONGO_URI: process.env.MONGO_URI ,   
    // MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/dt_dashbaord',
    saltRounds: 10,
    SENDGRID_API_KEY: process.env.SENDGRID_API_KEY ,
    SENDGRID_FROM_EMAIL: process.env.SENDGRID_FROM_EMAIL ,
    JWT_PRIVATE_KEY: process.env.JWT_PRIVATE_KEY || 'bolo_divyansh',
    USER_ONE_TIME_PASS: process.env.USER_ONE_TIME_PASS || 'thisIsOneTimePassForUserCreation',
    OPS_HOST: process.env.OPS_HOST ,
    REDIS_URI: process.env.REDIS_URI ,
}

module.exports = config;