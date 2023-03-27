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
let xPos;
let yPos;
let oscReceiveRed = 255;
let oscReceiveGreen = 255;
let oscReceiveBlue = 255;
let mqttReceiveRed = 255;
let mqttReceiveGreen = 255;
let mqttReceiveBlue = 255;

let btnSceneHome;
let btnSceneOne;
let btnSceneTwo;
let btnSceneThree;
let btnSceneFour;
let sound, amplitude;

function preload() {
  sound = loadSound("assets/Themadpixproject_WishYouWereHere.mp3");
}

function setup() {
  /////////////////////////////////////////////
  // FIXED SECION - START: DO NOT CHANGE IT
  /////////////////////////////////////////////

  let cnv = createCanvas(windowWidth, windowHeight);
  setupMqtt();
  setupOsc();
  /////////////////////////////////////////////
  // FIXED SECION - END
  /////////////////////////////////////////////
  cnv.mouseClicked(togglePlay);
  fft = new p5.FFT();
  sound.amp(0.2);

  xPos = windowWidth / 2;
  yPos = windowHeight / 2;
  colourRed = 0;
  colourGreen = 0;
  colourBlue = 0;

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
}

function draw() {
  background(mqttReceiveRed, mqttReceiveGreen, mqttReceiveBlue);
  let spectrum = fft.analyze();
  noStroke();
  fill(oscReceiveRed, oscReceiveGreen, oscReceiveBlue);
  for (let i = 0; i < spectrum.length; i++) {
    let x = map(i, 0, spectrum.length, width, 0);
    let h = -height + map(spectrum[i], 0, 255, height, 0);
    rect(x, height, width / spectrum.length, h);
  }

  let waveform = fft.waveform();
  noFill();
  beginShape();
  fill(10, 100, 200);
  stroke(255, 255, 0);
  for (let i = 0; i < waveform.length; i++) {
    let x = map(i, 0, waveform.length, width, 0);
    let y = map(waveform[i], -1, 1, 0, height);
    vertex(x, y);
  }
  endShape();
  push();
  fill(255);
  text("tap to play", 20, 50);
  pop();

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

function togglePlay() {
  if (sound.isPlaying()) {
    sound.pause();
  } else {
    sound.loop();
  }
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
    oscReceiveRed = value[0];
  } else if (address == "/colour/green") {
    oscReceiveGreen = value[0];
  } else if (address == "/colour/blue") {
    oscReceiveBlue = value[0];
  }
  if (address.includes("position")) {
    xPos = map(value[0], -1, 1, 0, windowWidth);
    yPos = map(value[1], -1, 1, 0, windowHeight);
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
    mqttReceiveRed = rgbColours[0].trim();
    mqttReceiveGreen = rgbColours[1].trim();
    mqttReceiveBlue = rgbColours[2].trim();
  }
}
