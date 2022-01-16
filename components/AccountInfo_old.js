import { Button, Link } from '@mui/material';
import Script from 'next/script';
import * as React from 'react';
import web3 from '../model/web3';
import { setActiveAccount } from '../server/contractManager';

const AccountInfo = (props) => {
    const [address, setAddress] = React.useState(props.address);
    const [balance, setBalance] = React.useState(props.balance);
    const [openLogin, setOpenLogin] = React.useState(null);

    const setAccount = async (account, fetch) => {
        setAddress(account);
        setBalance(account && await setActiveAccount(account, fetch));

        props.onAccountFetched(account);
    };
    
    const initOpenLogin = async () => {
        if (!openLogin) {
            const {default: OpenLogin} = await import("@toruslabs/openlogin");

            // clientId can be any string for localhost
            const openLogin = new OpenLogin({ clientId: "BBp6Cgeqr_GvSYRbcSUqpqYwnB62LI2Qn8_jappQvOq4Z5w0VT1Nbn_ajh9ZG6QgcxLjvl3iqtsgZGaZ0iTnzd0", network: "testnet" });

            await openLogin.init();

            setOpenLogin(openLogin);

            console.log('setting open login', openLogin);
    
            // if openlogin instance has private key then user is already logged in
            if (openLogin.privKey) {
                console.log("User is already logged in. Private key", openLogin);

                const acc = await web3.eth.accounts.privateKeyToAccount(openLogin.privKey);

                console.log('init', acc);
                setAccount(acc.address, true);

                return true;
            }
        }
    };

    const init = async () => {
        var accounts = await web3.eth.getAccounts();
        if (accounts && accounts.length > 0) {
            console.log('initwallet', accounts[0]);
            setAccount(accounts[0]);
        } else {
            const a = await initOpenLogin();
            console.log('asdasdsa', a);

            if (!a) {
                setAccount(null);
            }
        }
    };

    React.useEffect(() => {
        init();
    }, []);

    const loginOpen = async () => {
        await initOpenLogin();

        if (!openLogin.privKey) {
            const res = await openLogin.login({
                loginProvider: "google",
                uxMode: "popup"
            });

            // const acc = await web3.eth.accounts.privateKeyToAccount(openLogin.privKey);
            // console.log('got', acc);
            // setAccount(acc.address, true);
        }
    };

    const connectWallet = async () => {
        await web3.eth.requestAccounts();

        const accounts = await web3.eth.getAccounts();
        if (accounts && accounts.length > 0) {
            setAccount(accounts[0]);
        }
    };
    
    const logout = async () => {
        if (openLogin) {
            console.log('logging out');

            await openLogin.logout();
            openLogin = null;
            setAccount(null);
        }
    };

    return <div style={{display: 'flex', flexDirection: 'column' }}>
        <Script src="https://cdn.jsdelivr.net/npm/@toruslabs/openlogin@0"></Script>

        {address && 
            <div style={{display: 'flex', flexDirection: 'column',  padding: 10, fontSize: 13 }}>
                <p><strong>Address</strong>: {address}</p>
                <p><strong>Balance</strong>: {balance} ETH</p>
                <Button variant="outlined" component="span" style={{alignSelf: 'flex-end'}} onClick={logout}>
                    Logout
                </Button>
            </div>
        }
        {!address && 
            <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 10 }}>
                <Button variant="outlined" component="span" onClick={connectWallet}>
                    Connect Wallet
                </Button>
                <Link style={{paddingTop: 12, fontSize: 13, color: 'gray' }} href="#" onClick={loginOpen}>I don't have a wallet</Link>
            </div>
        }
    </div>;
};
export default AccountInfo;
