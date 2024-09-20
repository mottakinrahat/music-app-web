import AWS from "aws-sdk";
import config from "../config";
import fs from "fs";

// Configure AWS SDK for DigitalOcean Spaces
const spacesEndpoint = new AWS.Endpoint(config.doSpacesEndPoint as string);
const s3 = new AWS.S3({
  endpoint: spacesEndpoint,
  accessKeyId: config.doAccessKey,
  secretAccessKey: config.doSecretKey,
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

    const params: AWS.S3.PutObjectRequest = {
      Bucket: config.doBucketName as string,
      Key: `songs/${fileName}`, // Path to store in the S3 bucket
      Body: fileContent,
      ACL: "public-read", // Make it publicly accessible
    };

    // Uploading file to DigitalOcean Space (S3-compatible)
    const data = await s3.upload(params).promise();

    console.log(`File uploaded successfully: ${data.Location}`);
    return data.Location; // Return the public URL of the file
  } catch (err) {
    console.error("Error uploading song:", err);
    throw err; // Ensure errors are caught by the caller
  }
};


export default uploadFileAndGetLink;
