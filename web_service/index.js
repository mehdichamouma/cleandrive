var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080

var router = express.Router();

var mongoDb = require("./connectors/mongoDbConnector")()
var parkAI = require("./connectors/parkAIConnector")()
var pollutionAPI = require("./connectors/pollutionAPIConnector")()

const euclidianDistance = (lat1, lon1, lat2, lon2) => {
  return 1200
}

router.get('/car_status', async (req, res) => {
  try {
    const { carId, lat, lon } = req.query

    const { history, carDetails } = await mongoDb.getHistoryAndCarDetails(carId)
    const areaNearby = await mongoDb.getNearestArea({ lat, lon })

    const areaNearByDistance = euclidianDistance(lat, lon, areaNearby.lat, areaNearby.lon)

    let alternative = null
    let areaNearbyTaxAmount = null
    let alternativeDistance = null

    if(areaNearby && areaNearByDistance > 5) {
      alternative = await parkAI.getNearestFreeParkingPlace({ lat, lon });
      alternativeDistance = euclidianDistance(lat, lon, alternative.lat, alternative.lon);

      const polutionIndice = await pollutionAPI.getPolutionIndice({
        sensors: areaNearby.sensors
      })

      areaNearbyTaxAmount = polutionIndice * carDetails.cleanDriveIndice * 10
    }
    let data = {
      carDetails,
      history,
      areaNearby,
      areaNearbyTaxAmount,
      alternative,
      alternativeDistance,
    }

    res.json(data);
  }
  catch(e) {
    console.error(e)
    res.json({
      error: true
    })
  }

});

app.use('/api', router);

app.listen(port)

console.log('Magic happens on port ' + port);
