import {
  S3Client,
  PutObjectCommand,
  PutObjectCommandInput,
} from "@aws-sdk/client-s3";
import config from "../config";
import fs from "fs";

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
  const filePath = `${fileDir}/${fileName}`;

  // Read the file content asynchronously
  const fileContent = await fs.promises.readFile(filePath);

  const params: PutObjectCommandInput = {
    Bucket: config.doBucketName as string,
    Key: `songs/${fileName}`, // No leading slash
    Body: fileContent,
    ACL: "public-read", // Make it publicly accessible
  };

  // Uploading file to DigitalOcean Space (S3-compatible)
  const command = new PutObjectCommand(params);
  await s3.send(command);

  // Ensure the CDN endpoint ends with a slash
  if (!config.doCdnEndPoint) {
    throw new Error("CDN endpoint is not defined in the configuration.");
  }

  const cdnEndpoint = config.doCdnEndPoint.endsWith("/")
    ? config.doCdnEndPoint
    : `${config.doCdnEndPoint}/`;

  const url = new URL(`songs/${fileName}`, cdnEndpoint);

  return url.href; // Return the public CDN URL of the file
};

export default uploadFileAndGetLink;
