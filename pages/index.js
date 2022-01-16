import { CircularProgress } from "@mui/material";
import React, { useState } from "react";
import AccountInfo from "../components/AccountInfo";
import SingleMint from "../components/SingleMint";

export default () => {
    const [account, setAccount] = useState(null);
    const [initialized, setInitialized] = useState(false);

    const onAccountFetched = (acc) => {
        setInitialized(true);
        setAccount(acc);
    };

    return <div style={{padding: 20}}>
        <div hidden={!initialized} style={{position: 'absolute', right: 10, top: 10 }}>
            <AccountInfo onAccountFetched={onAccountFetched} />
        </div>
        {!initialized && <div style={{display: 'flex', height: '500px', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
            <CircularProgress />
        </div>}
        {initialized && <div>
            {account && <div>
                    <SingleMint account={account} />
                </div>
            }
            {!account && <div style={{display: 'flex', height: '500px', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                Your NFT is ready to be claimed! <br />
                Connect a wallet or login to claim it.
            </div>}
        </div>}
    </div>;
};