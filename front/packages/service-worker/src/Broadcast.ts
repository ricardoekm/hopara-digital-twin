export const broadcastListener = (callback) => {
  try {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', async (event) => {
        // Optional: ensure the message came from workbox-broadcast-update
        if (event.data.meta === 'workbox-broadcast-update') {
          const {cacheName, updatedURL} = event.data.payload
      
          const cache = await caches.open(cacheName)
          const updatedResponse = await cache.match(updatedURL)
    
          return callback({
            cacheName,
            url: updatedURL,
            response: await updatedResponse?.json(),
            tenant: updatedResponse?.headers.get('Tenant'),
          })
        }
      })
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error listening to SW', error)
  }
}
