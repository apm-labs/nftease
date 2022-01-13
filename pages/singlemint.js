import { Box, Button, CircularProgress, Link } from "@mui/material";
import React, { useState } from "react";
import { SERVER_URL } from "../config";

import { mintNFT } from "../server/contractManager";

//import Layout from "../components/Layout";'


export default () => {
    const [image, setImage] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [processing, setProcessing] = useState(null);
    const [result, setResult] = useState(null);

    const mint = async () => {
        setProcessing(true);

        try {
            const formData = new FormData();
            formData.append('file', selectedFile);
            formData.append('name', selectedFile.name);

            const response = await fetch(`/api/singlemint`, {
                method: 'POST',
                body: formData,
            });

            const tokenURI = (await response.json()).tokenURI;

            console.log('tokenURI', tokenURI);

            const result = await mintNFT('singlemint', tokenURI);

            setTimeout(() => {
                setResult(result);
                setProcessing(false);
            }, 3000);

            console.log(response);
        } catch (err) {
            console.log(err);
            setProcessing(false);
        }
    };

    const selectFile = async (event) => {
        const file = event.target.files[0]

        setSelectedFile(file);
        setResult(null);
        setImage(URL.createObjectURL(file));
    };

    
    return <Box sx={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
    {/* <Layout /> */}
        <label>
            <input
                style={{ display: 'none' }}
                type="file"
                onChange={selectFile} />
            <Button
                variant="outlined"
                component="span" >
                Choose File
            </Button>
        </label>

        {image && <Box sx={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', paddingTop: 5, paddingBottom: 5 }}>
            <img src={image} style={{ maxWidth: '700px', paddingBottom: 5 }} />
            { !result && <Button
                variant="outlined"
                component="span" 
                onClick={mint}>
                Mint
            </Button>}
        </Box>}
        {processing && <CircularProgress /> }
        {result &&
            <Link href={`https://testnets.opensea.io/assets/${result.contractId}/${result.tokenId}`} target="_blank">Show on Opensea</Link>
        }
    </Box>;

    
};