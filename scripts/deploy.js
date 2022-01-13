const fs = require("fs-extra");

const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');

const provider = new HDWalletProvider(
    fs.readFileSync(".secret").toString().trim(), //mnemoic
    'https://rinkeby.infura.io/v3/292e479fcfaa4ed3bbb2c7115b1798da' //rinkeby
);
const web3 = new Web3(provider);

const deploy = async (name) => {
    try {
        const compiledContract = fs.readJsonSync(`./build/contracts/${name}.json`);

        const accounts = await web3.eth.getAccounts();

        console.log(`Attempting to deploy ${name} from account`, accounts[0]);
      
        const result = await new web3.eth.Contract(compiledContract.abi)
          .deploy({ data: compiledContract.bytecode })
          .send({ gas: '10000000', from: accounts[0] });
      
        console.log('Contract deployed to', result.options.address);
    } catch (err) {
        console.error(err);
    } finally {
        provider.engine.stop();
    }
};

deploy(process.argv[2]);
