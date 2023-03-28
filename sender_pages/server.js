// Port for the Express web server
var WEB_SERVER_PORT = 3000;
var OSC_PORT_IN = 12000;
var OSC_PORT_OUT = 11000;

var MQTT_LISTEN_TOPIC = 'mqttHQ-client-ideaLabtest';



// Import Express and initialise the web server
var express = require('express');
var app = express();
var server = app.listen(WEB_SERVER_PORT);
app.use(express.static('public'));
console.log('Server message: Node.js Express server running on port ' + WEB_SERVER_PORT);
console.log('Server message: OSC listening on port ' + OSC_PORT_IN);
console.log('Server message: OSC sending on port ' + OSC_PORT_OUT);
console.log('Server message: MQTT listening to topic ' + MQTT_LISTEN_TOPIC);


// Import and configure body-parser for Express
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


// Import socket.io and create a socket to talk to the client
var socket = require('socket.io');
var io = socket(server);
io.sockets.on('connection', newSocketConnection);

function newSocketConnection(socket) {
    console.log('Server message: *** New connection to server web socket ' + socket.id);
}

// Import MQTT
var mqtt=require('mqtt');
const mqttHost = 'public.mqtthq.com'
const mqttPort = '1883'
const mqttClientId = `mqtt_${Math.random().toString(16).slice(3)}`
const mqttConnectUrl = `mqtt://${mqttHost}:${mqttPort}`
var mqttOptions = {
  mqttClientId,
  clean: true,
  connectTimeout: 4000,
  reconnectPeriod: 1000,
};
const mqttClient = mqtt.connect(mqttConnectUrl, mqttOptions);
mqttClient.on("connect", newMqttConnectionSuccess);
mqttClient.on("error", mqttConnectionrError);
mqttClient.on('message', receiveMqttMessage);

function newMqttConnectionSuccess() {
    console.log('Server message: *** MQTT connected to host  ' + mqttHost + ':' + mqttPort + '(client id: ' + mqttClientId + ')');

    const topicList = [MQTT_LISTEN_TOPIC];
    mqttClient.subscribe(topicList, {qos:1}, () => {
        console.log(`Server message: Subscribed to topics '${topicList}'`)
      });
}

function mqttConnectionrError(error) {
    console.log("Server message: Cannot connect to MQTT:" + error);
}

function receiveMqttMessage(topic, message, packet) {
    console.log("Server message: topic is "+ topic);
    console.log("Server message: message is "+ message);
    var data = [topic, "" + message];
    io.sockets.emit('mqttMessage', data);
}

var osc = require("osc");
var udpPort = new osc.UDPPort({
    localAddress: "0.0.0.0",
    localPort: OSC_PORT_IN,
    metadata: true
});

// Listen for incoming OSC messages.
udpPort.on("message", function (oscMsg, timeTag, info) {
    // console.log("An OSC message just arrived!", oscMsg);
    // console.log("Remote info is: ", info);
    io.sockets.emit('oscMessage', oscMsg);
});

// Open the socket.
udpPort.open();

// Handle POST requests
app.post('/sendMessage', function(request, response) {
	var address = request.body.address;
	var value = request.body.value;

	// console.log("POST received: address: " + address + ", value: " + value);

	sendOSC(address, value);
    response.end("");
});

// Send OSC messages
function sendOSC(address, value) {
    var valueArray = [];
    for (var i = 0; i < value.length; i++) {
        var elem = {
                type: "s",
                value: value[i]
        };
        valueArray.push(elem);
    }

    udpPort.send({
        address: address,
        args: valueArray
    }, "127.0.0.1", OSC_PORT_OUT);
}

// Handles termination of this process, i.e. this is run when 
// we type 'Ctrl+C' on the Terminal windoe to close thew server.
process.on('SIGINT', () => {
  console.log('===> SIGINT signal received.');
  mqttClient.end();
  console.log('===> MQTT connection closed.');
  udpPort.close();
  console.log('===> OSC connection closed.');
  io.close();
  console.log('===> WebSocket connection closed.');
  console.log('===> Node server exit complete.');
  process.exit(1);
});


