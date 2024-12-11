<script setup lang="ts">
import { useIntervalFn } from '@vueuse/core';
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useWebsocket } from '../composables/useWebsocket.ts'

const { notifyRetakeCapture, notifyStartTransform, isConnected } = useWebsocket()

const router = useRouter()
const count = ref(6)
const isCountdownComplete = ref(false)

const countdown = useIntervalFn(() => {
  console.log('Countdown:', count.value)
  if (count.value === 0) {
    isCountdownComplete.value = true;
    return countdown.pause()
  }
  count.value--
}, 1000)

const onRetakeClick = async () => {
  try {
    const success = await notifyRetakeCapture()
    console.log('📸 Retake button clicked, WebSocket connected:', isConnected.value)
    if (success) {
      count.value = 6
      isCountdownComplete.value = false
      countdown.resume()
    }
  } catch (error) {
    console.error('❌ Error starting capture:', error)
  }
}

const onContinueClick = async () => {
  try {
    const success = await notifyStartTransform()
    console.log('🔁 Continue button clicked, WebSocket connected:', isConnected.value)
    if (success) {
      router.push('/transform')
    } else {
      console.error('❌ Error starting transform')
    }
  } catch (error) {
    console.error('❌ Error starting transform:', error)
  }
}


onMounted(() => {
  console.log('Component mounted')
  countdown.resume();
})
</script>

<template>
  <div class="h-screen w-screen grid grid-rows-6 overflow-hidden m-0 p-0 absolute inset-0 bg-gradient-to-b from-blue-50 to-white">
    <div class="h-full">
      <transition name="slide-bottom">
        <button
          v-show="isCountdownComplete"
          @click="onRetakeClick"
          class="bg-green-600 text-white text-3xl absolute left-0 mt-14 px-8 py-8 flex items-center rounded-r-full"
        >
          Retake
        </button>
      </transition>
    </div>

    <div class="row-span-4 flex items-center justify-center">
      <template v-if="!isCountdownComplete">
        <span
          v-if="countdown.isActive.value"
          class="text-[15rem] sm:text-[20rem] text-green-500 fixed font-bold"
        >
          {{ count }}
        </span>
      </template>
      <template v-else>
        <img
          src="/wesmile-logo.png"
          alt="Robot Photobooth"
          class="mx-auto w-[300px] h-[300px] object-contain"
        >
      </template>
    </div>

    <div class="h-full relative">
      <transition name="slide-top">
        <div v-show="isCountdownComplete" class="h-full">
          <button
            @click="onContinueClick"
            class="bg-blue-700 text-white text-4xl absolute bottom-0 h-[90%] pt-8 px-12 right-0 flex items-center rounded-t-full"
          >
            Continue
          </button>
        </div>
      </transition>
    </div>
  </div>
</template>