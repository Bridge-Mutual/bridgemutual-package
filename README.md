# bridgemutual-sdk

Only for Rinkeby TestNet

 * async function
 * Get whitelisted policy list - async function
 * @param {Object} web3 - instance of web3
 * @returns {Object} List of whitelisted polices
 
 _getWhitelistedContracts(web3);

 * async function
 * Get Approve - async function
 * @param {Number} id - Id of policy
 * @param {Object} web3 - instance of web3
 * @param {Number} weeks - period of policy
 * @param {Number} amount - amount of policy
 * @param {String} userAddress - user address (in ETH)
 * @returns contract

 getApprove(id, web3, weeks, amount, userAddress);
 
 * async function
 * Policy Purchase
 * @param {Object} contract - instance of contract after buyPolicy method
 * @param {String} userAddress - user address (in ETH)
 * @param {Number} weeks - period of policy
 * @param {Number} amount - amount of policy
 * @returns policy purchase result

 policyPurchase (contract, userAddress, weeks, amount);
 
 * async function
 * Provide coverage to whitelisted contract
 * @param {Number} id - Id of contract
 * @param {Object} web3 - instance of web3
 * @param {Number} amount - coverage amount
 * @param {Number} userAddress - userAddress from web3
 * @returns void

 provideCoverage (id, web3, amount, userAddress);
 
 * Get purchased insurance
 * @param {Object} web3 - instance of web3
 * @param {String} userAddress - user address (in ETH)
 * @param {Boolean} active - active/unactive policies
 * @param {Number} offset - offset
 * @param {Number} limit - limit
 * @returns list purchased policies

 getPurchasedPolicies (web3, userAddress, active, offset, limit);
 
 # Example
 import {buyPolicy, _getWhitelistedContracts} from 'bridgemutual';
 
 _getWhitelistedContracts(web3).then((policies) => 
    {
        policies <== Policies List
    }
 )
 
 buyPolicy('0x84422411c84B5818Cf775AEB27B6554024B71A97', web3, 4, 10, 0x0000000000000000000000).then()
