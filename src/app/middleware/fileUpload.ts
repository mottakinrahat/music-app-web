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

    s3.putObject(params);

    // Construct CDN link using the DigitalOcean Spaces bucket URL and file name
    const cdnLink = `${config.doCdnEndPoint}/cdn.digitaloceanspaces.com/${fileName}`;
    console.log(cdnLink)

    return cdnLink; // Return the CDN link
  } catch (error) {
    throw error;
  }
};

export default uploadToSpaces;

// const testUpload = async () => {
//   const filePath = config.uploadSongDir; // Change to a valid file path
//   const fileName = "testfile.txt"; // Change to a desired file name

//   try {
//     const cdnLink = await uploadToSpaces(filePath, fileName);
//     console.log("File uploaded successfully. CDN Link:", cdnLink);
//   } catch (error) {
//     console.error("Upload failed:", error);
//   }
// };

// testUpload();

