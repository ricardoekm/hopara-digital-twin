import { Coordinates } from '@hopara/spatial'

const locationOpts = {maximumAge: 0, enableHighAccuracy: true, timeout: 60000}

export const getUserLocation = () => new Promise((resolve, reject) => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position:GeolocationPosition) => {
      resolve({ coordinates: Coordinates.fromArray([position.coords.longitude, position.coords.latitude]),
                accuracy: position.coords.accuracy})
    }, (err) => {
 reject(err)
}, locationOpts)
  } else {
    reject(new Error('Geolocation is not supported'))
  }
})

export const watchUserLocation = (callback) => {
  if (navigator.geolocation) {
    return navigator.geolocation.watchPosition((position:GeolocationPosition) => {
      callback({coordinates: Coordinates.fromArray([position.coords.longitude, position.coords.latitude]),
                 accuracy: position.coords.accuracy})
    }, () => {/* ignore */}, locationOpts)
  } else {
    throw new Error('Geolocation is not supported')
  }
}
