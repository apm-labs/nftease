import { Box, Button, CircularProgress, Link } from "@mui/material";
import React, { useState } from "react";

import { mintNFT } from "../server/contractManager";

const SingleMint = (props) => {
    const [imageURL, setImageURL] = useState(null);
    const [processing, setProcessing] = useState(null);
    const [result, setResult] = useState(null);

    const mint = async () => {
        setProcessing(true);

        try {
            const formData = new FormData();
            formData.append('url', 'https://source.unsplash.com/random/500x500?sig=1');

            const response = await fetch(`/api/upload`, {
                method: 'POST',
                body: formData,
            });

            const assetData = await response.json();
            const result = await mintNFT('singlemint', assetData.tokenURI, props.account);

            setImageURL(`https://ipfs.io/ipfs/${assetData.imageURI}`);
            setResult(result);
        } finally {
            setProcessing(false);
        }
    };

    
    return <Box sx={{display: 'flex', flexDirection: 'column', height: '600px', justifyContent: 'center', alignItems: 'center' }}>
        {imageURL && <img src={imageURL} style={{ maxWidth: '500px', paddingBottom: 5 }} />}
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