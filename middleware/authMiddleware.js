const { User } = require('../models');
const { verifyToken } = require('../utils/jwtUtils');


const Authentication = async (req, res, next) => {
    try {
        const authorizationHeader = req.header("Authorization")

        if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Invalid authorization header", status: 401 });
        }
        
        const token = authorizationHeader.replace("Bearer ", "")
        
        if (!token) {
            return res.status(401).json({ message: "Authorization token not found", status: 401 });
        }

        const verified = verifyToken(token);

        if (!verified){
            return res.status(401).json({ message: 'Invalid token', status: 401, response: res});
        } 

        const checkUser = await User.findOne({
        where: {
            id: verified.id
            }
        });

        if (!checkUser) return res.status(401).json({ message: 'Unauthorized', status: 401, response: res});

        req.user = verified;

        return next();

    }catch (error) {
        return res.status(401).json({ message: "Invalid token", status: 401 })
    }
}

module.exports = Authentication;