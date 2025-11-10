import React from "react";
import { View, TextInput, Text, StyleSheet, Alert, TouchableOpacity } from "react-native";

export default function ThresholdForm({
  tempThreshold,
  humThreshold,
  setTempThreshold,
  setHumThreshold
}) {
  const handleSave = () => {
    Alert.alert("✅ Saved", "New alert limits are now active.");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>⚙️ Alert Thresholds</Text>
      <View style={styles.inputRow}>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Temperature (°C)</Text>
          <TextInput
            style={styles.input}
            placeholder="35"
            placeholderTextColor="#555"
            keyboardType="numeric"
            value={String(tempThreshold)}
            onChangeText={value => setTempThreshold(Number(value))}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Humidity (%)</Text>
          <TextInput
            style={styles.input}
            placeholder="80"
            placeholderTextColor="#555"
            keyboardType="numeric"
            value={String(humThreshold)}
            onChangeText={value => setHumThreshold(Number(value))}
          />
        </View>
      </View>
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save Settings</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1a2332",
    padding: 20,
    borderRadius: 20,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: "#2a3442"
  },
  title: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16
  },
  inputRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16
  },
  inputContainer: {
    flex: 1,
    marginHorizontal: 4
  },
  inputLabel: {
    color: "#7f8c97",
    fontSize: 12,
    marginBottom: 6,
    fontWeight: "500"
  },
  input: {
    backgroundColor: "#0f1419",
    color: "#fff",
    padding: 12,
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#2a3442"
  },
  saveButton: {
    backgroundColor: "#4a90e2",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center"
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600"
  }
});
