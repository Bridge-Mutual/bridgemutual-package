# bridgemutual-package

Only for Rinkeby TestNet

 * Get whitelisted policy list - async function
 * @param {Object} web3 - instance of web3
 * @returns {Object} List of whitelisted polices
 
  _getWhitelistedContracts(web3);

 * Buy policy - async function
 * @param {Number} id - Id of policy
 * @param {Object} web3 - instance of web3
 * @param {Number} weeks - period of policy
 * @param {Number} amount - amount of policy
 * @param {String} userAddress - user address (in ETH)
 * @returns void

 buyPolicy(id, web3, weeks, amount, userAddress);
 
 # Example
 import {buyPolicy, _getWhitelistedContracts} from 'bridgemutual';
 
 _getWhitelistedContracts(web3).then((policies) => 
    {
        policies <== Policies List
    }
 )
 
 buyPolicy('0x84422411c84B5818Cf775AEB27B6554024B71A97', web3, 4, 10, 0x0000000000000000000000).then()
