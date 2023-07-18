/*
roadMap :
1. finish Html and CSS.  Checked
2. finish add pieces to the board. Checked
3. Allow pieces to move and follow the rules.
4. implement turn based  game
5. win condition
6. add reset button, curTurn, timer, etc.
 */

const boardRow = 10;
const boardCol = 9;
const board = [];
const chessPlate  = document.getElementById("chessBoard");
const generateButton = document.getElementById("generateItems");
const defaultBoard = "RHEGKGEHR/8/1C5C/P1P1P1P1P/8/8/p1p1p1p1p/1c5c/8/rhegkgehr g 20 100";

const pieceFullname = {
    r : "Rook",
    c : "Cannon",
    e : "Elephant",
    g : "Guard",
    h : "Horse",
    k : "King",
    p : "Pawn"
}
class Dot {
    #col;
    #row;
    #htmlEle;
    #pieceName;
    #id;
    #faction;

    constructor(thisCol, thisRow, thisHtml, thisID, thisPiece = "none",thisFac="none") {
        this.#col = thisCol;
        this.#row = thisRow;
        this.#htmlEle = thisHtml;
        this.#pieceName = thisPiece;
        this.#id = thisID;
        let image = document.createElement("img");
        image.setAttribute("src", "chessPiece/blank.png");
        image.setAttribute("width", 50);
        image.setAttribute("height", 50);
        image.setAttribute("alt", this.#pieceName);
        this.#htmlEle.classList.add("piecePosition");
        this.#htmlEle.appendChild(image);
    }
    /* Make sure thisFaction is all lowerCase 
        Make sure thisPieceName first letter is capitalized*/
    addPiece(thisFaction, thisPieceName) { 
        this.#faction = thisFaction;
        this.#pieceName = thisPieceName;
        this.#htmlEle.firstChild.setAttribute("src", "chessPiece/" + this.#faction +  this.#pieceName+".png");
        
    } 

    removePiece () {
        this.#faction = "none";
        this.#pieceName = "none";
        this.#htmlEle.firstChild.setAttribute("src", "chessPiece/blank.png");
    }
    getPieceName() {
        return this.#pieceName;
    }

    getFaction() {
        return this.#faction;
    }
}



function validPos (row, col) {
    if (row < 0 || col < 0 || row >= 10 || col >= 9) {
        return false;
    }
    return true;
}

function positionCalc (row, col) {
    return row*9+ col;

}
function isCharNumber(c) {
    return c >= '0' && c <= '9';
}


generateButton.addEventListener("click", generatePos);
function generatePos() {

    let total = boardRow * boardCol;
    let id = 0;
    let baseWidth = "40px";
    let baseHeight = "10px";
    let curWidth = baseWidth;
    let curHeight = baseHeight;
    for (let i = 0; i < boardRow; i++) {
        for (let j = 0; j < boardCol; j++) {
            let div = document.createElement("div");
            div.setAttribute("id", id);
            chessPlate.appendChild(div);
            let dot = new Dot (j, i, div, id);
            div.style.top=curHeight;
            div.style.left=curWidth;
            curWidth = (parseInt(curWidth.replace("px",""))+55+j)+"px";
            board.push(dot);
            id++;
        }
        curWidth= baseWidth;
        curHeight= (parseInt(curHeight.replace("px",""))+57+i)+"px";
    }
    loadBoard();
    generateButton.removeEventListener("click",generatePos);
    
    turn(0);
}




function pickPosition() {
    return new Promise((resolve, reject) => {
        
        let listener = (e) => {
            let pickPiece = board[e.target.parentElement.id];
            
            chessPlate.removeEventListener("click", listener);
            resolve(pickPiece);
        }
        chessPlate.addEventListener("click", listener);
    })
}


/* takes in a based turn.  */
async function turn(curTur) {
    while(true) {
        let initialDot = await pickPosition();
        alert(initialDot.getPieceName());
        
        let finalDot = await pickPosition();
        alert(finalDot.getPieceName());

        if (!validMove(initialDot, finalDot)) {
            curTur--;
        }
        movePiece(initialDot, finalDot);
        curTur++;
    }
    


};


function movePiece(initialDot, finalDot) {
    intFaction = initialDot.getFaction();
    intPiece = initialDot.getPieceName();
    finalDot.addPiece(intFaction,intPiece);
    initialDot.removePiece();
}

 
function validMove(initialDot, finalDot) {
    intFaction = initialDot.getFaction();
    intPiece = initialDot.getPieceName();


    return true;
}

function loadBoard(boardString = defaultBoard) {
    let curRow = 0;
    let curCol = 0;

    gameInfo = boardString.split(" ");


    curBoard = gameInfo[0];
    
    for (let i = 0; i < curBoard.length; i++) {
        let pos = curBoard[i];
        curIndex = positionCalc(curRow, curCol);
        console.log(pos);
        if (pos === "/") {
            curCol = 0;
            curRow++;
        } else if (isCharNumber(pos)) {
            curCol += (pos - '0');

        } else if (pos === pos.toUpperCase()) {
            board[curIndex].addPiece("black", pieceFullname[pos.toLowerCase()]);
            curCol++;
        } else if (pos === pos.toLowerCase()) {
            board[curIndex].addPiece("red", pieceFullname[pos.toLowerCase()]);
            curCol++;
        } else {
            alert ("load board failed");
            return false;
        }
        
        

    }
    return true;
}

