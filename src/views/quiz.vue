<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useWebsocket } from '../composables/useWebsocket'
const { sendMessage } = useWebsocket()

const router = useRouter()
const location = ref('')
const character = ref('')

const locations = [
  'Beach',
  'Forest',
  'City',
  'Mountains',
  'Space',
  'Underwater',
]

const characters = [
  'Pirate',
  'Astronaut',
  'Superhero',
  'Knight',
  'Explorer',
  'Mermaid',
]

const canContinue = computed(() => location.value && character.value)

const onContinue = async () => {
  const prompt = `A photo of a person as a ${character.value} in a ${location.value} setting`

  // Handle prompt and navigation
  await sendMessage('PROMPT_UPDATE', { prompt })
  router.push('/transform')

  await sendMessage('DISPLAY_UPDATE', {
    display: 'transform',
  })
}
</script>

<template>
  <div
    class="h-screen w-screen grid grid-rows-6 overflow-hidden m-0 p-0 absolute inset-0 bg-gradient-to-b from-blue-50 to-white"
  >
    <div class="row-span-4 flex flex-col items-center justify-center gap-8 p-8">
      <div class="w-full max-w-md">
        <label class="text-2xl mb-4 block text-black">Location</label>
        <select
          v-model="location"
          class="w-full p-4 text-xl rounded-xl bg-white/90 backdrop-blur-sm shadow-lg text-black"
        >
          <option value="">Select Location</option>
          <option v-for="loc in locations" :key="loc" :value="loc">
            {{ loc }}
          </option>
        </select>
      </div>

      <div class="w-full max-w-md">
        <label class="text-2xl mb-4 block text-black">Character</label>
        <select
          v-model="character"
          class="w-full p-4 text-xl rounded-xl bg-white/90 backdrop-blur-sm shadow-lg text-black"
        >
          <option value="">Select Character</option>
          <option v-for="char in characters" :key="char" :value="char">
            {{ char }}
          </option>
        </select>
      </div>
    </div>

    <div class="h-full relative">
      <button
        @click="onContinue"
        :disabled="!canContinue"
        class="bg-blue-700 text-white text-4xl absolute bottom-0 h-[90%] pt-8 px-12 right-0 flex items-center rounded-t-full"
        :class="{ 'opacity-50': !canContinue }"
      >
        Continue
      </button>
    </div>
  </div>
</template>
