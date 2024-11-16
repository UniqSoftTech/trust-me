// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

interface IChronicle {
    function read() external view returns (uint256 value);
}

interface ISelfKisser {
    function selfKiss(address oracle) external;
}

contract PriceFeed {
    IChronicle public immutable chronicle;
    ISelfKisser public immutable selfKisser;

    constructor(address chronicle_, address selfKisser_) {
        chronicle = IChronicle(chronicle_);
        selfKisser = ISelfKisser(selfKisser_);
        selfKisser.selfKiss(address(chronicle));
    }

    function read() external view returns (uint256 val) {
        return chronicle.read();
    }
}