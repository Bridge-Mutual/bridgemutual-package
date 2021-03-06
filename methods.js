import PolicyBookFascade from './contartsABI/PolicyBookFascade.json'
import PolicyBook from './contartsABI/PolicyBook.json'
import USDTContractAbi from './contartsABI/USDTContractAbi.json'
import PolicyBookRegistry from './contartsABI/PolicyBookRegistry.json'
import ContractRegistry from './contartsABI/ContractRegistry.json'

import PolicyRegistryAbi from './contartsABI/PolicyRegistry.json'
import BigNumber from 'bignumber.js';
const CONTRACT_REGISTRY_PROXY_ADDRESS_TEST = '0x38DE74c5AC7D2A3bC81E566Ee318fdedB4a8E1F1';
const CONTRACT_REGISTRY_PROXY_ADDRESS_MAIN = '0x45269F7e69EE636067835e0DfDd597214A1de6ea';
/**
 * async function
 * Get whitelisted policy list
 * @param {Object} web3 - instance of web3
 * @returns {Object} List of whitelisted polices
 */

export async function _getWhitelistedContracts(web3, isTest) {
    return getPolicyBooks(web3, isTest).then((contract) => {
        return contract.methods.count().call().then((count =>
        {
            return contract.methods.listWithStatsWhitelisted(0, count).call().then((listOfPolicies =>
            {
                return listOfPolicies;
            }))
        }))
    });
}

/**
 * async function
 * Get instance of Policy Book Registry Contract
 * @param {Object} web3 - instance of web3
 * @param {Boolean} isTest - for use Rinkeby TestNet
 * @returns {Object} List of whitelisted polices
 */
async function getPolicyBooks(web3, isTest) {
    let contract = new web3.eth.Contract(
        ContractRegistry,
        isTest ? CONTRACT_REGISTRY_PROXY_ADDRESS_TEST : CONTRACT_REGISTRY_PROXY_ADDRESS_MAIN
    );
    return new web3.eth.Contract(PolicyBookRegistry,
        await contract.methods.getPolicyBookRegistryContract().call());
}

/**
 * async function
 * Get Approve
 * @param {Number} id - Id of policy
 * @param {Object} web3 - instance of web3
 * @param {Number} weeks - period of policy
 * @param {Number} amount - amount of policy
 * @param {String} userAddress - user address (in ETH)
 * @returns contract
 */

export async function getApprove(id, web3, weeks, amount, userAddress, isTest) {
    let contract = new web3.eth.Contract(
        PolicyBook,
        id
    );
    const bigNumberAmount = BigNumber(amount).times(BigNumber(10).pow(18)).toFixed();
    return contract.methods.getPolicyPrice(weeks, bigNumberAmount, userAddress).call().then(res => {
        return getUSDTContract(web3, isTest).then(usdtContract => {
            return usdtContract.methods.allowance(userAddress, id).call().then(allowance => {
                if (BigNumber(allowance).lt(BigNumber(res.totalPrice).idiv(10^12))) {
                    if (allowance === 0) {
                        return usdtContract.methods.approve(id, BigNumber(res.totalPrice).idiv(10^12).toFixed()).send({from: userAddress}).then(() => {
                            return contract;
                        })
                    } else {
                        return usdtContract.methods.approve(id, 0).send({from: userAddress}).then(() => {
                            return usdtContract.methods.approve(id, BigNumber(res.totalPrice).idiv(10^12).toFixed()).send({from: userAddress}).then(() => {
                                return contract;
                            })
                        })
                    }
                }
                else {
                    return contract;
                }
            })
        })

    })
}

export async function getPolicyBookContractInstance(id, web3) {
    let contract = new web3.eth.Contract(
        PolicyBook,
        id
    );
    return contract
}

export async function getBalance(userAddress, id, web3) {
    let contract = new web3.eth.Contract(
        PolicyBook,
        id
    );
    return contract.methods.balanceOf(userAddress).call().then(balance => {
        return balance;
    })
}

export async function getPolicyPrice(userAddress, id, amount, weeks, web3) {
    let contract = new web3.eth.Contract(
        PolicyBook,
        id
    );
    const bigNumberAmount = BigNumber(amount).times(BigNumber(10).pow(18)).toFixed();
    return contract.methods.getPolicyPrice(weeks, bigNumberAmount, userAddress).call().then(res => {
        return res
    })
}

/**
 * async function
 * Policy Purchase
 * @param {String} userAddress - user address (in ETH)
 * @param {Number} weeks - period of policy
 * @param {Number} amount - amount of policy
 * @param {String} referralAddress - referral of Address
 * @returns policy purchase result
 */

export async function policyPurchase (contract, userAddress, weeks, amount, referralAddress = '0x0000000000000000000000000000000000000000') {
    const bigNumberAmount = BigNumber(amount).times(BigNumber(10).pow(18)).toFixed();
    contract.methods.policyBookFacade().call().then(facadeId => {
        let policyBookFacadeInstace = new web3.eth.Contract(
            PolicyBookFascade, facadeId
        );
        return policyBookFacadeInstace.methods.buyPolicyFromDistributor(weeks, bigNumberAmount, referralAddress).send({from: userAddress}).then((res) => {
            return res
        })
    })
}



/**
 * async function
 * Get instance of USDT contract
 * @param {Object} web3 - instance of web3
 * @param {Boolean} isTest - for use Rinkeby TestNet
 * @returns {Object} List of whitelisted polices
 */
async function getUSDTContract(web3, isTest) {
    let contract = new web3.eth.Contract(
        ContractRegistry,
        isTest ? CONTRACT_REGISTRY_PROXY_ADDRESS_TEST : CONTRACT_REGISTRY_PROXY_ADDRESS_MAIN
    );
    return new web3.eth.Contract(USDTContractAbi,
        await contract.methods.getUSDTContract().call());
}




/**
 * async function
 * Policy Purchase
 * @param {Object} contract - instance of contract after buyPolicy method
 * @param {String} userAddress - user address (in ETH)
 * @param {Number} amount - amount of coverage
 * @returns provide coverage result
 */
export async function provideCoverage(id, userAddress, amount) {
    let contract = new web3.eth.Contract(
        PolicyBook,
        id
    );
    contract.methods.policyBookFacade().call().then(facadeId => {
        let policyBookFacadeInstace = new web3.eth.Contract(
            PolicyBookFascade, facadeId
        );

        const bigNumberAmount = BigNumber(amount).times(BigNumber(10).pow(18)).toFixed();
        return policyBookFacadeInstace.methods.addLiquidity(bigNumberAmount).send({from: userAddress}).then(result => {
            return result
        })
    })

}

/**
 * async function
 * Get Approve
 * @param {Number} id - Id of policy
 * @param {Object} web3 - instance of web3
 * @param {Number} amount - amount of coverage
 * @param {String} userAddress - user address (in ETH)
 * @param {Boolean} isTest - for use Rinkeby TestNet
 * @returns contract
 */

export async function getCoverageApprove (id, web3, amount, userAddress, isTest) {
    let contract = new web3.eth.Contract(
        PolicyBook,
        id
    );
    const bigNumberAmount = BigNumber(amount).times(BigNumber(10).pow(18)).toFixed();
    return getUSDTContract(web3, isTest).then(usdtContract => {
        return usdtContract.methods.allowance(userAddress, id).call().then(allowance => {
            if (BigNumber(allowance).lt(BigNumber(bigNumberAmount).idiv(10^12))) {
                if (allowance === 0) {
                    return usdtContract.methods.approve(id, BigNumber(bigNumberAmount).idiv(10^12).toFixed()).send({from: userAddress}).then(() => {
                        return contract
                    })
                } else {
                    return usdtContract.methods.approve(id, 0).send({from: userAddress}).then(() => {
                        return usdtContract.methods.approve(id, BigNumber(bigNumberAmount).idiv(10^12).toFixed()).send({from: userAddress}).then(() => {
                            return contract
                        })
                    })
                }
            } else {
                return contract
            }
        })
    })
}

export async function getAllowance (web3, userAddress, id, isTest) {
    return getUSDTContract(web3, isTest).then(usdtContract => {
        return usdtContract.methods.allowance(userAddress, id).call()
    })
}


export async function resetAllowance (web3, userAddress, id, isTest) {
    return getUSDTContract(web3, isTest).then(usdtContract => {
        return usdtContract.methods.approve(id, 0).send({from: userAddress}).then((res) => {return res})
    })
}


export async function setAllowance (web3, userAddress, id, amount, isTest) {
    const bigNumberAmount = BigNumber(amount).times(BigNumber(10).pow(6)).toFixed();
    return getUSDTContract(web3, isTest).then(usdtContract => {
        return usdtContract.methods.approve(id, bigNumberAmount).send({from: userAddress}).then((res) => {
            return res;
        })
    })
}

export async function buyPolicy (id, web3, userAddress, weeks, amount, referralAddress = '0x0000000000000000000000000000000000000000') {
    let contract = new web3.eth.Contract(
        PolicyBook,
        id
    );
    const bigNumberAmount = BigNumber(amount).times(BigNumber(10).pow(18)).toFixed();
    contract.methods.policyBookFacade().call().then(facadeId => {
        let policyBookFacadeInstace = new web3.eth.Contract(
            PolicyBookFascade, facadeId
        );
        return policyBookFacadeInstace.methods.buyPolicyFromDistributor(weeks, bigNumberAmount, referralAddress).send({from: userAddress}).then((res) => {
            return res
        })
    })
}




/**
 * Get purchased insurance
 * @param {Object} web3 - instance of web3
 * @param {String} userAddress - user address (in ETH)
 * @param {Boolean} active - active/unactive policies
 * @param {Number} offset - offset
 * @param {Number} limit - limit
 * @param {Boolean} isTest - for use Rinkeby TestNet
 * @returns list purchased policies
 */

export async function getPurchasedPolicies(web3, userAddress, active, offset, limit, isTest) {
    let contract = new web3.eth.Contract(
        ContractRegistry,
        isTest ? CONTRACT_REGISTRY_PROXY_ADDRESS_TEST: CONTRACT_REGISTRY_PROXY_ADDRESS_MAIN
    );
    return contract.methods.getPolicyRegistryContract().call().then(res => {
        if (res) {
            let registryContract = new web3.eth.Contract(PolicyRegistryAbi, res);
            return registryContract.methods.getPoliciesInfo(userAddress, active, 0, limit).call({from: userAddress}).then( (info) => {
                return info
            })
        }
    })
}
