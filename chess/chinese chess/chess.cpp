#include <iostream>
#include <vector>
#include "board.h"

using namespace std;
// task: implement turn based game
// then implement the rule of each piece 
int main (void) {
    cout << "hello" <<endl;

    string fen = "RHEGKGEHR/8/1C5C/P1P1P1P1P/8/8/p1p1p1p1p/1c5c/8/rhegkgehr g 20 100";
    Board game(fen);

    cout << "fen: " << fen<< endl;
    game.displayBoard();

    bool successMove = false;
    while(!game.getExit()) {
        while(!successMove){
            successMove = game.makeMove(game.getCurPlayer());
        }
        game.nextTurn();
        game.displayBoard();
        successMove = false;
    }
    
}
