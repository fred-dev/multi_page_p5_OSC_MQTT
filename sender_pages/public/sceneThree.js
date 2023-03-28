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

let analyserNode;

async function getMedia(constraints) {
  try {
    let stream = null;
    stream = await navigator.mediaDevices.getUserMedia(constraints);
    /* use the stream */
    const audioContext = new AudioContext();
    const microphone = audioContext.createMediaStreamSource(
      stream
    );
    analyserNode = audioContext.createAnalyser();
    microphone.connect(analyserNode);
  } catch (err) {
    /* handle the error */
  }
}

function getLevel() {
  if (!analyserNode) {
    return 0;
  }
  const pcmData = new Float32Array(analyserNode.fftSize);
  analyserNode.getFloatTimeDomainData(pcmData);
  let sumSquares = 0.0;
  for (const amplitude of pcmData) {
    sumSquares += amplitude * amplitude;
  }
  return Math.sqrt(sumSquares / pcmData.length);
}

////////////////////////////////////////////////////
// CUSTOMIZABLE SECTION - BEGIN: ENTER OUR CODE HERE
////////////////////////////////////////////////////
let oscReceivedValue = 0;
let mqttReceivedMessage = "";
let oscReceiveRed = 255;
let oscReceiveGreen = 255;
let oscReceiveBlue = 255;
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
  getMedia({
    audio: true,
    video: false,
  });
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

}

function draw() {
  background(mqttReceiveRed, mqttReceiveGreen, mqttReceiveBlue);

  vol = getLevel();
  //console.log(vol)
    
  fill(oscReceiveRed, oscReceiveGreen, oscReceiveBlue);
  stroke(0);

  // Draw an ellipse with height based on volume
  let h = map(vol, 0, 1, height, 0);
  ellipse(width / 2, h - 10, 50, 50);
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

function mousePressed(){
  getAudioContext().resume();
}

function gotSources(deviceList) {
  if (deviceList.length > 0) {
    //set the source to the first item in the deviceList array
    audioIn.setSource(0);
    let currentSource = deviceList[audioIn.currentSource];
    text('set source to: ' + currentSource.deviceId, 5, 20, width);
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
