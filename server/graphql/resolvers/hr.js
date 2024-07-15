import HR from '../../models/HR.js';
import MailHistory from '../../models/MailHistory.js';
import * as dotenv from 'dotenv';
dotenv.config();
import jwt from 'jsonwebtoken';

const hrResolvers = {
    Mutation: {
        loginHR: async (_, { input }, context) => {
            const { email, password } = input;
            const hr = await HR.findOne({ email });
            if (!hr) {
              throw new Error('No hr with that email');
            }
            const valid = await hr.comparePassword(password);
            if (!valid) {
              throw new Error('Incorrect password');
            }
            
            const token = await jwt.sign(
              {
                id:  hr._id,
                username: hr.username,
                role: "HR"
              },
              process.env.JWT_SECRET_KEY,
              { expiresIn: '30d' }
            );
            return { hr, token, message: 'HR signed in successfully' };
          },
          registerHR: async (_, { input }, context) => {
            try {
                const { email, username, password } = input;
                
                // Check if the email is already in use
                const existing = await HR.findOne({
                    email,
                });
                if (existing) {
                    throw new Error('Existing email');
                }

                const hr = new HR({
                    username,
                    email,
                    password,
                });
                await hr.save();
                const token = await jwt.sign(
                    {
                        id: hr._id,
                        username: hr.username,
                        role: "HR"
                    },
                    process.env.JWT_SECRET_KEY,
                    { expiresIn: '30d' }
                );
                return { hr, token, message: 'HR registered successfully' };

            } catch (err) {
                throw new Error(err);
            }
        },
    },
};

export default hrResolvers;