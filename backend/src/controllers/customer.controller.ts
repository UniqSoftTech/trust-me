import { Request, Response } from "express";
import customerService from "../services/customer.service";

const getCustomers = async (req: Request, res: Response) => {
  const isEmployee = req.params.isEmployee as unknown as boolean;

  const users = await customerService.getCustomersByType(isEmployee);
  res.json(users);
};

const getCustomerByAccount = async (req: Request, res: Response) => {
  const { walletId } = req.params;

  const users = await customerService.getCustomerByAccount(walletId);
  res.json(users);
};

const createCustomers = async (req: Request, res: Response) => {
  const newEmployer = await customerService.createCustomersByType(req.body);
  res.status(201).json(newEmployer);
};

const getCustomerHistory = async (req: Request, res: Response) => {
  const { id } = req.params;

  const users = await customerService.getCustomerHistory(id);
  res.json(users);
};

const createOrder = async (req: Request, res: Response) => {
  const newOrder = await customerService.createOrder(req.body);
  res.status(201).json(newOrder);
};

const likeCustomer = async (req: Request, res: Response) => {
  const { account, liked_account } = req.body;
  const result = await customerService.likeCustomer(account, liked_account);
  res.json(result);
};

const getCustomersLike = async (req: Request, res: Response) => {
  const { address } = req.params;
  const result = await customerService.getCustomersLike(address);
  res.json(result);
};

const approveRequest = async (req: Request, res: Response) => {
  const { address, liked_address } = req.params;
  const result = await customerService.approveRequest(address, liked_address);
  res.json(result);
};

const getEmployeeWorkStatus = async (req: Request, res: Response) => {
  const { address } = req.params;

  const result = await customerService.getEmployeeWorkStatus(address);
  res.json(result);
};

export default {
  getCustomers,
  createCustomers,
  getCustomerHistory,
  getCustomerByAccount,
  createOrder,
  likeCustomer,
  getCustomersLike,
  approveRequest,
  getEmployeeWorkStatus,
};
