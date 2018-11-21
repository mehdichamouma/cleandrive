const feinstaubApi = require("./feinstaubApi")
const { euclidianDistance } = require("../utils")

module.exports = () => {
  return {
    async getPolutionIndice({ lat = 48.778, lon = 9.16, radius = 10000 }) {
      const data = await feinstaubApi.getAllSensors()
      const points = data.filter(d => euclidianDistance(lat, lon, d.latitude, d.longitude) <= radius).map(d => d.data.P1)
      const mean = points.reduce((tot, p) => tot + p, 0) / points.length
      return Math.max(500, mean) / 500
    },
  }
}
