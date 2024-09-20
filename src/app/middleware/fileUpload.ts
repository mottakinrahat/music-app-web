import fs from "fs";
import { S3 } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage"; // Import the Upload class
import config from "../config";
import { Buffer } from 'buffer';

// Function to upload file buffer or stream to DigitalOcean Spaces
export const uploadToSpaces = async (
  filePath: Buffer,
  fileName: string
): Promise<string> => {
  try {
    const s3 = new S3({
      endpoint: config.doSpacesEndPoint,
      credentials: {
        accessKeyId: config.doAccessKey || "",
        secretAccessKey: config.doSecretKey || "",
      },
      region: "us-east-1", // Default region, can be changed if needed
    });

    // Use fs.createReadStream to read the file
    const fileStream = fs.createReadStream(filePath);

    // Create a new instance of Upload from @aws-sdk/lib-storage
    const upload = new Upload({
      client: s3, // Pass in the S3 client
      params: {
        Bucket: config.doBucketName, // Your DigitalOcean Space name
        Key: fileName, // File name (e.g., myfile.mp3)
        Body: fileStream, // The file stream
        ACL: "public-read", // Make the file publicly accessible
        ContentType: "audio/mpeg", // Adjust based on the audio file type (you can dynamically infer from file.mimetype)
      },
    });

    // Execute the upload
    const result = await upload.done();

    // Construct CDN link using the DigitalOcean Spaces bucket URL and file name
    const cdnLink = `${config.doCdnEndPoint}/${fileName}`;
    console.log("File uploaded successfully:", cdnLink);

    return cdnLink; // Return the CDN link
  } catch (error) {
    console.error("Error uploading to DigitalOcean Spaces:", error);
    throw error;
  }
};
