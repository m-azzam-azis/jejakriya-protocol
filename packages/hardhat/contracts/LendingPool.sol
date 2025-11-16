// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title LendingPool
 * @dev NFT-backed lending protocol for JejakKriya
 * - Borrowers get loans at 12% APY using NFTs as collateral
 * - LPs earn 10% APY
 * - Protocol earns 2% APY
 */
contract LendingPool is Ownable, ReentrancyGuard {
    IERC721 public nftContract;
    IERC20 public usdcToken;

    struct Loan {
        address borrower;
        uint256 tokenId;
        uint256 amount; // in wei (USDC decimals)
        uint256 startTime;
        uint256 duration; // in days
        uint256 interestRate; // 12% = 1200 (basis points)
        bool isActive;
        bool isRepaid;
    }

    // Loan ID counter
    uint256 public loanCounter;

    // Mapping from loan ID to Loan struct
    mapping(uint256 => Loan) public loans;

    // Mapping from tokenId to loan ID (to check if NFT is locked)
    mapping(uint256 => uint256) public tokenIdToLoanId;

    // Events
    event LoanRequested(
        uint256 indexed loanId,
        address indexed borrower,
        uint256 indexed tokenId,
        uint256 amount,
        uint256 duration
    );

    event LoanRepaid(
        uint256 indexed loanId,
        address indexed borrower,
        uint256 totalRepayment
    );

    event LoanLiquidated(
        uint256 indexed loanId,
        address indexed borrower,
        uint256 indexed tokenId
    );

    constructor(address _nftContract, address _usdcToken) Ownable(msg.sender) {
        nftContract = IERC721(_nftContract);
        usdcToken = IERC20(_usdcToken);
        loanCounter = 0;
    }

    /**
     * @dev Request a loan using NFT as collateral
     * @param tokenId The NFT token ID to use as collateral
     * @param amount The amount to borrow (in wei/USDC)
     * @param duration The loan duration in days
     */
    function requestLoan(
        uint256 tokenId,
        uint256 amount,
        uint256 duration
    ) external nonReentrant returns (uint256) {
        require(amount > 0, "Amount must be greater than 0");
        require(duration > 0, "Duration must be greater than 0");
        require(
            nftContract.ownerOf(tokenId) == msg.sender,
            "You don't own this NFT"
        );
        require(
            !isNFTLocked(tokenId),
            "NFT is already locked in another loan"
        );

        // Transfer NFT to contract as collateral
        nftContract.transferFrom(msg.sender, address(this), tokenId);

        // Create loan
        loanCounter++;
        uint256 loanId = loanCounter;

        loans[loanId] = Loan({
            borrower: msg.sender,
            tokenId: tokenId,
            amount: amount,
            startTime: block.timestamp,
            duration: duration,
            interestRate: 1200, // 12% APY in basis points
            isActive: true,
            isRepaid: false
        });

        tokenIdToLoanId[tokenId] = loanId;

        emit LoanRequested(loanId, msg.sender, tokenId, amount, duration);

        // Transfer USDC to borrower
        require(usdcToken.balanceOf(address(this)) >= amount, "Insufficient pool liquidity");
        require(usdcToken.transfer(msg.sender, amount), "USDC transfer failed");

        return loanId;
    }

    /**
     * @dev Repay a loan and get NFT back
     * @param loanId The loan ID to repay
     */
    function repayLoan(uint256 loanId) external nonReentrant {
        Loan storage loan = loans[loanId];

        require(loan.isActive, "Loan is not active");
        require(loan.borrower == msg.sender, "You are not the borrower");
        require(!loan.isRepaid, "Loan already repaid");

        uint256 totalRepayment = calculateTotalRepayment(loanId);

        // Transfer USDC from borrower to pool
        require(usdcToken.balanceOf(msg.sender) >= totalRepayment, "Insufficient USDC balance");
        require(usdcToken.transferFrom(msg.sender, address(this), totalRepayment), "USDC transfer failed");

        // Mark loan as repaid
        loan.isRepaid = true;
        loan.isActive = false;

        // Unlock NFT
        delete tokenIdToLoanId[loan.tokenId];

        // Return NFT to borrower
        nftContract.transferFrom(address(this), msg.sender, loan.tokenId);

        emit LoanRepaid(loanId, msg.sender, totalRepayment);
    }

    /**
     * @dev Liquidate a defaulted loan
     * @param loanId The loan ID to liquidate
     */
    function liquidateLoan(uint256 loanId) external onlyOwner nonReentrant {
        Loan storage loan = loans[loanId];

        require(loan.isActive, "Loan is not active");
        require(!loan.isRepaid, "Loan already repaid");

        uint256 deadline = loan.startTime + (loan.duration * 1 days);
        require(block.timestamp > deadline, "Loan has not expired yet");

        // Mark loan as liquidated
        loan.isActive = false;

        // Unlock NFT
        delete tokenIdToLoanId[loan.tokenId];

        // Transfer NFT to protocol (or auction it)
        // For now, keeping it in contract

        emit LoanLiquidated(loanId, loan.borrower, loan.tokenId);
    }

    /**
     * @dev Check if an NFT is locked in an active loan
     * @param tokenId The NFT token ID to check
     */
    function isNFTLocked(uint256 tokenId) public view returns (bool) {
        uint256 loanId = tokenIdToLoanId[tokenId];
        if (loanId == 0) return false;

        Loan memory loan = loans[loanId];
        return loan.isActive && !loan.isRepaid;
    }

    /**
     * @dev Calculate total repayment amount (principal + interest)
     * @param loanId The loan ID
     */
    function calculateTotalRepayment(uint256 loanId)
        public
        view
        returns (uint256)
    {
        Loan memory loan = loans[loanId];
        require(loan.amount > 0, "Loan does not exist");

        // Calculate interest: amount * rate * days / (365 * 10000)
        // rate is in basis points (1200 = 12%)
        uint256 interest = (loan.amount *
            loan.interestRate *
            loan.duration) / (365 * 10000);

        return loan.amount + interest;
    }

    /**
     * @dev Calculate interest breakdown (LP share and protocol fee)
     * @param loanId The loan ID
     */
    function calculateInterestBreakdown(uint256 loanId)
        public
        view
        returns (uint256 totalInterest, uint256 lpShare, uint256 protocolFee)
    {
        Loan memory loan = loans[loanId];
        require(loan.amount > 0, "Loan does not exist");

        // Calculate total interest
        totalInterest =
            (loan.amount * loan.interestRate * loan.duration) /
            (365 * 10000);

        // LP gets 10% APY out of 12% = 10/12 = 83.33%
        lpShare = (totalInterest * 10) / 12;

        // Protocol gets 2% APY out of 12% = 2/12 = 16.67%
        protocolFee = totalInterest - lpShare;

        return (totalInterest, lpShare, protocolFee);
    }

    /**
     * @dev Get loan details
     * @param loanId The loan ID
     */
    function getLoan(uint256 loanId)
        external
        view
        returns (
            address borrower,
            uint256 tokenId,
            uint256 amount,
            uint256 startTime,
            uint256 duration,
            uint256 interestRate,
            bool isActive,
            bool isRepaid
        )
    {
        Loan memory loan = loans[loanId];
        return (
            loan.borrower,
            loan.tokenId,
            loan.amount,
            loan.startTime,
            loan.duration,
            loan.interestRate,
            loan.isActive,
            loan.isRepaid
        );
    }

    /**
     * @dev Get loan ID by NFT token ID
     * @param tokenId The NFT token ID
     */
    function getLoanIdByTokenId(uint256 tokenId)
        external
        view
        returns (uint256)
    {
        return tokenIdToLoanId[tokenId];
    }
}
