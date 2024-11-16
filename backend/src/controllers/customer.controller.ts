import { Request, Response } from "express";
import customerService from "../services/customer.service";

const getCustomers = async (req: Request, res: Response) => {
  const { type } = req.params;

  const users = await customerService.getCustomersByType(type);
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

export default { getCustomers, createCustomers, getCustomerHistory };
