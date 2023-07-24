/*
roadMap :
1. finish Html and CSS.  Checked
2. finish add pieces to the board. Checked
3. Allow pieces to move and follow the rules. Check
4. implement turn based  game. Check
5. win condition. check
6. add reset button check, curTurn check, timer, etc.
7. when piece dead, it move to the side of the board.
8. add customization
 */

import { validMove, Dot, pieceFullname } from "./modules/piece.js";
const boardRow = 10;
const boardCol = 9;
export const board = [];
const chessPlate  = document.getElementById("chessBoard");
const generateButton = document.getElementById("generateItems");
const defaultBoard = "RHEGKGEHR/8/1C5C/P1P1P1P1P/8/8/p1p1p1p1p/1c5c/8/rhegkgehr b 0";
const resetButton = document.getElementById("reset");
const theTurn = document.getElementById("turn");
const theFaction = document.getElementById("curFaction");
let generated = false;
let curPlayer = [];
let curTurn = 0;
let halfMove = 0;
let gameEnd = false;


export function displayInfo(curMessage) {
    let theMessage = document.getElementById("message");
    theMessage.innerText=curMessage;
    

}


function positionCalc (row, col) {
    return row*9+ col;

}
function isCharNumber(c) {
    return c >= '0' && c <= '9';
}


resetButton.addEventListener("click", reset);

function reset() {
    for(let i =0; i < boardRow * boardCol;i++) {
        board[i].removePiece();
    }
    generateButton.style.display="block";
    resetButton.style.display="none";
    
    generateButton.addEventListener("click", generatePos);
    displayInfo("Welcome to my Chinese chess game");
    theFaction.innerText=``;
    theTurn.innerText = "";
    gameEnd = false;
    halfMove = 0;
}

generateButton.addEventListener("click", generatePos);
function generatePos() {
    if (!generated) {
        
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
        formPalace();
        generated = true;
    }
    
    loadBoard();
    
    generateButton.removeEventListener("click",generatePos);
    generateButton.style.display="none";
    resetButton.style.display="block";
    turn();
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
            resetButton.removeEventListener("click", resetListner);
            resolve(pickPiece);
        }
        let resetListner = () => {
            chessPlate.removeEventListener("click", listener);
            resetButton.removeEventListener("click", resetListner);
            reject(1);
        }
        chessPlate.addEventListener("click", listener);
        resetButton.addEventListener("click", resetListner);
    })
}


/* takes in a based turn.  */
async function turn() {
    let initialDot;
    let same = false;
    while(gameEnd === false) {
        theFaction.innerText=`${curPlayer[halfMove % 2]} player turn`;
        theTurn.innerText = "Turn: " + (curTurn);
        if (!same) {
            
            try {
                initialDot = await pickPosition();
            } catch(e) {
                break;
            }
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
        
        
        displayInfo(`${initialDot.getFaction()} ${initialDot.getPieceName()}`);
        let finalDot;
        try {
            finalDot = await pickPosition();
        } catch(e) {
            break;
        }
        
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
        if (curPlayer[halfMove % 2] === curPlayer[1]) {
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
    let intFaction = initialDot.getFaction();
    let intPiece = initialDot.getPieceName();
    let deadPiece = finalDot.getPieceName();
    finalDot.addPiece(intFaction,intPiece);
    initialDot.removePiece();
    if (deadPiece ==="King"){
        win(intFaction);
    }
}

 

function loadBoard(boardString = defaultBoard) {
    let curRow = 0;
    let curCol = 0;

    let gameInfo = boardString.split(" ");
    if (gameInfo[1] === "r") {
        curPlayer = ["red", "black"];
    } else if (gameInfo[1] === "b") {
        curPlayer = ["black", "red"];
    } else {
        alert("unknow Error(loadBoard)");
    }
    curTurn = parseInt(gameInfo[2]);
    let curBoard = gameInfo[0];
    
    for (let i = 0; i < curBoard.length; i++) {
        let pos = curBoard[i];
        let curIndex = positionCalc(curRow, curCol);
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

