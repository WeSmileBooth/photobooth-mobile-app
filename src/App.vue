//App.vue
<script setup lang="ts">
import {useWebsocket} from './composables/useWebsocket.ts'
import {onMounted} from 'vue'


const { setupWebsocket, sendMessage } = useWebsocket()


onMounted(async () => {
     await setupWebsocket()
     await sendMessage('DISPLAY_UPDATE', { display: 'idle' })
})

</script>

<template>
    <div>
        <router-view></router-view>
    </div>
</template>
