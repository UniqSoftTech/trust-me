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
    image: "e1.jpg",
    isEmployee: true,
    hourPrice: "10$",
    description: "I am searching for part-time job",
  },
  {
    id: 2,
    account: "0x123457",
    firstname: "GS25",
    lastname: "Nice too meet you",
    email: "Margad@gmail.com",
    image: "r1.jpg",
    isEmployee: false,
    hourPrice: "20$",
    description:
      "With the guideline of Lifestyle Platform, GS25 has developed a daily living platform, optimizing the convenient new services and culinary culture to bring a modern and quality living experience to customers. Always maintain the leading position since its establishment.",
  },
  {
    id: 3,
    account: "0x123458",
    firstname: "Geleg",
    lastname: "Balsan",
    email: "Geleg@gmail.com",
    image: "e2.jpg",
    isEmployee: true,
    hourPrice: "10$",
    description: "I am really honest people and good person",
  },
  {
    id: 4,
    account: "0x123458",
    firstname: "Margad-Erdene",
    lastname: "Khosbayar",
    email: "marko_9911@gmail.com",
    image: "e3.jpg",
    isEmployee: true,
    hourPrice: "25$",
    description: "I'm currently seeking opportunities where I can contribute my skills and grow in a dynamic environment",
  },
  {
    id: 5,
    account: "0x123458",
    firstname: "Batgerelt",
    lastname: "Battsogt",
    email: "Grey@gmail.com",
    image: "e4.jpg",
    isEmployee: true,
    hourPrice: "30$",
    description: "Searching part-time job",
  },
  {
    id: 6,
    account: "0x123458",
    firstname: "7 Eleven",
    lastname: "Eleven",
    email: "Jay@gmail.com",
    image: "r2.jpg",
    isEmployee: false,
    hourPrice: "30$",
    description: "Searching part-time sales manager",
  },
  {
    id: 7,
    account: "0x123458",
    firstname: "CU",
    lastname: "Nice to meet you",
    email: "Ben@uniqsoft.mn",
    image: "r3.jpg",
    isEmployee: false,
    hourPrice: "15$",
    description:
      "CU provides space and content for the Korean lifestyle. From the start of the day, during the short break, until the day's end, CU is always with customers. New convenience store models provides a fresh experience in daily life. As a result, CU is seen not just a convenience store but as a lifestyle platform for customers.",
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
    const filteredValue = customers.filter((customer) => customer.isEmployee == (isEmployee.toString() == "true"));
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
