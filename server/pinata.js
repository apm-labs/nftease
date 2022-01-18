import path from 'path';
import os from 'os';

const axios = require('axios')

const fs = require('fs');

const pinataSDK = require('@pinata/sdk');
const pinata = pinataSDK('eed3e62e15fb35cb84c1', '52955b7afe9a69af60211a5d3843e796dde50e0ec5f8365c77f158a2845734d9');

export const downloadAsset = async (url) => {
    const filePath = path.join(os.tmpdir(), 'foobar-'+ Date.now())
    const response = await axios({
        url,
        method: 'GET',
        responseType: 'stream'
    });
    return new Promise((resolve, reject) => {
        response.data.pipe(fs.createWriteStream(filePath))
            .on('error', reject)
            .once('close', () => resolve(filePath)); 
    });
}

export const uploadAsset = async (file, name, description) => {
    let filePath = file.filePath;
    if (!filePath) { // it's a URL
        filePath = await downloadAsset(file);
    }
     
    const stream = fs.createReadStream(filePath);
    const options = name && {
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

    return {
        tokenURI: mresponse.IpfsHash,
        imageURI: response.IpfsHash
    };
};