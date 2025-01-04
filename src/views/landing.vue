<script setup lang="ts">
import { useMounted } from '@vueuse/core'
import { useWebsocket } from '../composables/useWebsocket.ts'
import { useRouter } from 'vue-router'  // Add this
import { onMounted } from 'vue';

const router = useRouter()  
const { sendMessage } = useWebsocket()
const isMounted = useMounted()

onMounted(async () => {
  //await sendMessage('DISPLAY_UPDATE', { display: 'idle' })
})


const handlePhotoClick = async () => {
  try {
    const success = await sendMessage('DISPLAY_UPDATE',{display: 'capture'})  // Wait for result
    if (success) {
      router.push('/capture')
    }
  } catch (error) {
    console.error('❌ Error starting capture:', error)
  }
}
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
        <button
          @click="handlePhotoClick"
          class="bg-blue-600 text-white text-xl sm:text-2xl md:text-3xl
            h-36 sm:h-44 md:h-52
            pt-6 sm:pt-8 md:pt-10
            px-12 sm:px-14 md:px-16
            flex items-center rounded-t-full
            shadow-lg hover:bg-blue-700 transition-colors duration-200"
        >
          Take a photo
        </button>
      </div>
    </Transition>
  </div>
</template>