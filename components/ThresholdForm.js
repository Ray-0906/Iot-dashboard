import React from "react";
import { View, TextInput, Button, Text, StyleSheet, Alert } from "react-native";

export default function ThresholdForm({
  tempThreshold,
  humThreshold,
  setTempThreshold,
  setHumThreshold
}) {
  const handleSave = () => {
    Alert.alert("Thresholds Saved", "New alert limits are now active.");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Set Thresholds</Text>
      <TextInput
        style={styles.input}
        placeholder="Temp Limit °C"
        placeholderTextColor="#777"
        keyboardType="numeric"
        value={String(tempThreshold)}
        onChangeText={value => setTempThreshold(Number(value))}
      />
      <TextInput
        style={styles.input}
        placeholder="Humidity Limit %"
        placeholderTextColor="#777"
        keyboardType="numeric"
        value={String(humThreshold)}
        onChangeText={value => setHumThreshold(Number(value))}
      />
      <Button title="Save Thresholds" onPress={handleSave} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1e1e1e",
    padding: 16,
    borderRadius: 12,
    marginVertical: 12
  },
  title: {
    color: "#fff",
    fontSize: 18,
    marginBottom: 10
  },
  input: {
    backgroundColor: "#333",
    color: "#fff",
    marginBottom: 10,
    padding: 10,
    borderRadius: 6
  }
});
