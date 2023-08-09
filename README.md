# parkinggarage-codingchallenge

Coding challenge opdracht [Parkeergarage](https://dev.azure.com/CloudCompetenceCenter/salmagundi/_wiki/wikis/salmagundi.wiki/5704/Parkeergarage#)

## Benodigdheden

### MySQL

Zorg dat je een MySQL database hebt draaien. Maak daar een database aan voor dit project.

### Clone de repo en install packages

Clone deze repo. Navigeer naar de backend folder:

```
cd backend
```

... en installeer de npm packages:

```
npm install
```

### Environment variabelen

Gebruik de `.env.template` file om je eigen `.env` file te maken met portnummer en database gegevens.

### Start server

Gebruik node om de server te starten:

```
node server
```

De server is te bereiken via REST API endpoints. Meer hierover vind je hieronder.

## De garage

De parkeergarage bestaat uit twee 'groepen' parkeerplaatsen:
- overdekt, 100 plaatsen, 4 euro per uur, starttarief 1 euro (id 14)
- op het dak, 50 plaatsen, 2 euro per uur, starttarief 1 euro (id 15)

Deze zijn gespecificeerd in `/config/parkingSpotsGroups.js`. Beide groepen hebben een eigen slagboom.

Daarnaast zijn er nog 20 elektrische laadpalen. Die staan allemaal in het overdekte gedeelte van de parkeerplaats, zoals je kunt zien in `/config/electricChargingPoints`.

Er zijn betaalautomaten aanwezig die zowel voor de overdekte parkeerplaatsen als de plekken op het dak gebruikt kunnen worden.

## Stap voor stap parkeren

Om van deze parkeergarage gebruik te kunnen maken moet je de volgende handelingen verrichten:

Bij het inrijden een kaartje halen bij de slagboom. Je kiest hier al of je overdekt of op het dak gaat parkeren. Maak hiervoor een `POST` request naar `/api/parking-sessions` waarbij je in de body aangeeft of je overdekt (id 14) of op het dak (id 15) gaat parkeren:

```
{
    "parkingspots_group_id": 14
}
```

Je krijgt dan o.a. het `id` van je parkingsession terug - zie dit als je kaartje, schrijf deze op.

Als je overdekt parkeert kun je je elektrische auto opladen. Het laden start als je je inrij-kaart tegen de laadpaal houdt. Dit doe je door een `POST` request te maken naar `/api/electric-charging-sessions`. Geef hierbij in de body aan wat het id is van jouw kaartje (`parkingsession_id`), en bij welke laadpaal je gaat staan (die hebben id 212 t/m 231, zie `/config/electricChargingPoints.js`):

```
{
    "parkingsession_id": 1,
    "chargingpoint_id": 230
}
```

Je krijgt het id van je laadsessie terug, deze heb je nodig om je sessie later te beëindigen.

Als je aan het laden bent, moet je de laadsessie stoppen voordat je naar de betaalautomaat gaat (dat is niet logisch bedenk ik nu ik dit schrijf). Dit doe je door een `POST` request te maken naar `/api/electric-charging-sessions/:id` waarbij `:id` het id van je laadsessie is. Om dit handig te kunnen testen kun je in de body een datetime mee geven die verder in de toekomst ligt, welke gebruikt zal worden voor het stoppen van de laadsessie:

```
{
    "futureDateTime": "2023-08-09T20:31:23.000Z"
}
```

Daarna moet je, voordat je uit kunt rijden, langs de betaalautomaat. Die vertelt je hoeveel je moet betalen door een `GET` request te maken naar `/api/parking-sessions/payment/:id` waarbij `:id` het id van je parkeerkaartje is. Ook hier kun je in de body voor testdoeleinden een datetime in de toekomst mee geven om mee te rekenen:

```
{
    "futureDateTime": "2023-08-09T20:40:23.000Z"
}
```

De betaalautomaat vertelt je hoeveel je moet betalen (in centen). Voldoe deze betaling door een `POST` request te maken naar `/api/parking-sessions/payment/:id` met in de body het bedrag (in centen):

```
{
    "payment": 900
}
```

Na het betalen heb je 15 minuten de tijd om bij de slagboom bij de uitgang te komen.

Bij de uitgang stop je je kaartje in de slagboom om deze te openen. Dit doe je door een `POST` request te maken naar `/api/parking-sessions/:id` waarbij `:id` het id van je parkeerkaartje is. Ook hier kun je in de body weer een datetime in de toekomst mee geven om te testen:

```
{
    "futureDateTime": "2023-08-09T20:45:01.000Z"
}
```

Als je genoeg betaalt hebt (op het moment van uitrijden, je hebt 15 minuten) dan gaat de slagboom open (en krijg je een nietveelzeggende `[ 1 ]` terug van de API. Als je nog niet of te weinig betaald hebt, dan krijg je daar een overzicht van te zien. Je kunt dan nogmaals langs de betaalautomaat om bij te betalen.

## Andere endpoints

Voor het overzicht zijn er nog enkele andere endpoints beschikbaar, die je niet per se nodig hebt bovenstaande stappen te voltooien:

### Parking sessions

**Get all parkingsessions**: `GET` request naar `/api/parking-sessions`.

**Get a specific parkingsession by id**: `GET` request naar `/api/parking-sessions/:id`.

**Get available parkingspots**: `GET` request naar `/api/parking-sessions/available/14` (of id 15 voor de parkeerplaatsen op het dak).

### Electric charging sessions

**Get all electric charging sessions**: `GET` request naar `/api/electric-charging-sessions`.

**Get a specific electric charging session by id**: `GET` request naar `/api/electric-charging-sessions/:id`

**Get all charging sessions belonging to a parking session id**: `GET` request naar `/api/electric-charging-sessions/all-from-parking-session/:id`.

