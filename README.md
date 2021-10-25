# bridgemutual-sdk

 * async function
 * Get whitelisted policy list - async function
 * @param {Object} web3 - instance of web3
 * @param {Boolean} isTest - for use Rinkeby TestNet
 * @returns {Object} List of whitelisted polices
 
 _getWhitelistedContracts(web3, isTest);

 * async function
 * Get Approve - async function
 * @param {Number} id - Id of policy
 * @param {Object} web3 - instance of web3
 * @param {Number} weeks - period of policy
 * @param {Number} amount - amount of policy
 * @param {String} userAddress - user address (in ETH)
 * @returns contract

 getApprove(id, web3, weeks, amount, userAddress, isTest);
 
 * async function
 * Policy Purchase
 * @param {Object} contract - instance of contract after buyPolicy method
 * @param {String} userAddress - user address (in ETH)
 * @param {Number} weeks - period of policy
 * @param {Number} amount - amount of policy
 * @param {String} referralAddress - referral of Address
 * @returns policy purchase result

 policyPurchase (contract, userAddress, weeks, amount, referralAddress);
 
 * async function
 * Get Approve
 * @param {Number} id - Id of policy
 * @param {Object} web3 - instance of web3
 * @param {Number} amount - amount of coverage
 * @param {String} userAddress - user address (in ETH)
 * @param {Boolean} isTest - for use Rinkeby TestNet
 * @returns contract

 getCoverageApprove (id, web3, amount, userAddress, isTest);
 
 * async function
 * Policy Purchase
 * @param {Object} contract - instance of contract after buyPolicy method
 * @param {String} userAddress - user address (in ETH)
 * @param {Number} amount - amount of coverage
 * @returns policy purchase result

 provideCoverage (contract, userAddress, amount);
 
 * Get purchased insurance
 * @param {Object} web3 - instance of web3
 * @param {String} userAddress - user address (in ETH)
 * @param {Boolean} active - active/unactive policies
 * @param {Number} offset - offset
 * @param {Number} limit - limit
 * @param {Boolean} isTest - for use Rinkeby TestNet
 * @returns list purchased policies

 getPurchasedPolicies (web3, userAddress, active, offset, limit, isTest);
 
 # Example
 import {buyPolicy, _getWhitelistedContracts} from 'bridgemutual';
 
 _getWhitelistedContracts(web3).then((policies) => 
    {
        policies <== Policies List
    }
 )
 
 buyPolicy('0x84422411c84B5818Cf775AEB27B6554024B71A97', web3, 4, 10, 0x0000000000000000000000).then()
