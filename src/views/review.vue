<script setup>
import { onMounted, onUnmounted, ref, computed } from 'vue';
import { useImageStore } from '../store/imageStore';

// Get access to our image store
const imageStore = useImageStore();

const imageUrl = computed(() => {
  if (imageStore.tempImage) {
    return window.URL.createObjectURL(imageStore.tempImage) // Using window.URL explicitly
  }
  return '/wesmile-logo.png'
})

onMounted(() => {
  // When the component mounts, we'll get the stored image and create a URL for it
  const storedImage = imageStore.getTempImage;
  if (storedImage) {
    // Create a URL that we can use in our img elements
    imageUrl.value = URL.createObjectURL(storedImage);
  }
  
  // Clean up the created URL when the component unmounts
  onUnmounted(() => {
  if (imageUrl.value && imageUrl.value.startsWith('blob:')) {
    window.URL.revokeObjectURL(imageUrl.value)
  }
})
});

// Function to handle saving the image
const handleSaveImage = () => {
  // Here you would implement your save logic
  console.log('Saving image...');
};
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <!-- Top image - reduced flex-1 to flex-none and added specific height -->
    <div class="flex-none h-[45vh] flex items-center justify-center">
      <img 
        :src="imageUrl"
        alt="WeSmile Logo Top" 
        class="max-h-full w-auto rounded-2xl shadow-lg object-contain"
      />
    </div>

    <!-- Bottom image - reduced flex-1 to flex-none and added specific height -->
    <div class="flex-none h-[45vh] flex items-center justify-center">
      <img
        :src="imageUrl"
        :alt="imageStore.tempImage ? 'Captured Photo' : 'WeSmile Logo Bottom'"
        class="max-h-full w-auto rounded-2xl shadow-lg object-contain"
      />
    </div>

    <!-- Button container - adjusted to take remaining space -->
    <div class="flex-1 relative">
      <button
        @click="console.log('Save button clicked')"
        class="bg-blue-700 text-white text-2xl fixed bottom-0 right-0 h-24 pt-6 px-12 flex items-center rounded-t-full shadow-lg hover:bg-blue-800 transition-colors">
        Save Image
      </button>
    </div>
  </div>
</template>