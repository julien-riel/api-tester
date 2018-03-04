# Testeur d'API

Service pour appeler en boucle un url et mesurer les performances

## Installation
```
git clone https://github.com/julien-riel/api-tester.git
cd api-tester
npm install
node server.js
```

# Endpoints
adsfsadf

## GET `/`
Affiche des informations à propos du service

## GET `/config`
Retourne la configuration

Valeurs par défaut des paramètres de configuration: 
```javascript
let configuration = {
    url: "https://158fgrohl5.execute-api.ca-central-1.amazonaws.com/prod/?string=laval",
    nbTime: 20
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
            "url": "https://158fgrohl5.execute-api.ca-central-1.amazonaws.com/prod/?string=laval",
            "second": 0,
            "millisecond": 510.813041
        }
    ],
...
```

## GET `/stop`
Arrête le test