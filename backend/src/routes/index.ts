import express from "express";
import CustomerController from "../controllers/customer.controller";

const router = express.Router();

router.get("/customer/:isEmployee", CustomerController.getCustomers);
router.post("/customer/:isEmployee", CustomerController.createCustomers);

router.get("/customer-wallet/:walletId", CustomerController.getCustomerByAccount);
router.get("/customer/history/:id", CustomerController.getCustomerHistory);

router.post("/order", CustomerController.createOrder);

router.get("/customer-like/:address", CustomerController.getCustomersLike);
router.post("/customer-like", CustomerController.likeCustomer);

router.post("/approve-request/:address/:liked_address", CustomerController.approveRequest);

router.get("/customer-status/:address", CustomerController.getEmployeeWorkStatus);

router.post("/end-status/:address/:date", CustomerController.endEmployeeWorkStatus);

export default router;
