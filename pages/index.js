import { CircularProgress } from "@mui/material";
import Script from "next/script";
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
        
        <Script src="https://cdn.jsdelivr.net/npm/@toruslabs/openlogin@0"></Script>

        <div style={{position: 'absolute', right: 10, top: 10 }}>
            <AccountInfo onAccountFetched={onAccountFetched} />
        </div>
    </div>;
};