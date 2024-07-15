import dotenv from 'dotenv';
dotenv.config();
import jwt from 'jsonwebtoken';

const getUser = async (token) => {
    try {
        const decoded ='';
        if(token){
            decoded = await jwt.verify(token, process.env.JWT_SECRET_KEY);
        }
        const user = {
            _id: decoded.id||'',
            username:decoded.username||'',
            role: decoded.role||'',
        };
        return user;
        
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

export {getUser,checkAuth,isEmployee,isHR};