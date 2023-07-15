//document.getElementById("count-el").innerText=5;


let count = 0 /* variable */


//console.log(count); /*  */
//console.log("hello");



let age = 20;

console.log(age); /* print stuff */

let humanDogRatio = 7;

let myDogAge = 20 *7;
console.log(myDogAge);

let bonusPoint = 50;

bonusPoint = bonusPoint + 50;
console.log(bonusPoint);
bonusPoint = bonusPoint - 75;
console.log(bonusPoint);
bonusPoint = bonusPoint + 45;
console.log(bonusPoint);

function increment() {
    count = count + 1;
    document.getElementById("count-el").innerText = count; /* in javsscript you cannot delare a variable using dash ex: var-iable */
}


function countdown() {
    console.log(5);
    console.log(4);
    console.log(3);
    console.log(2);
    console.log(1);
}


countdown()

function forty() {
    console.log(42);
}
forty();

let lap1 = 1;
let lap2 = 2;
let lap3 = 3;

function sum() { /* let variables declared inside the function is not in scope outside of the function */

    let temp = lap1 + lap2 + lap3;
    console.log(temp);
}

sum();

let lapsCom = 0;

function incr() {
    lapsCom = lapsCom +1;

}

incr();
incr();
incr();
console.log(lapsCom);