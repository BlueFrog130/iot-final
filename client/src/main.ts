import { createApp } from "vue"
import App from "./App.vue"
import "./index.css"
import firebase from "firebase/app"
import "firebase/firestore"
import router from "./router"

const firebaseConfig = {
    apiKey: "AIzaSyC9-sau16O1aEYUHp1V4chaSXfqBdVGo0U",
    authDomain: "iot-492-final.firebaseapp.com",
    projectId: "iot-492-final",
    storageBucket: "iot-492-final.appspot.com",
    messagingSenderId: "746315979054",
    appId: "1:746315979054:web:f1dfd9cd490f580d5d02bf"
};

firebase.initializeApp(firebaseConfig);

createApp(App).use(router).mount("#app")
