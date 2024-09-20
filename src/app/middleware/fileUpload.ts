/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  S3Client,
  PutObjectCommand,
  PutObjectCommandInput,
} from "@aws-sdk/client-s3";
import config from "../config";

// Configure AWS SDK for DigitalOcean Spaces
const s3 = new S3Client({
  endpoint: config.doSpacesEndPoint as string,
  region: "us-east-1", // Set a region, DigitalOcean Spaces requires it
  credentials: {
    accessKeyId: config.doAccessKey as string,
    secretAccessKey: config.doSecretKey as string,
  },
});

const uploadFileAndGetLink = async (fileName: any, fileContent: any) => {
  try {
    const params: PutObjectCommandInput = {
      Bucket: config.doBucketName, // Bucket from .env
      Key: `songs/${fileName}`, // Path in S3
      Body: fileContent,
      ACL: "public-read", // Specify the correct ACL type
    };

    const result = await s3.send(new PutObjectCommand(params));
    return result;
  } catch (err) {
    console.error("Error uploading file:", err);
  }
};

export default uploadFileAndGetLink;
