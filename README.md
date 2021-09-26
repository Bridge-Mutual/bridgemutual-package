# bridgemutual-package

Only for Rinkeby TestNet

 * async function
 * Get whitelisted policy list - async function
 * @param {Object} web3 - instance of web3
 * @returns {Object} List of whitelisted polices
 
 _getWhitelistedContracts(web3);

 * async function
 * Buy policy - async function
 * @param {Number} id - Id of policy
 * @param {Object} web3 - instance of web3
 * @param {Number} weeks - period of policy
 * @param {Number} amount - amount of policy
 * @param {String} userAddress - user address (in ETH)
 * @returns void

 buyPolicy(id, web3, weeks, amount, userAddress);
 
 * async function
 * Provide coverage to whitelisted contract
 * @param {Number} id - Id of contract
 * @param {Object} web3 - instance of web3
 * @param {Number} amount - coverage amount
 * @param {Number} userAddress - userAddress from web3
 * @returns void

 provideCoverage (id, web3, amount, userAddress);
 
 * async function
 * Request to receive reward (you can receive reward after 8 days)
 * @param {Number} id - Id of contract
 * @param {Object} web3 - instance of web3
 * @param {Number} userAddress - userAddress from web3
 * @returns void
  
 unStake(id, web3, userAddress)
 
 * async function
 * Request to receive liquidity (you can receive reward after 8 days)
 * @param {Number} id - Id of contract
 * @param {Object} web3 - instance of web3
 * @param {Number} userAddress - userAddress from web3
 * @returns void
 
 withdrawLiquidity(id, web3, userAddress)
 
 # Example
 import {buyPolicy, _getWhitelistedContracts} from 'bridgemutual';
 
 _getWhitelistedContracts(web3).then((policies) => 
    {
        policies <== Policies List
    }
 )
 
 buyPolicy('0x84422411c84B5818Cf775AEB27B6554024B71A97', web3, 4, 10, 0x0000000000000000000000).then()
