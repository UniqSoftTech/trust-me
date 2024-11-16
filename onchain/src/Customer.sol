// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "@openzeppelin/token/ERC20/IERC20.sol";
import "@openzeppelin/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/security/ReentrancyGuard.sol";
import "@openzeppelin/access/Ownable.sol";

contract Customer is ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;

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
    mapping(uint256 => CustomerStruct) private customers;
    mapping(address => uint256) private accountToCustomerId;
    uint256[] private customerIds;

    event CustomerCreated(
        uint256 indexed id,
        address indexed account,
        string firstname,
        string lastname,
        bool isEmployee
    );

    /// @notice Creates a new customer.
    /// @dev Only the contract owner can call this function.
    /// @param account The wallet address of the customer.
    /// @param firstname The first name of the customer.
    /// @param lastname The last name of the customer.
    /// @param email The email of the customer.
    /// @param image A link to the customer's image.
    /// @param isEmployee Whether the customer is an employee.
    /// @param hourPrice The hourly rate for the customer.
    function createCustomer(
        address account,
        string memory firstname,
        string memory lastname,
        string memory email,
        string memory image,
        bool isEmployee,
        uint256 hourPrice
    ) external onlyOwner {
        require(account != address(0), "Account address is invalid");
        require(bytes(firstname).length > 0, "First name is required");
        require(bytes(email).length > 0, "Email is required");
        require(accountToCustomerId[account] == 0, "Account already exists");

        uint256 customerId = nextCustomerId++;
        customers[customerId] = CustomerStruct({
            id: customerId,
            account: account,
            firstname: firstname,
            lastname: lastname,
            email: email,
            image: image,
            isEmployee: isEmployee,
            hourPrice: hourPrice
        });

        accountToCustomerId[account] = customerId;
        customerIds.push(customerId);

        emit CustomerCreated(customerId, account, firstname, lastname, isEmployee);
    }

    /// @notice Retrieves customer details by ID.
    /// @param id The unique ID of the customer.
    /// @return The customer details.
    function getCustomerById(uint256 id) external view returns (CustomerStruct memory) {
        require(id < nextCustomerId, "Customer ID does not exist");
        return customers[id];
    }

    /// @notice Retrieves customers based on their type (employee or not).
    /// @param isEmployee Filter for employees or non-employees.
    /// @return An array of customers matching the type.
    function getCustomersByType(bool isEmployee) external view returns (CustomerStruct[] memory) {
        uint256 count = 0;

        // Calculate the count of matching customers
        for (uint256 i = 0; i < customerIds.length; i++) {
            if (customers[customerIds[i]].isEmployee == isEmployee) {
                count++;
            }
        }

        // Allocate memory for the result array
        CustomerStruct[] memory result = new CustomerStruct[](count);
        uint256 index = 0;

        // Populate the result array
        for (uint256 i = 0; i < customerIds.length; i++) {
            if (customers[customerIds[i]].isEmployee == isEmployee) {
                result[index++] = customers[customerIds[i]];
            }
        }

        return result;
    }

    /// @notice Retrieves customer details by account address.
    /// @param account The wallet address of the customer.
    /// @return The customer details.
    function getCustomerByAccount(address account) external view returns (CustomerStruct memory) {
        uint256 customerId = accountToCustomerId[account];
        require(customerId != 0 || customers[0].account == account, "Customer not found");
        return customers[customerId];
    }

    /// @notice Retrieves the list of all customer IDs.
    /// @return An array of all customer IDs.
    function getAllCustomerIds() external view returns (uint256[] memory) {
        return customerIds;
    }
}
