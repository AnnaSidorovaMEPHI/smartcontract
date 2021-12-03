const { assert } = require("chai");

const Funding = artifacts.require("RockPaperScissors");
// require("chai").use(require("chai-bignumber")(web3.BigNumber)).should();

contract("RockPaperScissors", function() {

    // let RockPaperScissorsContract = await Funding.deployed();

    it("Check the init values must be empty", async () => {
        // деплоим контракт
        RockPaperScissorsContract = await Funding.deployed();
        console.log(RockPaperScissorsContract.address)

        const player_1 = await RockPaperScissorsContract.players.call(0);
        const player_2 = await RockPaperScissorsContract.players.call(1);
        

        // проверяем, что не стоит никаких выборов у обоих игроков
        assert.equal(player_1.choice, '');
        assert.equal(player_2.choice, '');


        // проверяем, что никто из пользователей еще не закоммитил значения
        assert.equal(player_1.commited, false);
        assert.equal(player_2.commited, false);

        // проверяем, что reveal установлен в false по умолчанию
        assert.equal(player_1.revealed, false);
        assert.equal(player_2.revealed, false);

        // проверяем, что адреса кошельков игроков еще пустые
        assert.equal(player_1.wallet_address, '0x0000000000000000000000000000000000000000');
        assert.equal(player_2.wallet_address, '0x0000000000000000000000000000000000000000');

        // проверяем, что коммитменты тоже пустые
        assert.equal(player_1.commitment, '0x0000000000000000000000000000000000000000000000000000000000000000');
        assert.equal(player_2.commitment, '0x0000000000000000000000000000000000000000000000000000000000000000');
    });


    it("Check that the values after the move are set correctly", async () => {
        // тут проверяем, что значения после коммита установлены корректно

        // const player_1 = await RockPaperScissorsContract.players.call(0);
        // const player_2 = await RockPaperScissorsContract.players.call(1);

        let firstDonator = '0x0000000000000000000000000000000000000000';
        let commitment = '0xb0c1f97a3a2b7f321dcef007069b5aa7b7d8f608e59fac217519f6fd4450076c'
        const donate = await RockPaperScissorsContract.commit_choice(commitment);

        
        const player_1 = await RockPaperScissorsContract.players.call(0);
        // console.log(player_1);
        // wallet_address: '0x627306090abaB3A6e1400e9345bC60c78a8BEf57',
        // commitment: '0x0000000000000000000000000000000000000000000000000000000000001337',
        // значение кошелька у меня было именно такое, для тестов пойдет, но возможно на другом хосте кошелек будет другим

        // проверяем, что все значения установлены, и что commited = true
        assert.equal(player_1.commitment, '0xb0c1f97a3a2b7f321dcef007069b5aa7b7d8f608e59fac217519f6fd4450076c');
        assert.equal(player_1.wallet_address, '0x627306090abaB3A6e1400e9345bC60c78a8BEf57');
        assert.equal(player_1.commited, true);

    });


    it("Check that it is impossible to make reveal", async () => {
        // проверяем, что нельзя сделать ансил, пока два игрока не закоммитятся
        // на данный момент закоммитился только 1 игрок
        // суть в том, что контракт бросает исключение, а мы проверяем, было оно или нет
        
        let isCaught = false;

        try {
            await RockPaperScissorsContract.reveal('choice', 'password');
        } catch (err) {
            isCaught = true;
        }
        // isCaught.should.be.equal(true);
        assert.equal(isCaught, true)

    });

    it("Raise error by incorrect hash", async () => {
        // проверяем, что если хэш не совпадает, то получаем ошибку и значения choice не будет установллено
        // сначала должен походить второй игрок, иначе получим ошибку
        let commitment = '0xb0c1f97a3a2b7f321dcef007069b5aa7b7d8f608e59fac217519f6fd4450076c'
        const donate = await RockPaperScissorsContract.commit_choice(commitment);
        let isCaught = false;

        try {
            // значения, которые должны быть - ['paper', 'password12345'] 
            await RockPaperScissorsContract.reveal('choice', 'password');
        } catch (err) {
            isCaught = true;
        }
        // из-за того, что хэши не совпадают, получаем ошибку
        assert.equal(isCaught, true)

    });

})
