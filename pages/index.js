import { Button } from "@mui/material";
import React, { useState } from "react";

import { createWallet } from "../server/blockcypher";
import web3 from "../model/web3";

export default () => {
    const [newAccount, setNewAccount] = useState(null);

    const [account, setAccount] = useState(null);
    const [balance, setBalance] = useState(null);
    
    const getAccounts = async () => {
        const accounts = await web3.eth.getAccounts();

        if (accounts && accounts.length > 0) {
            setAccount(accounts[0]);

            const wei = await web3.eth.getBalance(accounts[0]);
            setBalance(web3.utils.fromWei(wei, 'ether'));
        }
    };
    getAccounts();

    const connect = async () => {
        await web3.eth.requestAccounts();

        getAccounts();
    };

    const create = async() => {
        const accountInfo = await createWallet();

        setNewAccount(accountInfo);
    };

    return <div style={{padding: 20}}>
        {account && <span>Connected wallet address: <b>{account}</b></span>}
        <br />
        {account && <span>Connected wallet balance: <b>{balance} ETH</b></span>}
        <br />
        {!account && <Button variant="outlined" component="span" onClick={connect}>Connect to Wallet</Button>}
        <br />
        <p>or</p>
        <br />
        {!newAccount && <Button variant="outlined" component="span" onClick={create}>Create Account with BlockCypher</Button>}
        {newAccount && <span>Created account private key: <b>{newAccount.private}</b></span>}
        <br />
        {newAccount && <span>Created account public key: <b>{newAccount.public}</b></span>}
        <br />
        {newAccount && <span>Created account address: <b>0x{newAccount.address}</b></span>}

    </div>;
};