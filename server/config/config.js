require('dotenv').config({ path: './config/config.env' });

module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV,
  CLIENT_URL: process.env.CLIENT_URL,
  MONGO_URL: process.env.MONGO_URL,
  JWT_ACTIVATION: process.env.JWT_ACTIVATION,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_FORGOT_SECRET: process.env.JWT_FORGOT_SECRET,
  MAIL_HOST: process.env.MAIL_HOST,
  MAIL_PORT: process.env.MAIL_PORT,
  MAIL_USER: process.env.MAIL_USER,
  MAIL_PASS: process.env.MAIL_PASS,
  GOOGLE_CLIENT: process.env.GOOGLE_CLIENT,
};
