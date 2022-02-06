import Moralis from "moralis";
import Web3 from "web3";
import abi from "./abi";

const getStarted = async (address) => {
  await Moralis.enableWeb3();
  const web3 = new Web3(Moralis.provider);
  const contract = new web3.eth.Contract(
    abi,
    process.env.REACT_APP_NFT_CONTRACT_ADDRESS,
  );
  return contract.methods.getStarted().send({ from: address });
};

const mintToken = async (address, tokenId) => {
  await Moralis.enableWeb3();
  const web3 = new Web3(Moralis.provider);
  const contract = new web3.eth.Contract(
    abi,
    process.env.REACT_APP_NFT_CONTRACT_ADDRESS,
  );
  return contract.methods
    .mint(parseInt(tokenId, 10), 2)
    .send({ from: address });
};

export { getStarted, mintToken };
