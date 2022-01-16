import { Box, Button, CircularProgress, Link } from "@mui/material";
import React, { useState } from "react";

import { mintNFT } from "../server/contractManager";

const SingleMint = (props) => {
    const [image, setImage] = useState(null);
    const [selectedFile, setSelectedFile] = useState('https://source.unsplash.com/random/500x500?sig=1');
    const [processing, setProcessing] = useState(null);
    const [url, setUrl] = useState(null);
    const [result, setResult] = useState(null);

    const mint = async () => {
        setProcessing(true);

        try {
            const formData = new FormData();
            formData.append('url', selectedFile);

            const response = await fetch(`/api/singlemint`, {
                method: 'POST',
                body: formData,
            });

            const data = (await response.json());
            const imageURI = data.imageURI;

            const result = await mintNFT('singlemint', data.tokenURI, props.account);

            setTimeout(() => {
                setUrl(`https://ipfs.io/ipfs/${imageURI}`);
                setResult(result);
                setProcessing(false);
            }, 3000);

            console.log(response);
        } catch (err) {
            console.log(err);
            setProcessing(false);
        }
    };

    
    return <Box sx={{display: 'flex', flexDirection: 'column', height: '600px', justifyContent: 'center', alignItems: 'center' }}>
        {url && <img src={url} style={{ maxWidth: '500px', paddingBottom: 5 }} />}
        { !result && !processing && <Button
            variant="outlined"
            component="span" 
            onClick={mint}>
            Claim Your NFT
        </Button>}
        {processing && <CircularProgress /> }
        {result &&
            <Link href={`https://testnets.opensea.io/assets/${result.contractId}/${result.tokenId}`} target="_blank">Show on Opensea</Link>
        }
    </Box>;
};

export default SingleMint;