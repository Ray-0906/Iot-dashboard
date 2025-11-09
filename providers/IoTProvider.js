import React, { createContext, useState, useEffect } from "react";
import { Alert } from "react-native";
import { ref, onValue } from "firebase/database";
import { database } from "../config/firebase";

export const IoTContext = createContext();

export const IoTProvider = ({ children }) => {
  const [sensorData, setSensorData] = useState({
    temperature: 0,
    humidity: 0,
    latitude: 0,
    longitude: 0,
    timestamp: 0
  });
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const dataRef = ref(database, "sensors/data");

    const unsubscribe = onValue(
      dataRef,
      snapshot => {
        if (snapshot.exists()) {
          const payload = snapshot.val();
          setSensorData(payload);
          setHistory(current => {
            const nextHistory = [...current.slice(-19), payload];
            return nextHistory;
          });
        }
      },
      err => {
        Alert.alert("Firebase Error", err.message);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <IoTContext.Provider
      value={{
        sensorData,
        history
      }}
    >
      {children}
    </IoTContext.Provider>
  );
};
