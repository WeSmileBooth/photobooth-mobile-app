<script setup lang="ts">
import { useMounted } from '@vueuse/core'
const isMounted = useMounted()
</script>

<template>
  <div class="absolute inset-0 min-h-screen w-full m-0 p-0 bg-gradient-to-b from-blue-50 to-white overflow-hidden flex flex-col">
    <div class="flex-1 flex items-center justify-center px-6 pt-12 min-h-0">
      <div class="text-center space-y-8">
        <img
          src="/wesmile-logo.png"
          alt="Robot Photobooth"
          class="mx-auto w-[300px] h-[300px] object-contain"
        >
      </div>
    </div>

    <Transition name="slide-top">
      <div
        v-show="isMounted"
        class="fixed bottom-0 w-full flex justify-center items-center m-0"
      >
        <router-link to="/capture" custom v-slot="{ navigate }">
          <button
            @click="navigate"
            class="bg-blue-600 text-white text-xl sm:text-2xl md:text-3xl
              h-36 sm:h-44 md:h-52 
              pt-6 sm:pt-8 md:pt-10
              px-12 sm:px-14 md:px-16
              flex items-center rounded-t-full
              shadow-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Take a photo
          </button>
        </router-link>
      </div>
    </Transition>
  </div>
</template>

<style>
/* Add this outside of scoped style to affect the app container */
#app {
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
  position: relative;
}

html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>

<style scoped>
.slide-top-enter-active,
.slide-top-leave-active {
  transition: transform 0.5s ease-out;
}

.slide-top-enter-from,
.slide-top-leave-to {
  transform: translateY(100%);
}
</style>