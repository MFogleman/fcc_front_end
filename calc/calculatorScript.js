"use strict";
var num1 = "0";
var num2 = "0";
var operator1 = undefined;
var display = document.getElementById("display");
var key =[];// Array.from(document.getElementsByClassName("key"));
var keyRouter = {
    "digit"     : digitPressed,
    "operator"  : operatorPressed,
    "clear"     : clearPressed,
    "equal"     : equalPressed,
    "dot"       : dotPressed,
    "back"      : backPressed
};
for (var i = 0; i< document.getElementsByClassName("key").length; i+=1){
    key.push(document.getElementsByClassName("key")[i]);
}

printNumber(num1); //replace "Loading..." with "0"

key.forEach(function(element){
    return element.addEventListener("click", keyClicked);
});


function keyClicked() { 

    /*uses keyRouter to decide what function to call based 
    on which key is clicked, and passes the key's unique Id.*/

    var keyType = this.classList[1];
    var keyId = this.id;
    return keyRouter[keyType](keyId);
}

function digitPressed(keyId){
    if (num1.length < 10){  //keep display window from overflowing
        if (num1 != "0"){   //replace 0 if it exists with user input
            num1 += keyId;
        }else{  //or concatenate current displayed number with user input
            num1 = keyId;  
        }
        return printNumber(num1);
    }
}

function operatorPressed(keyId){
    if (operator1 && num1 && num2){ //true if user is chaining claculations
        num1 = doMath(num1, operator1, num2).toString(); //do math as we chain
        printNumber(num1);
    }
    num2 = num1 || num2;  //if num1 != 0 push its value to num2.
    num1 = "0";
    return operator1 = keyId;
}

function equalPressed(){
    if (num1 && operator1 && num2){ //if equal wasn't pressed in vain
        var total = doMath(num1, operator1, num2).toString();
        num1 = total;
        num2 = "";
        operator1 = "";
        return printNumber(total);
    } 
}

function clearPressed(){
    num1 = "0";
    num2 = "0";
    operator1 = "";
    return printNumber("0");
}

function backPressed(){
    num1 = num1.slice(0, -1);
    printNumber(num1);
}

function dotPressed(){
    if (num1.length < 9){
        if (num1 == "0"){
            num1 = "0.";
            return printNumber(num1);
        }
        if (num1.indexOf(".") == -1){
            num1 += ".";
            return printNumber(num1);
        }
    }
}

function printNumber(number){
    return display.textContent = number.toString(); 
} 

function doMath(num1, operator, num2) {
    var answer;
    switch (operator) {
    case "add": 
        answer = parseFloat(num1) + parseFloat(num2);
        break;
    case "subtract":
        answer = parseFloat(num2) - parseFloat(num1);
        break;
    case "multiply":
        answer = parseFloat(num1) * parseFloat(num2);
        break;
    case "divide":
        answer = parseFloat(num2) / parseFloat(num1);
        break;
    }
    return answer.toString().substring(0, 10);
}