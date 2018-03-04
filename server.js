const express = require('express');
const requestSA = require('superagent');
const bodyParser = require('body-parser')

// Configure server
const app = express();
app.use(bodyParser.json());

// server global variables
let remoteConfig = {
    object : {
        url: "https://158fgrohl5.execute-api.ca-central-1.amazonaws.com/prod/?string=laval",
        nbTime: 20
    }
};
let running = false;
let callCounter = 0;
let timerResults = [];

function respond(res) {
    res.status(200)
       .json(timerResults);
}

function addTimer(counter, url, startTimer) {
    let endTimer = process.hrtime(startTimer);
    timerResults.push([
        {
            counter: counter,
            url: url,
            second: endTimer[0],
            millisecond: endTimer[1]/1000000
        }
    ]);
}

function callServiceAsync(res) {
    
    let startTimer = process.hrtime();
    
    requestSA
    .get(remoteConfig.object.url)
    .end((apiErr, apiResponse) => {
        if (apiErr) {throw apiErr;}
        callCounter++;
        addTimer(callCounter, remoteConfig.object.url, startTimer);
        console.log('calling ', remoteConfig.object.url);
        if (running && callCounter < remoteConfig.object.nbTime) {
            setImmediate(() => {callServiceAsync(res);})
        } else {
            respond(res);
        }
    });
}

function start(req, res) {
    running = true;
    callCounter = 0;
    callServiceAsync(res)
}

function stop(req, res) {
    running = false;
    res.status(200).send("Stopped");
}

function index(req, res) {
    res.status(200).send('OK');
}

function getConfig(req, res) {
    res.status(200).json(remoteConfig.object);
}

function setConfig(req, res) {
    remoteConfig.object = req.body;
    res.status(200).json(remoteConfig.object);
}

app.get('/', index);
app.get('/start', start);
app.get('/stop', stop);
app.get('/config', getConfig);
app.post('/config', setConfig);

app.listen(3000, () => console.log('Server listening on port 3000!'))