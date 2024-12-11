<script setup lang="ts">
import {useWebsocket} from './composables/useWebsocket.ts'
import {useRoute} from 'vue-router'
import {onMounted} from 'vue'

const route = useRoute()
const {setupWebsocket} = useWebsocket()

// Function to extract session ID using multiple methods
function getSessionId(): string | null {
    // Method 1: Try Vue Router's query params
    const routeSessionId = route.query.session as string
    if (routeSessionId) {
        console.log('[Mobile App] Found session ID from route.query:', routeSessionId)
        return routeSessionId
    }

    // Method 2: Try URLSearchParams (as backup)
    const urlParams = new URLSearchParams(window.location.search)
    const urlSessionId = urlParams.get('session')
    if (urlSessionId) {
        console.log('[Mobile App] Found session ID from URLSearchParams:', urlSessionId)
        return urlSessionId
    }

    // Method 3: Try parsing the URL manually (as fallback)
    const matches = window.location.href.match(/[?&]session=([^&#]+)/)
    if (matches && matches[1]) {
        console.log('[Mobile App] Found session ID from URL parsing:', matches[1])
        return matches[1]
    }

    console.warn('[Mobile App] No session ID found using any method')
    return null
}


onMounted(() => {
    console.log('📱 Mobile App Mounted')
    const sessionId = getSessionId()
    
    if (sessionId) {
        console.log('🔌 Setting up WebSocket with session:', sessionId)
        setupWebsocket(sessionId)
    } else {
        console.warn('⚠️ Cannot setup WebSocket - no session ID')
    }
})


</script>

<template>
    <div>
        <router-view></router-view>
    </div>
</template>
