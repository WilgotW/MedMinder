import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { router } from "expo-router";

export default function LoginScreen() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const res = await fetch("http://localhost:4000/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, password }),
    });

    if (res.ok) {
      const user = await res.json();
      router.replace({
        pathname: "/home",
        params: { userId: user.id.toString() },
      });
    } else {
      Alert.alert("Login failed", "Check your credentials");
    }
  };

  const handleRegister = async () => {
    const res = await fetch("http://localhost:4000/api/users/new", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, password }),
    });

    if (res.ok) {
      Alert.alert("Account created", "You can now log in");
    } else {
      Alert.alert("Error", "Username might be taken");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>MedMinder Login</Text>
      <TextInput
        placeholder="Username"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />
      <Button title="Log in" onPress={handleLogin} />
      <Button title="Register" onPress={handleRegister} color="gray" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 6,
    fontSize: 16,
  },
});
