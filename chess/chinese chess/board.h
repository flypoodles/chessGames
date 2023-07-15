#include <iostream>
#include <vector>
#include <algorithm>
#include "piece.h"
#include <map>
#include <cctype>
#include <string>
#include <cstdlib>
#include <ctype.h>
using namespace std;
class Board {
    public:
        Board(string fen) {
            boardColumn = 9;
            boardRow = 10;
            for (int i = 0; i < boardRow; i++) {
                for (int j = 0; j < boardColumn; j++) {
                    board.push_back(0);
                }
            }

            loadFromFen(fen);
            string newFen = fen.substr(fen.find(" ")+1);
            if(newFen.at(0) == 'g') {
                curPlayer = "Green";
                curPlayerNum = 8;

            } else {
                curPlayer = "Red";
                curPlayerNum = 16;
            }
            
            newFen = newFen.substr(2);
            halfmove = stoi(newFen.substr(0, newFen.find(" ")));
            curTurn = stoi(newFen.substr(newFen.find(" ")+1));
            exit = false;

        }

        
        void displayBoard() {
            
            int totalRow = boardRow * 2 -1;
            int curRow = 0;
            int curCol = 0;
            cout << "  0 1 2 3 4 5 6 7 8" <<endl;
            for (int i = 0; i < totalRow; i++) {


                curCol = 0;
                
                if (i % 2 == 0) {
                    int j;
                    cout << curRow <<" ";
                    for (j = 0; j < boardColumn- 1; j++) {
                    char curPiece = pieceToDisplay(curRow, curCol);
                    cout << curPiece << "-";
                    curCol++;
                    }
                    cout << pieceToDisplay(curRow, curCol) << endl;
                    curRow++;
                } else {
                    if (i == 9) {
                        cout <<"  |     River     |\n";
                        continue;
                    }
                    if (i == 1 || i == 15) {
                        cout << "  | | | |\\|/| | | |\n";
                        continue;
                    }
                    if (i == 3 || i == 17) {
                        cout << "  | | | |/|\\| | | |\n";
                        continue;
                    }
                    cout <<"  ";
                    for (int j = 0; j < boardColumn; j++) {
                        cout << "| ";
                    }
                    cout << endl;
                }
                
            }

            cout << "\n\nTurn: " << curTurn << endl;
            cout << "halfmove: " << halfmove << endl;
            cout << "current Player: " << curPlayer <<endl;
        
        }
    
    
        bool makeMove(int curPlayerNum) {
            // pick a piece
            
            int pickedPiece = 0;
            int pickRow = 0;
            int pickColumn = 0;
            int destinationRow = 0;
            int destinationColumn = 0;
            int destinationPiece = 0;
            int switching = 0;
            cout << "pick a piece by entering the coordinates(row,column): " << endl;
            if (!(cin >> pickRow) ||!(cin >> pickColumn)) {
                cin.clear();
                cin.ignore(1000, '\n');
                return false;
            }

            // make sure the player picked valid coordinates
            while(!boundCheck(pickRow,pickColumn)) {
                cout <<"invalid coordinates. Try again" << endl;
                cout << "pick a piece by entering the coordinates(row,column): " << endl;
                if (!(cin >> pickRow) ||!(cin >> pickColumn)) {
                    cin.clear();
                    cin.ignore(1000, '\n');
                    return false;
                }
            } 
            
            pickedPiece = board[pickRow * 9 + pickColumn];
            if ((pickedPiece & 24) != curPlayerNum) {
                cout << "invalid Piece" << endl;
                return false;
            }
            cout << "You have picked: " << piece.pieceToString.at(pickedPiece & 24) << " " << piece.pieceToString.at(pickedPiece & 7) << endl;
            pickingDestination(destinationRow,destinationColumn, switching);
            if (switching == 1) {
                return false;
            }
            destinationPiece = board[destinationRow * 9 + destinationColumn];

            // make a move
            while (!validMove(pickedPiece,pickColumn, pickRow , destinationRow, destinationColumn)) {
                cout << "Invalid Destination: " << endl;
                pickingDestination(destinationRow,destinationColumn, switching);
                if (switching == 1) {
                return false;
            }
            }
            board[pickRow * 9 + pickColumn] = 0;
            board[destinationRow * 9 + destinationColumn] = pickedPiece;

            if ((destinationPiece & 7) == piece.king) {
                cout << curPlayer << " Won the game" << endl;
                this -> exit = true;
            }
            return true;
        }

        void nextTurn() {
            if(curPlayerNum == 16) {
                curPlayer.replace(0, curPlayer.length(), "Green");
                curPlayerNum = 8;
            } else if (curPlayerNum == 8) {
                curPlayer.replace(0, curPlayer.length(), "Red");
                curPlayerNum = 16;
            }
            curTurn++;
        }
        bool getExit() {
            return exit;
        }
        int getCurPlayer() {
            return curPlayerNum;
        }
    private:
        int boardColumn;
        int boardRow;
        vector<int> board;
        int curTurn;
        int halfmove;
        string curPlayer;
        int curPlayerNum;
        Piece piece;
        int exit;
        

        char pieceToDisplay(int curRow, int curCol) { 
                if (!board[curRow * 9 + curCol]) {
                         return 'O';
                    }
                int curPiece = board[curRow * 9 + curCol] & 7;
                int faction = board[curRow * 9 + curCol] & 8;
                if (faction == 8) {
                    // green
                    return toupper(piece.numToPiece.at(curPiece));
                } else {
                    // red
                    return tolower(piece.numToPiece.at(curPiece));
                }
        }

        bool loadFromFen(string fen) {
            int curCol = 0;
            int curRow = 0;
            string curBoard = fen.substr(0,fen.find(" "));
            map<char, int> pieceMap= {{'r', piece.rook}, {'h', piece.horse}, {'e', piece.elephant}, 
            {'g', piece.guard}, {'k', piece.king}, {'c', piece.cannon}, {'p', piece.pawn}};
            
            for (char& i : curBoard) {
                if(i == '/') {
                    curCol = 0;
                    curRow++;
                } else if (isdigit(i)) {
                    curCol += (i - '0');

                } else if (isalpha(i)) {
                    if (isupper(i)) {
                        board[(9 * curRow) + curCol] = piece.green | pieceMap.at(tolower(i));
                    } else {
                        board[(9 * curRow) + curCol] = piece.red | pieceMap.at(i);
                    }
                    curCol++;
                } else {
                    return false;
                }
            }
            return true;

        }

        bool boundCheck(int row, int column) {
            if (row > 9 || row < 0) {
                return false;
            }
            if (column > 8 || column <0) {
                return false;
            }
            return true;
        }

        void pickingDestination(int &destinationRow, int &destinationColumn, int & switchPiece ) {

            
            string theRow;
            string theCol;
            
            
            while (1) {
                cout << "pick a destination by entering the coordinates(row,column) press s to switch piece: " << endl;
                cin >> theRow;
                if (theRow.compare("s") == 0) {
                    switchPiece = 1;
                    return;
                }
                cin >> theCol;
                int curRow;
                int curCol;
                int failed = 0;
                try {
                    curRow = stoi(theRow);
                    curCol = stoi(theCol);
                } catch(...) {
                    cout <<"invalid coordinates. Try again" << endl;
                    
                    failed = 1;
                }

                if (failed == 0 ) {
                    if ( boundCheck(curRow, curCol)) {
                        destinationRow = curRow;
                        destinationColumn = curCol;
                        break;
                    }
                    
                    cout << "Out of bound bro" <<endl;
                }   
            }
        }

        bool validMove(int thePiece,int pickCol, int pickRow ,int destinationRow, int destinationColumn) {
            int faction = thePiece & 24;

            int pieceType = thePiece & 7;

            if (allyAtDestination(faction, destinationRow, destinationColumn)){
                cout <<"Ally at the destination" << endl;
                return false;
            }
            if (destinationColumn == pickCol && destinationRow == pickRow) {
                cout << "Same place" << endl;
                return false;
            }

            if (pieceType == piece.rook) {
                return validRook(faction, pickCol, pickRow, destinationRow, destinationColumn);
            } else if (pieceType == piece.horse) {
                return validHorse(faction, pickCol, pickRow , destinationRow,  destinationColumn);
            } else if (pieceType == piece.elephant) {
                return validElephant(faction, pickCol, pickRow , destinationRow,  destinationColumn);
            } else if (pieceType == piece.guard) {
                return validGuard(faction, pickCol, pickRow , destinationRow,  destinationColumn);
            } else if (pieceType == piece.king) {
                return validKing(faction, pickCol, pickRow , destinationRow,  destinationColumn);
            } else if (pieceType == piece.cannon) {
                return validCannon(faction, pickCol, pickRow , destinationRow,  destinationColumn);
            } else if (pieceType == piece.pawn) {
                return validPawn(faction,pickCol, pickRow , destinationRow, destinationColumn);
            } 
            return true;


        }

        int allyAtDestination(int faction, int destR, int destC) {
            int pieceAtDestFaction = board[destR * 9 + destC]  & 24;
            if (faction == pieceAtDestFaction) {
                return true;
            }
            return false;
        }

        bool validRook(int faction,int pickCol, int pickRow ,int destR, int destC) {
            int area = piece.getArea(pickCol, pickRow, destC, destR);
            if (area != 0) {
                cout << "only vertical and horizontal direction" << endl;
                return false;
            }

            // check if there is pieces in between
            int vertDirection = destR - pickRow;
            int horiDirection = destC - pickCol;
            if (vertDirection > 0) {
                // moving top
                
                for (int i = pickRow + 1; i < destR; i++) {
                    if (board[i * 9 + pickCol] != 0) {
                        cout <<"piece in between top(rook)" <<endl;
                        return false;
                    }
                }
            } else if (vertDirection < 0) {
                for (int i = pickRow - 1; i > destR; i--) {
                    if (board[i * 9 + pickCol] != 0) {
                        cout <<"piece in between bot(rook)" <<endl;
                        return false;
                    }
                }
            } else if (horiDirection > 0) {
                // moving right
                for (int i = pickCol + 1; i < destC; i++) {
                    if (board[pickRow * 9 + i] != 0) {
                        cout <<"piece in between right(rook)" <<endl;
                        return false;
                    }
                }
            } else if (horiDirection < 0) {
                // moving left
                for (int i = pickCol - 1; i > destC; i--) {
                    if (board[pickRow * 9 + i] != 0) {
                        cout <<"piece in between left(rook)" <<endl;
                        return false;
                    }
                }
            }
            return true;
        }

        bool validPawn(int faction,int pickCol, int pickRow ,int destinationRow, int destinationColumn) {
            int area = piece.getArea(pickCol, pickRow, destinationColumn, destinationRow);
            if (area != 0) {
                cout << "Diagonal (pawn)" << endl;
                return false;
            }

            int verDirection = destinationRow - pickRow;
            int horiDirection = destinationColumn - pickCol;
            if (faction == piece.red && verDirection > 0) {
                cout << "Pawn cannot move back (red)" << endl;
                return false;
            }
            if (faction == piece.green && verDirection < 0) {
                cout << "Pawn cannot move back (green)" << endl;
                return false;
            }

            if (abs(horiDirection) > 1 || abs(verDirection) > 1) {
                cout << "Pawn can only move one step" << endl;
                return false;
            }

            if (abs(horiDirection) == 1 && pickRow >= 5 && faction == piece.red) {
                cout << "Pawn can only move forward at their home turf(red)" << endl;
                return false;
            }

            if (abs(horiDirection) == 1 && pickRow <= 4 && faction == piece.green) {
                cout << "Pawn can only move forward at their home turf(green)" << endl;
                return false;
            }

            return true;
        }

        bool validHorse(int faction,int pickCol, int pickRow ,int destR, int destC) {
            int area = piece.getArea(pickCol, pickRow, destC, destR);
            if (area != 2) {
                cout << "area error: " << area << "(horse)" <<endl;
                return false;
            }
            
            int horiDirect = destC - pickCol;
            int verDirect = destR - pickRow;

            // move in horizontal
            if (abs(horiDirect) == 2) {
                // move right. Check if there is a piece blocking it from moving
                if (horiDirect > 0 && board[pickRow * 9 + pickCol + 1] != 0) {
                    cout << "piece blocking right (horse)" <<endl;
                    return false;
                }
                // move left. Check if there is a piece blocking it from moving
                if (horiDirect < 0 && board[pickRow * 9 + pickCol - 1] != 0) {
                    cout << "piece blocking left (horse)" <<endl;
                    return false;
                }
            }

            if (abs(verDirect) == 2) {
                // move down and  Check if there is a piece blocking it from moving
                if (verDirect > 0 && board[(pickRow + 1) * 9 + pickCol] != 0) {
                    cout << "piece blocking down (horse)" <<endl;
                    return false;
                }
                // move up and  Check if there is a piece blocking it from moving
                if (verDirect < 0 && board[(pickRow - 1) * 9 + pickCol] != 0) {
                    cout << "piece blocking up (horse)" <<endl;
                    return false;
                }
            }
            return true;
        }

        bool validElephant(int faction,int pickCol, int pickRow ,int destinationRow, int destinationColumn) {
            int area = piece.getArea(pickCol, pickRow, destinationColumn, destinationRow);

            int xlen = destinationColumn - pickCol;
            int ylen = destinationRow - pickRow;

            if (abs(xlen) != abs(ylen) || area != 4) {
                cout << "not square placement(elephant)" << endl;
                return false;
            }

            if (faction == piece.green && destinationRow  > 4) {
                cout << "green elephant cant crosee river" <<endl;
                return false;
            }

            if (faction == piece.red && destinationRow < 5) {
                cout << "red elephant cant crosee river" <<endl;
                return false;
            }

            int midx = (destinationColumn + pickCol) / 2;
            int midy = (destinationRow + pickRow) / 2;

            if (board[9 * midy + midx] != 0) {
                cout  << "piece in middle (elephant)" <<endl;
                return false; 
            }


            return true;
        }

        bool validGuard(int faction,int pickCol, int pickRow ,int destinationRow, int destinationColumn) {
            int area = piece.getArea(pickCol, pickRow, destinationColumn, destinationRow);

            if (area != 1) {
                cout << "not moving diagonal (guard)" << endl;
                return false;
            }

            if (!palaceBound(faction, destinationColumn, destinationRow)) {
                cout << "out of the palace (guard)" << endl;
                return false;
            }

            return true;
        }

        bool validKing(int faction,int pickCol, int pickRow ,int destinationRow, int destinationColumn) {
            int area = piece.getArea(pickCol, pickRow, destinationColumn, destinationRow);

            if (flyingKing(faction, pickCol, pickRow, destinationColumn, destinationRow)) {
                return true;
            }
            if (area != 0) {
                cout << "must not move diagonal(area)" <<endl;
                return false;
            }
            if (!palaceBound(faction, destinationColumn, destinationRow)) {
                cout << "must be inside palace" << endl;
                return false;
            }

            int vert = abs(destinationRow - pickRow);
            int hori = abs(destinationColumn - pickCol);

            if (vert > 1 || hori > 1) {
                cout << "can only move 1 block(king)" <<endl;
                return false;
            }
            return true;
        }

        bool validCannon(int faction,int pickCol, int pickRow ,int destinationRow, int destinationColumn) {
            int area = piece.getArea(pickCol, pickRow, destinationColumn, destinationRow);

            if (area != 0) {
                cout << "must not move diagonal(area) Cannon" <<endl;
                return false;
            }

            int vertDistance = destinationRow - pickRow;
            int horiDistance = destinationColumn - pickCol;
            int direction = 0;
            int blockers = 0;
            if (vertDistance  != 0) {
                direction = vertDistance / abs(vertDistance);
                int curRow = pickRow;
                curRow += direction;
                while(curRow != destinationRow) {
                    
                    if (board[curRow * 9 + pickCol] != 0) {
                        blockers++;
                    }
                    curRow += direction;
                }
            } else if (horiDistance  != 0) {
                direction = horiDistance / abs(horiDistance);
                int curCol = pickCol;
                curCol += direction;
                while (curCol != destinationColumn) {
                    
                    if (board[pickRow * 9 + curCol] != 0) {
                        blockers++;
                    }
                    curCol += direction;
                    
                }
            }

            if (blockers == 1 && board[destinationRow * 9 + destinationColumn] != 0) {
                return true;

            } else if (blockers == 0 && board[destinationRow * 9 + destinationColumn] == 0) {
                return true;
            }
            cout << "Invalid move (cannon)" << endl;
            return false;
        }

        bool palaceBound (int faction, int col, int row) {
            if (faction == piece.green) {
                if (col < 3 || col > 5 || row > 2) {
                    return false;
                }
            }

            if (faction == piece.red) {
                if (row < 7 || col < 3 || col > 5 ) {
                    return false;
                }
            }
            return true;
        }

        bool flyingKing(int faction, int intC, int intR, int destC, int destR) {
            int curPiece = board[9 * destR + destC] & 7;
            if (curPiece != piece.king) {
                cout <<"no king at destination(fly king)" << endl;
                return false;
            }

            if (destC != intC) {
                cout << "not straight line(fly king)" << endl;
                return false;
            }

            

            if (faction == piece.green) {
                for (int i = intR + 1; i< destR; i++) {
                    if (board[i * 9 + intC] != 0) {
                        cout << "something in the path(flyking)" << endl;
                        return false;
                    }
                }
            }

            if (faction == piece.red) {
                for (int i = intR - 1; i > destR; i--) {
                    if (board[i * 9 + intC] != 0) {
                        cout << "something in the path(flyking)" << endl;
                        return false;
                    }
                }
            }
            return true;

            
        }
        

};



