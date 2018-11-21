const fetch = require('node-fetch');

module.exports = () => {
  return {
    async getNearestFreeParkingPlace({ lat, lon }) {

      const body = {
        "numberOfParkingAreas": 10,
        "position": {
          "type": "Point",
          "coordinates": [
            lon, lat
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
        if(!c || (p && p.occupancy && p.occupancy.type == "P" && p.occupancy.value < c.min)) {
          return {
            min: p.occupancy.value,
            data: p,
          }
        }
        return c
      }, null);

      if(choice.data) {
        return {
          name: choice.data.parkingArea.name,
          lon: choice.data.parkingArea.center.coordinates[0],
          lat: choice.data.parkingArea.center.coordinates[1]
        }
      }
    }
  }
}
