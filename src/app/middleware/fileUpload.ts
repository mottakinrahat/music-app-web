/* eslint-disable no-useless-catch */
import {
  S3Client,
  PutObjectCommand,
  PutObjectCommandInput,
} from "@aws-sdk/client-s3";
import config from "../config";
import fs from "fs";
import { URL } from "url";

// Configure AWS SDK for DigitalOcean Spaces
const s3 = new S3Client({
  endpoint: config.doSpacesEndPoint as string,
  region: "us-east-1", // Set a region, DigitalOcean Spaces requires it
  credentials: {
    accessKeyId: config.doAccessKey as string,
    secretAccessKey: config.doSecretKey as string,
  },
});

const uploadFileAndGetLink = async (
  fileDir: string,
  fileName: string
): Promise<string> => {
  try {
    // Ensure you're combining the directory path with the file name
    const filePath = `${fileDir}/${fileName}`;

    // Read the file content from the file path
    const fileContent = fs.readFileSync(filePath);

    const params: PutObjectCommandInput = {
      Bucket: config.doBucketName as string,
      Key: `/songs/${fileName}`, // Path to store in the S3 bucket
      Body: fileContent,
      ACL: "public-read", // Make it publicly accessible
    };

    // Uploading file to DigitalOcean Space (S3-compatible)
    const command = new PutObjectCommand(params);
    await s3.send(command);

    // Construct the public URL for the uploaded file
    const url = new URL(`/songs/${fileName}`, config.doSpacesEndPoint);
    return url.href; // Return the public URL of the file
  } catch (err) {
    // console.error("Error uploading song:", err);
    throw err; // Ensure errors are caught by the caller
  }
};

export default uploadFileAndGetLink;
