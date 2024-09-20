import {
  S3Client,
  PutObjectCommand,
  PutObjectCommandInput,
} from "@aws-sdk/client-s3";
import config from "../config";
import fs from "fs";
import path from "path";

// Configure AWS SDK for DigitalOcean Spaces
const s3 = new S3Client({
  endpoint: config.doSpacesEndPoint as string, // DigitalOcean Spaces endpoint
  region: "nyc3", // Required by DigitalOcean Spaces, even though the region is irrelevant
  credentials: {
    accessKeyId: config.doAccessKey as string,
    secretAccessKey: config.doSecretKey as string,
  },
});

const uploadFileAndGetLink = async (
  fileDir: string,
  fileName: string
): Promise<string | null> => {
  const filePath = path.join(fileDir, fileName); // Use path.join for cross-platform compatibility

  try {
    // Read the file content asynchronously
    const fileStream = fs.createReadStream(filePath);

    const params: PutObjectCommandInput = {
      Bucket: config.doBucketName as string,
      Key: `songs/${fileName}`, // No leading slash
      Body: fileStream,
      ACL: "public-read", // Make it publicly accessible
    };

    const command = new PutObjectCommand(params);
    await s3.send(command);

    // Optionally remove file from local storage after successful upload
    fs.unlinkSync(filePath);

    // Return the public URL for accessing the file
    const publicUrl = `${config.doCdnEndPoint}/songs/${fileName}`;
    return publicUrl;
  } catch (error) {
    console.error("Error uploading file:", error);
    return null;
  }
};

export default uploadFileAndGetLink;
