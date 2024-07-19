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
        console.log(decodedUser, id);
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
  Mutation: {
    addMailHistory: async (_, { hrId, mailId }, context) => {
      try {
        //auth: HR self or HR
        const decodedUser = await checkAuth(context);
        const user = await User.findOne({ instance: hrId });
        const userId = user._id.toString();
        if (!checkUser(decodedUser, userId) && !isHR(decodedUser)) {
          throw new Error('Query id and auth user do not match.');
        }
        const hr = await HR.findById(hrId);
        const mailHistory = await MailHistory.findById(mailId);

        if (!hr ) throw new Error('HR not found');
        if (!mailHistory) throw new Error('MailHistory not found');

        // check if mailHistory already exists
        if (hr.mailHistory.includes(mailId)) {
          console.log('MailHistory already added');
        } else {
          hr.mailHistory.push(mailId);
        }
        await hr.save();

        // return expanded hr
        return await HR.findById(hrId).populate('mailHistory');
      } catch (err) {
        throw new Error(err);
      }
    }
  }
};

export default hrResolvers;