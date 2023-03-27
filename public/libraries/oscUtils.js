// we need these to make socket.io work
var HOST = window.location.origin;
let xmlHttpRequest = new XMLHttpRequest();
var socket;

//this holds our OSC values that we send and receive
let value = [0, 0];

/*
OSC functions for send and receive
*/
function setupOsc() {
  socket = io.connect(HOST);
  socket.on("oscMessage", receiveOsc);
}

//our function to wrap OSC message sending
function sendMessage(address, value) {
  value = [value, 0];
  let postData = JSON.stringify({
    id: 1,
    address: address,
    value: value,
  });

  xmlHttpRequest.open("POST", HOST + "/sendMessage", false);
  xmlHttpRequest.setRequestHeader("Content-Type", "application/json");
  xmlHttpRequest.send(postData);
}

//this is our callback function. When the socket receives a UDP packet, this function unpacks the address and value and passes it to the function in sketch.js
function receiveOsc(data) {
  

  var address = data.address;
  var values = [];

  // iterate through all the elements in the data.args array
  for (var i = 0; i < data.args.length; i++) {
    // access the value property of each element and store it in the values array
    values.push(data.args[i].value);
  }
  console.log( "OSC Utils message: Received message:Address: " + data.address + ", value: " + values);

  routeOsc(address, values);
}
