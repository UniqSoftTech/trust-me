// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

// Pyth Entropy challenger
contract Challenger {
    IEntropy entropy;

    constructor() {
        entropy = IEntropy(0x41c9e39574F40Ad34c79f1C99B66A45eFB830d4c);
    }

    function challenge() external {
        entropy.requestEntropy(msg.sender);
    }

    function resolve(bytes32 entropy) external {
        entropy.verify(entropy);
    }
}
