// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract MinimumPolymarket {
    struct Market {
        string question;
        bool isResolved;
        uint256 yesAmount;
        uint256 noAmount;
        mapping(address => uint256) yesPositions;
        mapping(address => uint256) noPositions;
        mapping(address => bool) hasVoted;
        bool yesVote;
    }

    uint256 public currentMarketId;
    mapping(uint256 => Market) public markets;

    event MarketCreated(uint256 marketId, string question);
    event BetPlaced(uint256 marketId, address better, bool isYes, uint256 amount);
    event MarketResolved(uint256 marketId, bool resolvedYes);

    function createMarket(string memory _question) external {
        uint256 marketId = currentMarketId++;
        Market storage market = markets[marketId];

        market.question = _question;

        emit MarketCreated(marketId, _question);
    }

    function placeBet(uint256 _marketId, bool _isYes) external payable {
        Market storage market = markets[_marketId];
        require(!market.isResolved, "Market is already resolved");
        require(msg.value > 0, "Bet amount must be positive");

        if (_isYes) {
            market.yesAmount += msg.value;
            market.yesPositions[msg.sender] += msg.value;
        } else {
            market.noAmount += msg.value;
            market.noPositions[msg.sender] += msg.value;
        }

        emit BetPlaced(_marketId, msg.sender, _isYes, msg.value);
    }

    function vote(uint256 _marketId, bool _votedYes) external {
        Market storage market = markets[_marketId];
        require(!market.isResolved, "Market already resolved");

        market.yesVote = _votedYes;
        market.isResolved = true;

        emit MarketResolved(_marketId, _votedYes);
    }

    function claimWinnings(uint256 _marketId) external {
        Market storage market = markets[_marketId];
        require(market.isResolved, "Market not resolved");

        uint256 winningAmount;

        if (market.yesVote) {
            winningAmount = market.yesPositions[msg.sender];
            market.yesPositions[msg.sender] = 0;
        } else {
            winningAmount = market.noPositions[msg.sender];
            market.noPositions[msg.sender] = 0;
        }

        require(winningAmount > 0, "No winnings to claim");

        uint256 totalPool = market.yesAmount + market.noAmount;
        uint256 payout = (winningAmount * totalPool) / (market.yesVote ? market.yesAmount : market.noAmount);

        (bool success,) = payable(msg.sender).call{value: payout}("");
        require(success, "Transfer failed");
    }
}
