import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import { Constants } from 'expo';

export default class App extends React.Component {
  renderMain() {
    let state = 2
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
              Be careful, paid area nearby: <Text style={styles.nearByOutline}>Berlin</Text>
            </Text>
          </View>
          <View style={styles.alternative}>
            <View style={styles.alternativeDescription}>
              <Text style={styles.alternativeText}>
                You can park for free at <Text style={styles.nearByOutline}>800 m</Text> and save <Text style={styles.nearByOutline}>2.10 €</Text>.
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

  renderHistoryRow(areaName, amount, ts) {
    return (
      <View style={styles.historyRow}>
        <View style={styles.rowDate}>
          <Text style={styles.rowDateDay}>20</Text>
          <Text style={styles.rowDateMonth}>Nov</Text>
        </View>
        <View style={styles.rowArea}>
          <Text style={styles.rowAreaText}>Koln</Text>
        </View>
        <View style={styles.rowAmount}>
          <Text style={styles.rowAmountText}>-3.05€</Text>
        </View>
      </View>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.statusBar} />
        <View style={styles.header}>
          <Text style={{ color: "green", fontSize: 21 }}>Clean Drive</Text>
        </View>
        <View style={styles.userDetails}>
          <View style={styles.carDetails}>
            <View style={styles.carId}>
              <View style={styles.carIdCard}>
                <Text style={styles.carIdText}>WOB ZK 295</Text>
              </View>

            </View>
            <View style={styles.cleanDriveStatus}>
              <View style={styles.cleanDriveStatusCard}>
                <Text style={styles.cleanDriveStatusText}>Clean Drive Status: Good</Text>
              </View>
            </View>
          </View>
          <View style={styles.balanceDetails}>
            <View style={styles.balanceDetailsCard}>
              <Text style={styles.balanceDetailsText}>+ 10.15 €</Text>
            </View>
          </View>
        </View>
        <View style={styles.body}>
          <View style={styles.main}>
            {this.renderMain()}
          </View>
          <View style={styles.history}>
            <View>
              <Text style={{ color: "white" }}>History</Text>
            </View>
            {this.renderHistoryRow()}
            {this.renderHistoryRow()}
            {this.renderHistoryRow()}
          </View>

        </View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    height: 30,
    padding: 5
  },
  userDetails: {
    backgroundColor: "#eee",
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
    borderWidth: 1
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
    height: 100,
    width: 100,
    borderRadius: 50,
    backgroundColor: "grey",
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
    borderRadius: 15,
    backgroundColor: "green",
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
    flex: 3
  },
  statusBar: {
    backgroundColor: "green",
    height: Constants.statusBarHeight,
  },
  history: {
    flex: 7,
    backgroundColor: "#EFEFEF"
  },
  historyRow: {
    flex: 1,
    margin: 10,
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "red",
    borderRadius: 5
  },
  rowDate: {
    width: 80,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white"
  },
  rowDateDay: {
    fontSize: 18
  },
  rowDateMonth: {
    fontSize: 14
  },
  rowArea: {
    flex: 2,
    backgroundColor: '#FDFDFD',
    justifyContent: "center",
    paddingLeft: 10
  },
  rowAreaText: {
    fontSize: 20,
    //color: "green"
  },
  rowAmount: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: "center",
    alignItems: "center",
  },
  rowAmountText: {
    fontSize: 20,
    color: "red"
  },
  main: {
    flex: 4,
  },
  mainGood: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1
  },
  mainGoodText: {
    fontSize: 20,
    color: "green"
  },
  mainNearby: {
    backgroundColor: "rgb(110,110,240)",
    flex: 1,
    padding: 10
  },
  areaNearby: {
    //backgroundColor: "rgba(255,255,255,0.4)",
    flex: 1,
    justifyContent: "center"
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
    flexDirection: "row"
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
