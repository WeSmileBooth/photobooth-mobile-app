//App.vue
<script setup lang="ts">
import { useWebsocket } from './composables/useWebsocket.ts'
import { onMounted } from 'vue'


const { setupWebsocket, sendMessage } = useWebsocket()


onMounted(async () => {
    const params = new URLSearchParams(window.location.search);
    const session = params.get('session');

    await setupWebsocket()
    await sendMessage('MOBILE_CONNECTED', { id: session })
    await sendMessage('DISPLAY_UPDATE', { display: 'idle' })
})

</script>

<template>
    <div>
        <router-view></router-view>
    </div>
</template>
