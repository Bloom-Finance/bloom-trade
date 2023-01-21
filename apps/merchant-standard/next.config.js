/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: false,
  experimental: {
    esmExternals: true,
  },
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    POLYGON_SCAN_API_KEY: process.env.POLYGON_SCAN_API_KEY,
    ETHERSCAN_API_KEY: process.env.ETHERSCAN_API_KEY,
    MODE: process.env.MODE,
    PG_USER: process.env.PGUSER,
    PG_PASSWORD: process.env.PGPASSWORD,
    PG_DATABASE: process.env.PGDATABASE,
    PG_HOST: process.env.PGHOST,
    WORMHOLE_VAA: process.env.WORMHOLE_VAA,
    CLIENT_ID_WEB3AUTH: process.env.CLIENT_ID_WEB3AUTH,
    FIREBASE: process.env.FIREBASE,
    JWT_SECRET: process.env.JWT_SECRET,
    CIRCLE_URL: process.env.CIRCLE_URL,
    SNOWTRACE_API_KEY: process.env.SNOWTRACE_API_KEY,
    ETHERSCAN_API_KEY: process.env.ETHERSCAN_API_KEY,
    POLYGONSCAN_API_KEY: process.env.POLYGONSCAN_API_KEY,
    WALLETCONNECT_PROJECTID: process.env.WALLETCONNECT_PROJECTID,
  },
};
