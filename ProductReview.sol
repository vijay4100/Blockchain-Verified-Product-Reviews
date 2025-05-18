// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IToken {
    function transfer(address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

contract ProductReview {
    address public owner;
    IToken public rewardToken;
    uint256 public rewardAmount;

    struct Product {
        uint256 id;
        string name;
        mapping(address => bool) verifiedBuyers;
        bool exists;
    }

    struct Review {
        address reviewer;
        uint256 productId;
        uint8 rating; // 1–5
        string comment;
    }

    uint256 public productCount;
    mapping(uint256 => Product) public products;
    mapping(uint256 => Review[]) public productReviews;
    mapping(address => mapping(uint256 => bool)) public hasReviewed; // user => product => reviewed

    event ProductAdded(uint256 productId, string name);
    event BuyerVerified(uint256 productId, address buyer);
    event ReviewSubmitted(uint256 productId, address reviewer, uint8 rating, string comment);
    event RewardIssued(address reviewer, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    constructor(address _token, uint256 _rewardAmount) {
        owner = msg.sender;
        rewardToken = IToken(_token);
        rewardAmount = _rewardAmount;
    }

    function addProduct(string calldata _name) external onlyOwner {
        productCount++;
        Product storage p = products[productCount];
        p.id = productCount;
        p.name = _name;
        p.exists = true;
        emit ProductAdded(productCount, _name);
    }

    function verifyBuyer(uint256 _productId, address _buyer) external onlyOwner {
        require(products[_productId].exists, "Invalid product");
        products[_productId].verifiedBuyers[_buyer] = true;
        emit BuyerVerified(_productId, _buyer);
    }

    function submitReview(uint256 _productId, uint8 _rating, string calldata _comment) external {
        require(products[_productId].exists, "Product doesn't exist");
        require(products[_productId].verifiedBuyers[msg.sender], "Not a verified buyer");
        require(!hasReviewed[msg.sender][_productId], "Already reviewed");
        require(_rating >= 1 && _rating <= 5, "Rating must be 1-5");

        productReviews[_productId].push(Review(msg.sender, _productId, _rating, _comment));
        hasReviewed[msg.sender][_productId] = true;

        // Reward the reviewer
        rewardToken.transfer(msg.sender, rewardAmount);
        emit ReviewSubmitted(_productId, msg.sender, _rating, _comment);
        emit RewardIssued(msg.sender, rewardAmount);
    }

    function getReviews(uint256 _productId) external view returns (Review[] memory) {
        return productReviews[_productId];
    }
}
