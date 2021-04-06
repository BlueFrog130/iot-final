import mqtt from "mqtt"
import firebase from "firebase-admin"
import serviceAccount from "./iot-492-final-firebase-adminsdk-9y2lj-3f7af6654c.json";
import colors from "colors";

firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount as any)
});

interface BaseData {
    temp: number;
    humidity: number;
}

interface Data extends BaseData {
    timestamp: firebase.firestore.Timestamp
    day: number
}

const day0 = new Date("04/05/2021").getDay() - 1;

async function update() {
    const docs = await firebase.firestore().collection("temp").get();
    docs.forEach(doc => {
        doc.ref.update("day", (doc.data()["timestamp"] as firebase.firestore.Timestamp).toDate().getDay() - day0);
    });
}

function main() {
    const client = mqtt.connect("mqtt://localhost");

    client.on("connect", () => {
        client.subscribe("temp/#", err => {
            if(err)
                error(err.message);
            else
                info("Connected");
        });
    });

    client.on("message", async (topic, message) => {
        if(topic.startsWith("temp/")) {
            try {
                const raw = JSON.parse(message.toString());

                if(typeof raw !== "object")
                    throw new Error();

                const baseData: BaseData = {
                    temp: raw.temp,
                    humidity: raw.humidity
                };

                if(Object.values(baseData).some(v => v === undefined))
                    throw new Error();

                const data: Data = {
                    timestamp: firebase.firestore.Timestamp.now(),
                    day: firebase.firestore.Timestamp.now().toDate().getDay() - day0,
                    ...baseData
                };
                const time = data.timestamp.toDate();
                const start = new Date();
                start.setHours(19);
                start.setMinutes(0);
                start.setMilliseconds(0);

                const end = new Date();
                end.setHours(21);
                end.setMinutes(0);
                end.setMilliseconds(0);
                if(time >= start && time <= end) {
                    const name = data.timestamp.seconds;
                    const doc = firebase.firestore().collection("temp").doc(name.toString());
                    await doc.set(data);
                    info(`Wrote data to ${doc.id}`);
                }
                else {
                    warn("Time out of bounds");
                }
            }
            catch(err) {
                warn("Invalid data recieved")
            }
        }
    });
}

function warn(msg: string) {
    console.warn(`[${colors.yellow("WARN")}] [${colors.yellow(new Date().toLocaleTimeString(undefined, { hour12: false }))}] ${msg}`);
}

function error(msg: string) {
    console.error(`[${colors.red("WARN")}] [${colors.red(new Date().toLocaleTimeString(undefined, { hour12: false }))}] ${msg}`);
}

function info(msg: string) {
    console.log(`[${colors.green("INFO")}] [${colors.green(new Date().toLocaleTimeString(undefined, { hour12: false }))}] ${msg}`);
}

update();
main();