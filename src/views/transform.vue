<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { Vue3Lottie } from 'vue3-lottie'
import { useWebsocket } from '../composables/useWebsocket'
import { emitter } from '../composables/eventBus'
import { useImageStore } from '../store/imageStore'



const router = useRouter()
const { sendMessage } = useWebsocket()
const timer = ref(60)
const imageStore = useImageStore()
let interval: any

onMounted(() => {
  emitter.on('ws-message', (data: any) => {
    console.log('ws-message', data);
    console.log('type', data.type.type);
    
    if (data.type == "GENERATION_COMPLETE") {
      imageStore.setOriginalImageUrl(data.payload.originalImageUrl)
      imageStore.setTransformedImageUrl(data.payload.transformedImageUrl)
      console.log('originalImageUrl', imageStore.originalImageUrl);
      console.log('transformedImageUrl', imageStore.transformedImageUrl);
      router.push('/review')
    }
  })
  
  
  
  interval = setInterval(() => {
       timer.value--
       if (timer.value <= 0) {
           clearInterval(interval)
           sendMessage('DISPLAY_UPDATE', { display: 'review' })
           router.push('/review')
       }
   }, 1000)
})

onUnmounted(() => clearInterval(interval))
</script>

<template>
  <div class="relative w-full h-full">
    <!-- Loading Animation -->
    <Vue3Lottie
      animation-link="https://lottie.host/9a999697-9e06-4773-905c-b16506d427ce/8yvtLXk1am.json"
      :height="400"
      :width="400"
      class="fixed inset-0 scale-100 z-1 flex justify-center items-center"
    />
  </div>
</template>