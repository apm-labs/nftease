import web3 from '../model/web3';
import singlemint from '../build/contracts/SingleMint.json' ;

const contracts = {
    'singlemint' : {
        id: '0xB0E53D690682dE77D1B3beD2F5188589AF188B65',
        abi: singlemint.abi
    }
};

Object.keys(contracts).forEach(key => {
    const contract = contracts[key];

    contract.instance = new web3.eth.Contract(contract.abi, contract.id);
});

export default contracts;