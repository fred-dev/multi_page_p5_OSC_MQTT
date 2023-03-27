/***********************************************************************
  IDEA9101 - WEEK 4 - Example 01 - Receiving MQTT

  Author: Luke Hespanhol
  Date: March 2022
***********************************************************************/
/*
	Disabling canvas scroll for better experience on mobile interfce.
	Source: 
		User 'soanvig', answer posted on Jul 20 '17 at 18:23.
		https://stackoverflow.com/questions/16348031/disable-scrolling-when-touch-moving-certain-element 
*/

const MQTT_LISTEN_TOPIC = "mqttHQ-client-ideaLabtest";

document.addEventListener("touchstart", function (e) {
  document.documentElement.style.overflow = "hidden";
});

document.addEventListener("touchend", function (e) {
  document.documentElement.style.overflow = "auto";
});

//////////////////////////////////////////////////
//FIXED SECTION: DO NOT CHANGE THESE VARIABLES
//////////////////////////////////////////////////
var WEB_SERVER_PORT = 3000;
var HOST = window.location.origin;
var socket;

////////////////////////////////////////////////////
// CUSTOMIZABLE SECTION - BEGIN: ENTER OUR CODE HERE
////////////////////////////////////////////////////
let oscReceivedValue = 0;
let mqttReceivedMessage = "";
let receiveRed = 0;
let receiveGreen = 0;
let receiveBlue = 0;

let btnSceneHome;
let btnSceneOne;
let btnSceneTwo;
let btnSceneThree;
let btnSceneFour;

let bubbles = [];
let img;

function preload() {
  img = loadImage("assets/bubble_w2.png");
}

function setup() {
  /////////////////////////////////////////////
  // FIXED SECION - START: DO NOT CHANGE IT
  /////////////////////////////////////////////
  createCanvas(windowWidth, windowHeight);
  setupMqtt();
  setupOsc();
  /////////////////////////////////////////////
  // FIXED SECION - END
  /////////////////////////////////////////////

  btnSceneHome = createButton("GO TO HOME");
  btnSceneHome.position(0, 0);
  btnSceneHome.mousePressed(goToSceneHome);

  btnSceneOne = createButton("GO TO SCENE ONE");
  btnSceneOne.position(200, 0);
  btnSceneOne.mousePressed(goToSceneOne);

  btnSceneTwo = createButton("GO TO SCENE TWO");
  btnSceneTwo.position(400, 0);
  btnSceneTwo.mousePressed(goToSceneTwo);

  btnSceneThree = createButton("GO TO SCENE THREE");
  btnSceneThree.position(600, 0);
  btnSceneThree.mousePressed(goToSceneThree);

  btnSceneFour = createButton("GO TO SCENE FOUR");
  btnSceneFour.position(800, 0);
  btnSceneFour.mousePressed(goToSceneFour);

  for (let i = 0; i < 10; i++) {
    //use a for loop to create 10 new bubbles and initialise them
    bubbles[i] = new Bubble(
      random(width),
      random(height),
      random(50, 150),
      img
    );
  }
}

function draw() {
  background(receiveRed, receiveGreen, receiveBlue);
  //use a for loop to iterate through the bubbles array
  for (let i = 0; i < bubbles.length; i++) {
    bubbles[i].move();
    bubbles[i].display();
  }
}

//make our bubble class
class Bubble {
  constructor(x, y, r, img) {
    //set up our object with parameters
    this.x = x;
    this.y = y;
    this.r = r;
    this.img = img;
  }
  move() {
    //this will shake the x and y values a little bit
    this.x = this.x + random(-2, 2);
    this.y = this.y + random(-2, 2);
  }
  display() {
    image(this.img, this.x, this.y, this.r, this.r);
  }
}

function goToSceneHome() {
  window.location.href = "index.html";
}
function goToSceneOne() {
  window.location.href = "sceneOne.html";
}
function goToSceneTwo() {
  window.location.href = "sceneTwo.html";
}
function goToSceneThree() {
  window.location.href = "sceneThree.html";
}
function goToSceneFour() {
  window.location.href = "sceneFour.html";
}

////////////////////////////////////////////////////
// CUSTOMIZABLE SECTION - END: ENTER OUR CODE HERE
////////////////////////////////////////////////////

////////////////////////////////////////////////////
// OSC MESSAGE HANDLING
////////////////////////////////////////////////////
//custom function for handling receieved osc messages
function routeOsc(address, value) {
  if (address == "/example") {
    oscReceivedValue = value[0];
  } else if (address == "/colour/red") {
    receiveRed = value[0];
  } else if (address == "/colour/green") {
    receiveGreen = value[0];
  } else if (address == "/colour/blue") {
    receiveBlue = value[0];
  }
}

function setupMqtt() {
  socket = io.connect(HOST);
  socket.on("mqttMessage", receiveMqtt);
}

function receiveMqtt(data) {
  var topic = data[0];
  var message = data[1];
  console.log("Topic: " + topic + ", message: " + message);

  mqttReceivedMessage = message;

  if (topic.includes(MQTT_LISTEN_TOPIC)) {
    rgbColours = message.split(",");
    receiveRed = rgbColours[0].trim();
    receiveGreen = rgbColours[1].trim();
    receiveBlue = rgbColours[2].trim();
  }
}
