//TODO go back and clean up the code.  Lots of things that can be made into functions
var workMin = 25;
var workSec = 0;
var holdWork;
var setWork = 25; 
var restMin = 5;
var restSec = 0;
var holdRest;
var setRest = 5;
var mode = "work";
var paused = true; 
var tic;
var alarm = new Audio("Alarm.wav");

$(document).ready(function(){
    settings();

});


function settings(){
    $("#onOff").click(function(){
        if (paused){ //start the timer / unpausing
            $("#onOff").text("Pause?");
            paused = false;
            colorChange();
            holdWork = setWork;  //remember the settings after we started the animation
            holdRest = setRest; 
            tic = setInterval(ticTimer, 1000);
        }
        else if (!paused){  //pause the timer
            $("#onOff").text("Start!");
            paused = true;
            colorChange();
            clearInterval(tic);
        }
    });
    
    $("#workAdd").click(function(){
        if (paused && setWork < 99){
            workSec = 0;
            setWork += 1;
            workMin = setWork;
            printTimer("#workSpan", setWork, 0);
        }  
    });

    $("#workSub").click(function(){
        if (paused && setWork > 1){
            workSec = 0;
            setWork -=1;
            workMin = setWork;
            printTimer("#workSpan", setWork, 0);
        }
    });

    $("#restAdd").click(function(){
        if (paused && setRest < 99){
            restSec = 0;
            setRest +=1;
            restMin = setRest;
            printTimer("#restSpan", setRest, 0);
        }
    });

    $("#restSub").click(function(){
        if (paused && setRest > 1){
            restSec = 0;
            setRest -=1;
            restMin = setRest;
            printTimer("#restSpan", setRest, 0);
        }
    });
}

function printTimer(timerId, min, sec){
    if (sec < 10 && sec >= 0){
        var ticSec = "0" + sec.toString();
    }
    else{
        ticSec = sec;
    }

    if (min < 10 && min >= 0){
        var ticMin = "0" + min.toString();
    }
    else{
        ticMin = min;
    }

    $(timerId).text(ticMin + ":" + ticSec);
}

function ticTimer(){
    
    if (mode == "work"){
        if (workSec === 0 && workMin ===0 ){
            reset();
        }
        else { 
            if (workSec === 0 && workMin > 0){
                workSec = 59;
                workMin -= 1;
            }
            else{
                workSec -= 1;
            }
            printTimer("#timer", workMin, workSec, mode);
        }
    }
    
    if (mode == "rest"){
        if (restSec === 0 && restMin === 0){
            reset();
        }
        else { 
            if (restSec === 0 && restMin > 0){
                restSec = 59;
                restMin -= 1;
            }
            else{
                restSec -= 1;
            }
            printTimer("#timer", restMin, restSec, mode);
        }
    }
}

function reset(){
    clearInterval(tic);
    alarm.play();
    
    if (mode == "work"){
        mode = "rest";
        if (holdRest == setRest){holdRest = undefined;}
        workMin = setWork;  //update to changed settings
    }
    else if (mode == "rest"){
        mode = "work";
        if (holdWork == setWork){holdWork = undefined;}
        restMin = setRest;  //same 
    }

    colorChange();
    tic = setInterval(ticTimer, 1000);
}

function colorChange(){
    
    if (paused == true){
        $('body').css("animation-play-state", "paused");
        $('body').css("-webkit-animation-play-state", "paused")
        document.title = "Pomodoro - Paused"
    }
    else{
        if (mode == "work"){
            document.title = "Pomodoro - Work";
            
            if (holdWork == setWork){  //if we are unpausing the timer mid-countodwn, animation shouldnt change
                $('.greenToRed').css("animation-play-state", "running");
                $('.greenToRed').css("-webkit-animation-play-state", "running");
            
            }
            else if (holdWork > workMin || setWork > holdWork){ //if we increased the work timer while paused, restart the animation with the new time from new beginning
                //cant simply replace and readd class.  **TODO stress test
                var element = document.getElementsByTagName("body")[0];
                element.preventDefault;
                element.classList.remove("greenToRed");             
                void element.offsetWidth;
                element.classList.add("greenToRed");                            
                $('.greenToRed').css("animation-duration", (setWork*60)+2 + "s");
                $('.greenToRed').css("-webkit-animation-duration", (setWork*60)+2 + "s");
                $('.greenToRed').css("animation-play-state", "running");
                $('.greenToRed').css("-webkit-animation-play-state", "running");
            }
            else{  //if we are starting the initial animation
                $('body').removeClass("redToGreen");
                $('body').addClass("greenToRed");
                
                $('.greenToRed').css("animation-duration", (setWork*60)+2 + "s");
                $('.greenToRed').css("-webkit-animation-duration", (setWork*60)+2 + "s");
                $('.greenToRed').css("animation-play-state", "running");
                $('.greenToRed').css("-webkit-animation-play-state", "running");
            }
        }
        if (mode == "rest"){
            document.title = "Pomodoro - Rest";
            
            if (holdRest == setRest){ //if unpausing timer mid-countdown, no animation change.
                $('.redToGreen').css("animation-play-state", "running");
                $('.redToGreen').css("-webkit-animation-play-state", "running");                
            }
            else if (holdRest > restMin || setRest > holdRest){
                //cant simply replace and readd class.  **TODO stress test
                var element = document.getElementsByTagName("body")[0];
                element.preventDefault;
                element.classList.remove("redToGreen");             
                void element.offsetWidth;
                element.classList.add("redToGreen");                            
                $('.redToGreen').css("animation-duration", (setRest*60)+2 + "s");
                $('.redToGreen').css("-webkit-animation-duration", (setRest*60)+2 + "s");
                $('.redToGreen').css("animation-play-state", "running");
                $('.redToGreen').css("-webkit-animation-play-state", "running");
            }
            else{ //initial proper animation;
                $('body').removeClass("greenToRed");
                $('body').addClass("redToGreen");
                $('.redToGreen').css("animation-duration", (setRest*60)+2 + "s");
                $('.redToGreen').css("-webkit-animation-duration", (setRest*60)+2 + "s");
                $('.redToGreen').css("animation-play-state", "running");
                $('.redToGreen').css("-webkit-animation-play-state", "running");
            }
        }
    }
}