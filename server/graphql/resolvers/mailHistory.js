const MailHistory = require('../../models/MailHistory');
const { generateToken } = require('../../services/registrationToken');
const { sendEmail } = require('../../services/emailServices');

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
        console.log(hrId, email, name);
        // check if there is an existing mail history
        const existingMailHistory = await MailHistory.findOne
        ({
          email,
          status: "pending",
        });
        const registrationToken = await generateToken(hrId, email, name);
        if (existingMailHistory) {
          existingMailHistory.registrationToken = registrationToken;
          existingMailHistory.expiration = Date.now() + 3 * 60 * 60 * 1000;
          await existingMailHistory.save();
          const subject = "Registration Token";
          const html = `<p>Hi ${name},</p><p>Here is your registration token: ${registrationToken}</p>`;
          await sendEmail(email, subject, html);
          console.log(subject, html);
          return existingMailHistory;
        }
        const newMailHistory = new MailHistory({
          email,
          registrationToken,
          expiration: Date.now() + 3 * 60 * 60 * 1000,
          name,
          status: "pending",
        });
        const mailHistory = await newMailHistory.save();
        
        const subject = "Registration Token";
        const html = `<p>Hi ${name},</p><p>Here is your registration token: ${registrationToken}</p>`;
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

module.exports = mailHistoryResolvers;