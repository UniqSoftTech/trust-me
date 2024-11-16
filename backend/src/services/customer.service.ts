import Web3 from "web3";
import config from "../config/env";
import { abi } from "../config/chain-abi";

const web3 = new Web3(new Web3.providers.HttpProvider(config.infura_url as string));

const getCustomersByType = async (type: any) => {
  const contract = new web3.eth.Contract(abi, config.contract_address);

  const result = await contract.methods.getEmployers(type).call();
  return result;
};

const createCustomersByType = async (data: any) => {
  try {
    const contract = new web3.eth.Contract(abi, config.contract_address);
    const result = await contract.methods.register(data).call();
    return result;
  } catch (error: any) {
    throw new Error(error);
  }
};

const getCustomerHistory = async (id: any) => {
  try {
    const contract = new web3.eth.Contract(abi, config.contract_address);
    const result = await contract.methods.history(id).call();
    return result;
  } catch (error: any) {
    throw new Error(error);
  }
};

export default { getCustomersByType, createCustomersByType, getCustomerHistory };
