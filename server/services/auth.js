import dotenv from 'dotenv';
dotenv.config();
import jwt from 'jsonwebtoken';

const getUser = async (token) => {
    try {
        //const jwtToken = token.split(' ')[1];
        let decoded = '';
        if (token) {
            decoded = await jwt.verify(token, process.env.JWT_SECRET_KEY);
        }
        const user = {
            _id: decoded.id || '',
            username: decoded.username || '',
            role: decoded.role || '',
        };
        return user;

    } catch (err) {
        console.log(err);
    }
}

const checkAuth = async (context) => {
    try {
        console.log("context:", context);
        const token = context.token;
        if (!token) {
            throw new Error('Unauthorized');
        }
        const decoded = await jwt.verify(token, process.env.JWT_SECRET_KEY);
        if (!decoded) {
            throw new Error('Unauthorized');
        }
        const user = {
            _id: decoded.id,
            username: decoded.username,
            role: decoded.role,
        };
        return user;
    } catch (err) {
        console.log(err);
    }

}

//check userId decoded from token == userId from query. Ensure that only employee self can access his/her info.
const checkUser = (decodedUser, userId) => {
    return decodedUser && decodedUser._id === userId;
}

//check user role is Employee
const isEmployee = (decodedUser) => decodedUser && decodedUser.role === "Employee";

//check user role is HR
const isHR = (decodedUser) => decodedUser && decodedUser.role === "HR";

export { getUser, checkAuth,checkUser, isEmployee, isHR };