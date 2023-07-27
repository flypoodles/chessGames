/*
roadMap :
1. finish Html and CSS.  Checked
2. finish add pieces to the board. Checked
3. Allow pieces to move and follow the rules. Check
4. implement turn based  game. Check
5. win condition. check
6. add reset button check, curTurn check, timer, etc. 
7. when piece dead, it move to the side of the board. check
8. add customization, fix pause/unpause button.
9. undo button
 */

import { validMove, Dot, pieceFullname } from "./modules/piece.js";
import { Timer } from "./modules/timer.js";
const boardRow = 10;
const boardCol = 9;
export const board = [];
const chessPlate  = document.getElementById("chessBoard");
const generateButton = document.getElementById("generateItems");
const defaultBoard = "RHEGKGEHR/8/1C5C/P1P1P1P1P/8/8/p1p1p1p1p/1c5c/8/rhegkgehr b 0";
const resetButton = document.getElementById("reset");
const theTurn = document.getElementById("turn");
const theFaction = document.getElementById("curFaction");

const redTimerText = document.getElementById("redTimer");
const blackTimerText = document.getElementById("blackTimer");
const redTimer = new Timer(redTimerText);
const blackTimer = new Timer(blackTimerText);
const pauseButton = document.getElementById("pause");
const unpauseButton = document.getElementById("unpause");
const timerDict = {
    "red": redTimer,
    "black" : blackTimer
}

export const abortSignal = new AbortController();

const redGrave = [];
let redGraveTracker = 0;
const blackGrave= [];
let blackGraveTracker = 0;
const redGraveyard = document.getElementById("redDeadPieces");
const blackGraveyard = document.getElementById("blackDeadPieces");

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
generateButton.addEventListener("click", generatePos);
pauseButton.addEventListener("click", () => {
    redTimer.PauseTime();
    redTimer.PauseTime();
})
unpauseButton.addEventListener("click", () => {
    redTimer.startTime();
});

function reset() {
    for(let i =0; i < boardRow * boardCol;i++) {
        board[i].removePiece();
    }
    generateButton.style.display="block";
    resetButton.style.display="none";
    
    redTimer.PauseTime();
    blackTimer.PauseTime();
    loadTime(1);
    cleanGraveyard();
    generateButton.addEventListener("click", generatePos);
    displayInfo("Welcome to my Chinese chess game");
    theFaction.innerText=``;
    theTurn.innerText = "";

    
    gameEnd = false;
    halfMove = 0;
}


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
        formGraveyard();
        loadTime(1);
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



function pickPosition(signal) {
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
        let timerListner = () => {
            chessPlate.removeEventListener("click", listener);
            resetButton.removeEventListener("click", resetListner);
            win(curPlayer[(halfMove+1) % 2]);
            reject(1);
        }
        chessPlate.addEventListener("click", listener);
        resetButton.addEventListener("click", resetListner);
        signal.addEventListener("abort", timerListner);
    })
}


/* takes in a based turn.  */
async function turn() {
    let initialDot;
    let same = false;
    let turnEnd = true;
    while(gameEnd === false) {
        if(turnEnd){
            timerDict[curPlayer[halfMove%2]].startTime();
            turnEnd = false;
        }
        theFaction.innerText=`${curPlayer[halfMove % 2]} player turn`;
        theTurn.innerText = "Turn: " + (curTurn);
        if (!same) {
            
            try {
                initialDot = await pickPosition(abortSignal.signal);
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
            finalDot = await pickPosition(abortSignal.signal);
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
        turnEnd = true;
        timerDict[curPlayer[halfMove%2]].PauseTime();
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
    let deadPieceFac = finalDot.getFaction();
    finalDot.addPiece(intFaction,intPiece);
    initialDot.removePiece();
    if (deadPiece ==="King"){
        win(intFaction);
    } else if (deadPiece != "none"){
        bury(deadPieceFac, deadPiece);
    }
}


function bury(deadFaction, deadPiece) {
    if(deadFaction ==="red") {
        redGrave[redGraveTracker++].addPiece(deadFaction,deadPiece);

    } else {
        blackGrave[blackGraveTracker++].addPiece(deadFaction, deadPiece);
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

function loadTime(timeLimit) {
    redTimer.setTime(timeLimit);
    blackTimer.setTime(timeLimit);
    alert(`${redTimer.getDuration()}, ${blackTimer.getDuration()}`)
    redTimer.displayTime();
    blackTimer.displayTime();
}


/* let total = boardRow * boardCol;
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

        } */
function formGraveyard() {
    let baseWidth = "10px";
    let baseHeight = "20px";
    let id = 0;
    let curWidth = baseWidth;
    let curHeight = baseHeight;
    for (let i = 0; i < 8; i++) {
        for(let j = 0; j < 2; j++) {
            let redDiv = document.createElement("div");
            let blackDiv = document.createElement("div");
            
            redDiv.setAttribute("id", id);
            let redDot = new Dot(j,i, redDiv,id);
            let blackDot = new Dot(j,i, blackDiv,id);
            redDiv.style.position="static";
            blackDiv.style.position="static";
            redGraveyard.appendChild(redDiv);
            blackGraveyard.appendChild(blackDiv);
            redGrave.push(redDot);
            blackGrave.push(blackDot);
            redDiv.style.border="1px solid black";
            blackDiv.style.border="1px solid black";
            id++;
        }
        
    }

 
}

function cleanGraveyard() {
    for(let i =0; i < redGrave.length; i++) {
        redGrave[i].removePiece();
        blackGrave[i].removePiece();
    }
    redGraveTracker=0;
    blackGraveTracker=0;
}
/* .graveyard {
    display:flex;
    min-height:200px;
    flex-wrap:wrap;
    justify-content: space-evenly;
    flex-direction: column;

} */