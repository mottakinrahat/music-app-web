import fs from "fs";
import {
  PutObjectCommand,
  S3Client,
  PutObjectCommandInput,
} from "@aws-sdk/client-s3";
import config from "../config";

const s3Client = new S3Client({
  endpoint: config.doSpacesEndPoint as string,
  forcePathStyle: false,
  region: "us-east-1",
  credentials: {
    accessKeyId: config.doAccessKey as string,
    secretAccessKey: config.doSecretKey as string,
  },
});

const uploadFileAndGetLink = async (
  fileDir: string,
  fileName: string
): Promise<string | null> => {
  const filePath = `${fileDir}/${fileName}`;
  const fileContent = fs.readFileSync(filePath);

  const params: PutObjectCommandInput = {
    Bucket: config.doBucketName as string,
    Key: `songs/${fileName}`,
    Body: fileContent,
    ACL: "public-read",
    Metadata: {
      "x-amz-meta-my-key": "your-value",
    },
  };

  try {
    await s3Client.send(new PutObjectCommand(params));

    // Return the public URL
    const publicUrl: string = `${config.doCdnEndPoint}/songs/${fileName}`;
    return publicUrl; // Return the URL as a string
  } catch (err) {
    console.error("Error uploading file:", err);
    return null; // Return null if there's an error
  } finally {
    fs.unlinkSync(filePath); // Clean up local file
  }
};

export default uploadFileAndGetLink;
