# Testeur d'API

Service pour appeler en boucle un url et mesurer les performances

# Endpoints

## GET `/`
Affiche des informations à propos du service

## GET `/config`
Retourne la configuration

Valeurs par défaut des paramètres de configuration: 
```javascript
let configuration = {
        "url": "https://158fgrohl5.execute-api.ca-central-1.amazonaws.com/prod?string=radar",
        "nbTime": 5,
        "sleepTime": 100,
        "showResponse": true,
        "appendUuid": false
    }
```

## POST `/config`
Permet de modifier la configuration

## GET `/start`
Démarre le test. Appelle `url` `nbTime` fois. 

Retourne le resultat d'exécution. Par exemple:
```javascript
[
    [
        {
            "counter": 1,
            "url": "https://158fgrohl5.execute-api.ca-central-1.amazonaws.com/prod?string=laval",
            "second": 0,
            "millisecond": 510.813041
        }
    ],
...
```

## GET `/stop`
Arrête le test

# Pour démarrer plusieurs services à la fois (bash)
```sh
node server.js 2000 &
node server.js 2001 &
node server.js 2002 &
```

## Installation et éxcution locale
```
git clone https://github.com/julien-riel/api-tester.git
cd api-tester
npm install
npm start
```

# Docker
Note: Le fichier Dockerfile n'est pas encore testé.

## Construire l'image 
```
docker build -t <your username>/api-tester .
```

## Exécuter l'image
```
docker run -p 3000:3000 -d <your username>/node-web-app
```
