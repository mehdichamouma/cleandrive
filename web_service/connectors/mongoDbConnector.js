const places = require('./data/places.json')
const { euclidianDistance } = require('../utils')
const cars = require('./data/cars')


module.exports = () => {
  return {
    async getHistoryAndCarDetails(carId) {
      const car = cars.find(c => c.carId == carId)
      const balance = car.history.reduce((t, c) => t + c.amount, 0)

      return {
        carDetails: {
          carId,
          balance,
          cleanDriveIndice: car.cleanDriveIndex
        },
        history: car.history
      }
    },
    async getNearestArea({ lat, lon }) {
      return Object.keys(places).reduce((min, k) => {
        console.log(min);
        if(!min || euclidianDistance(lat, lon, places[k][0], places[k][1]) < min.dist) {
          return {
            dist: euclidianDistance(lat, lon, places[k][0], places[k][1]),
            name: k,
            lat: places[k][0],
            lon: places[k][1],
          }
        }
        return min
      }, null)
    },
    async getPlaceByName(placeName) {
      return {
        name: placeName,
        lat: places[placeName][0],
        lon: places[placeName][1]
      }
    },
    async updateHistory({ carId, place, amount }) {
      var c = cars.find(c => c.carId == carId)
      c.history.push({
        ts: new Date(),
        place,
        amount,
      })
    }
  }
}
