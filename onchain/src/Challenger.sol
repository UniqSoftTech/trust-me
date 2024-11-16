// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import { IEntropyConsumer } from "@pythnetwork/entropy-sdk-solidity/IEntropyConsumer.sol";
import { IEntropy } from "@pythnetwork/entropy-sdk-solidity/IEntropy.sol";

import { PriceFeed } from "./PriceFeed.sol";

// Pyth Entropy challenger
contract Challenger {
    IEntropy entropy;

    constructor() {
        entropy = IEntropy(0x41c9e39574F40Ad34c79f1C99B66A45eFB830d4c);
    }

    function challenge(bytes32 userRandomNumber) external {
        address entropyProvider = entropy.getDefaultProvider();

        uint64 sequenceNumber = entropy.requestWithCallback{ value: fee }(
            entropyProvider,
            userRandomNumber
        );

        // user POD
        address pod = IBitcoinPodManager(bitcoinPodManager).getUserPod(msg.sender);
    }

    function entropyCallback(
        uint64 sequenceNumber,
        address provider,
        bytes32 randomNumber
    ) internal override {
        resolve(randomNumber);
    }

    function resolve(bytes32 randomNumber) internal {
        if (randomNumber) {
            address pod = IBitcoinPodManager(bitcoinPodManager).getUserPod(msg.sender);
            uint256 price = PriceFeed(priceFeed).read();
            pod.unlock(price);
        } else {
            revert("Challenge failed");
        }
    }

    function getEntropy() internal view override returns (address) {
        return address(entropy);
    }
}
