import Document from '../../models/Document.js';
import { v4 as uuidv4 } from 'uuid';
import AWS from 'aws-sdk';
import dotenv from 'dotenv';
dotenv.config();

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

const documentResolvers = {
  Query: {
    getAllDocuments: async () => {
      try {
        console.log("get all documents");
        const documents = await Document.find();
        return documents;
      } catch (err) {
        throw new Error(err);
      }
    },
    getDocument: async (_, { id }) => {
      try {
        const document = await Document.findById(id);
        return document;
      } catch (err) {
        throw new Error(err);
      }
    },
  },
  Mutation: {
    createDocument: async (_, { input: { title, file } },contextValue) => {
      console.log("create document");
      const resolveFile = await file.promise;
      const { createReadStream, filename, mimetype, encoding } = resolveFile;
      const stream = createReadStream();
      const key = uuidv4() + '-' + filename;
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
        Body: stream,
        ContentType: mimetype,
      };

      const upload = await s3.upload(params).promise();

      const newDocument = new Document({
        title,
        filename,
        url: upload.Location,
        key
      });

      const document = await newDocument.save();
      return document;
    },
    deleteDocument: async (_, { id }) => {
      try {
        const document = await Document.findById(id);
        const params = {
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: document.key
        };
        await s3.deleteObject(params).promise();
        await Document.findByIdAndDelete(id);
        return "Document deleted";
      } catch (err) {
        throw new Error(err);
      }
    }
  }
};

export default documentResolvers;