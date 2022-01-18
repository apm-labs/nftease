import Web3 from "web3";
import singlemint from '../build/contracts/SingleMint.json' ;

const contracts = {
    'singlemint' : {
        id: '0xB0E53D690682dE77D1B3beD2F5188589AF188B65',
        abi: singlemint.abi
    }
};

let web3;
let account;

export const mintNFT = async (contractId, tokenURI, recipient) => {
    const contract = new web3.eth.Contract(contracts[contractId].abi, contracts[contractId].id);
    
    const data = await contract.methods.mintNFT(recipient, tokenURI).send({
        from: recipient
    });

    return {
        contractId: contracts[contractId].id,
        tokenId: data.events.Transfer.returnValues.tokenId
    };
}

export const setActiveAccount = async(account, provider) => {
    web3 = new Web3(provider || window.ethereum);
    account = account;

    const wei = await web3.eth.getBalance(account);

    return web3.utils.fromWei(wei, 'ether');
};
