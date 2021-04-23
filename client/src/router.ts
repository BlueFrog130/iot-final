import { createWebHistory, createRouter, RouteRecordRaw  } from "vue-router"

const routes: RouteRecordRaw[] = [
    {
        path: "/",
        name: "download",
        component: () => import("./views/Home.vue")
    },
    {
        path: "/chart",
        name: "chart",
        component: () => import("./views/Chart.vue")
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;