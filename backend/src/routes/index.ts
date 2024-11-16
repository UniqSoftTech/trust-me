import express from "express";
import CustomerController from "../controllers/customer.controller";

const router = express.Router();

router.get("/customer/:type", CustomerController.getCustomers);
router.post("/customer/:type", CustomerController.createCustomers);

router.get("/customer/history/:id", CustomerController.getCustomerHistory);

export default router;
