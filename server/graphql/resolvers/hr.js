import User from '../../models/User.js';
import HR from '../../models/HR.js';
import MailHistory from '../../models/MailHistory.js';
import * as dotenv from 'dotenv';
dotenv.config();
import jwt from 'jsonwebtoken';
import { checkAuth, isHR, checkUser, isEmployee } from '../../services/auth.js';

const hrResolvers = {
  Query: {
    getHR: async (_, { id }, context) => {
      try {
        //auth: HR self or HR
        const decodedUser = await checkAuth(context);
        const user = await User.findOne({ instance: id });
        const userId = user._id.toString();
        if (!checkUser(decodedUser, userId) && !isHR(decodedUser)) {
          throw new Error('Query id and auth user do not match.');
        }
        return await HR.findById(id).populate('mailHistory');
      } catch (err) {
        throw new Error(err);
      }
    },
  },
};

export default hrResolvers;