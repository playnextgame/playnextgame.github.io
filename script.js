
//Determines if user is on mobile
function mobileTest(){
    var isMobile = window.matchMedia("only screen and (max-width: 760px)");
    return isMobile.matches ? true : false;
}

function LoginLeaderboard(){
    PlayFab.settings.titleId = "F1743";
    var loginRequest = {
        TitleId: PlayFab.settings.titleId,
        CustomId: custId,
        CreateAccount: true
    };

    PlayFabClientSDK.LoginWithCustomID(loginRequest, LeaderboardLoginCallback);
}

function DoExampleLoginWithCustomID(){
    PlayFab.settings.titleId = "F1743";
    var loginRequest = {
        TitleId: PlayFab.settings.titleId,
        CustomId: custId,
        CreateAccount: true
    };

    PlayFabClientSDK.LoginWithCustomID(loginRequest, LoginCallback);
}

//Callback functions for submitting user data
var updateStatsCallback = function (result, error) {
  if (result !== null) {
    console.log("stats callback")
    //gameOverModal.style.display = "none";
    window.location.reload();
  } else if (error !== null) {
      console.log("Here's some debug information:\n")
  }
};
var updateNameCallback = function (result, error) {
  if (result !== null) {
    console.log("name callback")
  } else if (error !== null) {
      console.log("Here's some debug information:\n")
      console.log(error);
  }
};

var leaderboardButtonCallback = function (result, error) {
  if (result !== null) {
     console.log("lead button callback")
     var board = result.data.Leaderboard;
     var leaderboard = document.getElementById("leaderboardButton");
     for(var i = 0; i < board.length; i++){
       var trow = document.createElement("tr");
       var score = document.createElement("td");
       score.innerHTML = board[i].StatValue;
       var name = document.createElement("td");
       var scrollDiv = document.createElement("div");
       scrollDiv.style.width = "20vw";
       scrollDiv.style.overflowX = "auto";
       name.style.alignItems = "center";
       name.style.textAlign = "center";
       scrollDiv.style.alignItems = "center";
       scrollDiv.style.textAlign = "left";
       scrollDiv.innerHTML = board[i].DisplayName;
       var rank = document.createElement("td");
       rank.innerHTML = parseInt(board[i].Position) + 1;

       leaderboard.appendChild(trow);
       trow.appendChild(rank);
       trow.appendChild(name);
       name.appendChild(scrollDiv)
       trow.appendChild(score);
     }
  } else if (error !== null) {
      console.log("Here's some debug information:\n")
      console.log(error);
  }
};

var LeaderboardLoginCallback = function (result, error) {
    if (result !== null) {
      var leaderboardReq = { StartPosition: 0, StatisticName: "Score", MaxResultsCount: 100, CustomId: custId };
      PlayFabClientSDK.GetLeaderboard(leaderboardReq, leaderboardButtonCallback);

    } else if (error !== null) {
      console.log(error);
    }
}

// callback functions take two parameters: result and error
// see callback functions in JavaScript if unclear
var LoginCallback = function (result, error) {

  var leaderboardCallback = function (result, error) {
    if (result !== null) {
       console.log("lead callback")

       var board = result.data.Leaderboard;
       var leaderboard = document.getElementById("leaderboard");
       for(var i = 0; i < board.length; i++){

         var trow = document.createElement("tr");
         var score = document.createElement("td");
         score.innerHTML = board[i].StatValue;
         var name = document.createElement("td");
         var scrollDiv = document.createElement("div");
         scrollDiv.style.width = "20vw";
         scrollDiv.style.overflowX = "auto";
         name.style.alignItems = "center";
         name.style.textAlign = "center";
         scrollDiv.style.alignItems = "center";
         scrollDiv.style.textAlign = "left";
         scrollDiv.innerHTML = board[i].DisplayName;
         var rank = document.createElement("td");
         rank.innerHTML = parseInt(board[i].Position) + 1;

         leaderboard.appendChild(trow);
         trow.appendChild(rank);
         trow.appendChild(name);
         name.appendChild(scrollDiv)
         trow.appendChild(score);
       }
    } else if (error !== null) {
        console.log("Here's some debug information:\n")
        console.log(error);
    }
  };

    if (result !== null) {
      var leaderboardReq = { StartPosition: 0, StatisticName: "Score", MaxResultsCount: 100, CustomId: custId };

      PlayFabClientSDK.GetLeaderboard(leaderboardReq, leaderboardCallback);

    } else if (error !== null) {
      console.log(error);
    }
}

//Return date in mm/dd/yyyy format
function GetFormattedDate() {
    var d = new Date();
    var datestring = (d.getMonth()+1)  + "/" + d.getDate() + "/" + d.getFullYear()
    return datestring;
}

// Reset squares when correct is picked
function resetGame() {
  //Score goes up one
  score++;
  //Change background, timer, and block colors
  r = getRandomInt(255);
  g = getRandomInt(255);
  b = getRandomInt(255);
  textColor = "rgb(" + [r,g,b].join() + ")";
  shadowColor = "rgb(" + [r*(0.8),g*(0.8),b*(0.8)].join() + ")";
  backgroundColor = "rgb(" + [getRandomInt(255),getRandomInt(255),getRandomInt(255)].join() + ")";
  var timer = document.getElementById("timer");
  timer.style.textShadow = "2px 2px " + textColor + ", 4px 4px " + shadowColor + "";
  first = true;
  correct = false;

  tmp = getRandomInt(4);
  for(var i = 0; i < 4; i++){
    if(tmp == i){
      targets[i] = true;
    } else{
      targets[i] = false;
    }
  }

  rects = []
  rects[0] = new rectButton((midx-(basis/6)), (midy-(basis/6)), basis/4, basis/4, r, g, b, targets[0]);
  rects[1] = new rectButton((midx+(basis/6)), (midy-(basis/6)), basis/4, basis/4, r, g, b, targets[1]);
  rects[2] = new rectButton((midx+(basis/6)), (midy+(basis/6)), basis/4, basis/4, r, g, b, targets[2]);
  rects[3] = new rectButton((midx-(basis/6)), (midy+(basis/6)), basis/4, basis/4, r, g, b, targets[3]);

}
//  pass in number for top of range non-inclusive
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

async function timer(){
  timeleft = 15;
  var downloadTimer = setInterval(function(){
  if(timeleft <= 0){
    clearInterval(downloadTimer);
    document.getElementById("timer").innerHTML = "0";
    gameOverText.innerHTML = "Your Score: " + score;
    gameOverModal.style.display = "block";
    DoExampleLoginWithCustomID()
    console.log(score);
  } else {
    document.getElementById("timer").innerHTML = timeleft;
  }
  timeleft -= 1;
  }, 1000);
}

function initTimer(top, left){
  var timer = document.getElementById("timer");
  timer.innerHTML = "15";
  timer.style.textAlign = "center";
  timer.style.position = "absolute";
  timer.style.top = top;
  timer.style.left = left;
  timer.style.transform = "translate(-50%, -50%)";
  timer.style.fontSize = "4vw";
  timer.style.letterSpacing = "0.1em";
  timer.style.webkitTextStrokeWidth = "0px";
  timer.style.webkitTextFillColor = "transparent";
  //timer.style.webkitTextStrokeColor = "white";
  timer.style.textShadow = "2px 2px " + textColor + ", 4px 4px " + shadowColor + "";
}

class x{
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

}
class rectButton {
  constructor(padx, pady, height, width, r, g, b, target) {
    this.padx = padx;
    this.pady = pady;
    this.height = height;
    this.width = width;
    this.r = r;
    this.g = g;
    this.b = b;
    this.fillColor = "rgb(" + [r,g,b].join() + ")";
    this.strokeColor = "rgb(" + [r*(0.5),g*(0.5),b*(0.5)].join() + ")";
    this.target = target;
  }

  setChosen(percent){
    if (first = true){
      this.r = Math.floor(parseFloat(this.r) * parseFloat(percent));
      this.g = Math.floor(parseFloat(this.g) * parseFloat(percent));
      this.b = Math.floor(parseFloat(this.b) * parseFloat(percent));
      this.fillColor = "rgb(" + [this.r,this.g,this.b].join() + ")";
    }
  }
}

//Initialize Canvas
var canvas = document.getElementsByClassName("game");
var parent = document.getElementsByClassName("gameCont");
canvas[0].width = parent[0].offsetWidth;
canvas[0].height = document.body.clientHeight;

let gameActive = true;
let first = true;
let correct = false;
let custId = getRandomInt(1000000000000000000).toString();
let backgroundColor = "rgb(" + [getRandomInt(255),getRandomInt(255),getRandomInt(255)].join() + ")";
let r = getRandomInt(255);
let g = getRandomInt(255);
let b = getRandomInt(255);
let populatelb = true;
let score = 0;
let timeleft = 15;
let exes  = [];
let textColor = "rgb(" + [r,g,b].join() + ")";
let shadowColor = "rgb(" + [r*(0.8),g*(0.8),b*(0.8)].join() + ")";
let rects = [];
let top = "";
let left = "";
const context = document.querySelector("canvas").getContext("2d");
context.width = document.body.clientWidth;
context.height = document.body.clientHeight;

if(context.width > context.height){
  var basis = context.height;

} else {
  var basis = context.width;
}

let midx = context.width/2-(basis/8);
let midy = context.height/2-(context.height/8)-50;
let targets = []

let tmp = getRandomInt(4);
for(var i = 0; i < 4; i++){
  if(tmp == i){
    targets[i] = true;
  } else{
    targets[i] = false;
  }

}
rects[0] = new rectButton((midx-(basis/6)), (midy-(basis/6)), basis/4, basis/4, r, g, b, targets[0]);
rects[1] = new rectButton((midx+(basis/6)), (midy-(basis/6)), basis/4, basis/4, r, g, b, targets[1]);
rects[2] = new rectButton((midx+(basis/6)), (midy+(basis/6)), basis/4, basis/4, r, g, b, targets[2]);
rects[3] = new rectButton((midx-(basis/6)), (midy+(basis/6)), basis/4, basis/4, r, g, b, targets[3]);

//Set up timer
//Check user platform
if (mobileTest() == true){
  top = "61vh";
  left = "50vw";
} else {
  top = "63.4vh";
  left = "50vw";
}


//Listen for click/touch events
const controller = {
  keyListener: function (event) {
   if (gameActive == true){
      if((event.type == "mousedown") || (event.type == "touchstart")) {
        if (event.target.className == "game"){
          //event.preventDefault();
          if(event.offsetX > (midx-(basis/6)) && (event.offsetX < (midx-(basis/6) + basis/4))){
            if(event.offsetY > (midy-(basis/6)) && (event.offsetY < (midy-(basis/6) + basis/4))){
              //console.log("Top Left");
              if (rects[0].target == true){
                exes = [];
                resetGame()
              } else {
                exes[exes.length] = new x(event.offsetX, event.offsetY);
                timeleft--;
                document.getElementById("timer").innerHTML = timeleft;
              }
            }
            if(event.offsetY > (midy+(basis/6)) && (event.offsetY < (midy+(basis/6) + basis/4))){
              //console.log("Bottom Left");
              if (rects[3].target == true){
                exes = [];
                resetGame()
              } else {
                exes[exes.length] = new x(event.offsetX, event.offsetY);
                timeleft--;
                document.getElementById("timer").innerHTML = timeleft;
              }
            }
          }
          else if(event.offsetX > (midx+(basis/6)) && (event.offsetX < (midx+(basis/6) + basis/4))){
            if(event.offsetY > (midy-(basis/6)) && (event.offsetY < (midy-(basis/6) + basis/4))){
              //console.log("Top Right");
              if (rects[1].target == true){
                exes = [];
                resetGame()
              } else {
                exes[exes.length] = new x(event.offsetX, event.offsetY);
                timeleft--;
                document.getElementById("timer").innerHTML = timeleft;
              }
            }
            if(event.offsetY > (midy+(basis/6)) && (event.offsetY < (midy+(basis/6) + basis/4))){
              //console.log("Bottom Right");
              if (rects[2].target == true){
                exes = [];
                resetGame()
              } else {
                exes[exes.length] = new x(event.offsetX, event.offsetY);
                timeleft--;
                document.getElementById("timer").innerHTML = timeleft;
              }
            }
          }
        }
      }
    }
  }
};

//Main game loop logic
const loop = function () {

  // Creates the backdrop for each frame
  context.fillStyle = backgroundColor;
  context.fillRect(0, 0, context.width, context.height); // x, y, width, height

  for (var i = 0; i < rects.length; i++){
    context.beginPath();
    if ((rects[i].target == true) && (first == true)){
      rects[i].setChosen(0.8);
      first = false;
    }
    context.closePath();
    context.fillStyle = rects[i].fillColor;
    context.strokeStyle = rects[i].strokeColor;
    context.lineWidth = 3;
    context.rect(rects[i].padx, rects[i].pady, rects[i].width, rects[i].height);
    context.fill();
    context.stroke();
  }
  for (var i = 0; i < exes.length; i++){
    context.font = "10vw Arial";
    context.fillStyle = "red";
    context.textAlign="center";
    context.textBaseline = "middle";
    context.fillText("X", exes[i].x, exes[i].y);
  }
  window.requestAnimationFrame(loop);

};

window.addEventListener("mousedown", controller.keyListener, { passive: false });
window.addEventListener("mouseup", controller.keyListener);
window.addEventListener("touchstart", controller.keyListener, { passive: false });
window.addEventListener("touchend", controller.keyListener);

// MODAL SETUP
var modal = document.getElementById("startModal");
var leaderboardModal = document.getElementById("leaderboardModal");
var gameOverModal = document.getElementById("gameOverModal");
var gameOverText = document.getElementById("gameOverText");
// turn off leaderboard and game over modals
gameOverModal.style.display = "none";
leaderboardModal.style.display = "none";

// Get the button that opens the modal
var playButton = document.getElementById("playButton");

// When the user clicks on the button, close the modal
playButton.onclick = function() {
  gameActive = true;
  initTimer(top, left);
  timer()
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
    gameActive = true;

  }
  if (event.target.id == "submitButton") {
    let name = document.forms["form"]["fname"].value;
    var updateStatsRequest = { Statistics: [{ StatisticName: "Score", Value: score }]};
    var updateNameRequest = {DisplayName: name};
    PlayFabClientSDK.UpdateUserTitleDisplayName(updateNameRequest, updateNameCallback);
    PlayFabClientSDK.UpdatePlayerStatistics(updateStatsRequest, updateStatsCallback);
  }
  if (event.target.id == "playAgain") {
    var updateStatsRequest = { Statistics: [{ StatisticName: "Score", Value: score }]};
    var updateNameRequest = {DisplayName: "Unknown"};
    PlayFabClientSDK.UpdateUserTitleDisplayName(updateNameRequest, updateNameCallback);
    PlayFabClientSDK.UpdatePlayerStatistics(updateStatsRequest, updateStatsCallback);
  }
  if (event.target.id == "lbbutton") {
    var leaderboardReq = { StartPosition: 0, StatisticName: "Score", MaxResultsCount: 100, CustomId: custId };
    if (populatelb ==  true){
      LoginLeaderboard();
    }
    populatelb = false;
    leaderboardModal.style.display = "block";
    gameActive = true;
  }
}

// Start animation loop
window.requestAnimationFrame(loop);
