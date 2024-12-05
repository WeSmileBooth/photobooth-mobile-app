<script setup lang="ts">
import { useIntervalFn, useUserMedia } from '@vueuse/core';
import { onMounted, onUnmounted, ref, watch, watchEffect } from 'vue'
import { useImageStore } from '../store/imageStore';

// Add debug logs
console.log('Script starting')

const capturedImageBlob = ref<Blob | null>(null)
const isUploaded = ref(false)
const imageStore = useImageStore()

function snapshotImage(
  src: CanvasImageSource,
  size: { width: number; height: number }
) {
  const canvas = new OffscreenCanvas(size.width, size.height);
  const context = canvas.getContext("2d")!;
  context.translate(size.width, 0);
  context.scale(-1, 1);
  context.drawImage(src, 0, 0);
  return canvas;
}

const camera = useUserMedia({
  constraints: {
    video: {
      width: { ideal: 256, max: 1024 },
      height: { ideal: 256, max: 1024 },
      facingMode: 'user', // This specifies front camera
      // Add iOS specific constraints
      aspectRatio: 1,
      frameRate: { max: 30 }
    },
    audio: false, // Explicitly disable audio
  },
})

const video = ref<HTMLVideoElement | null>(null)

watchEffect(() => {
  console.log('watchEffect triggered', video.value, camera.stream.value)
  if(video.value && camera.stream.value) {
    video.value.srcObject = camera.stream.value;
    console.log('Stream set to video')
  }
})

const count = ref(4)
const countdown = useIntervalFn(() => {
  console.log('Countdown:', count.value)
  if (count.value === 0) {
    return countdown.pause()
  }
  count.value--
}, 1000)

async function onRetakeClick() {
  isUploaded.value=false
  console.log('Retake clicked')
  const _video = video.value;
  if (_video && _video.paused) {
    count.value = 4;
    await _video.play();
    countdown.resume();
  }
}

// Initialize camera
const initCamera = async () => {
  console.log('Initializing camera')
  try {
    await camera.start();
    console.log('Camera started successfully')
  } catch (error) {
    console.error('Camera start error:', error)
  }
}

onMounted(async () => {
  console.log('Component mounted')
  await initCamera();
  countdown.resume();
})

onUnmounted(() => {
  console.log('Component unmounting')
  const _video = video.value;
  if (_video && !_video.paused) {
    _video.pause();
    _video.srcObject = null;
  }
  camera.stop();
})

watch(countdown.isActive, async (isPending) => {
  console.log('Countdown watch triggered', isPending)
  if (isPending) return;
  
  const _video = video.value;
  if (!_video) {
    console.log('No video element found')
    return;
  }
  
  _video.pause();
  
  try {
    const photo = snapshotImage(_video, {
      width: _video.videoWidth,
      height: _video.videoHeight,
    });
    
    const mimeType = { type: "image/png" };
    const blob = await photo.convertToBlob(mimeType);
    _video.poster = URL.createObjectURL(blob);
    
    capturedImageBlob.value = blob;
    console.log('Blob before store:', blob) 
    imageStore.setTempImage(blob)
    console.log('Store after setting:', imageStore.tempImage) 
    isUploaded.value = true;
    console.log('Photo captured and stored')
  } catch (error) {
    console.error('Photo capture error:', error)
  }
});
</script>

<template>
  <div class="h-screen w-screen grid grid-rows-6 overflow-hidden m-0 p-0 absolute inset-0">
    <div class="h-full">
      <transition name="slide-bottom">
        <button
          v-show="isUploaded"
          @click="onRetakeClick"
          class="bg-green-600 text-white text-3xl absolute left-0 mt-14 px-8 py-8 flex items-center rounded-r-full"

        >
          Retake
        </button>
      </transition>
    </div>

    <div class="row-span-4 flex items-center justify-center">
      <video
        ref="video"
        class="h-[80vw] w-[80vw] sm:h-[60vw] sm:w-[60vw] object-cover -scale-x-100 rounded-2xl"
        muted
        autoplay
        playsinline
        webkit-playsinline
      />
      <span
        v-if="countdown.isActive.value"
        class="text-[15rem] sm:text-[20rem] text-white fixed"
        >
        {{ count }}
      </span>
    </div>

    <div class="h-full relative">
      <transition name="slide-top">
        <div v-show="isUploaded" class="h-full">
          <button
            @click="$router.push('/transform')"
            class="bg-blue-700 text-white text-4xl absolute bottom-0 h-[90%] pt-8 px-12 right-0 flex items-center rounded-t-full"
          >
            Continue
          </button>
        </div>
      </transition>
    </div>
  </div>
</template>
