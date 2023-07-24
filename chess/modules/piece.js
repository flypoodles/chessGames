/* import{Dot} from "../main.js";
 */

import {displayInfo, board} from "../main.js";

function positionCalc (row, col) {
    return row*9+ col;

}

function getArea(intCol, intRow, finCol, finRow) {

    return Math.abs((finCol - intCol) * (finRow - intRow));
}

export const pieceFullname = {
    r : "Rook",
    c : "Cannon",
    e : "Elephant",
    g : "Guard",
    h : "Horse",
    k : "King",
    p : "Pawn" 
}
export class Dot {
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
        this.#faction=thisFac;
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
        this.#htmlEle.firstChild.setAttribute("src", "./chessPiece/" + this.#faction +  this.#pieceName+".png");
        
    } 

    removePiece () {
        this.#faction = "none";
        this.#pieceName = "none";
        this.#htmlEle.firstChild.setAttribute("src", "./chessPiece/blank.png");
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
export function validMove(initialDot, finalDot) {
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

export function validCannon(initialDot, finalDot) {
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
export function validElephant(initialDot, finalDot) {
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
export function validGuard(initialDot, finalDot) {
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
export function validHorse(initialDot, finalDot) {
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
        let direction = xlen / Math.abs(xlen);
        if (board[positionCalc(intPos[1], intPos[0]+direction)].getPieceName() != "none") {
            displayInfo("blocking horse's leg");
            return false;
        }
    }
    if (Math.abs(ylen) === 2) {
        let direction = ylen / Math.abs(ylen);
        if (board[positionCalc(intPos[1] + direction, intPos[0])].getPieceName() != "none") {
            displayInfo("blocking horse's leg");
            return false;
        }
    }

    return true;
}
export function validKing(initialDot, finalDot) {
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
export function validPawn(initialDot, finalDot) {
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
export function validRook(initialDot, finalDot) {
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

export function flyingKing (initialDot, finalDot) {
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