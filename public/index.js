/***********************************************************************
  IDEA9101 - WEEK 4 - Example 01 - Receiving MQTT

  Author: Luke Hespanhol
  Date: March 2022
***********************************************************************/

const MQTT_LISTEN_TOPIC = "mqttHQ-client-ideaLabtest";


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
let oscReceiveRed = 0;
let oscReceiveGreen = 0;
let oscReceiveBlue = 0;
let mqttReceiveRed = 0;
let mqttReceiveGreen = 0;
let mqttReceiveBlue = 0;

let btnSceneHome;
let btnSceneOne;
let btnSceneTwo;
let btnSceneThree;
let btnSceneFour;

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

  btnSceneHome  = createButton ("GO TO HOME");
  btnSceneHome.position(0, 0);
  btnSceneHome.mousePressed(goToSceneHome);

  btnSceneOne = createButton ("GO TO SCENE ONE");
  btnSceneOne.position(200, 0);
  btnSceneOne.mousePressed(goToSceneOne);

  btnSceneTwo = createButton ("GO TO SCENE TWO");
  btnSceneTwo.position(400, 0);
  btnSceneTwo.mousePressed(goToSceneTwo);

  btnSceneThree = createButton ("GO TO SCENE THREE");
  btnSceneThree.position(600, 0);
  btnSceneThree.mousePressed(goToSceneThree);

  btnSceneFour = createButton ("GO TO SCENE FOUR");
  btnSceneFour.position(800, 0);
  btnSceneFour.mousePressed(goToSceneFour);

}

function draw() {
  //background(colourRed, colourGreen, colourBlue);
  background(255, 255, 255);
  fill(0);
  text("Last MQTT Message = " + mqttReceivedMessage, 20, 40);

  fill(mqttReceiveRed, mqttReceiveGreen, mqttReceiveBlue);
  ellipse(70, 70, 50);

  fill(0);
  text("Last OSC value = " + oscReceivedValue, 20, 120);
  fill(oscReceiveRed, oscReceiveGreen, oscReceiveBlue);
  ellipse(70, 170, 50);
}


function goToSceneHome(){
	window.location.href = "index.html" ;
  }
  function goToSceneOne(){
	window.location.href = "sceneOne.html";
  }
  function goToSceneTwo(){
	window.location.href = "sceneTwo.html";
  }
  function goToSceneThree(){
	window.location.href = "sceneThree.html" ;
  }
  function goToSceneFour(){
	window.location.href = "sceneFour.html" ;
  }


////////////////////////////////////////////////////
// CUSTOMIZABLE SECTION - END: ENTER OUR CODE HERE
////////////////////////////////////////////////////

////////////////////////////////////////////////////
// OSC MESSAGE HANDLING
////////////////////////////////////////////////////
//custom function for handling receieved osc messages
function routeOsc(address, value) {
	console.log("Osc Received: " + address + ", " + value);
  if (address == "/example") {
    oscReceivedValue = value[0];
  } else if (address == "/colour/red") {
    oscReceiveRed = value[0];
  } else if (address == "/colour/green") {
    oscReceiveGreen = value[0];
  } else if (address == "/colour/blue") {
    oscReceiveBlue = value[0];
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
