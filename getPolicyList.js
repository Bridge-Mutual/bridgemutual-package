import ContractRegistryAbi from './contartsABI/ContractRegistryAbi.json'
import PolicyBookRegistryContractAbi from './contartsABI/PolicyBookRegistryContractAbi.json'
import PolicyBookContractAbi from './contartsABI/PolicyBookContractAbi.json'
import USDTContractAbi from './contartsABI/USDTContractAbi.json'
const CONTRACT_REGISTRY_PROXY_ADDRESS_TEST = '0x88240185a74F020B94b14FAe3e6d5DdE1AA9057b';
import BigNumber from 'bignumber.js';

/**
 * async function
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
                }))
            }))
        });
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

export async function getApprove(id, web3, weeks, amount, userAddress) {
    let contract = new web3.eth.Contract(
        PolicyBookContractAbi,
        id
    );
    const bigNumberAmount = BigNumber(amount).times(BigNumber(10).pow(18)).toFixed();
    return contract.methods.getPolicyPrice(weeks, bigNumberAmount).call().then(res => {
        return getUSDTContract(web3).then(usdtContract => {
            return usdtContract.methods.allowance(userAddress, id).call().then(allowance => {

                if (BigNumber(allowance).lt(BigNumber(res.totalPrice).idiv(10^12))) {
                    if (allowance === 0) {
                        return usdtContract.methods.approve(id, BigNumber(res.totalPrice).idiv(10^12).toFixed()).send({from: userAddress}).then(() => {
                            //tt
                            return contract;
                            // contract.methods.buyPolicy(weeks, bigNumberAmount).send({from: userAddress}).then()
                        })
                    } else {
                        return usdtContract.methods.approve(id, 0).send({from: userAddress}).then(() => {
                            return usdtContract.methods.approve(id, BigNumber(res.totalPrice).idiv(10^12).toFixed()).send({from: userAddress}).then(() => {
                                //tt
                                return contract;
                                // contract.methods.buyPolicy(weeks, bigNumberAmount).send({from: userAddress}).then()
                            })
                        })
                    }
                }
                else {
                    return contract;
                    // contract.methods.buyPolicy(weeks, bigNumberAmount).send({from: userAddress}).then()
                }
            })
        })

    })
}

/**
 * async function
 * Policy Purchase
 * @param {Object} contract - instance of contract after buyPolicy method
 * @param {String} userAddress - user address (in ETH)
 * @param {Number} weeks - period of policy
 * @param {Number} amount - amount of policy
 * @returns policy purchase result
 */

export async function policyPurchase (contract, userAddress, weeks, amount) {
    const bigNumberAmount = BigNumber(amount).times(BigNumber(10).pow(18)).toFixed();
    return contract.methods.buyPolicy(weeks, bigNumberAmount).send({from: userAddress}).then((res) => {
        return res
    })
}


/**
 * async function
 * Get instance of Policy Book Registry Contract
 * @param {Object} web3 - instance of web3
 * @returns {Object} List of whitelisted polices
 */
async function getPolicyBooks(web3) {
    let contract = new web3.eth.Contract(
        ContractRegistryAbi,
        CONTRACT_REGISTRY_PROXY_ADDRESS_TEST
    );
    return new web3.eth.Contract(PolicyBookRegistryContractAbi,
        await contract.methods.getPolicyBookRegistryContract().call());
}

/**
 * async function
 * Get instance of USDT contract
 * @param {Object} web3 - instance of web3
 * @returns {Object} List of whitelisted polices
 */
async function getUSDTContract(web3) {
    let contract = new web3.eth.Contract(
        ContractRegistryAbi,
        CONTRACT_REGISTRY_PROXY_ADDRESS_TEST
    );
    return new web3.eth.Contract(USDTContractAbi,
        await contract.methods.getUSDTContract().call());
}

/**
 * async function
 * Provide coverage to whitelisted contract
 * @param {Number} id - Id of contract
 * @param {Object} web3 - instance of web3
 * @param {Number} amount - coverage amount
 * @param {Number} userAddress - userAddress from web3
 * @returns void
 */

export async function provideCoverage (id, web3, amount, userAddress) {
    let contract = new web3.eth.Contract(
        PolicyBookContractAbi,
        id
    );

    const bigNumberAmount = BigNumber(amount).times(BigNumber(10).pow(18)).toFixed();
    getUSDTContract(web3).then(usdtContract => {
        usdtContract.methods.allowance(userAddress, id).call().then(allowance => {
            if (BigNumber(allowance).lt(BigNumber(bigNumberAmount).idiv(10^12))) {
                if (allowance === 0) {
                    usdtContract.methods.approve(id, BigNumber(bigNumberAmount).idiv(10^12).toFixed()).send({from: userAddress}).then(() => {
                        //tt
                        contract.methods.convertSTBLToBMIX(bigNumberAmount).call().then((BMIxAmount) => {
                            contract.methods.allowance(userAddress, BMIContractStakingTestNet).call().then((allowance) => {
                                if (BigNumber(allowance).lt(BMIxAmount)) {
                                    contract.methods.approve(BMIContractStakingTestNet, BMIxAmount).send({from: userAddress}).then(() => {
                                        contract.methods.addLiquidityAndStake(bigNumberAmount, bigNumberAmount).send({from: userAddress}).then();
                                    })
                                } else {
                                    contract.methods.addLiquidityAndStake(bigNumberAmount, bigNumberAmount).send({from: userAddress}).then();
                                }
                            })

                        })
                    })
                } else {
                    usdtContract.methods.approve(id, 0).send({from: userAddress}).then(() => {
                        //tt
                        usdtContract.methods.approve(id, BigNumber(bigNumberAmount).idiv(10^12).toFixed()).send({from: userAddress}).then(() => {
                            contract.methods.convertSTBLToBMIX(bigNumberAmount).call().then((BMIxAmount) => {
                                contract.methods.allowance(userAddress, BMIContractStakingTestNet).call().then((allowance) => {
                                    if (BigNumber(allowance).lt(BMIxAmount)) {
                                        contract.methods.approve(BMIContractStakingTestNet, BMIxAmount).send({from: userAddress}).then(() => {
                                            contract.methods.addLiquidityAndStake(bigNumberAmount, bigNumberAmount).send({from: userAddress}).then()
                                        })
                                    } else {
                                        contract.methods.addLiquidityAndStake(bigNumberAmount, bigNumberAmount).send({from: userAddress}).then();
                                    }
                                })
                            })
                        })
                    })
                }
            } else {
                contract.methods.convertSTBLToBMIX(bigNumberAmount).call().then((BMIxAmount) => {
                    contract.methods.allowance(userAddress, BMIContractStakingTestNet).call().then((allowance) => {
                        if (BigNumber(allowance).lt(BMIxAmount)) {
                            contract.methods.approve(BMIContractStakingTestNet, BMIxAmount).send({from: userAddress}).then(() => {
                                contract.methods.addLiquidityAndStake(bigNumberAmount, bigNumberAmount).send({from: userAddress}).then();
                            })
                        } else {
                            contract.methods.addLiquidityAndStake(bigNumberAmount, bigNumberAmount).send({from: userAddress}).then();
                        }
                    })
                })
            }
        })
    })
}

/**
 * async function
 * Request to receive reward (you can receive reward after 8 days)
 * @param {Number} id - Id of contract
 * @param {Object} web3 - instance of web3
 * @param {Number} userAddress - userAddress from web3
 * @returns void
 */
export async function unStake(id, web3, userAddress) {
    let BMIStakingContract = new web3.eth.Contract(
        BMICoverStaking,
        BMIContractStakingTestNet
    );

    let contract = new web3.eth.Contract(
        PolicyBookContractAbi,
        id
    );

    BMIStakingContract.methods.withdrawStakerFundsWithProfit(id).send({from: userAddress}).then(() => {
        contract.methods.getAvailableBMIXWithdrawableAmount(userAddress).call().then((amount) => {
            contract.methods.approve(id, amount).send({from: userAddress}).then(() => {
                contract.methods.requestWithdrawal(amount).send({from: userAddress}).then()
            })
        })

    })

}

/**
 * async function
 * Request to receive liquidity (you can receive reward after 8 days)
 * @param {Number} id - Id of contract
 * @param {Object} web3 - instance of web3
 * @param {Number} userAddress - userAddress from web3
 * @returns void
 */
export async function withdrawLiquidity(id, web3, userAddress) {
    let contract = new web3.eth.Contract(
        PolicyBookContractAbi,
        id
    );
    contract.methods.withdrawLiquidity().send({from: userAddress}).then();
}
