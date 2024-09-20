import dotenv from "dotenv";
import path from "path";

const currentPath = process.cwd();

dotenv.config({ path: path.join((process.cwd(), ".env")) });
export default {
  NODE_ENV: process.env.NODE_ENV,
  port: process.env.PORT,
  database_URL: process.env.DATABASE_URL,
  bcrypt_url: process.env.BCRYPT_SALT_ROUND,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET,
  expires_times: process.env.EXPIRES_TIME,
  forget_password_key: process.env.JWT_FORGET_KEY,
  clientUrl: process.env.CLIENT_URL,
  smtpPassword: process.env.SMTP_PASSWORD,
  smtpUserName: process.env.SMTP_USER_NAME,
  encryption_key: process.env.ENCRYPTION_KEY,
  encryption_iv: process.env.ENCRYPTION_IV,
  importSongsDir: `${currentPath}/public/importSongs`,
  uploadSongDir: `https://x-mega-pro.nyc3.digitaloceanspaces.com/songs`,
  apiLink: process.env.API_LINK,
  doSpacesEndPoint: process.env.DO_SPACES_ENDPOINT,
  doBucketName: process.env.DO_BUCKET_NAME,
  doAccessKey: process.env.DO_ACCESS_KEY,
  doSecretKey: process.env.DO_SECRET_KEY,
  doCdnEndPoint: process.env.DO_CDN_ENDPOINT,
};
