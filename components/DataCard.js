import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function DataCard({ label, value, isAlert, type, maxValue }) {
  const getGradientColors = () => {
    if (type === "temperature") {
      return isAlert ? ["#ff4757", "#e84118"] : ["#ee5a6f", "#f79d65"];
    } else if (type === "humidity") {
      return isAlert ? ["#ff4757", "#e84118"] : ["#4a90e2", "#5f9ee1"];
    }
    return ["#2c3e50", "#34495e"];
  };

  const getIcon = () => {
    if (type === "temperature") return "🌡️";
    if (type === "humidity") return "💧";
    return "📍";
  };

  return (
    <LinearGradient
      colors={getGradientColors()}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.card}
    >
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{getIcon()}</Text>
      </View>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
      {maxValue && (
        <Text style={styles.maxValue}>Max: {maxValue}</Text>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 24,
    marginVertical: 8,
    minHeight: 140,
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8
  },
  iconContainer: {
    alignSelf: "flex-start"
  },
  icon: {
    fontSize: 32,
    marginBottom: 8
  },
  label: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8
  },
  value: {
    color: "#ffffff",
    fontSize: 36,
    fontWeight: "bold"
  },
  maxValue: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 14,
    marginTop: 4
  }
});
