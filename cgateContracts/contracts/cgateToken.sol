// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/utils/math/SafeMathUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20BurnableUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract CG8 is
    Initializable,
    ERC20Upgradeable,
    ERC20BurnableUpgradeable,
    OwnableUpgradeable,
    PausableUpgradeable,
    ReentrancyGuardUpgradeable
{
    using SafeMathUpgradeable for uint256;
    using SafeERC20 for IERC20;

    address public proposedOwner;
    address[] public voters;
    mapping(address => bool) public hasVoted;

    address public _owner;
    uint256 public minTransactionAmount; // Minimum transaction amount
    uint256 public maxTransactionAmount; // Maximum transaction amount
    uint256 public transferDelay; // Transfer delay period

    uint256 public lockedLiquidityAmount; // Amount of liquidity tokens locked
    bool public liquidityLocked; // Flag to track if liquidity is locked

    bool public isDeflationary; // Deflationary state flag

    mapping(address => bool) public isExcludedFromTax;

    uint256 public burnableTax; // 0.5%
    uint256 public graduallyDecreasingTax; // 0.2%
    uint256 public buySellTaxRate; // Rate at which gradually decreasing tax decreases
    uint256 public decreasingTaxInterval; // 1 hr
    uint256 public lastUpdatedTaxTimestamp; // Timestamp of the last tax update
    bool public isBuySellTaxEnabled;
    address public usdt;

    struct Vesting {
        uint256 amount;
        address beneficiary;
        uint256 percentageOfTokensToBeReleased;
        uint256 timeInterval;
        uint256 lastWithdrawTimestamp;
        uint256 claimedTokens;
    }

    mapping(address => bool) private isBlacklisted;
    mapping(address => uint256) private _transferAllowedAt;
    mapping(address => uint256) public _frozenWallets;
    mapping(address => bool) private _whitelistedWallets;
    mapping(address => bool) public signers;
    mapping(address => Vesting) public vestingInfo;

    address public router;
    uint256 public maxSupply;

    // Tracking holders
    mapping(address => bool) private holders;
    uint256 public holdersCount;

    event OwnershipTransferProposed(address indexed newOwner);
    event VoteCasted(address indexed voter, bool approve);

    function initialize(
        string memory _name,
        string memory _symbol,
        uint8 _decimals,
        uint256 _initialSupply,
        address _router,
        address[] memory _initialVoters
    ) public initializer {
        _owner = msg.sender;
        __ERC20_init(_name, _symbol);
        __ERC20Burnable_init();
        __Ownable_init();
        __Pausable_init();
        __ReentrancyGuard_init();
        usdt = 0x0285e1D847B88056ADd3823C456eE83D37cDD60a;
        burnableTax = 50; // 0.5%
        graduallyDecreasingTax = 5000; // 0.2%
        isBuySellTaxEnabled = true;
        buySellTaxRate = 2000; // Rate at which gradually decreasing tax decreases
        decreasingTaxInterval = 300; // 5 min
        isDeflationary = true; // Deflationary state flag
        minTransactionAmount = 0; // Minimum transaction amount
        maxTransactionAmount = 100 ether;
        _mint(_owner, _initialSupply * (10**uint256(_decimals)));
        isBlacklisted[msg.sender] = false;
        _whitelistedWallets[msg.sender] = true;
        _transferAllowedAt[msg.sender] = block.timestamp;
        router = _router;
        isExcludedFromTax[address(this)] = true;
        maxSupply = 1000000000 ether;
        isExcludedFromTax[router] = true;
        for (uint256 i = 0; i < _initialVoters.length; i++) {
            voters.push(_initialVoters[i]);
        }
        // Initialize holders tracking
        if (_initialSupply > 0) {
            holders[_owner] = true;
            holdersCount = 1;
        }
    }

    modifier onlyVoter() {
        require(isVoter(msg.sender), "Not a valid voter");
        _;
    }
    modifier onlyIfNotVoted() {
        require(!hasVoted[msg.sender], "Already voted");
        _;
    }

    // Modifier to check if liquidity is locked
    modifier liquidityNotLocked() {
        require(!liquidityLocked, "Liquidity is locked");
        _;
    }

    modifier whenNotFrozen(address wallet) {
        require(
            _frozenWallets[wallet] == 0 ||
                block.timestamp > _frozenWallets[wallet],
            "Wallet is frozen"
        );
        _;
    }

    modifier checkAmount(address wallet, uint256 amount) {
        if (!_whitelistedWallets[wallet]) {
            require(amount >= minTransactionAmount, "Amount below minimum");
            require(amount <= maxTransactionAmount, "Amount exceeds maximum");
        }
        _;
    }

    function isVoter(address _addr) internal view returns (bool) {
        for (uint256 i = 0; i < voters.length; i++) {
            if (voters[i] == _addr) {
                return true;
            }
        }
        return false;
    }

    function proposeOwnershipTransfer(address newOwner) external onlyOwner {
        require(newOwner != address(0), "New owner cannot be zero address");
        proposedOwner = newOwner;
        emit OwnershipTransferProposed(newOwner);
    }

    function setIsExcludedFromTax(address wallet) external onlyOwner {
        isExcludedFromTax[wallet] = true;
    }

    function includeInTax(address wallet) external onlyOwner {
        isExcludedFromTax[wallet] = false;
    }

    function setRouter(address _newRouter) external onlyOwner {
        router = _newRouter;
        isExcludedFromTax[router] = true;
    }

    function mint(address account, uint256 amount)
        public
        onlyOwner
        nonReentrant
    {
        uint256 _totalSupply = totalSupply();
        require(
            _totalSupply + amount <= maxSupply,
            "Supply Reached Max Supply"
        );
        _mint(account, amount);
    }

    function cancelOwnershipTransfer() external onlyOwner {
        proposedOwner = address(0);
        for (uint256 i = 0; i < voters.length; i++) {
            hasVoted[voters[i]] = false;
        }
    }

    function castVote(bool approve) external onlyVoter onlyIfNotVoted {
        hasVoted[msg.sender] = approve;
        emit VoteCasted(msg.sender, approve);
    }

    function removeVoter(address _voterAddress) external onlyOwner {
        // Find the index of the voter in the voters array
        uint256 voterIndex;
        bool found = false;
        for (uint256 i = 0; i < voters.length; i++) {
            if (voters[i] == _voterAddress) {
                voterIndex = i;
                found = true;
                break;
            }
        }

        // If the voter is found, remove them from the array
        if (found) {
            voters[voterIndex] = voters[voters.length - 1];
            voters.pop();
        }
    }

    function finalizeOwnershipTransfer() external onlyOwner {
        uint256 approvalCount = 0;
        uint256 totalVoters = voters.length;

        for (uint256 i = 0; i < totalVoters; i++) {
            if (hasVoted[voters[i]]) {
                approvalCount++;
            }
        }

        // Assuming that more than half of the voters should approve
        bool approve = (approvalCount == totalVoters);

        require(approve, "Insufficient approvals");

        address previousOwner = _owner;
        address newOwner = proposedOwner;

        // Transfer ownership
        _owner = newOwner;
        super.transferOwnership(newOwner);

        // Reset voting state
        proposedOwner = address(0);
        for (uint256 i = 0; i < totalVoters; i++) {
            hasVoted[voters[i]] = false;
        }

        emit OwnershipTransferred(previousOwner, newOwner);
    }

    function blackList(address _user) external onlyOwner {
        require(!isBlacklisted[_user], "user already blacklisted");
        isBlacklisted[_user] = true;
    }

    function removeFromBlacklist(address _user) external onlyOwner {
        require(isBlacklisted[_user], "user already blacklisted");
        isBlacklisted[_user] = false;
    }

    function isBlackList(address _user) public view returns (bool) {
        return isBlacklisted[_user];
    }

    function setMinTransactionAmount(uint256 amount) external onlyOwner {
        minTransactionAmount = amount;
    }

    function setMaxTransferAmount(uint256 amount) external onlyOwner {
        maxTransactionAmount = amount;
    }

    function setTransferDelay(uint256 delay) external onlyOwner {
        transferDelay = delay;
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function addToWhitelist(address wallet) external onlyOwner {
        _whitelistedWallets[wallet] = true;
    }

    function removeFromWhitelist(address wallet) external onlyOwner {
        _whitelistedWallets[wallet] = false;
    }

    function transferAllowedAt() external view returns (uint256) {
        return _transferAllowedAt[msg.sender];
    }

    // Enable or disable deflationary mechanism
    function setDeflationary(bool _enabled) external onlyOwner {
        isDeflationary = _enabled;
    }

    function disableBuySellTax(bool _enabled) external onlyOwner {
        isBuySellTaxEnabled = _enabled;
    }

    function setBurnableTax(uint256 _burnableTax) external {
        burnableTax = _burnableTax;
    }

    function isWhitelisted(address user) public view returns (bool) {
        return _whitelistedWallets[user];
    }

    function freezeWallet(address wallet, uint256 freezeDuration)
        external
        onlyOwner
    {
        require(wallet != address(0), "Invalid wallet address");
        _frozenWallets[wallet] = block.timestamp + freezeDuration;
    }

    function unfreezeWallet(address wallet) external onlyOwner {
        _frozenWallets[wallet] = 0;
    }

    // Function to update the gradually decreasing tax rate
    function updateGraduallyDecreasingTax() public {
        uint256 timeSinceLastUpdate = block.timestamp - lastUpdatedTaxTimestamp;
        if (timeSinceLastUpdate >= decreasingTaxInterval) {
            if ((10000 - buySellTaxRate) <= 0) {
                graduallyDecreasingTax = 0;
                lastUpdatedTaxTimestamp = block.timestamp;
                return;
            }
            // Calculate the new tax rate
            buySellTaxRate =
                buySellTaxRate -
                ((graduallyDecreasingTax * buySellTaxRate) / 10000);

            lastUpdatedTaxTimestamp = block.timestamp;
        }
    }

    function setGraduallyDecreasingTaxZero() external onlyOwner {
        graduallyDecreasingTax = 0;
    }

    function setGraduallyDecreasingTax(uint256 tax) external onlyOwner {
        graduallyDecreasingTax = tax;
    }

    function setGraduallyDecreasingInterval(uint256 _decreasingTaxInterval)
        external
        onlyOwner
    {
        decreasingTaxInterval = _decreasingTaxInterval;
    }

    function setBuySellTaxRate(uint256 _rate) external onlyOwner {
        buySellTaxRate = _rate;
    }

    function setUSDTAddress(address _usdt) external onlyOwner {
        usdt = _usdt;
    }

    function transfer(
        address recipient,
        uint256 amount
    )
        public
        override
        whenNotPaused
        whenNotFrozen(msg.sender)
        checkAmount(msg.sender, amount)
        nonReentrant
        returns (bool)
    {
        require(!isBlacklisted[msg.sender], "Sender's wallet is blacklisted");
        require(
            _transferAllowedAt[msg.sender] <= block.timestamp,
            "Transfer not allowed yet"
        );
        _transferAllowedAt[msg.sender] = block.timestamp + transferDelay;

        _updateHoldersOnTransfer(msg.sender, recipient, amount);
        _transfer(msg.sender, recipient, amount); // Transfer without burning

        return true;
    }

    function transferFrom(
        address from,
        address to,
        uint256 amount
    )
        public
        override
        whenNotFrozen(from)
        checkAmount(msg.sender, amount)
        nonReentrant
        returns (bool)
    {
        require(!isBlacklisted[from], "Sender's wallet is blacklisted");
        require(
            _transferAllowedAt[msg.sender] <= block.timestamp,
            "Transfer not allowed yet"
        );
        _transferAllowedAt[msg.sender] = block.timestamp + transferDelay;

        _spendAllowance(from, msg.sender, amount);
        _updateHoldersOnTransfer(from, to, amount);
        _transfer(from, to, amount);

        return true;
    }

    // Transfer function with auto liquidity and tax
    function _transfer(
        address sender,
        address recipient,
        uint256 amount
    ) internal virtual override checkAmount(sender, amount) {
        require(!isBlacklisted[sender], "Sender's wallet is blacklisted");
        require(sender != address(0), "ERC20: transfer from the zero address");
        require(
            recipient != address(0),
            "ERC20: transfer to the zero address"
        );
        require(amount > 0, "Transfer amount must be greater than zero");

        uint256 initialAmount = amount;

        if (isExcludedFromTax[sender] || isExcludedFromTax[recipient]) {
            super._transfer(sender, recipient, amount);
            return;
        }
        if (isDeflationary) {
            uint256 burnAmount = ((initialAmount * burnableTax) / 10000); // Calculate the amount to burn
            _burn(sender, burnAmount); // Burn tokens
            amount = amount - burnAmount;
        }

        if (isBuySellTaxEnabled) {
            uint256 buySellTax = (buySellTaxRate * initialAmount) / 10000;
            super._transfer(sender, _owner, buySellTax);
            amount = amount - (buySellTaxRate * initialAmount) / 10000;
        }
        updateGraduallyDecreasingTax();

        // Transfer the remaining amount
        super._transfer(sender, recipient, amount);
    }

    function _updateHoldersOnTransfer(
        address sender,
        address recipient,
        uint256 amount
    ) internal {
        if (balanceOf(sender) == amount) {
            holders[sender] = false;
            holdersCount = holdersCount.sub(1);
        }
        if (balanceOf(recipient) == 0) {
            holders[recipient] = true;
            holdersCount = holdersCount.add(1);
        }
    }

    function _mint(address account, uint256 amount) internal override {
        super._mint(account, amount);
        if (!holders[account]) {
            holders[account] = true;
            holdersCount = holdersCount.add(1);
        }
    }

    function _burn(address account, uint256 amount) internal override {
        super._burn(account, amount);
        if (balanceOf(account) == 0) {
            holders[account] = false;
            holdersCount = holdersCount.sub(1);
        }
    }

    receive() external payable {}

    // Function to lock liquidity
    function lockLiquidity(uint256 amount) external liquidityNotLocked {
        require(amount <= balanceOf(address(this)), "Insufficient balance");

        // Transfer the liquidity tokens to the contract itself
        transfer(address(this), amount);

        lockedLiquidityAmount = lockedLiquidityAmount.add(amount);
        liquidityLocked = true;
    }

    // Function to unlock locked liquidity
    function unlockLiquidity(uint256 amount) external {
        require(liquidityLocked, "Liquidity is not locked");
        require(lockedLiquidityAmount >= amount, "Not enough locked liquidity");

        // Transfer the locked liquidity tokens back to the contract owner
        transfer(_owner, amount);

        lockedLiquidityAmount = lockedLiquidityAmount.sub(amount);
        liquidityLocked = false;
    }

    function burnFrom(address account, uint256 amount)
        public
        virtual
        override
        onlyOwner
    {
        _burn(account, amount);
    }

    // Function to add vesting for a wallet
    function addVestingSchedule(
        address beneficiary,
        uint256 amount,
        uint256 percentageToRelease,
        uint256 timeInterval
    ) external onlyOwner {
        require(
            beneficiary != address(0),
            "Beneficiary address cannot be zero"
        );
        require(
            percentageToRelease > 0 && percentageToRelease <= 10000,
            "Percentage must be between 1 and 100"
        );
        require(timeInterval > 0, "Time interval must be greater than zero");
        Vesting storage vesting = vestingInfo[beneficiary];
        vesting.amount = amount;
        vesting.beneficiary = beneficiary;
        vesting.percentageOfTokensToBeReleased = percentageToRelease;
        vesting.timeInterval = timeInterval;
        vesting.lastWithdrawTimestamp = block.timestamp;
        vesting.claimedTokens = 0;
    }

    function claim() external {
        Vesting storage vesting = vestingInfo[msg.sender];
        require(vesting.amount > 0, "No vesting schedule found for the sender");

        uint256 currentTime = block.timestamp;
        uint256 elapsedTime = currentTime - vesting.lastWithdrawTimestamp;
        uint256 totalVested = vesting.amount;

        require(
            elapsedTime >= vesting.timeInterval,
            "Tokens cannot be claimed yet"
        );

        // Calculate the tokens to release in this claim
        uint256 tokensToRelease = (totalVested *
            vesting.percentageOfTokensToBeReleased) / 10000;
        vesting.claimedTokens += tokensToRelease;
        vesting.lastWithdrawTimestamp = currentTime;

        require(
            tokensToRelease <= totalVested,
            "Tokens to claim exceed total vested tokens"
        );
        require(
            vesting.claimedTokens <= vesting.amount,
            "Not enough tokens in the vesting schedule"
        );

        // Transfer the tokens to the beneficiary
        _transfer(_owner, msg.sender, tokensToRelease);
    }

    function withdrawEth(address payable _receiver) external onlyOwner {
        require(_receiver != address(0), "Invalid address");

        _receiver.transfer(address(this).balance);
    }

    function withdrawDumpToken(address receiver, IERC20 _token)
        external
        onlyOwner
    {
        _token.transfer(receiver, _token.balanceOf(address(this)));
    }

    function transferOwnership(address newOwner) public override onlyOwner {
        revert("Please Call Finalize Transfer Ownership");
    }
}
