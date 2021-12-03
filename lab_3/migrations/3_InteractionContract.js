const Funding = artifacts.require("./contracts/InteractionContract.sol");

module.exports = function(deployer) {
    deployer.deploy(Funding);
};