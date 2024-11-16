// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "@openzeppelin/token/ERC20/IERC20.sol";
import "@openzeppelin/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/security/ReentrancyGuard.sol";
import "@openzeppelin/access/Ownable.sol";

contract TrustMe is ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;

    enum Status {
        Created,
        InProgress,
        Completed,
        Cancelled
    }

    uint256 public advancePercent;

    constructor(uint256 _advancePercent) Ownable() {
        advancePercent = _advancePercent;
    }

    struct WorkOrder {
        uint256 id;
        address requester;
        address employee;
        string description;
        uint256 amount;
        uint256 advancePayment;
        Status status;
    }

    uint256 public nextWorkOrderId;
    mapping(uint256 => WorkOrder) public workOrders;

    uint256[] public workOrderIds;

    event WorkOrderCreated(uint256 id, address requester, string description, uint256 amount);
    event WorkOrderStatusChanged(uint256 id, Status status);
    event AdvancePaymentMade(uint256 id, uint256 amount);

    function createWorkOrder(address employee, string memory description, uint256 amount) public onlyOwner {
        workOrders[nextWorkOrderId] = WorkOrder({
            id: nextWorkOrderId,
            requester: msg.sender,
            employee: employee,
            description: description,
            amount: amount,
            advancePayment: 0,
            status: Status.Created
        });

        workOrderIds.push(nextWorkOrderId);

        emit WorkOrderCreated(nextWorkOrderId, msg.sender, description, amount);
        nextWorkOrderId++;
    }

    function changeWorkOrderStatus(uint256 id, Status status) public onlyOwner {
        WorkOrder storage workOrder = workOrders[id];
        require(workOrder.status != Status.Completed, "Work order already completed");
        require(workOrder.status != Status.Cancelled, "Work order already cancelled");

        workOrder.status = status;
        emit WorkOrderStatusChanged(id, status);
    }

    function makeAdvancePayment(uint256 id, uint256 amount, IERC20 token) public onlyOwner nonReentrant {
        WorkOrder storage workOrder = workOrders[id];
        require(workOrder.status != Status.Created, "Invalid work order status");
        require(amount <= workOrder.amount, "Advance payment exceeds work order amount");

        token.safeTransferFrom(msg.sender, workOrder.employee, amount);
        workOrder.advancePayment += amount;
        workOrder.status = Status.InProgress;

        emit AdvancePaymentMade(id, amount);
    }

    function cancelWorkOrder(uint256 id) public onlyOwner {
        WorkOrder storage workOrder = workOrders[id];
        require(workOrder.status != Status.Completed, "Work order already completed");
        require(workOrder.status != Status.Cancelled, "Work order already cancelled");

        workOrder.status = Status.Cancelled;
        emit WorkOrderStatusChanged(id, Status.Cancelled);
    }

    function completeWorkOrder(uint256 id) public onlyOwner {
        WorkOrder storage workOrder = workOrders[id];
        require(workOrder.status == Status.InProgress, "Work order not in progress");

        workOrder.status = Status.Completed;
        emit WorkOrderStatusChanged(id, Status.Completed);
    }

    function getAdvanceAmount(uint256 id) public view returns (uint256) {
        WorkOrder storage workOrder = workOrders[id];

        return workOrder.amount * (advancePercent / 100);
    }

    function getWorkOrder(uint256 id) public view returns (WorkOrder memory) {
        return workOrders[id];
    }

    function getAllWorkOrders() public view returns (WorkOrder[] memory) {
        WorkOrder[] memory orders = new WorkOrder[](workOrderIds.length);
        for (uint256 i = 0; i < workOrderIds.length; i++) {
            orders[i] = workOrders[workOrderIds[i]];
        }
        return orders;
    }
}
