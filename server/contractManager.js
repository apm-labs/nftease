import web3 from "../model/web3";
import contracts from "./contracts";

export const mintNFT = async (contractId, tokenURI, recipient) => {
    const contract = contracts[contractId];
    if (!recipient) {
        const accounts = await web3.eth.getAccounts();
        recipient = accounts[0];
    }

    const data = await contract.instance.methods.mintNFT(recipient, tokenURI).send({
        from: recipient
    });

    return {
        contractId: contract.id,
        tokenId: data.events.Transfer.returnValues.tokenId
    };
}