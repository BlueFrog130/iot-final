import * as functions from "firebase-functions";
import admin from "firebase-admin";
import stringify from "csv-stringify";

admin.initializeApp();

export const download = functions.https.onRequest(async (req, res) => {
    res.setHeader("Content-Type", "text/csv");
    res.setHeader('Content-Disposition', 'attachment; filename=\"' + 'firestore-' + Date.now() + '.csv\"');
    const collection = await admin.firestore().collection("temp").get();
    const raw = collection.docs.map(d => d.data()) as { timestamp: admin.firestore.Timestamp, day: number, temp: number, humidity: number }[];
    const formatted = raw.map(({ timestamp, day, humidity, temp }) => {
        return {
            day,
            temp,
            humidity,
            time: timestamp.toDate().toLocaleTimeString(undefined, { hour12: false, timeZone: "America/Chicago" })
        }
    });
    stringify(formatted, { header: true })
        .pipe(res);
});