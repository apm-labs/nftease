
const DEV = process.env.NODE_ENV !== 'production';

export const BLOCKCYPHER_API_URL = "https://api.blockcypher.com/v1/eth/main/addrs?token=1f061445bcdc4b30acaa33f27aa4c1ae";

export const SERVER_URL = DEV ? 'http://localhost:3000' : 'https://nftease-fd053.web.app';