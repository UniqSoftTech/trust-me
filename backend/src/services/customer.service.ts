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
    isEmployee: true,
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
    description: "Searching a part-time full stack developer",
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
    description: "Frontend Developer",
  },
  {
    id: 4,
    account: "0x123458",
    firstname: "Geleg",
    lastname: "Balsan",
    email: "Geleg@gmail.com",
    image: "/image/test.jpg",
    isEmployee: true,
    hourPrice: "10$",
    description: "Junior Developer",
  },
  {
    id: 5,
    account: "0x123458",
    firstname: "Grey",
    lastname: "Gerelt",
    email: "Grey@gmail.com",
    image: "/image/test.jpg",
    isEmployee: true,
    hourPrice: "20$",
    description: "Senior Developer",
  },
  {
    id: 6,
    account: "0x123458",
    firstname: "Jay",
    lastname: "Jamka",
    email: "Jay@gmail.com",
    image: "/image/test.jpg",
    isEmployee: false,
    hourPrice: "30$",
    description: "Employer for developer",
  },
  {
    id: 7,
    account: "0x123458",
    firstname: "Ben",
    lastname: "Bat-Erdene",
    email: "Ben@uniqsoft.mn",
    image: "/image/test.jpg",
    isEmployee: false,
    hourPrice: "30$",
    description: "Searching frontend developer",
  },
];

enum OrderStatus {
  approved = "approved",
  inProgress = "inProgress",
  completed = "completed",
}

const orders = [
  {
    id: 1,
    employeeId: 1,
    employerId: 2,
    amount: "100$",
    hours: 5,
    rating: 4,
    status: OrderStatus.completed,
  },
];

const getCustomersByType = async (isEmployee: boolean) => {
  try {
    const filteredValue = customers.find((customer) => customer.isEmployee === isEmployee);
    return filteredValue;

    // const contract = new web3.eth.Contract(abi, config.contract_address);
    // const result = await contract.methods.getCustomersByType(isEmployee).call();
    // return result;
  } catch (error: any) {
    return customers;
  }
};

const createCustomersByType = async (data: any) => {
  try {
    return customers[0];

    // const contract = new web3.eth.Contract(abi, config.contract_address);
    // const result = await contract.methods.createCustomer(data).call();
    // return result;
  } catch (error: any) {
    return customers[0];
  }
};

const getCustomerHistory = async (id: any) => {
  try {
    return customers.find((customer) => customer.id == id);

    // const contract = new web3.eth.Contract(abi, config.contract_address);
    // const result = await contract.methods.getCustomerById(id).call();
    // return result;
  } catch (error: any) {
    return customers[0];
  }
};

const getCustomerByAccount = async (account: any) => {
  try {
    return customers.find((customer) => customer.account == account);
    // const contract = new web3.eth.Contract(abi, config.contract_address);
    // const result = await contract.methods.getCustomerById(account).call();
    // return result;
  } catch (error: any) {
    return customers[0];
  }
};

const createOrder = async (data: any) => {
  try {
    const { employeeId, employerId, amount, hours } = data;

    const newOrder = { id: 3, employeeId: employeeId, employerId: employerId, amount: amount, hours: hours, rating: 0, status: OrderStatus.approved };

    orders.push(newOrder);
    return newOrder;
    // const contract = new web3.eth.Contract(abi, config.contract_address);
    // const result = await contract.methods.createOrder(employeeId, employerId, orderId, amount, hours).call();
  } catch (error) {
    throw error;
  }
};

export default { getCustomersByType, createCustomersByType, getCustomerHistory, getCustomerByAccount, createOrder };
