const { euclidianDistance } = require('../utils')
const MongoClient = require('mongodb').MongoClient;

var uri = "mongodb+srv://admin:admin@cluster1-zdxhq.mongodb.net/test";

module.exports = () => {
  var connection;

  return {
    async init() {
      MongoClient.connect(uri, function(err, client) {
        if (err) throw err;
        console.log('connected')
        connection = client.db("myfirstDB")
        Promise.resolve()
      });
    },
    async getHistoryAndCarDetails(carId) {
      const rows = await connection.collection("cars").find({ carId }).toArray()
      const car = rows[0]
      console.log(car);
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
      const rows = await connection.collection("places").find({}).toArray()
      const { _id, ...places } = rows[0]

      return Object.keys(places).reduce((min, k) => {
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
      const rows = await connection.collection("places").find({}).toArray()
      const { _id, ...places } = rows[0]
      return {
        name: placeName,
        lat: places[placeName][0],
        lon: places[placeName][1]
      }
    },
    async updateHistory({ carId, place, amount }) {
      await connection.collection("cars").update(
         { carId },
         { $push: { history: {
           ts: new Date(),
           place,
           amount,
         } } }
      )
    }
  }
}
