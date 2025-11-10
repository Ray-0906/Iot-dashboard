import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import { ScrollView, Text, View, Alert, StyleSheet } from "react-native";
import * as Location from "expo-location";
import { IoTProvider, IoTContext } from "./providers/IoTProvider";
import DataCard from "./components/DataCard";
import ThresholdForm from "./components/ThresholdForm";
import ChartView from "./components/ChartView";
import MapViewComponent from "./components/MapViewComponent";

const Dashboard = () => {
  const { sensorData, history } = useContext(IoTContext);
  const [tempThreshold, setTempThreshold] = useState(35);
  const [humThreshold, setHumThreshold] = useState(80);
  const [deviceLocation, setDeviceLocation] = useState(null);
  const tempAlertActive = useRef(false);
  const humAlertActive = useRef(false);

  const { temperature, humidity, latitude, longitude, timestamp } = sensorData;

  const formattedTimestamp = useMemo(() => {
    if (!timestamp) {
      return "--";
    }
    const date = new Date(timestamp * 1000);
    return date.toLocaleString();
  }, [timestamp]);

  const tempHistory = useMemo(
    () => history.map(entry => (typeof entry.temperature === "number" ? entry.temperature : 0)),
    [history]
  );

  const humHistory = useMemo(
    () => history.map(entry => (typeof entry.humidity === "number" ? entry.humidity : 0)),
    [history]
  );

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === "granted") {
          const { coords } = await Location.getCurrentPositionAsync({});
          if (isMounted) {
            setDeviceLocation(coords);
          }
        }
      } catch (err) {
        console.warn("Location permission error", err);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  const triggerAlert = useCallback((title, body) => {
    Alert.alert(title, body);
  }, []);

  useEffect(() => {
    if (typeof temperature === "number") {
      if (temperature > tempThreshold && !tempAlertActive.current) {
        tempAlertActive.current = true;
        triggerAlert("High Temperature", `Current temperature: ${temperature} °C`);
      }
      if (temperature <= tempThreshold && tempAlertActive.current) {
        tempAlertActive.current = false;
      }
    }

    if (typeof humidity === "number") {
      if (humidity > humThreshold && !humAlertActive.current) {
        humAlertActive.current = true;
        triggerAlert("High Humidity", `Current humidity: ${humidity} %`);
      }
      if (humidity <= humThreshold && humAlertActive.current) {
        humAlertActive.current = false;
      }
    }
  }, [temperature, humidity, tempThreshold, humThreshold, triggerAlert]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>IoT Live Dashboard</Text>
        <Text style={styles.subtitle}>Last update: {formattedTimestamp}</Text>
      </View>

      <View style={styles.cardsRow}>
        <View style={styles.cardHalf}>
          <DataCard
            label="Temperature"
            value={typeof temperature === "number" ? `${temperature.toFixed(1)}°C` : "--"}
            isAlert={typeof temperature === "number" && temperature > tempThreshold}
            type="temperature"
            maxValue={typeof temperature === "number" ? `${tempThreshold}°C` : null}
          />
        </View>
        <View style={styles.cardHalf}>
          <DataCard
            label="Humidity"
            value={typeof humidity === "number" ? `${humidity.toFixed(1)}%` : "--"}
            isAlert={typeof humidity === "number" && humidity > humThreshold}
            type="humidity"
            maxValue={typeof humidity === "number" ? `${humThreshold}%` : null}
          />
        </View>
      </View>

      <View style={styles.locationCard}>
        <View style={styles.locationHeader}>
          <Text style={styles.locationIcon}>📍</Text>
          <Text style={styles.locationTitle}>Location</Text>
        </View>
        <Text style={styles.locationText}>
          Lat: {typeof latitude === "number" ? latitude.toFixed(6) : deviceLocation ? deviceLocation.latitude.toFixed(6) : "--"}
        </Text>
        <Text style={styles.locationText}>
          Lon: {typeof longitude === "number" ? longitude.toFixed(6) : deviceLocation ? deviceLocation.longitude.toFixed(6) : "--"}
        </Text>
      </View>

      <ThresholdForm
        tempThreshold={tempThreshold}
        humThreshold={humThreshold}
        setTempThreshold={setTempThreshold}
        setHumThreshold={setHumThreshold}
      />

      <ChartView tempHistory={tempHistory} humHistory={humHistory} />
      <MapViewComponent
        latitude={
          typeof latitude === "number" && !Number.isNaN(latitude)
            ? latitude
            : deviceLocation?.latitude
        }
        longitude={
          typeof longitude === "number" && !Number.isNaN(longitude)
            ? longitude
            : deviceLocation?.longitude
        }
      />

      <View style={styles.footer}>
        <Text style={styles.footerText}>Data powered by ESP32 → Firebase Realtime Database</Text>
      </View>
    </ScrollView>
  );
};

export default function App() {
  return (
    <IoTProvider>
      <View style={styles.appContainer}>
        <Dashboard />
      </View>
    </IoTProvider>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: "#0f1419"
  },
  container: {
    flex: 1,
    padding: 16
  },
  header: {
    paddingTop: 48,
    paddingBottom: 16,
    alignItems: "center"
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    letterSpacing: 1
  },
  subtitle: {
    fontSize: 13,
    color: "#7f8c97",
    marginTop: 4
  },
  cardsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16
  },
  cardHalf: {
    flex: 1,
    marginHorizontal: 4
  },
  locationCard: {
    backgroundColor: "#1a2332",
    borderRadius: 20,
    padding: 20,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "#2a3442"
  },
  locationHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12
  },
  locationIcon: {
    fontSize: 20,
    marginRight: 8
  },
  locationTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600"
  },
  locationText: {
    color: "#7f8c97",
    fontSize: 14,
    marginTop: 4
  },
  footer: {
    marginVertical: 24,
    alignItems: "center"
  },
  footerText: {
    color: "#555",
    fontSize: 12
  }
});
