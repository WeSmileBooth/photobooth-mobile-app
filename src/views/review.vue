<script setup lang="ts">
import { onMounted, onUnmounted, computed } from 'vue'
import { useImageStore } from '../store/imageStore'
import { useWebsocket } from '../composables/useWebsocket'
import { useRouter } from 'vue-router'

// Get access to our image store
const imageStore = useImageStore()
const { sendMessage } = useWebsocket()
const router = useRouter()

const imageUrl = computed(() => {
  if (imageStore.tempImage) {
    return window.URL.createObjectURL(imageStore.tempImage) // Using window.URL explicitly
  }
  return '/wesmile-logo.png'
})

// Compute URL for processed image
const processedImageUrl = computed(() => {
  return imageStore.transformedImageUrl || '/wesmile-logo.png'
})

//Compute URL for original image
const originalImageUrl = computed(() => {
  return imageStore.originalImageUrl || '/wesmile-logo.png'
})

onMounted(() => {
  // When the component mounts, we'll get the stored image and create a URL for it
  const storedImage = imageStore.tempImage
  console.log('processedImageUrl', processedImageUrl.value)
  console.log('originalImageUrl', originalImageUrl.value)
  if (storedImage) {
    // Create a URL that we can use in our img elements
    imageUrl.value = URL.createObjectURL(storedImage)
  }
  sendMessage('DISPLAY_UPDATE', { display: 'review' })
})

// Clean up the created URL when the component unmounts
onUnmounted(() => {
  if (imageUrl.value && imageUrl.value.startsWith('blob:')) {
    window.URL.revokeObjectURL(imageUrl.value)
  }
})

// Function to handle saving the image
const handleSaveImage = async () => {
  try {
    const imageUrlToSave = processedImageUrl.value

    // Check if it's iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
    // Check if it's Android
    const isAndroid = /Android/.test(navigator.userAgent)

    if (isIOS) {
      // For iOS, we'll open the image in a new tab
      // This allows the user to long-press and save
      window.open(imageUrlToSave, '_blank')
      alert('Long press on the image to save it to your photos')
    } else if (isAndroid) {
      // For Android, we'll fetch the image and create a temporary link
      const response = await fetch(imageUrlToSave)
      const blob = await response.blob()
      const blobUrl = window.URL.createObjectURL(blob)

      const link = document.createElement('a')
      link.href = blobUrl
      link.download = 'processed-image.png'
      link.click()

      // Clean up
      setTimeout(() => {
        window.URL.revokeObjectURL(blobUrl)
      }, 100)

      alert('Check your downloads folder for the saved image')
    } else {
      // Fallback for other devices
      window.open(imageUrlToSave, '_blank')
      alert('Long press on the image to save it')
    }
    // TODO: send to idle
    router.push('/landing')
    await sendMessage('DISPLAY_UPDATE', {
      display: 'idle',
    })
  } catch (error) {
    console.error('Error saving image:', error)
    alert('Unable to save image. Please try taking a screenshot instead.')
  }
}
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <!-- Top image - reduced flex-1 to flex-none and added specific height -->
    <div class="flex-none h-[45vh] flex items-center justify-center">
      <img
        :src="originalImageUrl"
        alt="WeSmile Logo Top"
        class="max-h-full w-auto rounded-2xl shadow-lg object-contain"
      />
    </div>

    <!-- Bottom image - reduced flex-1 to flex-none and added specific height -->
    <div class="flex-none h-[45vh] flex items-center justify-center">
      <img
        :src="processedImageUrl"
        :alt="imageStore.tempImage ? 'Captured Photo' : 'WeSmile Logo Bottom'"
        class="max-h-full w-auto rounded-2xl shadow-lg object-contain"
      />
    </div>

    <!-- Button container - adjusted to take remaining space -->
    <div class="flex-1 relative">
      <button
        @click="handleSaveImage"
        class="bg-blue-700 text-white text-2xl fixed bottom-0 right-0 h-24 pt-6 px-12 flex items-center rounded-t-full shadow-lg hover:bg-blue-800 transition-colors"
      >
        Save Image
      </button>
    </div>
  </div>
</template>
