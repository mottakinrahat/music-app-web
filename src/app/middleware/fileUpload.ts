/* eslint-disable no-useless-catch */
import fs from "fs";
import { S3 } from "@aws-sdk/client-s3";
import config from "../config";
import { Buffer } from 'buffer';

// Function to upload file buffer to DigitalOcean Spaces
export const uploadToSpaces = async (fileBuffer: Buffer, fileName: string): Promise<string> => {
  try {
    const s3 = new S3({
      endpoint: config.doSpacesEndPoint,
      credentials: {
        accessKeyId: config.doAccessKey || "",
        secretAccessKey: config.doSecretKey || "",
      },
      region: "us-east-1", // Default region, can be changed if needed
    });

    const params = {
      Bucket: config.doBucketName, // Your DigitalOcean Space name
      Key: fileName, // File name (e.g., myfile.mp3)
      Body: fileBuffer, // File buffer from multer
      ACL: "public-read", // Make the file publicly accessible
      ContentType: "audio/mpeg", // Adjust based on the audio file type (you can dynamically infer from file.mimetype)
    };

    // Upload file to DigitalOcean Spaces
    await s3.putObject(params);

    // Construct CDN link using the DigitalOcean Spaces bucket URL and file name
    const cdnLink = `${config.doCdnEndPoint}/${fileName}`;
    return cdnLink; // Return the CDN link
  } catch (error) {
    console.error("Error uploading to DigitalOcean Spaces:", error);
    throw error;
  }
};


