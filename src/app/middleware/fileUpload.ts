import fs from "fs";
import { S3 } from "@aws-sdk/client-s3";
import config from "../config";

const uploadToSpaces = async (filePath: string, fileName: string): Promise<string> => {
  try {
    console.log("File path received:", filePath); // Log the file path
    console.log("Bucket:", config.doBucketName);  // Log the bucket name

    // Check if the file exists before proceeding
    if (!fs.existsSync(filePath)) {
      throw new Error(`File at path ${filePath} does not exist.`);
    }

    const s3 = new S3({
      endpoint: config.doSpacesEndPoint,
      credentials: {
        accessKeyId: config.doAccessKey || "",
        secretAccessKey: config.doSecretKey || "",
      },
      region: "us-east-1", // Default region, you can change this if necessary
    });

    const params = {
      Bucket: config.doBucketName, // Ensure the bucket name is defined here
      Key: fileName,
      Body: fs.createReadStream(filePath), // This expects a file stream
      ACL: "public-read",
    };

    await s3.putObject(params);

    const cdnLink = `${config.doCdnEndPoint}/${fileName}`;
    console.log("CDN Link:", cdnLink);

    return cdnLink;
  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  }
};

export default uploadToSpaces;
