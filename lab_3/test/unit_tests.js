const { assert } = require("chai");

// const Funding = artifacts.require("RockPaperScissors");
const Funding2 = artifacts.require("InteractionContract");

// require("chai").use(require("chai-bignumber")(web3.BigNumber)).should();

contract("InteractionContract", function() {

    

    it("Cant start not ready game via InteractionContract", async () => {
        // деплоим контракт
        let InteractionContract = await Funding2.deployed();
        InteractionContract.set_address(RockPaperScissorsContract.address);

        

        let commitment = '0xb0c1f97a3a2b7f321dcef007069b5aa7b7d8f608e59fac217519f6fd4450076c'
        await RockPaperScissorsContract.commit_choice(commitment);
        const player_1 = await RockPaperScissorsContract.players.call(0);
        const player_2 = await RockPaperScissorsContract.players.call(1);
        // console.log(player_1);
        // console.log(player_2);

        //пытаемся начать игру через второй смарт-контракт
        // InteractionContract.start_game();

        let isCaught = false;

        try {
            // пытаемся начать игру, которая еще не готова, через второй контракт
            await InteractionContract.start_game();
        } catch (err) {
            isCaught = true;
        }
        assert.equal(isCaught, true)
        
    });

    it("Trying start ready game...", async () => {
        // деплоим контракт
        let InteractionContract = await Funding2.deployed();
        InteractionContract.set_address(RockPaperScissorsContract.address);

        
        // второй игрок тоже делает коммит
        let commitment = '0xc6d317c8a94110480f743f5ed9810be7fea638614cb33e64384c12c333671c09'
        await RockPaperScissorsContract.commit_choice(commitment);

        // игроки открывают свои значения
        await RockPaperScissorsContract.reveal('paper', 'password12345');
        await RockPaperScissorsContract.reveal('rock', 'password12345');

        // let commitment = '0xb0c1f97a3a2b7f321dcef007069b5aa7b7d8f608e59fac217519f6fd4450076c'
        // await RockPaperScissorsContract.commit_choice(commitment);
        // let player_1 = await RockPaperScissorsContract.players.call(0);
        // console.log(player_1);

        // let player_2 = await RockPaperScissorsContract.players.call(1);
        // console.log(player_2);

        // проверяем, что теперь можно начать игру через второй контракт
        let isCaught = false;
        try {
            await InteractionContract.start_game();
        } catch (err) {
            isCaught = true;
            console.log(err);
        }
        assert.equal(isCaught, false)
    });

    it("Clearing game...", async () => {
        // деплоим контракт
        let InteractionContract = await Funding2.deployed();
        InteractionContract.set_address(RockPaperScissorsContract.address);

        // теперь проверяем, что через второй контракт смогли зачистить первый
        await InteractionContract.drop_game();
        let player_1 = await RockPaperScissorsContract.players.call(0);
        // console.log(player_1);
        assert.equal(player_1.wallet_address, '0x0000000000000000000000000000000000000000')
        assert.equal(player_1.commitment, '0x0000000000000000000000000000000000000000000000000000000000000000')

        let player_2 = await RockPaperScissorsContract.players.call(1);
        // console.log(player_2);
        assert.equal(player_2.wallet_address, '0x0000000000000000000000000000000000000000')
        assert.equal(player_2.commitment, '0x0000000000000000000000000000000000000000000000000000000000000000')

    });
    
})
