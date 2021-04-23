<template>
    <section class="h-full relative container mx-auto flex items-center justify-center flex-col">
        <h3 class="text-xl text-white m-6">Mysterious Download Button</h3>
        <button @click="download" class="bg-gray-300 hover:bg-gray-400 transition text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center focus:outline-none shadow-2xl">
            <svg v-if="!loading" class="fill-current w-4 h-4 mr-2" viewBox="0 0 24 24" >
                <path :d="icons.mdiDownload"></path>
            </svg>
            <svg v-else class="fill-current animate-spin flex-initial w-4 h-4 mr-2" viewBox="0 0 24 24">
                <path :d="icons.mdiLoading"></path>
            </svg>
            <span>Download</span>
        </button>
        <h5 class="text-l text-gray-300 m-6">Click if you dare</h5>
    </section>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue"
import { mdiDownload, mdiLoading } from "@mdi/js";
import firebase from "firebase/app"

export default defineComponent({
    name: "Home",
    setup() {
        const icons = {
            mdiDownload,
            mdiLoading
        }

        const loading = ref(false);

        function convertToCSV(objArray: any[]) {
            const array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
            let str = '';

            for (let i = 0; i < array.length; i++) {
                let line = '';
                for (let index in array[i]) {
                    if (line != '') line += ','

                    line += array[i][index];
                }

                str += line + '\r\n';
            }

            return str;
        }

        const download = async () => {
            loading.value = true;
            const collection = await firebase.firestore().collection("temp").get();
            const data = collection.docs.map(d => d.data());
            const formatted = data.map(({ timestamp, day, humidity, temp }) => {
                return {
                    day,
                    temp,
                    humidity,
                    time: timestamp.toDate().toLocaleTimeString(undefined, { hour12: false, timeZone: "America/Chicago" })
                }
            });
            formatted.unshift({
                day: "day",
                temp: "temp",
                humidity: "humidity",
                time: "time"
            });
            const csv = convertToCSV(formatted);
            const exportedname = `firebase-${Date.now()}.csv`;
            const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
            const link = document.createElement("a");
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", exportedname);
            link.style.visibility = "hidden";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            loading.value = false;
        };

        return {
            icons,
            download,
            loading
        }
    }
})
</script>