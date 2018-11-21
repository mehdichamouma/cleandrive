const feinstaubApi = require("./feinstaubApi")
const { euclidianDistance } = require("../utils")

module.exports = () => {
  return {
    async getPolutionIndice({ lat = 48.778, lon = 9.16, radius = 10000 }) {
      console.log(lat, lon, radius);

      const data = await feinstaubApi.getAllSensors()
      const points = data.filter(d => euclidianDistance(lat, lon, d.latitude, d.longitude) <= radius).map(d => d.data.P1)
      const mean = points.reduce((tot, p) => tot + p, 0) / points.length

      return Math.min(500, mean) / 500.0
    },
  }
}
