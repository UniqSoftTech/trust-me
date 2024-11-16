import Web3 from "web3";
import config from "../config/env";
import { SignProtocolClient, SpMode, EvmChains, IndexService, decodeOnChainData, DataLocationOnChain } from "@ethsign/sp-sdk";
import { privateKeyToAccount } from "viem/accounts";
import { Hex } from "viem";
import { formatDate, getLastTwoDays } from "../utils/utils";
// import { abi } from "../config/chain-abi";

// const web3 = new Web3(new Web3.providers.HttpProvider(config.infura_url as string));

const customers = [
  {
    id: 1,
    account: "0x72F969f810d832853A9C3838Da9FaE6682650319",
    firstname: "John",
    lastname: "Doe",
    email: "doe@gmail.com",
    image: "e1.jpg",
    isEmployee: true,
    hours_day: 4,
    hourPrice: 10,
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
    hours_day: 5,
    hourPrice: 20,
    description:
      "With the guideline of Lifestyle Platform, GS25 has developed a daily living platform, optimizing the convenient new services and culinary culture to bring a modern and quality living experience to customers. Always maintain the leading position since its establishment.",
  },
  {
    id: 3,
    account: "0x7AF8D1aD0A22287fa2aa735203ce57fa4C8b441f",
    firstname: "Geleg",
    lastname: "Balsan",
    email: "Geleg@gmail.com",
    image: "e2.jpg",
    isEmployee: true,
    hours_day: 4,
    hourPrice: 10,
    description: "I am really honest people and good person",
  },
  {
    id: 4,
    account: "0x123459",
    firstname: "Margad-Erdene",
    lastname: "Khosbayar",
    email: "marko_9911@gmail.com",
    image: "e3.jpg",
    isEmployee: true,
    hours_day: 3,
    hourPrice: 25,
    description: "I'm currently seeking opportunities where I can contribute my skills and grow in a dynamic environment",
  },
  {
    id: 5,
    account: "0x123450",
    firstname: "Batgerelt",
    lastname: "Battsogt",
    email: "Grey@gmail.com",
    image: "e4.jpg",
    isEmployee: true,
    hours_day: 3,
    hourPrice: 30,
    description: "Searching part-time job",
  },
  {
    id: 6,
    account: "0x123451",
    firstname: "7 Eleven",
    lastname: "Eleven",
    email: "Jay@gmail.com",
    image: "r2.jpg",
    isEmployee: false,
    hours_day: 4,
    hourPrice: 30,
    description: "Searching part-time sales manager",
  },
  {
    id: 7,
    account: "0x123452",
    firstname: "CU",
    lastname: "Nice to meet you",
    email: "Ben@uniqsoft.mn",
    image: "r3.jpg",
    isEmployee: false,
    hours_day: 4,
    hourPrice: 15,
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
    const customerInfo = customers.find((customer) => customer.account == account);
    if (!customerInfo) {
      return customers[0];
    }
    return customerInfo;
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
    // return result;
  } catch (error) {
    throw error;
  }
};

const likeCustomer = async (account: string, liked_account: string) => {
  try {
    const privateKey = `0x${config.private_key as string}`;

    const client = new SignProtocolClient(SpMode.OnChain, {
      chain: EvmChains.baseSepolia,
      account: privateKeyToAccount(privateKey as Hex),
    });

    const createAttestationRes = await client.createAttestation({
      schemaId: "0x4ac", // use the created schemaId
      data: {
        account_one: account,
        account_two: liked_account,
        date: new Date().toISOString(),
      },
      indexingValue: `${liked_account}`,
    });
    return createAttestationRes;
  } catch (error: any) {
    console.log("error: ", error.message);
    return customers[0];
  }
};

const getCustomersLike = async (address: string): Promise<any[]> => {
  try {
    const indexService = new IndexService("testnet");
    const res = await indexService.queryAttestationList({
      id: "",
      schemaId: "",
      attester: "",
      page: 1,
      mode: "onchain",
      indexingValue: address,
    });

    if (res?.rows.length === 0) {
      return [];
    }

    const schemaData = `[{"name":"account_one","type":"string"},{"name":"account_two","type":"string"},{"name":"date","type":"string"}]`;
    const datas = res?.rows.map((row) => {
      return decodeOnChainData(row.data, DataLocationOnChain.ONCHAIN, JSON.parse(schemaData));
    });
    return datas || [];
  } catch (error: any) {
    console.log("error: ", error.message);
    return [];
  }
};

const approveRequest = async (my_address: string, liked_address: string) => {
  try {
    const customerInfo = await getCustomerByAccount(my_address);
    if (!customerInfo) {
      return { approved: false, message: "customer info not found" };
    }

    const likedAccounts = await getCustomersLike(my_address);
    const isApproved = likedAccounts.find((account: any) => account.account_one === liked_address);
    if (!isApproved) {
      await likeCustomer(my_address, liked_address);
      return { approved: false, message: "liked" };
    }

    const privateKey = `0x${config.private_key as string}`;

    const client = new SignProtocolClient(SpMode.OnChain, {
      chain: EvmChains.baseSepolia,
      account: privateKeyToAccount(privateKey as Hex),
    });

    const employeeAddress = customerInfo.isEmployee ? my_address : liked_address;

    const date = formatDate(new Date());

    await client.createAttestation({
      schemaId: "0x4dd", // use the created schemaId
      data: {
        employee_address: employeeAddress,
        employer_address: customerInfo.isEmployee ? liked_address : my_address,
        amount: customerInfo.hourPrice * customerInfo.hours_day,
        hours: customerInfo.hours_day,
        rating: 0,
        status: OrderStatus.approved,
        date: date,
      },
      indexingValue: `${employeeAddress}-work-${date}`,
    });

    return { approved: true, message: "Work approved" };
  } catch (error: any) {
    console.log("approveRequest error: ", error.message);
    throw error;
  }
};

const getEmployeeWorkStatus = async (address: string): Promise<any[] | object> => {
  try {
    const indexService = new IndexService("testnet");

    const lastSevenDays = getLastTwoDays();
    const results = [] as any[];

    for (const date of lastSevenDays) {
      const res = await indexService.queryAttestationList({
        id: "",
        schemaId: "",
        attester: "",
        page: 1,
        mode: "onchain",
        indexingValue: `${address}-work-${date}`,
      });

      if (res?.rows?.length === 0) continue;

      const checkStatus = await checkWorkStatusByDate(address, date, OrderStatus.completed);
      if (checkStatus) {
        continue;
      }

      const schemaData = `[{"name":"employee_address","type":"string"},{"name":"employer_address","type":"string"},{"name":"amount","type":"uint256"},{"name":"hours","type":"uint256"},{"name":"rating","type":"uint256"},{"name":"status","type":"string"}]`;
      const datas = res?.rows.map((row) => {
        return decodeOnChainData(row.data, DataLocationOnChain.ONCHAIN, JSON.parse(schemaData));
      });

      if (datas) {
        results.push(...datas);
      }
    }
    return results.length > 0 ? results : [];
  } catch (error: any) {
    console.log("getEmployeeWorkerStatus error: ", error.message);
    return { status: false, message: error.message };
  }
};

const stringifyBigInt = (obj: any): any => {
  if (typeof obj === "bigint") {
    return obj.toString();
  } else if (Array.isArray(obj)) {
    return obj.map(stringifyBigInt);
  } else if (typeof obj === "object" && obj !== null) {
    return Object.fromEntries(Object.entries(obj).map(([key, value]) => [key, stringifyBigInt(value)]));
  } else {
    return obj;
  }
};

const getWorkerStatusKey = (address: string, workDate: string, status: string) => `${status}-${address}-work-${workDate}`;

const checkWorkStatusByDate = async (address: string, workDate: string, status: string) => {
  const indexService = new IndexService("testnet");
  const res = await indexService.queryAttestationList({
    id: "",
    schemaId: "",
    attester: "",
    page: 1,
    mode: "onchain",
    indexingValue: getWorkerStatusKey(address, workDate, status),
  });

  if (res?.rows?.length === 0) return false;

  return true;
};

const endEmployeeWorkStatus = async (address: string, workDate: string) => {
  try {
    const privateKey = `0x${config.private_key as string}`;

    const client = new SignProtocolClient(SpMode.OnChain, {
      chain: EvmChains.baseSepolia,
      account: privateKeyToAccount(privateKey as Hex),
    });

    const res = await client.createAttestation({
      schemaId: "0x4da", // use the created schemaId
      data: {
        employee_address: address,
        status: OrderStatus.completed,
      },
      indexingValue: getWorkerStatusKey(address, workDate, OrderStatus.completed),
    });

    return res;
  } catch (error: any) {
    console.log("endEmployeeWorkStatus error: ", error.message);
    return { status: false, message: error.message };
  }
};

export default {
  getCustomersByType,
  createCustomersByType,
  getCustomerHistory,
  getCustomerByAccount,
  createOrder,
  likeCustomer,
  getCustomersLike,
  approveRequest,
  getEmployeeWorkStatus,
  stringifyBigInt,
  endEmployeeWorkStatus,
};
