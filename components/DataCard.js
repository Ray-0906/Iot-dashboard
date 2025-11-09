import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function DataCard({ label, value, isAlert }) {
  return (
    <View style={[styles.card, isAlert && styles.alertCard]}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, isAlert && styles.alertValue]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1e1e1e",
    padding: 16,
    borderRadius: 12,
    marginVertical: 8
  },
  alertCard: {
    borderColor: "#ff5252",
    borderWidth: 1
  },
  label: {
    color: "#aaa",
    fontSize: 16
  },
  value: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold"
  },
  alertValue: {
    color: "#ff5252"
  }
});
