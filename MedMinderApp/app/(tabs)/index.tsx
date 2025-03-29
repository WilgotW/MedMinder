import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  TextInput,
  Button,
  ScrollView,
  View,
  Platform,
  TouchableOpacity,
  SafeAreaView,
  Modal,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import ParallaxScrollView from "@/components/ParallaxScrollView";

export default function HomeScreen() {
  const [time, setTime] = useState("");
  const [medicine, setMedicine] = useState("");
  const [doses, setDoses] = useState<
    { time: string; medicine: string; dispensed: boolean }[]
  >([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const onTimeChange = (event: any, date?: Date) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  const confirmTime = () => {
    const hours = selectedDate.getHours();
    const minutes = selectedDate.getMinutes();
    const formattedTime = `${hours < 10 ? "0" + hours : hours}:${
      minutes < 10 ? "0" + minutes : minutes
    }`;
    setTime(formattedTime);
    setShowTimeModal(false);
  };

  const handleAddDose = () => {
    console.log("handleAddDose triggered", { time, medicine });
    if (time.trim() && medicine.trim()) {
      setDoses([...doses, { time, medicine, dispensed: false }]);
      setTime("");
      setMedicine("");
    } else {
      console.log("Cannot add dose, missing time or medicine.");
    }
  };

  const timeToNumber = (timeStr: string) => {
    const [h, m] = timeStr.split(":").map(Number);
    return h * 60 + m;
  };

  const sortedDoses = doses.slice().sort((a, b) => {
    if (a.dispensed === b.dispensed) {
      return timeToNumber(a.time) - timeToNumber(b.time);
    }
    return a.dispensed ? 1 : -1;
  });

  const handleDispenseNextDose = () => {
    const nonDispensed = doses
      .filter((dose) => !dose.dispensed)
      .sort((a, b) => timeToNumber(a.time) - timeToNumber(b.time));

    if (nonDispensed.length === 0) {
      console.log("No non-dispensed doses available.");
      return;
    }

    const nextDose = nonDispensed[0];
    const newDoses = doses.map((dose) =>
      dose.time === nextDose.time && dose.medicine === nextDose.medicine
        ? { ...dose, dispensed: true }
        : dose
    );

    setDoses(newDoses);
    console.log(`Dispensing dose: ${nextDose.medicine} at ${nextDose.time}`);
  };

  function DoseItem({
    dose,
    currentTime,
  }: {
    dose: { time: string; medicine: string; dispensed: boolean };
    currentTime: Date;
  }) {
    const startOfDay = new Date(
      currentTime.getFullYear(),
      currentTime.getMonth(),
      currentTime.getDate()
    );

    const [targetHour, targetMinute] = dose.time.split(":").map(Number);
    const targetTime = new Date(
      currentTime.getFullYear(),
      currentTime.getMonth(),
      currentTime.getDate(),
      targetHour,
      targetMinute,
      0
    );

    const isDispensed = dose.dispensed === true;
    const isPast = isDispensed || currentTime >= targetTime;

    let progress = 0;

    if (!isPast) {
      progress =
        (currentTime.getTime() - startOfDay.getTime()) /
        (targetTime.getTime() - startOfDay.getTime());
      progress = Math.min(Math.max(progress, 0), 1);
    }

    return (
      <ThemedView style={[styles.doseItem, isPast && styles.doseItemPast]}>
        <ThemedText style={styles.doseTime}>{dose.time}</ThemedText>
        <ThemedText style={styles.doseMedicine}>{dose.medicine}</ThemedText>
        {!isPast && (
          <View style={styles.progressBarContainer}>
            <View
              style={[styles.progressBar, { width: `${progress * 100}%` }]}
            />
          </View>
        )}
      </ThemedView>
    );
  }

  return (
    <SafeAreaView style={styles.screenContainer}>
      <ParallaxScrollView
        headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
        headerImage={<></>}
      >
        <ThemedView style={styles.container}>
          <ThemedText style={styles.dateHeader}>
            {currentTime.toLocaleDateString()}
          </ThemedText>
          <ThemedText style={styles.header}>Medicin Schema</ThemedText>
          <ThemedView style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Medicin (ex. Alvedon 500mg)"
              value={medicine}
              onChangeText={setMedicine}
            />
            <TouchableOpacity
              style={styles.customButton}
              onPress={() => setShowTimeModal(true)}
            >
              <ThemedText style={styles.customButtonText}>
                {time ? `Vald tid: ${time}` : "Lägg till tid"}
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.customButton}
              onPress={handleAddDose}
            >
              <ThemedText style={styles.customButtonText}>
                Lägg till dos
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>
          <ScrollView style={styles.listContainer}>
            {sortedDoses.map((dose, index) => (
              <DoseItem key={index} dose={dose} currentTime={currentTime} />
            ))}
          </ScrollView>
          <View style={styles.dispenseButtonContainer}>
            <Button
              title="Mata ut nästa dos"
              onPress={handleDispenseNextDose}
            />
          </View>
        </ThemedView>
      </ParallaxScrollView>
      <Modal
        visible={showTimeModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowTimeModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View>
              <DateTimePicker
                value={selectedDate}
                mode="time"
                display="spinner"
                themeVariant="light"
                onChange={onTimeChange}
              />
              <TouchableOpacity
                style={styles.customButton}
                onPress={confirmTime}
              >
                <ThemedText style={styles.customButtonText}>Klar</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    position: "relative",
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f0f4f7",
  },
  dateHeader: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 8,
    color: "#333",
  },
  header: {
    fontSize: 26,
    marginBottom: 16,
    textAlign: "center",
    fontWeight: "bold",
    color: "#333",
  },
  inputContainer: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 6,
    padding: 10,
    marginBottom: 12,
    fontSize: 16,
  },
  listContainer: {
    flex: 1,
    marginBottom: 16,
  },
  doseItem: {
    padding: 16,
    marginBottom: 16,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  doseItemPast: {
    backgroundColor: "#d3d3d3",
  },
  doseTime: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#222",
  },
  doseMedicine: {
    fontSize: 16,
    marginTop: 4,
    color: "#555",
  },
  progressBarContainer: {
    height: 10,
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
    marginTop: 12,
    overflow: "hidden",
  },
  progressBar: {
    height: 10,
    backgroundColor: "#76c7c0",
    borderRadius: 5,
  },
  dispenseButtonContainer: {
    marginTop: 16,
  },
  customButton: {
    backgroundColor: "#76c7c0",
    paddingVertical: 12,
    borderRadius: 6,
    marginVertical: 4,
    alignItems: "center",
  },
  customButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    display: "flex",
    alignItems: "center",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    padding: 16,
  },
});
