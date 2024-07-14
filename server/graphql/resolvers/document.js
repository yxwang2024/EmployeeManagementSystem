import Document from '../../models/Document';
import AWS from 'aws-sdk';
require('dotenv').config();
import { v4 as uuidv4 } from 'uuid';

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

const documentResolvers = {
  Query: {
    documents: async () => {
      try {
        const documents = await Document.find();
        return documents;
      } catch (err) {
        throw new Error(err);
      }
    },
    document: async (_, { id }) => {
      try {
        const document = await Document.findById(id);
        return document;
      } catch (err) {
        throw new Error(err);
      }
    }
  },
  Mutation: {
    createDocument: async (_, { input: { title, file } }) => {
      const { createReadStream, filename, mimetype, encoding } = await file;
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
        await document.delete();
        return document;
      } catch (err) {
        throw new Error(err);
      }
    }
  }
};
