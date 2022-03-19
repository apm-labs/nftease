import { Button, Link } from '@mui/material';
import * as React from 'react';
import Web3 from 'web3';
import { setActiveAccount } from '../server/contractManager';

import { isMobile } from 'react-device-detect';

const AccountInfo = (props) => {
    const [address, setAddress] = React.useState(props.address);
    const [balance, setBalance] = React.useState(props.balance);
    const [torus, setTorus] = React.useState(null);

    const setAccount = async (account, provider) => {
        setAddress(account);

        if (account) {
            const balance = await setActiveAccount(account, provider)
            setBalance(balance);
        }

        props.onAccountFetched(account);
    };
    
    const initTorus = async () => {
        if (!torus) {
            const {default: Torus} = await import("@toruslabs/torus-embed");

            const torus = new Torus({});
            await torus.init({
                buildEnv: "testing",
                enableLogging: false,
                showTorusButton: false,
                network: {
                    host: "mumbai",
                    chainId: 80001,
                    networkName: "Mumbai Test Network" 
                  },
            });

            setTorus(torus);

            const web3 = new Web3(torus.provider);
            const accounts = await web3.eth.getAccounts();
            const address = accounts.length > 0 && accounts[0];
            
            setAccount(address, torus.provider);

            console.log(torus);

            return address;
        }
    };

    const init = async () => {
        const web3 = new Web3(window.ethereum);

        var accounts = window.ethereum && await web3.eth.getAccounts();

        if (accounts && accounts.length > 0) {
            setAccount(accounts[0]);
        } else {
            if (!await initTorus()) {
                setAccount(null);
            }
        }
    };

    const loginTorus = async () => {
        await torus.login();
    
        const web3 = new Web3(torus.provider);
        const address = (await web3.eth.getAccounts())[0];

        setAccount(address, torus.provider);
    };

    const connectWallet = async () => {
        const web3 = new Web3(window.ethereum);
        
        const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
          });

        if (accounts && accounts.length > 0) {
            setAccount(accounts[0]);
        }

        if (isMobileDevice()) {
            const metamaskAppDeepLink = "https://metamask.app.link/dapp/" + window.origin;
            return (
              <a href={metamaskAppDeepLink}>
                 <button className={styles.button}>
                   Connect to MetaMask
                 </button>
              </a>
            );
          }
    };

    const showTorusWallet = async () => {
        try {
            torus.showWallet();
        } catch (err) {
            console.log('Torus wallet error', err);
        }
    };

    const addTorusFund = async () => {
        try {
            await torus.initiateTopup("wyre", {
                selectedCurrency: "USD",
                fiatValue: 150,
                //selectedCryptoCurrency: "MATIC",
                selectedAddress: address,
            });
        } catch (err) {
            console.log('Torus add fund error', err);
        }
    };

    const logout = () => {
        torus && torus.logout();
        setAccount(null);
    };

    React.useEffect(() => {
        init();
    }, []);

    return <div style={{display: 'flex', flexDirection: 'column' }}>
        {address && 
            <div style={{display: 'flex', flexDirection: 'column',  padding: 10, fontSize: 13 }}>
                <p><strong>Address</strong>: {address}</p>
                <p><strong>Balance</strong>: {balance} MATIC</p>
                <div>
                <Button variant="outlined" component="span" style={{alignSelf: 'flex-start', marginRight: 30}} onClick={addTorusFund}>
                    Add Funds
                </Button>
                <Button variant="outlined" component="span" style={{alignSelf: 'flex-end', marginRight: 30}} onClick={showTorusWallet}>
                    Show Wallet
                </Button>
                <Button variant="outlined" component="span" style={{alignSelf: 'flex-end'}} onClick={logout}>
                    Logout
                </Button>
                </div>
            </div>
        }
        {!address && 
            <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 10 }}>
                {isMobile ?  (<Button variant="outlined" component="span">
                <a href={"https://metamask.app.link/dapp/nftease.vercel.app/#"}>
                    
                        Connect Wallet
                    
                </a></Button>
                ) :(
                                       <Button variant="outlined" component="span" onClick={connectWallet}>
                        Connect Wallet
                    </Button>
                )
                }
                <Link style={{paddingTop: 12, fontSize: 13, color: 'gray' }} href="#" onClick={loginTorus}>I don't have a wallet</Link>
            </div>
        }
    </div>;
};
export default AccountInfo;
