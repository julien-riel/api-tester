const express = require('express');
const requestSA = require('superagent');
const bodyParser = require('body-parser');

// Configure server
const app = express();
app.use(bodyParser.json());

// server global variables
let port = process.env.port || process.argv[2] || 3000 ;
console.log('Détection du port:', port);

// Les valeurs par défaut de l'application
let remoteConfig = {
    object : {
        url: "https://158fgrohl5.execute-api.ca-central-1.amazonaws.com/prod/?string=laval",
        nbTime: 5,
        sleepTime: 100
    }
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
    timerResults.push([
        {
            counter: counter,
            url: url,
            second: endTimer[0],
            millisecond: endTimer[1]/1000000
        }
    ]);
}


// Exécution d'un test. Appeller le url, noter les résultats et continuer
function doOneTestAndContinue(res) {
    
    let startTimer = process.hrtime();
    let url = remoteConfig.object.url; 
    requestSA
    .get(url)
    .end((apiErr, apiResponse) => {
        if (apiErr) {throw apiErr;}
        
        callCounter++;
        addTestResult(callCounter, url, startTimer);
        console.log(callCounter + ' - calling ', url);
        
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