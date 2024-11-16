// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "@openzeppelin/token/ERC20/IERC20.sol";
import "@openzeppelin/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/security/ReentrancyGuard.sol";
import "@openzeppelin/access/Ownable.sol";

contract Customer is ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;


    enum Status { Created, InProgress, Completed, Cancelled }

    uint256 public advancePercent;
    
    constructor(uint256 _advancePercent) Ownable() {
        advancePercent = _advancePercent;
    }

    struct CustomerStruct {
        uint256 id;
        address account;
        string firstname;
        string lastname;
        string email; 
        string image;
        bool isEmployee;
        uint256 hourPrice;
    }

    uint256 public nextCustomerId;
    mapping(uint256 => CustomerStruct) public customers;
    uint256[] public customerIds;

    event CustomerCreated(uint256 id, address account, string firstname, string lastname, bool isEmployee);

    function createCustomer(
        address account,
        string memory firstname,
        string memory lastname,
        string memory email,
        string memory image,
        bool isEmployee,
        uint256 hourPrice
    ) public onlyOwner {
        customers[nextCustomerId] = CustomerStruct({
            id: nextCustomerId,
            account: account,
            firstname: firstname,
            lastname: lastname,
            email: email,
            image: image,
            isEmployee: isEmployee,
            hourPrice: hourPrice
        });

        customerIds.push(nextCustomerId);

        emit CustomerCreated(nextCustomerId, account, firstname, lastname, isEmployee);
        nextCustomerId++;
    }
    function getCustomerById(uint256 id) public view returns (CustomerStruct memory) {
        return customers[id];
    }

    function getCustomersByType(bool isEmployee) public view returns (CustomerStruct[] memory) {
        uint256 count = 0;
        for (uint256 i = 0; i < customerIds.length; i++) {
            if (customers[customerIds[i]].isEmployee == isEmployee) {
                count++;
            }
        }

        CustomerStruct[] memory result = new CustomerStruct[](count);
        uint256 index = 0;
        for (uint256 i = 0; i < customerIds.length; i++) {
            if (customers[customerIds[i]].isEmployee == isEmployee) {
                result[index] = customers[customerIds[i]];
                index++;
            }
        }

        return result;
    }
}