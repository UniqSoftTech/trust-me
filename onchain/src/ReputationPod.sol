// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

abstract contract Ownable {
    address private _owner;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    constructor() {
        _transferOwnership(msg.sender);
    }

    modifier onlyOwner() {
        _checkOwner();
        _;
    }

    function owner() public view virtual returns (address) {
        return _owner;
    }

    function _checkOwner() internal view virtual {
        require(owner() == msg.sender, "Ownable: caller is not the owner");
    }

    function renounceOwnership() public virtual onlyOwner {
        _transferOwnership(address(0));
    }

    function transferOwnership(address newOwner) public virtual onlyOwner {
        require(newOwner != address(0), "Ownable: new owner is the zero address");
        _transferOwnership(newOwner);
    }

    function _transferOwnership(address newOwner) internal virtual {
        address oldOwner = _owner;
        _owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }
}

interface IAppRegistry {
    enum AppRegistrationStatus {
        UNREGISTERED,
        REGISTERED
    }

    function registerApp(address app, bytes memory signature, bytes32 salt, uint256 expiry) external;
    function deregisterApp(address app) external;
    function isAppRegistered(address app) external view returns (bool);
    function updateAppMetadataURI(string calldata metadataURI) external;
    function calculateAppRegistrationDigestHash(address app, address appRegistry, bytes32 salt, uint256 expiry)
        external
        view
        returns (bytes32);
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
    function getBitcoinWithdrawalAddress(address pod) external view returns (bytes memory);
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
    function withdrawBitcoinCompleteTxRequest(
        address pod,
        bytes memory preSignedWithdrawTransaction,
        bytes memory withdrawAddress
    ) external;
    function withdrawBitcoinAsTokens(address pod) external;
    function setSignedBitcoinWithdrawTransactionPod(address pod, bytes memory signedBitcoinWithdrawTransaction)
        external;
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

contract ReputationPod is Ownable {
    // Add magic value constants for EIP-1271
    bytes4 internal constant _MAGICVALUE = 0x1626ba7e;
    bytes4 internal constant _INVALID_SIGNATURE = 0xffffffff;

    IBitcoinPodManager public bitcoinPodManager;
    IAppRegistry public appRegistry;

    struct Lock {
        uint256 amount;
        uint256 timestamp;
    }

    mapping(address => Lock) public locks;

    event Locked(address indexed user, uint256 amount);
    event Unlocked(address indexed user, uint256 amount);

    constructor() {
        bitcoinPodManager = IBitcoinPodManager(0x96EAE70bC21925DdE05602c87c4483579205B1F6);
        appRegistry = IAppRegistry(0x91677dD787cd9056c5805cBb74e271Fd83d88E61);
    }

    function lock() external {
        // get the pod
        IBitcoinPod bitcoinPod = IBitcoinPod(IBitcoinPodManager(bitcoinPodManager).getUserPod(msg.sender));
        // check whether the pod is delegated to this contract
        require(bitcoinPodManager.getPodApp(address(bitcoinPod)) == address(this), "Pod not delegated to CDP App");
        uint256 collateralAmount = IBitcoinPod(bitcoinPod).getBitcoinBalance();
        address pod = IBitcoinPodManager(bitcoinPodManager).getUserPod(msg.sender);
        bitcoinPodManager.lockPod(pod);

        locks[msg.sender] = Lock({amount: collateralAmount, timestamp: block.timestamp});
        emit Locked(msg.sender, collateralAmount);
    }

    function unlock() external onlyOwner {
        address pod = IBitcoinPodManager(bitcoinPodManager).getUserPod(msg.sender);
        bitcoinPodManager.unlockPod(pod);
        emit Unlocked(msg.sender, locks[msg.sender].amount);
        delete locks[msg.sender];
    }

    function getLockInfo() external view returns (uint256 amount, uint256 timestamp) {
        Lock memory userLock = locks[msg.sender];

        return (userLock.amount, userLock.timestamp);
    }

    function isValidSignature(bytes32 hash, bytes memory signature) external view returns (bytes4 magicValue) {
        return _MAGICVALUE;
    }

    function updateAppMetadataURI(string calldata metadataURI) external {
        IAppRegistry(appRegistry).updateAppMetadataURI(metadataURI);
    }
}
