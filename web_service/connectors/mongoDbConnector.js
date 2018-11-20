module.exports = () => {
  return {
    async getHistoryAndCarDetails(carId) {

      // to be implemented

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

      // to be implemented

      return {
        name: "Berlin",
        lat: 40.1,
        lon: 20.5,
        sensors: {
          fineDustSensorsIds: [
            { sensorId: "xdsa"},
            { sensorId: "xdsa"}
          ],
          pollutionSensorsIds: [
            { sensorId: "xdsa"},
            { sensorId: "xdsa"},
            { sensorId: "xdsa"}
          ]
        }
      }
    },
  }
}
