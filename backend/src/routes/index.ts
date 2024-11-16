import express from "express";
import CustomerController from "../controllers/customer.controller";

const router = express.Router();

router.get("/customer/:isEmployee", CustomerController.getCustomers);
router.post("/customer/:isEmployee", CustomerController.createCustomers);

router.get("/customer-wallet/:walletId", CustomerController.getCustomerByAccount);
router.get("/customer/history/:id", CustomerController.getCustomerHistory);

router.post("/order", CustomerController.createOrder);

router.get("/customer-like/:account", CustomerController.getCustomersLike);
router.post("/customer-like", CustomerController.likeCustomer);

export default router;
