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
        <Text style={styles.placeholderText}>📊 Waiting for data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.chartTitle}>📈 Trends</Text>
      <LineChart
        data={{
          labels: Array.from({ length: Math.min(safeTempHistory.length, 10) }, () => ""),
          datasets: [
            {
              data: safeTempHistory.slice(-10),
              color: () => "#ee5a6f",
              strokeWidth: 3
            },
            {
              data: safeHumHistory.slice(-10),
              color: () => "#4a90e2",
              strokeWidth: 3
            }
          ],
          legend: ["🌡️ Temperature", "💧 Humidity"]
        }}
        width={screenWidth - 32}
        height={240}
        chartConfig={{
          backgroundColor: "#1a2332",
          backgroundGradientFrom: "#1a2332",
          backgroundGradientTo: "#1a2332",
          decimalPlaces: 1,
          color: opacity => `rgba(127, 140, 151, ${opacity})`,
          labelColor: opacity => `rgba(127, 140, 151, ${opacity})`,
          propsForDots: {
            r: "4",
            strokeWidth: "2"
          },
          propsForBackgroundLines: {
            strokeDasharray: "",
            stroke: "#2a3442",
            strokeWidth: 1
          }
        }}
        bezier
        style={styles.chart}
        withInnerLines={true}
        withOuterLines={false}
        withVerticalLines={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1a2332",
    borderRadius: 20,
    padding: 16,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: "#2a3442"
  },
  chartTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16
  },
  placeholder: {
    height: 240,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1a2332",
    borderRadius: 20,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: "#2a3442"
  },
  placeholderText: {
    color: "#7f8c97",
    fontSize: 16
  }
});
