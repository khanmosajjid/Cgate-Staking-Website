// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

interface IPancakeRouter {
    function getAmountIn(uint256 amountOut, uint256 reserveIn, uint256 reserveOut) external view returns (uint256 amountIn);
}
interface IPancakeFactory {
    function getPair(address tokenA,address tokenB) external view returns (address pairContract);
}
interface IPancakePairContract {
    function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast);
}

contract StakingPoolV3 is Initializable,ReentrancyGuardUpgradeable {
     using SafeERC20 for IERC20;
    address public admin;
    uint256 private poolIdCounter;
    uint256 oneYear;
    uint256 price;

    address public proposedOwner;
    address[] public voters;
    mapping(address => bool) public hasVoted;



    address public  PANCAKE_ROUTER_ADDRESS ;
    address public  CG8_TOKEN_ADDRESS ;
    address public  USDC_TOKEN_ADDRESS;
    address public  PANCAKE_FACTORY_ADDRESS;
    struct Pool {
        uint256 timePeriod;
        address stakeToken;
        address rewardToken;
        uint256 rewardPercentPerStakedTokenPerYear;
        uint256 referralRewardPercent; // in BIPS i.e for 10% - 1000
        bool isActive;
        uint256 totalStakes;
    }

    struct UserInfo {
        uint256 totalStaked;
        uint256 activeStakes;
        uint256 totalRewardWithdrawnTillNow;
        uint256 referralIncomeWithdrawnTillNow;
        uint256 totalReferrers;
    }

    struct UserStake {
        uint256 amount;
        uint256 lastWithdrawTimestamp;
        uint256 rewardWithdrawnTillNow;
        uint256 stakeTime;
        address referrer;
        uint256 depositedValueInDollars;
    }

    mapping(uint256 => Pool) public pools;
    mapping(address => mapping(uint256 => UserStake[])) public userStakes;
    mapping(address => address) public referrers;
    mapping(address => uint256) public specialReferrersPercents;
    mapping(address => UserInfo) public users;
    mapping(address => mapping(uint256 => uint256)) public usersStakesPerPool;
    mapping(address => bool) public signers;

     event OwnershipTransferProposed(address indexed newOwner);
    event VoteCasted(address indexed voter, bool approve);

    function initialize(address[] memory _initialVoters) public initializer {
         __ReentrancyGuard_init();
        admin = msg.sender;
        oneYear=365 days;
        price=1000000000000;
        PANCAKE_ROUTER_ADDRESS = 0x9Ac64Cc6e4415144C455BD8E4837Fea55603e5c3;
        CG8_TOKEN_ADDRESS = 0x9f7b09eb38ed912aB5932dCcAD0b1F501aBFE6Fd;
        USDC_TOKEN_ADDRESS = 0xd1Fac5Ff5d03b70D3383909692d09Fc6d97c8219;
        PANCAKE_FACTORY_ADDRESS = 0xB7926C0430Afb07AA7DEfDE6DA862aE0Bde767bc;
         for (uint256 i = 0; i < _initialVoters.length; i++) {
            voters.push(_initialVoters[i]);
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
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can call this function");
        _;
    }

    modifier isValidPool(uint256 poolId) {
        require(poolId >= 0 && poolId < poolIdCounter, "Invalid Pool");
        _;
    }

    modifier isActivePool(uint256 poolId) {
        require(pools[poolId].isActive, "Pool Is Not Active");
        _;
    }
   

    // Function to get the pair contract address
    event Error(string message);


 function isVoter(address _addr) internal view returns (bool) {
        for (uint256 i = 0; i < voters.length; i++) {
            if (voters[i] == _addr) {
                return true;
            }
        }
        return false;
    }

     function proposeOwnershipTransfer(
        address newOwner
    ) external onlyAdmin {
        require(newOwner != address(0), "New owner cannot be zero address");
        proposedOwner = newOwner;
        emit OwnershipTransferProposed(newOwner);
    }

   

   

   
     function cancelOwnershipTransfer() onlyAdmin external{
        proposedOwner=address(0);
        for (uint256 i = 0; i < voters.length;i++) {
            hasVoted[voters[i]] = false;
        }
    }
     function castVote(
        bool approve
    ) external onlyVoter onlyIfNotVoted  {
        hasVoted[msg.sender] = true;
        emit VoteCasted(msg.sender, approve);
    }

 function finalizeOwnershipTransfer()
        external
        onlyAdmin
        
    {
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

        
        address newOwner = proposedOwner;

       
       admin=newOwner;
   

        // Reset voting state
        proposedOwner = address(0);
        for (uint256 i = 0; i < totalVoters; i++) {
            hasVoted[voters[i]] = false;
        }

        
    }
    // Function to get the pair contract address
    function getPair(address tokenA, address tokenB) public view returns (address) {
        address pair = IPancakeFactory(PANCAKE_FACTORY_ADDRESS).getPair(tokenA, tokenB);
        return pair;
    }

    // Function to get the reserves from the pair contract
    function getReserves(address pair) public view returns (uint112 reserve0, uint112 reserve1) {
        (uint112 reserveA, uint112 reserveB, ) = IPancakePairContract(pair).getReserves();
        return (reserveA, reserveB);
    }

    // Function to convert amount to Wei (if necessary)
    function convertToWei(uint256 amount) internal pure returns (uint256) {
        return amount * 1 ether; // Assuming 1 token = 1 ether, adjust accordingly
    }

    // Function to convert amount to Ether
    function convertToEther(uint256 amount) internal pure returns (uint256) {
        return amount / 1 ether; // Assuming 1 token = 1 ether, adjust accordingly
    }

 function getCurrentCgatePrice() public view returns (uint256) {
        address pair = getPair(CG8_TOKEN_ADDRESS,USDC_TOKEN_ADDRESS);
        if (pair == address(0)) {
           
            return 0;
        }
        (uint112 reserveA, uint112 reserveB) = getReserves(pair);
        uint256 _price = IPancakeRouter(PANCAKE_ROUTER_ADDRESS).getAmountIn(1e18,reserveB, reserveA);
      
        return _price;
    }

    function getTotalPoolsCount() external view returns (uint256) {
        return poolIdCounter;
    }

    function getPendingReward(
        uint256 poolId,
        uint256 stakeId,
        address user
    ) public view isValidPool(poolId) isActivePool(poolId) returns (uint256) {
        require(userStakes[user][poolId].length > stakeId, "User Not Staked");
        UserStake storage userStake = userStakes[user][poolId][stakeId];
        Pool storage pool = pools[poolId];
        uint256 currentTime = block.timestamp;
       
        // if (currentTime < userStake.stakeTime + pool.timePeriod) {
        //         return 0;
        // }
        uint256 stakedTime = currentTime - userStake.lastWithdrawTimestamp;
        uint256 reward = ((userStake.depositedValueInDollars * stakedTime) *
            pool.rewardPercentPerStakedTokenPerYear)/
            10000 /
            oneYear;
        return reward;
    }

    function createStakingPool(
        uint256 _timePeriod,
        address _stakeToken,
        address _rewardToken,
        uint256 _rewardPercent,
        uint256 _referralRewardPercent
    ) external onlyAdmin nonReentrant {
        pools[poolIdCounter] = Pool(
            _timePeriod,
            _stakeToken,
            _rewardToken,
            _rewardPercent,
            _referralRewardPercent,
            true,
            0
        );
        poolIdCounter++;
    }

    function stake(
        uint256 poolId,
        uint256 _amount,
        address referrer
    ) external isValidPool(poolId) isActivePool(poolId) {
        require(_amount > 0, "Amount must be greater than 0");
        require(msg.sender != referrer, "You can't refer yourself");
        Pool storage pool = pools[poolId];

        // Transfer tokens from the user to this contract for staking
        require(
            IERC20(pool.stakeToken).transferFrom(
                msg.sender,
                address(this),
                _amount
            ),
            "Token transfer failed"
        );

        userStakes[msg.sender][poolId].push(
            UserStake({
                amount: _amount,
                lastWithdrawTimestamp: block.timestamp,
                rewardWithdrawnTillNow: 0,
                stakeTime: block.timestamp,
                referrer: referrer,
                depositedValueInDollars:_amount*getCurrentCgatePrice()/1e18
            })
        );

        pools[poolId].totalStakes += _amount;

        users[msg.sender] = UserInfo({
            totalStaked: users[msg.sender].totalStaked + _amount,
            activeStakes: users[msg.sender].activeStakes + _amount,
            totalRewardWithdrawnTillNow: users[msg.sender]
                .totalRewardWithdrawnTillNow,
            referralIncomeWithdrawnTillNow: users[msg.sender]
                .referralIncomeWithdrawnTillNow,
            totalReferrers: 0
        });
        usersStakesPerPool[msg.sender][poolId] += _amount;
        users[referrer].totalReferrers += 1;
    }

   

    function updateCurrentCgatePrice(uint256 newPrice) public onlyAdmin {
        price=newPrice;
    }

    function unStakeIndividual(
        uint256 poolId,
        uint256 _stakeId
    ) external isValidPool(poolId) isActivePool(poolId) {
        
        UserStake storage userStake = userStakes[msg.sender][poolId][_stakeId];
        Pool storage pool = pools[poolId];

        require(userStake.amount >= 0, "Insufficient staked amount");

        uint256 currentTime = block.timestamp;
        require(
            currentTime >= userStake.stakeTime + pool.timePeriod,
            "Time period not passed"
        );

        claimIndividualReward(poolId, _stakeId);
        
        // Update the lastWithdrawTimestamp
        userStake.lastWithdrawTimestamp = currentTime;

        // Transfer the staked tokens back to the user
        require(
            IERC20(pool.stakeToken).transfer(msg.sender, userStake.amount),
            "Staked token transfer failed"
        );
        users[msg.sender].activeStakes -= userStake.amount;
        usersStakesPerPool[msg.sender][poolId]-=userStake.amount;
        pools[poolId].totalStakes-= userStake.amount;
        // Reduce the staked amount
        userStake.amount = 0;
         userStake.depositedValueInDollars = 0;

        // delete userStakes[msg.sender][poolId][_stakeId];
        
    }

    function unStake(
        uint256 poolId
    ) external isValidPool(poolId) isActivePool(poolId) {
        uint256 totalAmount = 0;
        Pool storage pool = pools[poolId];
        for (
            uint256 stakeId = 0;
            stakeId < userStakes[msg.sender][poolId].length;
            stakeId++
        ) {
            UserStake storage userStake = userStakes[msg.sender][poolId][
                stakeId
            ];
            
            
            uint256 currentTime = block.timestamp;
            if (currentTime >= userStake.stakeTime + pool.timePeriod) {
                totalAmount+=userStake.amount;
                claimIndividualReward(poolId, stakeId);
                userStake.amount = 0;

                // Update the lastWithdrawTimestamp
                userStake.lastWithdrawTimestamp = currentTime;

                // If the staked amount becomes zero, delete record
                if (userStake.amount == 0) {
                    delete userStakes[msg.sender][poolId][stakeId];
                }
            }
        }
        users[msg.sender].activeStakes -= totalAmount;
        usersStakesPerPool[msg.sender][poolId] -= totalAmount;
        if(totalAmount>0)
            {require(
                IERC20(pool.stakeToken).transfer(msg.sender, totalAmount),
                "Staked token transfer failed"
            );}
    }

    function claimIndividualReward(
        uint256 poolId,
        uint256 stakeId
    ) public isValidPool(poolId) isActivePool(poolId) returns (uint256) {
        UserStake storage userStake = userStakes[msg.sender][poolId][stakeId];
        Pool storage pool = pools[poolId];
        if(userStake.amount==0){
            return 0;
        }
        uint256 currentTime = block.timestamp;
        uint256 reward = getPendingReward(poolId, stakeId, msg.sender);
        if (reward > 0) {
            require(
                IERC20(pool.rewardToken).transfer(msg.sender, reward),
                "Reward transfer failed"
            );

            if (userStake.referrer != address(0)) {
                uint256 refRewardPercent = pool.referralRewardPercent;
                if (specialReferrersPercents[userStake.referrer] > 0) {
                    refRewardPercent = specialReferrersPercents[
                        userStake.referrer
                    ];
                }
                if ((reward * refRewardPercent) / 10000 > 0) {
                    require(
                        IERC20(pool.rewardToken).transfer(
                            userStake.referrer,
                            (reward * refRewardPercent) / 10000
                        ),
                        "Referral Reward transfer failed"
                    );
                }

                users[userStake.referrer].referralIncomeWithdrawnTillNow +=
                    (reward * refRewardPercent) /
                    10000;
            }
            users[msg.sender].totalRewardWithdrawnTillNow += reward;

            userStake.rewardWithdrawnTillNow += reward;
            userStake.lastWithdrawTimestamp = currentTime;
            return reward;
        }
    }

    function claimReward(
        uint256 poolId
    ) public isValidPool(poolId) nonReentrant isActivePool(poolId) {
        Pool storage pool = pools[poolId];
        uint256 totalReward = 0;
        for (
            uint256 stakeId = 0;
            stakeId < userStakes[msg.sender][poolId].length;
            stakeId++
        ) {
            UserStake storage userStake = userStakes[msg.sender][poolId][
                stakeId
            ];

            if (userStake.amount > 0) {
                uint256 currentTime = block.timestamp;
                uint256 reward = getPendingReward(poolId, stakeId, msg.sender);

                if (userStake.referrer != address(0)) {
                    uint256 refRewardPercent = pool.referralRewardPercent;
                    if (specialReferrersPercents[userStake.referrer] > 0) {
                        refRewardPercent = specialReferrersPercents[
                            userStake.referrer
                        ];
                    }
                    if ((reward * refRewardPercent) / 10000 > 0) {
                        require(
                            IERC20(pool.rewardToken).transfer(
                                userStake.referrer,
                                (reward * refRewardPercent) / 10000
                            ),
                            "Referral Reward transfer failed"
                        );
                        users[userStake.referrer]
                            .referralIncomeWithdrawnTillNow +=
                            (reward * refRewardPercent) /
                            10000;
                    }
                }
                users[msg.sender].totalRewardWithdrawnTillNow += reward;

                userStake.rewardWithdrawnTillNow += reward;
                userStake.lastWithdrawTimestamp = currentTime;
                totalReward += reward;
            }
        }
        if (totalReward > 0) {
            require(
                IERC20(pool.rewardToken).transfer(msg.sender, totalReward),
                "Reward transfer failed"
            );
        }
    }

    function setAdmin(address newAdmin) external onlyAdmin {
        admin = newAdmin;
    }

    function setRewardToken(
        uint256 poolId,
        address _newRewardToken
    ) external onlyAdmin nonReentrant isValidPool(poolId) isActivePool(poolId) {
        require(poolId > 0 && poolId <= poolIdCounter, "Invalid pool ID");
        pools[poolId].rewardToken = _newRewardToken;
    }

    function setRewardPercent(
        uint256 poolId,
        uint256 _newRewardPercentInBIPS
    ) external onlyAdmin nonReentrant isValidPool(poolId) isActivePool(poolId) {
        require(poolId > 0 && poolId <= poolIdCounter, "Invalid pool ID");
        pools[poolId]
            .rewardPercentPerStakedTokenPerYear = _newRewardPercentInBIPS;
    }

    function setTimePeriod(
        uint256 poolId,
        uint256 _newTimePeriod
    ) external onlyAdmin isValidPool(poolId) isActivePool(poolId) {
        require(poolId > 0 && poolId <= poolIdCounter, "Invalid pool ID");
        pools[poolId].timePeriod = _newTimePeriod;
    }

    function setReferralRewardPercent(
        uint256 poolId,
        uint256 newPercentInBIPS
    ) external onlyAdmin isValidPool(poolId) isActivePool(poolId) {
        pools[poolId].referralRewardPercent = newPercentInBIPS;
    }

    function togglePoolStatus(
        uint256 poolId
    ) external onlyAdmin isValidPool(poolId) {
        pools[poolId].isActive = !pools[poolId].isActive;
    }

    function setSpecialReferrerRewardPercent(
        address _referrer,
        uint256 _percentInBIPS
    ) external onlyAdmin {
        specialReferrersPercents[_referrer] = _percentInBIPS;
    }

    function getTotalPendingRewardsForPool(
        uint256 poolId,
        address user
    ) public view returns (uint256) {
        uint256 total = 0;
        for (uint256 i = 0; i < userStakes[user][poolId].length; i++) {
            total += getPendingReward(poolId, i, user);
        }
        return total;
    }

    function withdrawEth(address payable _receiver) external onlyAdmin nonReentrant {
        require(_receiver != address(0), "Invalid address");

        _receiver.transfer(address(this).balance);
    }

    function withdrawDumpToken(address receiver, IERC20 _token) external onlyAdmin nonReentrant {
        _token.transfer(receiver, _token.balanceOf(address(this)));
    }

    function totalStakeCount(
        address user,
        uint256 poolId
    ) public view returns (uint256 count) {
        return userStakes[user][poolId].length;
    }

    function totalUnstakeAllowed(
        address user,
        uint256 poolId
    ) public view returns (uint256 totalWithdrawable) {
        uint256 totalAmount = 0;
        if (usersStakesPerPool[user][poolId] > 0) {
            for (uint256 i = 0; i < totalStakeCount(user, poolId); i++) {
                if (
                    userStakes[user][poolId][i].stakeTime +
                        pools[poolId].timePeriod <=
                    block.timestamp
                ) {
                    totalAmount += userStakes[user][poolId][i].amount;
                }
            }
        }
        return totalAmount;
    }

    function setRouter(address _router)external onlyAdmin{
        PANCAKE_ROUTER_ADDRESS = _router;
    }
     function setFactory(address _factory)external onlyAdmin{
        PANCAKE_FACTORY_ADDRESS = _factory;
    }

     function setCg8Address(address _cg8Address)external onlyAdmin{
        CG8_TOKEN_ADDRESS = _cg8Address;
    }

    function setUSDCAddress(address _usdcAddress)external onlyAdmin{
        USDC_TOKEN_ADDRESS = _usdcAddress;
    }

   


}
