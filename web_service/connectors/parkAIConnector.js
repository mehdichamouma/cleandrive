const fetch = require('node-fetch');

module.exports = () => {
  return {
    async getNearestFreeParkingPlace({ lat, lon }) {

      const body = {
        "numberOfParkingAreas": 10,
        "position": {
          "type": "Point",
          "coordinates": [
            10.512625,
            52.2606285
          ]
        },
        "timestamp": Date.now()
      }

      const res = await fetch('https://api.aipark.de:443/aipark/v1/getParkingAreasForPositionWithOccupancy', {
        method: 'post',
        body:    JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
          'apikey': 'smart_country_hack'
        },
      })
      const data = await res.json()
      console.log(JSON.stringify(data))
      const choice = data.parkingAreasWithOccupancy.reduce((c, p) => {
        if(p && p.occupancy && p.occupancy.type == "P" && p.occupancy.value < c.min) {
          return {
            min: p.occupancy.value,
            data: p,
          }
        }
        return c
      }, { min: 100, data: null });

      if(choice.data) {
        return {
          name: choice.data.parkingArea.name,
          lat: choice.data.parkingArea.center.coordinates[0],
          lon: choice.data.parkingArea.center.coordinates[1]
        }
      }
    }
  }
}
