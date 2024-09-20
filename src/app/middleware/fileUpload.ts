/* eslint-disable no-useless-catch */
import fs from "fs";
import { S3 } from "@aws-sdk/client-s3";
import config from "../config";

const uploadToSpaces = async (
  filePath: string,
  fileName: string
): Promise<string> => {
  try {
    const s3 = new S3({
      endpoint: config.doSpacesEndPoint,
      credentials: {
        accessKeyId: config.doAccessKey || "",
        secretAccessKey: config.doSecretKey || "",
      },
      region: "us-east-1", // Default region, you can change this if necessary
    });

    interface Iparams {
      Bucket: string | undefined;
      Key: string;
      Body: fs.ReadStream;
      ACL: string;
    }

    const params: Iparams = {
      Bucket: config.doBucketName,
      Key: fileName,
      Body: fs.createReadStream(filePath),
      ACL: "public-read",
    };

    await s3.putObject(params);

    // Construct CDN link using the DigitalOcean Spaces bucket URL and file name
    const cdnLink = `https://${config.doBucketName}.${config.doCdnEndPoint}/cdn.digitaloceanspaces.com/${fileName}`;

    return cdnLink; // Return the CDN link
  } catch (error) {
    throw error;
  }
};

export default uploadToSpaces;
