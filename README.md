# IoT 492 Final
### By Adam Grady & Supriti Ghosh
<br>

## MQTT

Directory housing the local MQTT subscriber on the `temp` topic. This subscriber will update the firestore database with the temperature data.

### Installation

To run the MQTT client, a MQTT server needs to be installed on the local machine. For example, installing [mosquitto](https://mosquitto.org/) on a Raspbeery Pi.

Navigate to the `client` directory and run the following:
```
npm install
```

### Starting the client
```
npm run start
```

## ESP32

Directory containing the code executed on the ESP32. Utilizes MQTT code from the [micropython library](https://github.com/micropython/micropython-lib).

## Client

Directory containing the website where the data is downloadable.
