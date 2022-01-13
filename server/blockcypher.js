const BLOCKCYPHER_API_URL = "https://api.blockcypher.com/v1/eth/main/addrs?token=1f061445bcdc4b30acaa33f27aa4c1ae"

export const createWallet = async () => {
    const response = await fetch(BLOCKCYPHER_API_URL, {
        method: 'POST'
    });

    return response.json();
};