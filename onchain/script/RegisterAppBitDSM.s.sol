// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {ReputationPod} from "../src/ReputationPod.sol";

interface IAppRegistry {
    enum AppRegistrationStatus {
        UNREGISTERED,
        REGISTERED
    }

    function registerApp(address app, bytes memory signature, bytes32 salt, uint256 expiry) external;
    function deregisterApp(address app) external;
    function isAppRegistered(address app) external view returns (bool);
    function cancelSalt(bytes32 salt) external;
    function updateAppMetadataURI(string calldata metadataURI) external;
    function calculateAppRegistrationDigestHash(address app, address appRegistry, bytes32 salt, uint256 expiry)
        external
        view
        returns (bytes32);
}

contract RegisterApp is Script {
    address internal _APP_REGISTRY;
    address internal _APP_ADDRESS;
    ReputationPod public app;

    function setUp() public {
        _APP_REGISTRY = 0x91677dD787cd9056c5805cBb74e271Fd83d88E61;
        _APP_ADDRESS = 0x5E5b22ea2aE899D2E4fD5F27155C59Bb7d05e50C;
    }

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("DEPLOYER_PRIVATE_KEY");

        address deployer = vm.addr(deployerPrivateKey);
        console.log("deployer", deployer);
        // create salt and expiry for Digest Hash
        bytes32 salt = bytes32(uint256(1));
        uint256 expiry = block.timestamp + 1 days;
        app = ReputationPod(_APP_ADDRESS);
        vm.startBroadcast(deployerPrivateKey);
        // Try to read the digest hash with try/catch
        try IAppRegistry(_APP_REGISTRY).calculateAppRegistrationDigestHash(_APP_ADDRESS, _APP_REGISTRY, salt, expiry)
        returns (bytes32 digestHash) {
            console.log("Digest Hash:", vm.toString(digestHash));

            (uint8 v, bytes32 r, bytes32 s) = vm.sign(deployerPrivateKey, digestHash);
            bytes memory signature = abi.encodePacked(r, s, v);

            IAppRegistry(_APP_REGISTRY).registerApp(_APP_ADDRESS, signature, salt, expiry);
            console.log("App registered successfully");
        } catch Error(string memory reason) {
            console.log("Failed to calculate digest:", reason);
        } catch {
            console.log("Failed to calculate digest (no reason)");
        }
        vm.stopBroadcast();
    }
}
