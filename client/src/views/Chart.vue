<template>
    <section class="min-h-full relative container mx-auto text-white py-10 flex flex-col">
        <section class="grid grid-cols-2 gap-4 place-items-center flex-shrink">
            <h2 class="text-3xl col-span-auto">Charts</h2>
            <button class="py-2 px-3 bg-gray-600 border border-gray-700 shadow-2xl transition hover:bg-gray-700 hover:border-gray-500" @click="fetchData" :disabled="data.length > 0" >Fetch Data</button>
        </section>
        <section class="grid grid-cols-1 gap-4 place-items-center mt-8 flex-grow">
            <div class="bg-white">
                <canvas id="data" />
            </div>
            <canvas id="avgs" />
            <canvas id="maxTemp" />
            <canvas id="minTemp" />
            <canvas id="maxHumidity" />
            <canvas id="minHumidity" />
        </section>
    </section>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, onMounted } from "vue"
import firebase from "firebase/app"
import { Chart, registerables } from "chart.js"

Chart.register(...registerables);

interface Data extends AvgData {
    timestamp: firebase.firestore.Timestamp
}

interface AvgData {
    temp: number;
    humidity: number;
    day: number
}

export default defineComponent({
    name: "Chart",
    setup() {
        let data = reactive<Data[]>([]);

        const fetchData = async () => {
            data = (await firebase.firestore().collection("temp").get()).docs.map(d => d.data() as Data)
        }

        const getDay = (d: number) => data.filter(x => x.day === d);

        onMounted(() => {
            const ctx = document.getElementById("data") as HTMLCanvasElement;
            if(!ctx) return;
            const chart = new Chart(ctx, {
                type: "line",
                data: {
                    datasets: [
                        {
                            data,
                            label: "Temperature",
                            parsing: {
                                xAxisKey: "timestamp",
                                yAxisKet: "temp"
                            }
                        },
                        {
                            data,
                            label: "Humidity",
                            parsing: {
                                xAxisKey: "timestamp",
                                yAxisKet: "humidity"
                            }
                        }
                    ],
                }
            });
        })

        const avgs = computed(() => {
            const distinct = new Set(data.map(d => d.day));
            const out: AvgData[] = [];
            for(const day of distinct) {
                const dayData = getDay(day);
                out.push({
                    day,
                    temp: dayData.reduce((a, { temp }) => a + temp, 0) / dayData.length,
                    humidity: dayData.reduce((a, { humidity }) => a + humidity, 0) / dayData.length,
                });
            }
            return out;
        });

        const maxTemp = computed(() => {
            const distinct = new Set(data.map(d => d.day));
            const out: Data[] = [];
            for(const day of distinct) {
                const dayData = getDay(day);
                const max = dayData.reduce((o, c) => c.temp > o.temp ? c : o);
                out.push(max);
            }
            return out;
        });

        const maxHumidity = computed(() => {
            const distinct = new Set(data.map(d => d.day));
            const out: Data[] = [];
            for(const day of distinct) {
                const dayData = getDay(day);
                const max = dayData.reduce((o, c) => c.humidity > o.humidity ? c : o);
                out.push(max);
            }
            return out;
        });

        const minTemp = computed(() => {
            const distinct = new Set(data.map(d => d.day));
            const out: Data[] = [];
            for(const day of distinct) {
                const dayData = getDay(day);
                const max = dayData.reduce((o, c) => c.temp < o.temp ? c : o);
                out.push(max);
            }
            return out;
        });

        const minHumidity = computed(() => {
            const distinct = new Set(data.map(d => d.day));
            const out: Data[] = [];
            for(const day of distinct) {
                const dayData = getDay(day);
                const max = dayData.reduce((o, c) => c.humidity < o.humidity ? c : o);
                out.push(max);
            }
            return out;
        });

        return {
            data,
            avgs,
            getDay,
            maxHumidity,
            maxTemp,
            minHumidity,
            minTemp,
            fetchData
        }
    }
})
</script>