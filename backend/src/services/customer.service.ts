import Web3 from "web3";
import config from "../config/env";
import { abi } from "../config/chain-abi";

const web3 = new Web3(new Web3.providers.HttpProvider(config.infura_url as string));

const customers = [
  {
    id: 1,
    account: "0x123456",
    firstname: "John",
    lastname: "Doe",
    email: "doe@gmail.com",
    image: "/image/test.jpg",
    isEmployee: false,
    hourPrice: "20$",
    description: "I am a full stack developer",
  },
  {
    id: 2,
    account: "0x123457",
    firstname: "Margad",
    lastname: "Khosbayar",
    email: "Margad@gmail.com",
    image: "/image/test.jpg",
    isEmployee: false,
    hourPrice: "30$",
    description: "Searching a full stack developer",
  },
  {
    id: 3,
    account: "0x123458",
    firstname: "Geleg",
    lastname: "Balsan",
    email: "Geleg@gmail.com",
    image: "/image/test.jpg",
    isEmployee: true,
    hourPrice: "10$",
    description: "Developer",
  },
];

const getCustomersByType = async (isEmployee: boolean) => {
  try {
    const filteredValue = customers.find((customer) => customer.isEmployee === isEmployee);
    return filteredValue;

    const contract = new web3.eth.Contract(abi, config.contract_address);
    const result = await contract.methods.getCustomersByType(isEmployee).call();
    return result;
  } catch (error: any) {
    return customers;
  }
};

const createCustomersByType = async (data: any) => {
  try {
    return customers[0];

    const contract = new web3.eth.Contract(abi, config.contract_address);
    const result = await contract.methods.createCustomer(data).call();
    return result;
  } catch (error: any) {
    return customers[0];
  }
};

const getCustomerHistory = async (id: any) => {
  try {
    return customers.find((customer) => customer.id == id);

    const contract = new web3.eth.Contract(abi, config.contract_address);
    const result = await contract.methods.getCustomerById(id).call();
    return result;
  } catch (error: any) {
    return customers[0];
  }
};

const getCustomerByAccount = async (account: any) => {
  try {
    return customers.find((customer) => customer.account == account);
    const contract = new web3.eth.Contract(abi, config.contract_address);
    const result = await contract.methods.getCustomerById(account).call();
    return result;
  } catch (error: any) {
    return customers[0];
  }
};

export default { getCustomersByType, createCustomersByType, getCustomerHistory, getCustomerByAccount };
