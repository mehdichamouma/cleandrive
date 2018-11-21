const places = require('./data/places.json')
const { euclidianDistance } = require('../utils')

module.exports = () => {
  return {
    async getHistoryAndCarDetails(carId) {

      // to be implemented
      Object.keys({})
      return {
        carDetails: {
          carId: "PN LX 295",
          balance: 10.05,
          cleanDriveIndice: 0.2 // [0; 1]
        },
        history: [
          {
            areaName: "Koln",
            taxAmount: 3.01,
            ts: new Date(2018, 10, 17, 5, 20),
          },
          {
            areaName: "Muenech",
            taxAmount: 1.04,
            ts: new Date(2018, 10, 17, 5, 20),
          },
          {
            areaName: "Leverkusen",
            taxAmount: 1.4,
            ts: new Date(2018, 10, 17, 5, 20),
          }
        ]
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
  }
}
