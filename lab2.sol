pragma solidity <0.9.0;

contract RockPaperScissors {
    
    struct PlayerChoice {
        string choice;
        address wallet_address;
        bytes32 commitment; // hash of choice + blinding_factor (чтоб нельзя было посчитать хеш от каждого choice и понять)
        bool commited;
        bool revealed;
    }
    // игровые события
    event Commit_message(address player);
    event Reveal_message(address player, string choice);
    event GameEnded(string message);
    event GameDestruction(string message);
    event Winner(address winner_wallet);
    
    PlayerChoice[2] public players;
    
    
    
    // хотя бы кто-то свободен(не commited) - можно сходить (||)
    modifier is_someone_free() {
        bool free = false;
        if (players[0].commited == false || players[1].commited == false) free=true;
        require(free == true, "Someone is free!");
        _;
    }
    
    // тут наоборот, проверяем, что уже все сделали первый ход (&&)
    modifier all_already_commited() {
        bool already_commited = false;
        if (players[0].commited == true && players[1].commited == true) already_commited=true;
        require(already_commited == true, "The players have already made their choice!");
        _;
    }
    
    // is_someone_free, можно закоммитить choice, сделать ход
    function commit_choice(bytes32 data_hash) public is_someone_free(){
        if (players[0].commited == false) {
            players[0].commited = true;
            players[0].commitment = data_hash;
            players[0].wallet_address = msg.sender;
        } else if (players[1].commited == false) {
            players[1].commited = true;
            players[1].commitment = data_hash;
            players[1].wallet_address = msg.sender;
        }
        emit Commit_message(msg.sender);
    }
    
    // равны ли строки
    function is_str_equal(string memory a, string memory b) internal returns (bool) {
        return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))));
    }
    
    // если all_already_commited(), имеем выборы и blinding_factors, раскрываем секреты пользователей
    function reveal(string memory choice, string memory blinding_factor) public all_already_commited() {
        uint32 player_id;
        // проверка, кто прислал и что он еще не раскрыл
        if (players[0].wallet_address == msg.sender && players[0].revealed == false) player_id = 0;
        else if (players[1].wallet_address == msg.sender && players[1].revealed == false) player_id = 1;
         // от пользователя имеем выборы и blinding_factors, проверяем, что закоммиченный хэш совпадает с хэшем от переданных пользователем значениями
        require(keccak256(abi.encodePacked(choice, blinding_factor)) == players[player_id].commitment, "invalid hash");
        // теперь раскрыли (revealed = true)
        players[player_id].revealed = true;
        // устанавливаем значение choice
        players[player_id].choice = choice;
        // "испускаем" событие
        emit Reveal_message(msg.sender, choice);
    }
    
    // если кто-то ввел неверные значения, либо просто для перезапуска игры
    function drop_game() public {
        delete players;
    }
    
    // все игроки раскрылись
    modifier already_revealed() {
        bool revealed = false;
        if (players[0].revealed == true && players[1].revealed == true) revealed = true;
        require(revealed == true, "Not all players revealed!");
        _;
    }

    // перебор значений и определение победителя 
    // если одинаковые значения, то ничья
    // (будет возвращаться адрес победителя, а если ничья, то возвращается пустой адрес)
    function game() public already_revealed() {
        address winner_wallet;
        if (is_str_equal(players[0].choice, players[1].choice)) {
            // ничья
            emit GameEnded("Choices was equal!");
            emit Winner(winner_wallet);
        } else if (is_str_equal(players[0].choice, "rock") &&  is_str_equal(players[1].choice, "paper")) {
            emit GameEnded("Game finished!");
            // выигрыш второго
            emit Winner(players[1].wallet_address);
        } else if (is_str_equal(players[0].choice, "paper") &&  is_str_equal(players[1].choice, "rock")) {
            emit GameEnded("Game finished!");
            // выигрыш первого
            emit Winner(players[0].wallet_address);
        } else if (is_str_equal(players[0].choice, "rock") &&  is_str_equal(players[1].choice, "scissors")) {
            emit GameEnded("Game finished!");
            // выигрыш первого
            emit Winner(players[0].wallet_address);
        } else if (is_str_equal(players[0].choice, "scissors") &&  is_str_equal(players[1].choice, "rock")) {
            emit GameEnded("Game finished!");
            emit Winner(players[1].wallet_address);
        } else if (is_str_equal(players[0].choice, "paper") &&  is_str_equal(players[1].choice, "scissors")) {
            emit GameEnded("Game finished!");
            // выигрыш второго
            emit Winner(players[1].wallet_address);
        } else if (is_str_equal(players[0].choice, "scissors") &&  is_str_equal(players[1].choice, "paper")) {
            emit GameEnded("Game finished!");
            // выигрыш первого
            emit Winner(players[0].wallet_address);
        } else {
            revert("Incorrect game! Please, drop game!");
        }
    }
    
    
}
