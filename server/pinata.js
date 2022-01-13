const fs = require('fs');

const pinataSDK = require('@pinata/sdk');
const pinata = pinataSDK('eed3e62e15fb35cb84c1', '52955b7afe9a69af60211a5d3843e796dde50e0ec5f8365c77f158a2845734d9');

export const uploadAsset = async (file, name, description) => {
    const stream = fs.createReadStream(file.filepath);

    const options = {
        pinataMetadata: {
            name: name
        }
    };

    const response = await pinata.pinFileToIPFS(stream, options);

    const metadata = {
        "title": "NFTease",
        "type": "object",
        "properties": {
            "name": {
                "type": "string",
                "description": description || ''
            },
            "description": {
                "type": "string",
                "description": name
            },
            "image": {
                "type": "string",
                "description": `ipfs://${response.IpfsHash}`
            }
        }
    };

    const mresponse = await pinata.pinJSONToIPFS(metadata);

    return mresponse.IpfsHash;
};