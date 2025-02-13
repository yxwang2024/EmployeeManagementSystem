import MailHistory from '../../models/MailHistory.js';
import { generateToken } from '../../services/registrationToken.js';
import { sendEmail } from '../../services/emailServices.js';
import Joi from 'joi';
import HR from '../../models/HR.js';

const BASE_URL = "http://localhost:5173/signup?registrationToken=";

const mailHistoryInputSchema = Joi.object({
  email: Joi.string().email().required(),
  name: Joi.string().required(),
});

const mailHistoryResolvers = {
  Query: {
    getMailHistories: async () => {
      try {
        const mailHistories = await MailHistory.find();
        return mailHistories;
      } catch (err) {
        throw new Error(err);
      }
    },
    getMailHistory: async (_, { id }) => {
      try {
        console.log(id);
        const mailHistory = await MailHistory.findById(id);
        return mailHistory;
      } catch (err) {
        throw new Error(err);
      }
    },
  },
  Mutation: {
    createMailHistory: async (_, { mailHistoryInput}, context) => {
      try {
        // get hrId from context
        const hrId = context?.user?.id || "5f9b1f1b1f6b1d0b3c1b1f9b";
        const {
          email,
          name,
        } = mailHistoryInput;
        // validate input
        const { error } = mailHistoryInputSchema.validate({ email, name });
        if (error) {
          throw new Error(error);
        }
        // check if there is an existing mail history, if expired, reset the token, if used, throw error     
        const existingMailHistoryUsed = await MailHistory.findOne
        ({
          email,
          status: "completed",
        });

        // check if there's an existing history expired or pending
        const existingMailHistory = await MailHistory.findOne({
          email,
          status: { $in: ["pending", "expired"] },
        });

        if (existingMailHistoryUsed) {
          throw new Error("Email already used");
        }
        const registrationToken = await generateToken(hrId, email, name);
        if (existingMailHistory) {
          console.log("resetting token");
          existingMailHistory.name = name;
          existingMailHistory.status = "pending";
          existingMailHistory.registrationToken = registrationToken;
          existingMailHistory.expiration = Date.now() + 3 * 60 * 60 * 1000;
          await existingMailHistory.save();
          const subject = "Registration Token Reset";
          const html = `
            <p>Hi ${name},</p>
            <p>Here is your new registration token: ${registrationToken}</p>
            <p>Please use the following <a href="${BASE_URL}${registrationToken}">link</a> to register.</p>
            <a href="${BASE_URL}${registrationToken}">${BASE_URL}${registrationToken}</a>\n
            <p>We have reset your registration token. So please use the new token to register.</p>

            <p>Thank you!</p>
          `;
          await sendEmail(email, subject, html);
          console.log(subject, html);
          return existingMailHistory;
        }
        console.log("creating new mail history");
        const newMailHistory = new MailHistory({
          email,
          registrationToken,
          expiration: Date.now() + 3 * 60 * 60 * 1000,
          name,
          status: "pending",
        });
        const mailHistory = await newMailHistory.save();
        
        const subject = "Registration Token";
        const html = `
          <p>Hi ${name},</p>
          <p>WELCOME TO OUR COMPANY!</p>
          <p>Here is your registration token: ${registrationToken}</p>
          <p>Please use the following <a href="${BASE_URL}${registrationToken}">link</a> to register.</p>
          <a href="${BASE_URL}${registrationToken}">${BASE_URL}${registrationToken}</a>\n

          <p>Thank you!</p>
        `;
        await sendEmail(email, subject, html);
        console.log(subject, html);

        return mailHistory;
      } catch (err) {
        throw new Error(err);
      }
    },
    updateMailHistory: async (_, { id, status }) => {
      // validate status
      if (!["pending", "completed", "expired"].includes(status)) {
        throw new Error("Invalid status");
      }
      const mailHistory = await MailHistory.findByIdAndUpdate(id, {status:status}, {
        new: true,
      });
      return mailHistory;
    },
    deleteMailHistory: async (_, { id }) => {
      const mailHistory = await MailHistory.findByIdAndDelete(id);
      return mailHistory;
    },
  },
};

export default mailHistoryResolvers;