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
      <Text style={styles.title}>IoT Live Dashboard</Text>
      <Text style={styles.subtitle}>Last update: {formattedTimestamp}</Text>

      <DataCard
        label="Temperature"
        value={typeof temperature === "number" ? `${temperature} °C` : "--"}
        isAlert={typeof temperature === "number" && temperature > tempThreshold}
      />
      <DataCard
        label="Humidity"
        value={typeof humidity === "number" ? `${humidity} %` : "--"}
        isAlert={typeof humidity === "number" && humidity > humThreshold}
      />
      <DataCard
        label="Location"
        value={
          typeof latitude === "number" && typeof longitude === "number"
            ? `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`
            : deviceLocation
              ? `${deviceLocation.latitude.toFixed(5)}, ${deviceLocation.longitude.toFixed(5)}`
              : "--"
        }
      />

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
    backgroundColor: "#111"
  },
  container: {
    flex: 1,
    padding: 16
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginTop: 32
  },
  subtitle: {
    fontSize: 14,
    color: "#bbb",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 16
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
