#include <iostream>
#include <vector>
#include <map>
#include <cstdlib>
using namespace std;
class Piece  {
    public:
        int rook = 7;
        int horse = 6;
        int elephant = 5;
        int guard = 4;
        int king = 3;
        int cannon = 2;
        int pawn = 1;
        int green = 8;
        int red = 16;

        map<int , char> numToPiece{{7, 'r'}, {6, 'h'}, {5, 'e'}, {4, 'g'}, {3, 'k'}, {2, 'c'}, {1, 'p'}};
        map <int, string> pieceToString{ {16, "red"},{8,"green"},{7, "rook"}, {6, "horse"}, {5, "elephant"}, {4, "guard"}, {3, "king"}, {2, "cannon"}, {1, "pawn"}};

        int getArea(int intx, int inty,int finx,int finy) {
            //cout << intx << " " << inty << " " << finx << " " << finy<<endl;
            int xdis = finx - intx;
            int ydis = finy - inty;
            //cout << xdis  << " " << ydis << endl;
            return abs(xdis * ydis);
        }

        

    private:
        

        
        

};
