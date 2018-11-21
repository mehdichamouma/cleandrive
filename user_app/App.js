import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import { Constants } from 'expo';
import { MapView } from 'expo';

const colors = [
  "#9EB25D",
  "#A7C6DA",
  "#EEFCCE",
  "#C97064",
  "#EDFF71"
]

const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loaded: false,
      carDetails: {
        balance: 0,
      },
      location: {
        lat: 0,
        lon: 0,
      },
      areaNearby: {
        lat: 0,
        lon: 0
      },
      history: []
    }
  }

  componentDidMount() {
    const locationLookup = async () => {
      const res = await fetch('http://10.70.3.121:8080/demo/location')
      const data = await res.json()
      this.setState({
        location: data
      })
      setTimeout(locationLookup, 1000)
    }

    const step = async () => {
      let { lat, lon } = this.state.location
      const res = await fetch(`http://10.70.3.121:8080/api/car_status?lat=${lat}&lon=${lon}&carId=PNLX295`)
      const data = await res.json()
      this.setState(data)
      setTimeout(step, 2000)
    }
    step()
    locationLookup()
  }

  renderMain() {
    let state = this.state.alternative ? 2 : 1
    if(state == 1) {
      return (
        <View style={styles.mainGood}>
          <Text style={styles.mainGoodText}>No Environmental Area Nearby</Text>
        </View>
      )
    }
    else if (state == 2) {
      return (
        <View style={styles.mainNearby}>
          <View style={styles.areaNearby}>
            <Text style={styles.areaNearbyText}>
              You will enter <Text style={styles.nearByOutline}>{this.state.areaNearby.name}</Text>
            </Text>
          </View>
          <View style={styles.alternative}>
            <View style={styles.alternativeDescription}>
              <Text style={styles.alternativeText}>
                You can park for free at <Text style={styles.nearByOutline}>{Math.floor(this.state.alternativeDistance)} m</Text> and save <Text style={styles.nearByOutline}>{Math.round(this.state.areaNearbyTaxAmount * 100) / 100} €</Text>.
              </Text>
            </View>
            <View style={styles.alternativeAction}>
              <TouchableOpacity style={styles.goButton}>
                  <Text style={styles.goButtonText}>GO !</Text>
              </TouchableOpacity>
              <Text style={styles.aipark}>Powered by AIPark</Text>
            </View>
          </View>
        </View>
      )
    }
    else if (state == 3) {
      return (
        <View style={styles.mainAreaCrossed}>
          <Text style={styles.mainGoodText}>No Environmental Area Nearby</Text>
        </View>
      )
    }
  }

  renderBottom() {
    const state = this.state.alternative ? 1 : 0
    if(state == 0) {
      return (
        <View style={styles.history}>
          <View>
            <Text style={{ color: "white" }}>History</Text>
          </View>
          {this.state.history.slice(0, 3).map((h, i) => this.renderHistoryRow(h.place, h.amount, new Date(h.ts), i))}
        </View>
      )
    }
    else if (state == 1) {
      var alternativeMarker
      if(this.state.alternative) {
        alternativeMarker = (
          <MapView.Marker
            coordinate={{
              latitude: this.state.alternative.lat,
              longitude: this.state.alternative.lon,
            }}
            title={"Parking Area"}
            description={"parking area nearby"}
          />
        )
      }
      return (
        <MapView
          style={styles.history}
          region={{
            latitude: this.state.location.lat,
            longitude: this.state.location.lon,
            latitudeDelta: this.state.alternative ? Math.abs(this.state.location.lat - this.state.alternative.lat) * 2.5 : 0.03,
            longitudeDelta: this.state.alternative ? Math.abs(this.state.location.lon - this.state.alternative.lon) * 2.5 : 0.05,
          }}
          showsUserLocation={true}
        >
          <MapView.Marker
            coordinate={{
              latitude: this.state.location.lat,
              longitude: this.state.location.lon,
            }}
            title={"Parking Area"}
            description={"parking area nearby"}
          />
          {alternativeMarker}
        </MapView>
      )
    }
  }

  renderHistoryRow(areaName, amount, ts, idx) {
    return (
      <View key={idx} style={styles.historyRow}>
        <View style={styles.rowDate}>
          <Text style={styles.rowDateDay}>{ts.getDate()}</Text>
          <Text style={styles.rowDateMonth}>{ months[ts.getMonth()] }</Text>
        </View>
        <View style={styles.rowArea}>
          <Text style={styles.rowAreaText}>{areaName.charAt(0).toUpperCase() + areaName.slice(1)}</Text>
        </View>
        <View style={styles.rowAmount}>
          <Text style={styles.rowAmountText}>-{Math.floor(amount * 100) / 100}€</Text>
        </View>
      </View>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.statusBar} />
        <View style={styles.header}>
          <Text style={{ color: "white", fontSize: 21 }}>Clean Drive</Text>
        </View>
        <View style={styles.userDetails}>
          <View style={styles.carDetails}>
            <View style={styles.carId}>
              <View style={styles.carIdCard}>
                <Text style={styles.carIdText}>WOB ZK 295</Text>
              </View>

            </View>
          </View>
          <View style={styles.balanceDetails}>
            <View style={styles.balanceDetailsCard}>
              <Text style={styles.balanceDetailsText}>+ { Math.floor(this.state.carDetails.balance * 100) / 100 } €</Text>
            </View>
            <View style={styles.cleanDriveStatus}>
              <View style={styles.cleanDriveStatusCard}>
                <Text style={styles.cleanDriveStatusText}>Clean Drive Status: Good</Text>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.body}>
          <View style={styles.main}>
            {this.renderMain()}
          </View>
          {this.renderBottom()}
        </View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors[1],
  },
  header: {
    height: 35,
    padding: 5
  },
  userDetails: {
    backgroundColor: colors[1],
    flex: 1,
    flexDirection: "row"
  },
  carDetails: {
    flex: 3,
    // flexDirection: "column"
  },
  carIdCard: {
    margin: 10,
    backgroundColor: "white",
    padding: 5,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "grey"
  },
  carIdText: {
    textAlign: "center",
    fontSize: 21
  },
  balanceDetails: {
    justifyContent: "center",
    alignItems: "center",
    flex: 2
  },
  balanceDetailsCard: {
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  balanceDetailsText: {
    textAlign: "center",
    color: "white",
  },
  carId: {
    flex: 1
  },
  cleanDriveStatus: {
    flex: 1
  },
  cleanDriveStatusCard: {
    margin: 10,
    borderRadius: 5,
    backgroundColor: colors[0],
    padding: 5,
    justifyContent: "center",
    alignItems: "center",
    flex: 1
  },
  cleanDriveStatusText: {
    textAlign: "center",
    color: "white",
  },
  body: {
    flex: 5
  },
  statusBar: {
    backgroundColor: colors[2],
    height: Constants.statusBarHeight,
  },
  history: {
    flex: 7,
  },
  historyRow: {
    flex: 1,
    margin: 10,
    flexDirection: "row",
    borderWidth: 1,
    borderColor: colors[4],
    borderRadius: 5
  },
  rowDate: {
    width: 80,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FDFDFD"
  },
  rowDateDay: {
    fontSize: 18
  },
  rowDateMonth: {
    fontSize: 14
  },
  rowArea: {
    flex: 2,
    backgroundColor: '#EEE',
    justifyContent: "center",
    paddingLeft: 10
  },
  rowAreaText: {
    fontSize: 20,
    color: colors[0]
  },
  rowAmount: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: "center",
    alignItems: "center",
  },
  rowAmountText: {
    fontSize: 20,
    color: colors[3]
  },
  main: {
    flex: 4,
  },
  mainGood: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    backgroundColor: colors[2]
  },
  mainGoodText: {
    fontSize: 20,
    color: colors[0]
  },
  mainNearby: {
    backgroundColor: "rgba(0,0,0,0.1)",
    flex: 1,

  },
  areaNearby: {
    backgroundColor: "rgba(255,255,255,0.1)",
    flex: 1,
    justifyContent: "center",
    padding: 10
  },
  areaNearbyText: {
    color: "white",
    fontSize: 22
  },
  nearByOutline: {
    backgroundColor: "rgba(255,255,255,0.5)",
    padding: 5,
    borderRadius: 5
  },
  alternative: {
    flex: 2,
    flexDirection: "row",
    padding: 10
  },
  alternativeText: {
    color: "white",
    fontSize: 22
  },
  alternativeDescription: {
    flex: 1
  },
  alternativeAction: {
    justifyContent: "center",
    alignItems: "center"
  },
  aipark: {
    color: "white"
  },
  goButton: {
    justifyContent: "center",
    alignItems: "center",
    width: 100,
    height: 50,
    backgroundColor: "white",
    borderRadius: 25
  }
});
