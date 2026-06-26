import Echo from 'laravel-echo'
import Pusher from 'pusher-js'
import axios from 'axios'

window.Pusher = Pusher

export function initEcho() {
  window.Echo = new Echo({
    broadcaster: 'reverb',
    key:      import.meta.env.VITE_REVERB_APP_KEY,
    wsHost:   import.meta.env.VITE_REVERB_HOST,
    wsPort:   import.meta.env.VITE_REVERB_PORT,
    wssPort:  import.meta.env.VITE_REVERB_PORT,
    forceTLS: false,
    enabledTransports: ['ws', 'wss'],

    authorizer: (channel) => ({
      authorize: (socketId, callback) => {
        axios.post('/broadcasting/auth', {
          socket_id:    socketId,
          channel_name: channel.name,
        })
          .then(({ data }) => callback(null, data))
          .catch((err)   => callback(err, null))
      },
    }),
  })
}