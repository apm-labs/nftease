import { Button, Link } from '@mui/material';
import * as React from 'react';
import Web3 from 'web3';
import { setActiveAccount } from '../server/contractManager';

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
                    host: "rinkeby", 
                  }
            });

            setTorus(torus);

            const web3 = new Web3(torus.provider);
            const accounts = await web3.eth.getAccounts();
            const address = accounts.length > 0 && accounts[0];
            
            setAccount(address, torus.provider);

            return address;
        }
    };

    const init = async () => {
        const web3 = new Web3(window.ethereum);

        var accounts = await web3.eth.getAccounts();
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
        await web3.eth.requestAccounts();

        const accounts = await web3.eth.getAccounts();
        if (accounts && accounts.length > 0) {
            setAccount(accounts[0]);
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
                selectedCryptoCurrency: "ETH",
                selectedAddress: address,
            });
        } catch (err) {
            console.log('Torus add fund error', err);
        }
    };

    React.useEffect(() => {
        init();
    }, []);

    return <div style={{display: 'flex', flexDirection: 'column' }}>
        {address && 
            <div style={{display: 'flex', flexDirection: 'column',  padding: 10, fontSize: 13 }}>
                <p><strong>Address</strong>: {address}</p>
                <p><strong>Balance</strong>: {balance} ETH</p>
                <div>
                <Button variant="outlined" component="span" style={{alignSelf: 'flex-start', marginRight: 30}} onClick={addTorusFund}>
                    Add Funds
                </Button>
                <Button variant="outlined" component="span" style={{alignSelf: 'flex-end'}} onClick={showTorusWallet}>
                    Show Wallet
                </Button>
                </div>
            </div>
        }
        {!address && 
            <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 10 }}>
                <Button variant="outlined" component="span" onClick={connectWallet}>
                    Connect Wallet
                </Button>
                <Link style={{paddingTop: 12, fontSize: 13, color: 'gray' }} href="#" onClick={loginTorus}>I don't have a wallet</Link>
            </div>
        }
    </div>;
};
export default AccountInfo;
