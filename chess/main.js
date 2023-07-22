/*
roadMap :
1. finish Html and CSS.  Checked
2. finish add pieces to the board. Checked
3. Allow pieces to move and follow the rules. Check
4. implement turn based  game. Check
5. win condition
6. add reset button, curTurn, timer, etc.
7. when piece dead, it move to the side of the board.
 */

const boardRow = 10;
const boardCol = 9;
const board = [];
const chessPlate  = document.getElementById("chessBoard");
const generateButton = document.getElementById("generateItems");
const defaultBoard = "RHEGKGEHR/8/1C5C/P1P1P1P1P/8/8/p1p1p1p1p/1c5c/8/rhegkgehr b 0";
let curPlayer = [];
let curTurn = 0;
let halfMove = 0;
let gameEnd = false;
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
    #palace = false;

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

    getPosition() {
        return [this.#col, this.#row];
    }
    getID () {
        return this.#id;
    }

    isPalace() {
        return this.#palace;
    }

    setPalace() {
        this.#palace = true;
    }
}

function displayInfo(curMessage) {
    theMessage = document.getElementById("message");
    theMessage.innerText=curMessage;
    

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

function getArea(intCol, intRow, finCol, finRow) {

    return Math.abs((finCol - intCol) * (finRow - intRow));
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
    formPalace();
    generateButton.removeEventListener("click",generatePos);

    turn(0);
}

function formPalace () {
    for (let i = 0; i < 3; i++) {
        for (let j = 3; j < 6; j++) {
            board[positionCalc(i,j)].setPalace();
            board[positionCalc(i+7,j)].setPalace();
        }
    }

    /* for(let i =0; board.length; i++) {
        
        if (board[i].isPalace()) {
            let curDiv = document.getElementById(i);
            curDiv.style.border = "1em solid black";
        }
    } */
    
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
async function turn() {
    let initialDot;
    let same = false;
    while(gameEnd === false) {
        
        theFaction = document.getElementById("curFaction");
        theFaction.innerText=`${curPlayer[halfMove % 2]} player turn`;
        theTurn = document.getElementById("turn");
        theTurn.innerText = "Turn: " + (curTurn);
        if (!same) {
            initialDot = await pickPosition();
            if (initialDot === undefined || initialDot.getPieceName() ==="none") {
                continue;
            }
            if (curPlayer[halfMove % 2] != initialDot.getFaction()){
                displayInfo(`Must be ${curPlayer[halfMove % 2]} pieces`);
                continue;
            }
        } else {
            same = false;
        }
        
        
        displayInfo(`${initialDot.getPieceName()}`);

        let finalDot = await pickPosition();
        if (finalDot === undefined) {
            continue;
        }
        console.log(finalDot.getPieceName());
        if (initialDot.getFaction() === finalDot.getFaction()) {
            initialDot = finalDot;
            same = true;
            continue;
        }

        if (!validMove(initialDot, finalDot)) {
            continue;
        }
        else {
            movePiece(initialDot, finalDot); 

        }
        if (curPlayer[halfMove % 2] === "black") {
            curTurn++;
        }
        halfMove++;
        
    }
    


};

function win(intFaction) {
    gameEnd = true;
    displayInfo(`${intFaction} wins the game!!`);

}
function movePiece(initialDot, finalDot) {
    intFaction = initialDot.getFaction();
    intPiece = initialDot.getPieceName();
    let deadPiece = finalDot.getPieceName();
    finalDot.addPiece(intFaction,intPiece);
    initialDot.removePiece();
    if (deadPiece ==="King"){
        win(intFaction);
    }
}

 
function validMove(initialDot, finalDot) {
    let intFaction = initialDot.getFaction();
    let intPiece = initialDot.getPieceName();
    let finFaction = finalDot.getFaction();
    let finPiece = finalDot.getPieceName();

    let intPos = initialDot.getPosition();
    let finPos = finalDot.getPosition();

    let intID = positionCalc(intPos[0],intPos[1]);
    let finID = positionCalc(finPos[0],finPos[1]);
    if (intFaction === finFaction && intID != finID) {
        displayInfo("Cannot kill your allies.");
        return false;
    }

    if (intID === finID) {
        displayInfo("Same Place");
        return false;
    }

    /* todo... */
    switch(intPiece) {
        case "Cannon":
            return validCannon(initialDot,finalDot);
        case "Rook":
            return  validRook(initialDot, finalDot);
        case "Elephant":
            return validElephant(initialDot, finalDot);
        case "Pawn":
            return validPawn(initialDot, finalDot);
        case "Horse":
            return validHorse(initialDot, finalDot);
        case "King":
            return validKing(initialDot, finalDot);
        case "Guard":
            return validGuard(initialDot, finalDot);
    }
    return true;
}

function loadBoard(boardString = defaultBoard) {
    let curRow = 0;
    let curCol = 0;

    gameInfo = boardString.split(" ");
    if (gameInfo[1] === "r") {
        curPlayer = ["red", "black"];
    } else if (gameInfo[1] === "b") {
        curPlayer = ["black", "red"];
    } else {
        alert("unknow Error(loadBoard)");
    }
    curTurn = parseInt(gameInfo[2]);
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

function validCannon(initialDot, finalDot) {
    let intFaction = initialDot.getFaction();
    let intPos = initialDot.getPosition();
    let finPos = finalDot.getPosition();
    let direction = 0;
    let blocker = 0;
    if (getArea(intPos[0], intPos[1], finPos[0],finPos[1]) != 0) {
        displayInfo("Cannon cannot move diagonally!");
        return false;
    }
    let horiDis = finPos[0] - intPos[0];
    let verDis = finPos[1] - intPos[1];

    if (horiDis != 0) {
        direction = horiDis / Math.abs(horiDis);
        let curCol = intPos[0];

        curCol += direction;
        while(curCol != finPos[0]) {
            let index = positionCalc( intPos[1],curCol);
            if(board[index].getPieceName() != "none") {
                blocker++;
            }
            curCol += direction;
        }

    } else if (verDis != 0) {
        direction = verDis/Math.abs(verDis);
        let curRow = intPos[1];
        curRow += direction;

        while(curRow != finPos[1]) {
            let index = positionCalc( curRow,intPos[0]);
            if (board[index].getPieceName() != "none") {
                blocker++;
            }
            curRow += direction;
        }
    }

    if (blocker === 1 && finalDot.getPieceName() != "none") {
        return true;
    }

    if (blocker === 0 && finalDot.getPieceName() === "none") {
        return true;
    }

    displayInfo("Invalid Move (Cannon)");
    return false;
}
function validElephant(initialDot, finalDot) {
    let intFaction = initialDot.getFaction();
    let intPos = initialDot.getPosition();
    let finPos = finalDot.getPosition();
    let theArea = getArea(intPos[0], intPos[1], finPos[0],finPos[1]);
    
    let xlen = finPos[0] - intPos[0];
    let ylen = finPos[1] - intPos[1];

    if (Math.abs(xlen) != Math.abs(ylen) || theArea != 4) {
        displayInfo("Elephant must move in a square");
        return false;
    }

    if(intFaction ==="red" && finPos[1] < 5 ) {
        displayInfo("Elephant Cannot cross river(red)");
        return false;
    }
    if(intFaction ==="black" && finPos[1] > 4) {
        displayInfo("Elephant Cannot cross river(black)");
        return false;
    }

    let midx = (finPos[0]+intPos[0]) / 2;
    let midy = (finPos[1] + intPos[1]) / 2;

    let index = positionCalc(midy,midx);
    if (board[index].getPieceName() != "none") {
        displayInfo("middle is occupid ");
        return false;
    }
    return true;
}
function validGuard(initialDot, finalDot) {
    let intPos = initialDot.getPosition();
    let finPos = finalDot.getPosition();

    if(!finalDot.isPalace()) {
        displayInfo("must be within palace")
        return false;
    }
    if (getArea(intPos[0], intPos[1], finPos[0],finPos[1]) != 1) {
        displayInfo("Guard can only move 1 block diagonally!");
        return false;
    }
    return true;
}
function validHorse(initialDot, finalDot) {
    let intFaction = initialDot.getFaction();
    let intPos = initialDot.getPosition();
    let finPos = finalDot.getPosition();
    let theArea = getArea(intPos[0], intPos[1], finPos[0],finPos[1]);

    if (theArea != 2) {
        displayInfo("Horse Invalid Move Area");
        return false;
    }

    let xlen = finPos[0] - intPos[0];
    let ylen = finPos[1] - intPos[1];
    if (Math.abs(xlen) === 2) {
        direction = xlen / Math.abs(xlen);
        if (board[positionCalc(intPos[1], intPos[0]+direction)].getPieceName() != "none") {
            displayInfo("blocking horse's leg");
            return false;
        }
    }
    if (Math.abs(ylen) === 2) {
        direction = ylen / Math.abs(ylen);
        if (board[positionCalc(intPos[1] + direction, intPos[0])].getPieceName() != "none") {
            displayInfo("blocking horse's leg");
            return false;
        }
    }

    return true;
}
function validKing(initialDot, finalDot) {
    let intPos = initialDot.getPosition();
    let finPos = finalDot.getPosition();
    if(!finalDot.isPalace()) {
        displayInfo("must be within palace")
        return false;
    }

    if(flyingKing (initialDot, finalDot)) {
        displayInfo("flyingKing");
        return true;
    }

    if (getArea(intPos[0], intPos[1], finPos[0],finPos[1]) != 0) {
        displayInfo("King must not move diagonally!");
        return false;
    }

    let horiDis = Math.abs(finPos[0] - intPos[0]);
    let verDis = Math.abs(finPos[1] - intPos[1]);

    if (horiDis > 1 || verDis  > 1) {
        displayInfo("King can only move 1 block at a time");
        return false;
    }


    return true;
}
function validPawn(initialDot, finalDot) {
    let intFaction = initialDot.getFaction();
    let intPos = initialDot.getPosition();
    let finPos = finalDot.getPosition();
    let theArea = getArea(intPos[0], intPos[1], finPos[0],finPos[1]);

    if (theArea !=0) {
        displayInfo("Pawn cannot move diagonly");
        return false;
    }
    let xlen = finPos[0] - intPos[0];
    let ylen = finPos[1] - intPos[1];

    if (intFaction === "red" && ylen > 0) {
        displayInfo("Pawn cannot move backward");
        return false;
    }
    if (intFaction === "black" && ylen < 0) {
        displayInfo("Pawn cannot move backward");
        return false;
    }

    if (Math.abs(xlen) > 1 || Math.abs(ylen) > 1) {
        displayInfo("Pawn can only move one step");
        return false;
    }

    if(Math.abs(xlen) === 1 && intFaction ==="red" && finPos[1] > 4) {
        displayInfo("Pawn can only move forward before river");
        return false;
    }
    if(Math.abs(xlen) === 1 && intFaction ==="black" && finPos[1] < 5) {
        displayInfo("Pawn can only move forward before river");
        return false;
    }
    return true;
}
function validRook(initialDot, finalDot) {
    let intPos = initialDot.getPosition();
    let finPos = finalDot.getPosition();
    let theArea = getArea(intPos[0], intPos[1], finPos[0],finPos[1]);

    if (theArea !=0) {
        displayInfo("Rook cannot move diagonly");
        return false;
    }

    let horiDis = finPos[0] - intPos[0];
    let verDis = finPos[1] - intPos[1];

    if (horiDis != 0) {
        let direction = horiDis / Math.abs(horiDis);
        let curCol = intPos[0];

        curCol += direction;
        while(curCol != finPos[0]) {
            let index = positionCalc( intPos[1],curCol);
            if(board[index].getPieceName() != "none") {
                displayInfo ("Invalid Move for Rook");
                return false;
            }
            curCol += direction;
        }

    } else if (verDis != 0) {
        let direction = verDis/Math.abs(verDis);
        let curRow = intPos[1];
        curRow += direction;

        while(curRow != finPos[1]) {
            let index = positionCalc( curRow,intPos[0]);
            if (board[index].getPieceName() != "none") {
                displayInfo ("Invalid Move for Rook");
                return false;
            }
            curRow += direction;
        }
    }
    return true;
}

function flyingKing (initialDot, finalDot) {
    let curPiece = finalDot.getPieceName();
    let intPos = initialDot.getPosition();
    let finPos = finalDot.getPosition();
    let verDis = finPos[1] - intPos[1];

    if (curPiece != "King") {
        console.log("destination piece is not King!!");
        return false;
    }
    if (finPos[0] != intPos[0]) {
        console.log("not straight line(fly king)");
        return false;
    }

    let direction = verDis/Math.abs(verDis);
    let curRow = intPos[1];
    curRow += direction;

    while(curRow != finPos[1]) {
        let index = positionCalc( curRow,intPos[0]);
        if (board[index].getPieceName() != "none") {
            console.log ("piece block (flyinKing)");
            return false;
        }
        curRow += direction;
    }

    return true;
}