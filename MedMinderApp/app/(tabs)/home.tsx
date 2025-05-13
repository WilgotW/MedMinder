import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import React, { useEffect, useState } from "react";
import {
  Button,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface Dose {
  id: number;
  time: string;
  medicine: string;
  dispensed: boolean;
  userId: number;
}

export default function HomeScreen() {
  const [userId, setUserId] = useState<number | null>(null);
  const [medicine, setMedicine] = useState("");
  const [time, setTime] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [doses, setDoses] = useState<Dose[]>([]);

  useEffect(() => {
    const loadUser = async () => {
      const stored = await AsyncStorage.getItem("user");
      if (stored) {
        const parsed = JSON.parse(stored);
        setUserId(parsed.id);
      }
    };
    loadUser();

    //refetch medicine every 2 seconds
    const interval = setInterval(refetchDoses, 2000);
    return () => clearInterval(interval);
  }, []);

  function refetchDoses() {
    if (userId) {
      console.log("trying fetch");
      fetchDoses();
    }
  }
  useEffect(() => {
    if (!userId) return;

    const interval = setInterval(() => {
      fetchDoses();
    }, 10000);

    return () => clearInterval(interval);
  }, [userId]);
  const fetchDoses = async () => {
    try {
      const res = await fetch(
        `https://focused-smile-production.up.railway.app/api/doses/${userId}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch doses");
      const data = await res.json();

      setDoses(data);
    } catch (error) {
      console.error("Error fetching doses:", error);
    }
  };

  const onTimeChange = (event: DateTimePickerEvent, date?: Date) => {
    if (date) setSelectedDate(date);
  };

  const confirmTime = () => {
    const hours = selectedDate.getHours();
    const minutes = selectedDate.getMinutes();
    const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
    setTime(formattedTime);
    setShowTimeModal(false);
  };

  const handleAddDose = async () => {
    if (!time || !medicine || !userId) return;

    try {
      const res = await fetch(
        "https://focused-smile-production.up.railway.app/api/doses/add",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ time, medicine, userId }),
        }
      );

      if (!res.ok) throw new Error("Failed to add dose");
      const newDose = await res.json();
      setDoses((prev) => [...prev, newDose]);
      setMedicine("");
      setTime("");
    } catch (error) {
      console.error("Error adding dose:", error);
    }
  };

  const handleDispenseNextDose = async () => {
    const next = doses.find((d) => !d.dispensed);
    if (!next) return;

    const res = await fetch(
      `https://focused-smile-production.up.railway.app/api/doses/dispense/${next.id}`,
      {
        method: "PUT",
      }
    );

    if (res.ok) {
      setDoses((prev) =>
        prev.map((d) => (d.id === next.id ? { ...d, dispensed: true } : d))
      );
    }
  };

  function DoseItem({ dose }: { dose: Dose }) {
    return (
      <ThemedView
        style={[styles.doseItem, dose.dispensed && styles.doseItemPast]}
      >
        <ThemedText style={styles.doseTime}>{dose.time}</ThemedText>
        <ThemedText style={styles.doseMedicine}>{dose.medicine}</ThemedText>
      </ThemedView>
    );
  }

  return (
    <SafeAreaView style={styles.screenContainer}>
      <ParallaxScrollView
        headerBackgroundColor={{ light: "#87bfd1", dark: "#1D3D47" }}
        headerImage={<></>}
      >
        <ThemedView style={styles.container}>
          <ThemedText style={styles.header}>Medicin Schema</ThemedText>

          <ThemedView style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Medicin (ex. Alvedon)"
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
            {doses.map((dose) => (
              <DoseItem key={dose.id} dose={dose} />
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
            <DateTimePicker
              value={selectedDate}
              mode="time"
              display="spinner"
              themeVariant="light"
              onChange={onTimeChange}
            />
            <TouchableOpacity style={styles.customButton} onPress={confirmTime}>
              <ThemedText style={styles.customButtonText}>Klar</ThemedText>
            </TouchableOpacity>
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
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    padding: 16,
  },
});
