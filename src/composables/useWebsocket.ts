import { ref } from 'vue'

// Create singleton instance
const ws = ref<WebSocket | null>(null)
const isConnected = ref(false)

export function useWebsocket() {
    function setupWebsocket(session: string) {
        // Only setup if not already connected
        if (ws.value) return
        
        ws.value = new WebSocket('ws://localhost:5080')

        ws.value.onopen = () => {
            console.log('✅ WebSocket Connected!')
            isConnected.value = true
            
            ws.value?.send(JSON.stringify({
                type: 'MOBILE_JOIN',
                payload: { sessionId: session }
            }))
        }

        ws.value.onclose = () => {
            console.log('❌ WebSocket Closed')
            isConnected.value = false
        }
    }

    function notifyStartCapture(): Promise<boolean> {
      return new Promise((resolve, reject) => {  
          if (!ws.value || !isConnected.value) {
              console.error('❌ Cannot start capture - WebSocket not connected')
              reject(new Error('WebSocket not connected'))
              return
          }

          try {
              ws.value.send(JSON.stringify({
                  type: 'START_CAPTURE',
                  payload: { timestamp: Date.now() }
              }))
              resolve(true)
          } catch (error) {
              reject(error)
          }
      })
  }

  function notifyRetakeCapture(): Promise<boolean> {
      return new Promise((resolve, reject) => {  
          if (!ws.value || !isConnected.value) {
              console.error('❌ Cannot retake capture - WebSocket not connected')
              reject(new Error('WebSocket not connected'))
              return
          }

          try {
              ws.value.send(JSON.stringify({
                  type: 'RETAKE_CAPTURE',
                  payload: { timestamp: Date.now() }
              }))
              resolve(true)
          } catch (error) {
              reject(error)
          }
      })
  }

  function notifyStartTransform(): Promise<boolean> {
      return new Promise((resolve, reject) => {  
          if (!ws.value || !isConnected.value) {
              console.error('❌ Cannot start transform - WebSocket not connected')
              reject(new Error('WebSocket not connected'))
              return
          }

          try {
              ws.value.send(JSON.stringify({
                  type: 'START_TRANSFORM',
                  payload: { timestamp: Date.now() }
              }))
              resolve(true)
          } catch (error) {
              reject(error)
          }
      })
  }

  function notifyShowReview(): Promise<boolean> {
      return new Promise((resolve, reject) => {  
          if (!ws.value || !isConnected.value) {
              console.error('❌ Cannot show review - WebSocket not connected')
              reject(new Error('WebSocket not connected'))
              return
          }

          try {
              ws.value.send(JSON.stringify({
                  type: 'SHOW_REVIEW',
                  payload: { timestamp: Date.now() }
              }))
              resolve(true)
          } catch (error) {
              reject(error)
          }
      })
  }

    return {
        isConnected,
        setupWebsocket,
        notifyStartCapture,
        notifyRetakeCapture,
        notifyStartTransform,
        notifyShowReview
    }
}