<template>
    <transition name="fade">
        <div v-if="loading" :class="{ 'w-full': overlay, 'h-full': overlay }" class="flex justify-center items-center">
            <svg class="animate-spin flex-initial z-50" viewBox="0 0 24 24" fill="white" :width="size || '1rem'" :height="size || '1rem'" >
                <path :d="icons.mdiLoading"></path>
            </svg>
            <div v-if="loading && overlay" class="w-full h-full bg-black bg-opacity-25 absolute top-0 left-0 z-40 pointer-events-auto"></div>
        </div>
    </transition>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import { mdiLoading } from "@mdi/js"

export default defineComponent({
    name: "Loader",
    props: {
        loading: Boolean,
        overlay: Boolean,
        size: String
    },
    setup() {
        const icons = {
            mdiLoading
        };

        return {
            icons
        }
    }
})
</script>

<style lang="postcss">
.fade-enter-active, .fade-leave-active {
    @apply transition-opacity duration-300;
}
.fade-enter-from, .fade-leave-to {
    @apply opacity-0;
}
</style>