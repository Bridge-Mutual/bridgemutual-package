import ContractRegistryAbi from './contartsABI/ContractRegistryAbi.json'
import PolicyBookRegistryContractAbi from './contartsABI/PolicyBookRegistryContractAbi.json'
import PolicyBookContractAbi from './contartsABI/PolicyBookContractAbi.json'
import USDTContractAbi from './contartsABI/USDTContractAbi.json'
const CONTRACT_REGISTRY_PROXY_ADDRESS_TEST = '0x88240185a74F020B94b14FAe3e6d5DdE1AA9057b';
import BigNumber from 'bignumber.js';

/**
 * Get whitelisted policy list
 * @param {Object} web3 - instance of web3
 * @returns {Object} List of whitelisted polices
 */

export async function _getWhitelistedContracts(web3) {
    return getPolicyBooks(web3).then((contract) => {
        return contract.methods.count().call().then((count =>
            {
                return contract.methods.listWithStatsWhitelisted(0, count).call().then((listOfPolicies =>
                {
                    return listOfPolicies;
                    // buyPolicy(listOfPolicies._policyBooksArr[0], web3, 10, web3.web3.utils.toWei('100'), userAddress);
                }))
            }))
        });
}

/**
 * Buy policy
 * @param {Number} id - Id of policy
 * @param {Object} web3 - instance of web3
 * @param {Number} weeks - period of policy
 * @param {Number} amount - amount of policy
 * @param {String} userAddress - user address (in ETH)
 * @returns void
 */

export async function buyPolicy(id, web3, weeks, amount, userAddress) {
    let contract = new web3.web3.eth.Contract(
        PolicyBookContractAbi,
        id
    );
    contract.methods.getPolicyPrice(weeks, amount).call().then(res => {
        getUSDTContract(web3).then(usdtContract => {
            usdtContract.methods.allowance(userAddress, id).call().then(allowance => {

                if (BigNumber(allowance).lt(BigNumber(res.totalPrice).idiv(10^12))) {
                    if (allowance === 0) {
                        usdtContract.methods.approve(id, BigNumber(res.totalPrice).idiv(10^12).toFixed()).send({from: userAddress}).then(() => {
                            contract.methods.buyPolicy(weeks, amount).send({from: userAddress}).then()
                        })
                    } else {
                        usdtContract.methods.approve(id, 0).send({from: userAddress}).then(() => {
                            usdtContract.methods.approve(id, BigNumber(res.totalPrice).idiv(10^12).toFixed()).send({from: userAddress}).then(() => {
                                contract.methods.buyPolicy(weeks, amount).send({from: userAddress}).then()
                            })
                        })
                    }
                } else {
                    contract.methods.buyPolicy(weeks, amount).send({from: userAddress}).then()
                }
            })
        })

    })
}

/**
 * Get instance of Policy Book Registry Contract
 * @param {Object} web3 - instance of web3
 * @returns {Object} List of whitelisted polices
 */
async function getPolicyBooks(web3) {
    let contract = new web3.web3.eth.Contract(
        ContractRegistryAbi,
        CONTRACT_REGISTRY_PROXY_ADDRESS_TEST
    );
    return new web3.web3.eth.Contract(PolicyBookRegistryContractAbi,
        await contract.methods.getPolicyBookRegistryContract().call());
}

/**
 * Get instance of USDT contract
 * @param {Object} web3 - instance of web3
 * @returns {Object} List of whitelisted polices
 */
async function getUSDTContract(web3) {
    let contract = new web3.web3.eth.Contract(
        ContractRegistryAbi,
        CONTRACT_REGISTRY_PROXY_ADDRESS_TEST
    );
    return new web3.web3.eth.Contract(USDTContractAbi,
        await contract.methods.getUSDTContract().call());
}
