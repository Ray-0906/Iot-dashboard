import React from "react";
import { View, Text, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";

export default function MapViewComponent({ latitude, longitude }) {
  const hasValidCoords =
    typeof latitude === "number" &&
    typeof longitude === "number" &&
    !Number.isNaN(latitude) &&
    !Number.isNaN(longitude);

  if (!hasValidCoords) {
    return (
      <View style={styles.placeholder}>
        <Text style={styles.placeholderText}>Location data unavailable</Text>
      </View>
    );
  }

  return (
    <MapView
      style={styles.map}
      initialRegion={{
        latitude,
        longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01
      }}
      region={{
        latitude,
        longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01
      }}
    >
      <Marker coordinate={{ latitude, longitude }} title="Sensor Location" />
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    height: 250,
    marginVertical: 16,
    borderRadius: 12
  },
  placeholder: {
    height: 250,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1E1E1E",
    borderRadius: 12,
    marginVertical: 16
  },
  placeholderText: {
    color: "#777"
  }
});
