// // SPDX-License-Identifier: UNLICENSED
// pragma solidity ^0.8.13;

// import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
// import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
// import "@openzeppelin/contracts/access/Ownable.sol";
// import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

// contract USDC is IERC20 {
//     constructor() {
//         _mint(msg.sender, 1000000000000000000000000);
//     }
// }

// contract WorkMatch is Ownable {
//     using ECDSA for bytes32;

//     IERC20 public immutable stakeToken;
//     uint256 public immutable requiredStake;

//     struct Profile {
//         string name;
//         bool isEmployer;
//         uint256 stake;
//         bool isActive;
//     }

//     struct Job {
//         address employer;
//         address employee;
//         uint256 payment;
//         bool isComplete;
//         bool isActive;
//     }

//     mapping(address => Profile) public profiles;
//     mapping(address => mapping(address => bool)) public matches;
//     mapping(bytes32 => Job) public jobs;

//     event ProfileCreated(address indexed user, bool isEmployer);
//     event MatchCreated(address indexed employer, address indexed employee);
//     event JobCreated(bytes32 indexed jobId, address employer, address employee, uint256 payment);
//     event JobCompleted(bytes32 indexed jobId);
//     event StakeSlashed(address indexed user);

//     constructor(address _stakeToken) Ownable(msg.sender) {
//         stakeToken = IERC20(_stakeToken);
//         requiredStake = 1000000000000000000;
//     }

//     function createProfile(string memory _name, bool _isEmployer) external {
//         require(!profiles[msg.sender].isActive, "Profile exists");

//         stakeToken.transferFrom(msg.sender, address(this), requiredStake);

//         profiles[msg.sender] = Profile({name: _name, isEmployer: _isEmployer, stake: requiredStake, isActive: true});

//         emit ProfileCreated(msg.sender, _isEmployer);
//     }

//     function likeProfile(address _target) external {
//         require(profiles[msg.sender].isActive, "No profile");
//         require(profiles[_target].isActive, "Target no profile");
//         require(profiles[msg.sender].isEmployer != profiles[_target].isEmployer, "Same role");

//         address employer = profiles[msg.sender].isEmployer ? msg.sender : _target;
//         address employee = profiles[msg.sender].isEmployer ? _target : msg.sender;

//         matches[employer][employee] = true;
//         emit MatchCreated(employer, employee);
//     }

//     function createJob(address _employee, uint256 _payment) external {
//         require(profiles[msg.sender].isEmployer, "Not employer");
//         require(matches[msg.sender][_employee], "Not matched");

//         bytes32 jobId = keccak256(abi.encodePacked(msg.sender, _employee, block.timestamp));

//         stakeToken.transferFrom(msg.sender, address(this), _payment);

//         jobs[jobId] =
//             Job({employer: msg.sender, employee: _employee, payment: _payment, isComplete: false, isActive: true});

//         emit JobCreated(jobId, msg.sender, _employee, _payment);
//     }

//     function completeJob(bytes32 _jobId) external {
//         Job storage job = jobs[_jobId];
//         require(msg.sender == job.employer, "Not employer");
//         require(job.isActive && !job.isComplete, "Invalid job");

//         job.isComplete = true;

//         // Return stake to employee
//         Profile storage employeeProfile = profiles[job.employee];
//         uint256 employeeStake = employeeProfile.stake;
//         employeeProfile.stake = 0;

//         // Transfer payment and stake
//         stakeToken.transfer(job.employee, job.payment + employeeStake);

//         emit JobCompleted(_jobId);
//     }

//     function slashStake(address _user) external onlyOwner {
//         Profile storage profile = profiles[_user];
//         require(profile.stake > 0, "No stake");

//         uint256 stake = profile.stake;
//         profile.stake = 0;
//         stakeToken.transfer(owner(), stake);

//         emit StakeSlashed(_user);
//     }
// }
