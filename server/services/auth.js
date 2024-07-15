const jwt = require("jsonwebtoken");
require('dotenv').config();

//check registration token
const checkRegistrationToken = async (args) => {
    try {

    } catch (err) {
        console.log(err);
    }

}


const checkAuth = async (context) => {
    try {
        const token = context.headers?.authorization?.split(' ')?.[1];
        console.log(token);
        const decoded = await jwt.verify(token, process.env.JWT_SECRET_KEY);
        if (!decoded) {
            throw new Error('Unauthorized');
        }
        const user = {
            _id: decoded.id,
            username:decoded.username,
            role: decoded.role,
        };
        return user;
    } catch (err) {
        console.log(err);
    }

}

const isEmployee = (user, employeeId) => user && user.id === employeeId;


const isHR = (user) => user && user.role === "HR";


module.exports = { checkRegistrationToken, checkAuth, isEmployee, isHR };