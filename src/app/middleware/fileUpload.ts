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
  region: "us-east-1", // DigitalOcean Spaces requires a region even though it doesn't use it for regions in the same way
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
    const filePath = `${fileDir}/${fileName}`; // Path of the local file

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    // Read the file content from the local file system
    const fileContent = await fs.promises.readFile(filePath);

    const params: PutObjectCommandInput = {
      Bucket: config.doBucketName as string, // Your DigitalOcean bucket name
      Key: `songs/${fileName}`, // The path within the bucket
      Body: fileContent, // The file's contents
      ACL: "public-read", // Allow public access to the file
    };

    // Uploading file to DigitalOcean Space
    const command = new PutObjectCommand(params);
    await s3.send(command);

    // Ensure the CDN endpoint is defined and ends with a slash
    if (!config.doCdnEndPoint) {
      throw new Error("CDN endpoint is not defined in the configuration.");
    }

    const cdnEndpoint = config.doCdnEndPoint.endsWith("/")
      ? config.doCdnEndPoint
      : `${config.doCdnEndPoint}/`;

    // Construct the public URL for the uploaded file
    const url = new URL(`songs/${fileName}`, cdnEndpoint);

    return url.href; // Return the public CDN URL
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error; // Handle the error appropriately in your code
  }
};

export default uploadFileAndGetLink;
