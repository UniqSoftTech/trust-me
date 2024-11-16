// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface IERC20 {
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address to, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) external returns (bool);
}

interface IAppRegistry {
     
    /**
     * @notice Enum representing the registration status of an app
     * @param UNREGISTERED App is not registered
     * @param REGISTERED App is registered
     */
    enum AppRegistrationStatus { UNREGISTERED, REGISTERED }
    /**
     * @notice Emitted when registration status changes
     * @param app The address of the app
     * @param status The new registration status
     */
     event AppRegistrationStatusUpdated(address indexed app, AppRegistrationStatus status);
    
    /**
     * @notice Emitted when metadata URI is updated
     * @param app The address of the app
     * @param metadataURI The new metadata URI
     */
    event AppMetadataURIUpdated(address indexed app, string metadataURI);

    /**
     * @notice Registers a new app with signature verification
     * @param app The address of the app to register
     * @param signature The signature proving ownership
     * @param salt Unique value to prevent replay attacks
     * @param expiry Timestamp when signature expires
     */
    function registerApp(address app, bytes memory signature, bytes32 salt, uint256 expiry) external;
    /**
     * @notice Deregisters an app from the registry
     * @param app The address of the app to deregister
     */
    function deregisterApp(address app) external;
    
    /**
     * @notice Checks if an app is registered
     * @param app The address of the app to check
     * @return bool True if registered, false otherwise
     */
    function isAppRegistered(address app) external view returns (bool);
    
    /**
     * @notice Cancels a salt for an app
     * @param salt The salt to cancel
     */
    
    function cancelSalt(bytes32 salt) external;
    /**
     * @notice Updates the metadata URI for an app
     * @param metadataURI The new metadata URI
     */
    
    function updateAppMetadataURI(string calldata metadataURI) external;
    /**
     * @notice Calculates the EIP-712 digest hash for app registration
     * @param app The address of the app
     * @param salt The salt value
     * @param expiry The expiration timestamp
     * @return bytes32 The calculated digest hash
     */
    function calculateAppRegistrationDigestHash(
        address app,
        address appRegistry,
        bytes32 salt,
        uint256 expiry
    ) external view returns (bytes32);

   
}

interface IBitcoinPodManager {
    struct BitcoinDepositRequest {
        bytes32 transactionId;
        uint256 amount;
        bool isPending;
    }
    function getUserPod(address user) external view returns (address);
    function getPodApp(address pod) external view returns (address);
    function getBitcoinDepositRequest(address pod) external view returns (BitcoinDepositRequest memory);
    function getBitcoinWithdrawalAddress(address pod) external view returns (bytes memory );
    function getTotalTVL() external view returns (uint256);
    function getBitDSMServiceManager() external view returns (address);
    function getAppRegistry() external view returns (address);
    function getBitDSMRegistry() external view returns (address);
    function createPod(address operator, bytes memory btcAddress) external returns (address);
    function delegatePod(address pod, address appContract) external;
    function undelegatePod(address pod) external;
    function lockPod(address pod) external;
    function unlockPod(address pod) external;
    function verifyBitcoinDepositRequest(address pod, bytes32 transactionId, uint256 amount) external;
    function confirmBitcoinDeposit(address pod, bytes32 transactionId, uint256 amount) external;
    function withdrawBitcoinPSBTRequest(address pod, bytes memory withdrawAddress) external;
    function withdrawBitcoinCompleteTxRequest(address pod, bytes memory preSignedWithdrawTransaction, bytes memory withdrawAddress) external;
    function withdrawBitcoinAsTokens(address pod) external;
    function setSignedBitcoinWithdrawTransactionPod(address pod, bytes memory signedBitcoinWithdrawTransaction) external;
}

interface IBitcoinPod {
    function getBitcoinAddress() external view returns (bytes memory);
    function getOperatorBtcPubKey() external view returns (bytes memory);
    function getOperator() external view returns (address);
    function getBitcoinBalance() external view returns (uint256);
    function getSignedBitcoinWithdrawTransaction() external view returns (bytes memory);
    function setSignedBitcoinWithdrawTransaction(bytes memory _signedBitcoinWithdrawTransaction) external;
    function lock() external;
    function unlock() external;
    function isLocked() external view returns (bool);
    function mint(address operator, uint256 amount) external;
    function burn(address operator, uint256 amount) external;
}


contract BitDSMStake is Ownable {
    // Add magic value constants for EIP-1271
    bytes4 internal constant _MAGICVALUE = 0x1626ba7e;
    bytes4 internal constant _INVALID_SIGNATURE = 0xffffffff;

    IERC20 public stakingToken;
    IBitcoinPodManager public bitcoinPodManager;
    IAppRegistry public appRegistry;
    
    struct Stake {
        uint256 amount;
        uint256 timestamp;
    }
    
    mapping(address => Stake) public stakes;
    
    event Staked(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    
    constructor(address _stakingToken) Ownable(msg.sender) {
        stakingToken = IERC20(_stakingToken);
        bitcoinPodManager = IBitcoinPodManager(0x96EAE70bC21925DdE05602c87c4483579205B1F6);
        appRegistry = IAppRegistry(0x91677dD787cd9056c5805cBb74e271Fd83d88E61);
    }
    
    function stake() external {
        // get the pod
        IBitcoinPod bitcoinPod = IBitcoinPod(
            IBitcoinPodManager(bitcoinPodManager).getUserPod(msg.sender)
        );
        // check whether the pod is delegated to this contract
        require(
            bitcoinPodManager.getPodApp(address(bitcoinPod)) == address(this),
            "Pod not delegated to CDP App"
        );
        uint256 collateralAmount = IBitcoinPod(bitcoinPod).getBitcoinBalance();
        address pod = IBitcoinPodManager(bitcoinPodManager).getUserPod(msg.sender);
        bitcoinPodManager.lockPod(pod);
        //stableToken.mint(address(this), _amount);
    }
    
    function withdraw(uint256 _amount) external {
        require(_amount > 0, "Cannot withdraw 0");
        require(stakes[msg.sender].amount >= _amount, "Insufficient stake");
        
        stakes[msg.sender].amount -= _amount;
        require(stakingToken.transfer(msg.sender, _amount), "Transfer failed");
        
        emit Withdrawn(msg.sender, _amount);
    }
    
    function getStakeInfo(address _user) external view returns (uint256 amount, uint256 timestamp) {
        Stake memory userStake = stakes[_user];
        return (userStake.amount, userStake.timestamp);
    }

    function isValidSignature(
        bytes32 _hash,
        bytes memory _signature
    ) external view returns (bytes4) {
        // Recover the signer from the signature
        address signer = ECDSA.recover(_hash, _signature);
        // Check if the signer is the owner
        if (signer == owner()) {
            return _MAGICVALUE;
        }
        return _INVALID_SIGNATURE;
    }

    function updateAppMetadataURI(
        string calldata metadataURI,
        address appRegistry
    ) external {
        IAppRegistry(appRegistry).updateAppMetadataURI(metadataURI);
    }
}
