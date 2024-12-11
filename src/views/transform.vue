<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { Vue3Lottie } from 'vue3-lottie'
import {useWebsocket} from '../composables/useWebsocket'

// Constants
const INITIAL_COUNTDOWN = 4
const INTERVAL_DELAY = 1000

// Component setup
const router = useRouter()
const { notifyShowReview, isConnected } = useWebsocket()
const secondsRemaining = ref(INITIAL_COUNTDOWN)
const isLoading = ref(true)
const error = ref<string | null>(null)

// Handle navigation to review page
const navigateToReview = async () => {
  try {
    const success = await notifyShowReview()    
    if (success) {
      await router.push('/review')
    } else {
      throw new Error('Failed to show review')
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'An unexpected error occurred'
    console.error('❌ Error showing review:', err)
    isLoading.value = false
  }
}

// Setup countdown timer
let countdownInterval: NodeJS.Timer | null = null

const startCountdown = () => {
  countdownInterval = setInterval(() => {
    if (secondsRemaining.value <= 0) {
      if (countdownInterval) {
        clearInterval(countdownInterval)
      }
      console.log('Image generation complete! Navigating to review page...')
      navigateToReview()
      return
    }

    console.log(`Image generating, ready in ${secondsRemaining.value} seconds...`)
    secondsRemaining.value--
  }, INTERVAL_DELAY)
}

// Lifecycle hooks
onMounted(() => {
  startCountdown()
})

onUnmounted(() => {
  if (countdownInterval) {
    clearInterval(countdownInterval)
  }
})
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