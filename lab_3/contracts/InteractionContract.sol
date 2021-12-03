pragma solidity <0.9.0;
// SPDX-License-Identifier: MIT




// этот класс позволяет работать с публичными функциями класса RockPaperScissors
contract InteractionContract {
    // сюда нужно подставить адрес контракта после деплоя
    address RockPaperScissors_addr; 
    RockPaperScissors r;
    
    bool public commit_success;
    
    function set_address(address cont_address) public {
        RockPaperScissors_addr = cont_address; 
        r = RockPaperScissors(RockPaperScissors_addr);
    }
 
    // start game if it is ready
    function start_game() public {
        r.game();
    }
    
    // drop game
    function drop_game() public {
        r.drop_game();
    }
    
    
} 



abstract contract RockPaperScissors {
    
    struct PlayerChoice {
        string choice;
        address wallet_address;
        bytes32 commitment; // hash of choice + blinding_factor
        bool commited;
        bool revealed;
    }
    
    PlayerChoice[2] public players;
    

    function commit_choice(bytes32 data_hash) public virtual;
    
    function reveal(string memory choice, string memory blinding_factor) public virtual;
    
    function drop_game() public virtual;
     
    function game() public virtual;
    
    
}

