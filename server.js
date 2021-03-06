const config = require('config');
const express = require('express');
const requestSA = require('superagent');
const bodyParser = require('body-parser');
const uuidv4 = require('uuid/v4');

// Configure server
const app = express();
app.use(bodyParser.json());

// server global variables
let port = process.env.port || process.argv[2] || 3000 ;

let configFromFile = config.get('remoteConfig');
let configWithEnv = {
    url: process.env.url  || configFromFile.url,
    nbTime: process.env.nbTime || configFromFile.nbTime,
    sleepTime: process.env.sleepTime || configFromFile.sleepTime,
    showResponse: process.env.showResponse || configFromFile.showResponse,
    appendUuid: process.env.appendUuid || configFromFile.appendUuid
};

// Les valeurs par défaut de l'application
let remoteConfig = {
    object : configWithEnv
};
let running = false;
let callCounter = 0;
let timerResults = [];

// ** Fonctions privées

// Retourne sur la sortie http le résultat d'exécution du test
function sendTestResult(res) {
    res.status(200)
       .json(timerResults);
}

// Accumule les résultats d'exécution d'un appel au service
// TODO : Corriger second et millisecond
function addTestResult(counter, url, startTimer) {
    let endTimer = process.hrtime(startTimer);

    const nanoseconds = (endTimer[0] * 1e9) + endTimer[1];
	const milliseconds = nanoseconds / 1e6;
    
    timerResults.push([
        {
            counter: counter,
            url: url,
            milliseconds: milliseconds
        }
    ]);
}


// Exécution d'un test. Appeller le url, noter les résultats et continuer
function doOneTestAndContinue(res) {

    let startTimer = process.hrtime();
    
    let url = remoteConfig.object.url; 
    if (remoteConfig.object.appendUuid == true) {
        url += "&uuid=" + uuidv4();
    }

    console.log(callCounter + ' - Calling:', url);
    
    requestSA
    .get(url)
    .end((apiErr, apiResponse) => {
        if (apiErr) {throw apiErr;}
        if (remoteConfig.object.showResponse == true) {
            console.log(apiResponse.status + ' ' + apiResponse.text);
        } 
        
        callCounter++;
        addTestResult(callCounter, url, startTimer);
        
        if (running && callCounter < remoteConfig.object.nbTime) {
            setTimeout(() => {doOneTestAndContinue(res);}, remoteConfig.object.sleepTime);
            
        } else {
            sendTestResult(res);
            console.log('** Fin du test')
        }
    });
}

// ** Fonctions de l'API

function start(req, res) {
    console.log('** Début du test');
    running = true;
    callCounter = 0;
    doOneTestAndContinue(res);
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

// Assignations des routes
app.get('/', index);
app.get('/start', start);
app.get('/stop', stop);
app.get('/config', getConfig);
app.post('/config', setConfig);

app.listen(port, () => console.log(''
 + '  GET http://localhost:' + port + '/start pour démarrer le test.\n'
 + '  GET http://localhost:' + port + '/config pour obtenir la configuration.\n'
 + '  POST http://localhost:' + port + '/config pour définir la configuration.\n'
 + '  GET http://localhost:' + port + '/stop pour arrêter le test.\n\n'
 + 'Configuration:\n' + JSON.stringify(remoteConfig.object, null, 3) + '\n'
 + 'Le serveur écoute sur le port ' + port
));