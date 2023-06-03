/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    API_URL: process.env.API_URL,
    MODE: process.env.MODE,
  },
};

module.exports = nextConfig;
