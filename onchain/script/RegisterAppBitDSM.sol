// // SPDX-License-Identifier: UNLICENSED
// pragma solidity ^0.8.13;

// import {Script, console} from "forge-std/Script.sol";
// import {TrustMe} from "../src/Trustme.sol";

// /**
//  * @title IAppRegistry
//  * @notice Interface for managing application registrations in the BitDSM protocol
//  * @dev Implements app registration, deregistration and status tracking functionality
//  *
//  * The IAppRegistry interface provides the following key functionality:
//  * - App registration with signature verification
//  * - App deregistration by owner
//  * - Registration status checks
//  * - Salt cancellation for security
//  * - Metadata URI updates
//  */

// interface IAppRegistry {

//     /**
//      * @notice Enum representing the registration status of an app
//      * @param UNREGISTERED App is not registered
//      * @param REGISTERED App is registered
//      */
//     enum AppRegistrationStatus { UNREGISTERED, REGISTERED }
//     /**
//      * @notice Emitted when registration status changes
//      * @param app The address of the app
//      * @param status The new registration status
//      */
//      event AppRegistrationStatusUpdated(address indexed app, AppRegistrationStatus status);

//     /**
//      * @notice Emitted when metadata URI is updated
//      * @param app The address of the app
//      * @param metadataURI The new metadata URI
//      */
//     event AppMetadataURIUpdated(address indexed app, string metadataURI);

//     /**
//      * @notice Registers a new app with signature verification
//      * @param app The address of the app to register
//      * @param signature The signature proving ownership
//      * @param salt Unique value to prevent replay attacks
//      * @param expiry Timestamp when signature expires
//      */
//     function registerApp(address app, bytes memory signature, bytes32 salt, uint256 expiry) external;
//     /**
//      * @notice Deregisters an app from the registry
//      * @param app The address of the app to deregister
//      */
//     function deregisterApp(address app) external;

//     /**
//      * @notice Checks if an app is registered
//      * @param app The address of the app to check
//      * @return bool True if registered, false otherwise
//      */
//     function isAppRegistered(address app) external view returns (bool);

//     /**
//      * @notice Cancels a salt for an app
//      * @param salt The salt to cancel
//      */

//     function cancelSalt(bytes32 salt) external;
//     /**
//      * @notice Updates the metadata URI for an app
//      * @param metadataURI The new metadata URI
//      */

//     function updateAppMetadataURI(string calldata metadataURI) external;
//     /**
//      * @notice Calculates the EIP-712 digest hash for app registration
//      * @param app The address of the app
//      * @param salt The salt value
//      * @param expiry The expiration timestamp
//      * @return bytes32 The calculated digest hash
//      */
//     function calculateAppRegistrationDigestHash(
//         address app,
//         address appRegistry,
//         bytes32 salt,
//         uint256 expiry
//     ) external view returns (bytes32);

// }

// // to deploy on local
// // forge script script/cdp/RegisterApp.s.sol:RegisterApp --rpc-url http://localhost:8545 --broadcast --private-key $DEPLOYER_PRIVATE_KEY

// // to deploy on holesky
// // forge script script/cdp/RegisterApp.s.sol:RegisterApp --fork-url https://1rpc.io/holesky --broadcast --private-key $DEPLOYER_PRIVATE_KEY
// contract RegisterApp is Script {
//     address internal _APP_REGISTRY;
//     address internal _APP_ADDRESS;
//     TrustMe public app;

//     function setUp() public {
//         // For other networks, use hardcoded addresses
//         _APP_REGISTRY = 0x91677dD787cd9056c5805cBb74e271Fd83d88E61; // replace with your registry address
//         _APP_ADDRESS = 0x58C3a95F687B9C707C4d36a57EF680D765D28d45; // replace with your CDP address
//     }

//     function run() external {
//         uint256 deployerPrivateKey = vm.envUint("DEPLOYER_PRIVATE_KEY");
//         address deployer = vm.addr(deployerPrivateKey);

//         // check if App is already registered
//         if (IAppRegistry(_APP_REGISTRY).isAppRegistered(_APP_ADDRESS)) {
//             revert("App already registered");
//         }

//         // create salt and expiry for Digest Hash
//         bytes32 salt = bytes32(uint256(1));
//         uint256 expiry = block.timestamp + 1 days;
//         app = TrustMe(_APP_ADDRESS);
//         vm.startBroadcast(deployerPrivateKey);
//         // Try to read the digest hash with try/catch
//         try IAppRegistry(_APP_REGISTRY).calculateAppRegistrationDigestHash(_APP_ADDRESS, _APP_REGISTRY, salt, expiry)
//         returns (bytes32 digestHash) {
//             console.log("Digest Hash:", vm.toString(digestHash));

//             (uint8 v, bytes32 r, bytes32 s) = vm.sign(deployerPrivateKey, digestHash);
//             bytes memory signature = abi.encodePacked(r, s, v);

//             IAppRegistry(_APP_REGISTRY).registerApp(_APP_ADDRESS, signature, salt, expiry);
//             console.log("App registered successfully");
//         } catch Error(string memory reason) {
//             console.log("Failed to calculate digest:", reason);
//         } catch {
//             console.log("Failed to calculate digest (no reason)");
//         }
//         app.updateAppMetadataURI(
//             "https://raw.githubusercontent.com/shanu516516/App-metadata/refs/heads/main/cdp_meta.json", _APP_REGISTRY
//         );
//         vm.stopBroadcast();
//     }
// }
