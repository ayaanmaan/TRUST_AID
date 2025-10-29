// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "hardhat/console.sol";

contract ReliefFund {
    // --- State Variables ---

    struct Milestone {
        uint payoutAmount;
        string proofUrl; // URL to the proof of work
        bool isPaid;
        mapping(address => bool) hasVoted;
        uint voteCount;
    }

    address public immutable recipient;
    address[] public oracleCommittee;
    mapping(address => bool) public isOracle;
    uint public immutable requiredVotes;

    Milestone[] public milestones;

    // --- Events ---

    event Donated(address indexed donor, uint amount);
    // NEW Event
    event MilestoneAdded(uint indexed milestoneIndex, uint amount);
    event MilestoneRequested(uint indexed milestoneIndex, string proofUrl);
    event MilestoneApproved(uint indexed milestoneIndex, address indexed oracle);
    event MilestonePaid(uint indexed milestoneIndex, uint amount);

    // --- Constructor ---

    constructor(
        address _recipient,
        address[] memory _oracles,
        uint _requiredVotes
    ) {
        // REMOVED: _payoutAmounts
        require(_oracles.length > 0, "No oracles provided");
        require(_requiredVotes > 0 && _requiredVotes <= _oracles.length, "Invalid required votes");

        recipient = _recipient;
        requiredVotes = _requiredVotes;

        for (uint i = 0; i < _oracles.length; i++) {
            address oracle = _oracles[i];
            require(oracle != address(0), "Invalid oracle address");
            require(!isOracle[oracle], "Duplicate oracle");
            isOracle[oracle] = true;
            oracleCommittee.push(oracle);
        }

        // REMOVED: Milestone creation loop
    }

    // --- Functions ---

    /**
     * @dev Allows anyone to donate to the fund.
     */
    function donate() public payable {
        emit Donated(msg.sender, msg.value);
    }

    // --- NEW FUNCTION ---
    /**
     * @dev Allows the RECIPIENT to add a new milestone to the fund.
     */
    function addMilestone(uint _payoutAmount) public {
        require(msg.sender == recipient, "Only recipient can add");
        require(_payoutAmount > 0, "Payout must be greater than 0");

        milestones.push();
        Milestone storage newMilestone = milestones[milestones.length - 1];
        newMilestone.payoutAmount = _payoutAmount;

        emit MilestoneAdded(milestones.length - 1, _payoutAmount);
    }

    /**
     * @dev Allows the recipient to request payment for a milestone.
     */
    function requestMilestone(uint _milestoneIndex, string memory _proofUrl) public {
        require(msg.sender == recipient, "Only recipient can request");
        require(_milestoneIndex < milestones.length, "Invalid milestone");
        Milestone storage milestone = milestones[_milestoneIndex];
        require(!milestone.isPaid, "Milestone already paid");
        require(bytes(milestone.proofUrl).length == 0, "Request already submitted"); // Can only submit once

        milestone.proofUrl = _proofUrl;
        emit MilestoneRequested(_milestoneIndex, _proofUrl);
    }

    /**
     * @dev Allows oracle committee members to approve a milestone.
     */
    function approveMilestone(uint _milestoneIndex) public {
        require(isOracle[msg.sender], "Not an oracle");
        require(_milestoneIndex < milestones.length, "Invalid milestone");
        Milestone storage milestone = milestones[_milestoneIndex];
        require(!milestone.isPaid, "Milestone already paid");
        require(bytes(milestone.proofUrl).length > 0, "Request not submitted yet");
        require(!milestone.hasVoted[msg.sender], "Already voted");

        milestone.hasVoted[msg.sender] = true;
        milestone.voteCount++;
        emit MilestoneApproved(_milestoneIndex, msg.sender);

        // If threshold reached, pay the recipient
        if (milestone.voteCount >= requiredVotes) {
            milestone.isPaid = true;
            uint amount = milestone.payoutAmount;
            (bool success, ) = recipient.call{value: amount}("");
            require(success, "Transfer failed");
            emit MilestonePaid(_milestoneIndex, amount);
        }
    }

    /**
     * @dev Helper view function for oracles to check if they voted.
     */
    function getMilestoneVotedStatus(uint _milestoneIndex, address _oracle) public view returns (bool) {
        require(_milestoneIndex < milestones.length, "Invalid milestone");
        return milestones[_milestoneIndex].hasVoted[_oracle];
    }

    /**
     * @dev Helper view function to get the contract's balance.
     */
    function getBalance() public view returns (uint) {
        return address(this).balance;
    }

    /**
     * @dev Helper view function for the frontend to get total milestone count.
     */
    function getMilestoneCount() public view returns (uint) {
        return milestones.length;
    }
}
