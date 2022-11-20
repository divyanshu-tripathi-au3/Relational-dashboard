const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const config = require('../config/index');
const { fetchUser } = require('../repo/agent')

const jwtPrivateKey = config.JWT_PRIVATE_KEY
const saltRounds = config.saltRounds;

const createPasswordHash = async rawPassword => await bcrypt.hashSync(rawPassword, saltRounds);

const comparePassword = async (rawPassword, hash) => await bcrypt.compareSync(rawPassword, hash);

const generateAccessToken = userData => {
    const data = {
        userId: userData.userId,
        name: userData.name,        
        email: userData.email,
   
    }
    const token = jwt.sign(data, jwtPrivateKey);
    return token
}


const authorize = async (req, res, next) => {
    try {
        if(!req.headers.authorization) {
            res.statusCode = 401;
            res.send({ message: 'Authentication required!' })
        }
        const token = req.headers.authorization;
        const { userId} = jwt.verify(token, jwtPrivateKey)

        const user = await fetchUser({ _id: userId })
        if(!user) {
            res.statusCode = 401;
            res.send({ message: 'Authentication Failed' })
        }
       
        req.userId = userId;
        
        next();
    } catch (error) {
        console.error('Error while user authorization!');
        res.statusCode = 401;
        res.send({ message: 'Authentication Failed' })
    }
}

module.exports = {
    createPasswordHash,
    comparePassword,
    generateAccessToken,
    authorize
}