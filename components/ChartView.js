import React from "react";
import { Dimensions, View, Text, StyleSheet } from "react-native";
import { LineChart } from "react-native-chart-kit";

export default function ChartView({ tempHistory = [], humHistory = [] }) {
  const screenWidth = Dimensions.get("window").width;
  const safeTempHistory = tempHistory.filter(value => typeof value === "number");
  const safeHumHistory = humHistory.filter(value => typeof value === "number");
  const hasData = safeTempHistory.length > 0 || safeHumHistory.length > 0;

  if (!hasData) {
    return (
      <View style={styles.placeholder}>
        <Text style={styles.placeholderText}>Waiting for data...</Text>
      </View>
    );
  }

  return (
    <LineChart
      data={{
        labels: Array.from({ length: safeTempHistory.length }, () => ""),
        datasets: [
          {
            data: safeTempHistory,
            color: () => "#ff6b6b",
            strokeWidth: 2
          },
          {
            data: safeHumHistory,
            color: () => "#4da6ff",
            strokeWidth: 2
          }
        ],
        legend: ["Temperature", "Humidity"]
      }}
      width={screenWidth - 20}
      height={220}
      chartConfig={{
        backgroundColor: "#1E1E1E",
        backgroundGradientFrom: "#1E1E1E",
        backgroundGradientTo: "#333",
        color: opacity => `rgba(255, 255, 255, ${opacity})`,
        labelColor: opacity => `rgba(255, 255, 255, ${opacity})`,
        propsForDots: {
          r: "3"
        }
      }}
      bezier
      style={styles.chart}
    />
  );
}

const styles = StyleSheet.create({
  chart: {
    marginVertical: 16,
    borderRadius: 12
  },
  placeholder: {
    height: 220,
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
