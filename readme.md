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
            "url": "https://exemple.org/",
            "milliseconds": 510.813041
        }
    ],
...
```

## GET `/stop`
Arrête le test

# Installation et éxcution locale
```
git clone https://github.com/julien-riel/api-tester.git
cd api-tester
npm install
npm start
```

# Pour démarrer plusieurs services à la fois (bash)
```sh
npm start 2000 &
npm start 2001 &
npm start 2002 &
```

# Docker

## Exécuter l'image
```
docker run -p 3000:3000 --env url=http://google.com jriel/api-tester
```

## Construire l'image 
```
docker build -t jriel/api-tester .
```

