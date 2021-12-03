const Funding = artifacts.require("./contracts/RockPaperScissors.sol");

module.exports = function(deployer) {
    deployer.deploy(Funding);
};