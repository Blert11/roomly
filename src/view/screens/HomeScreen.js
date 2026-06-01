// src/view/screens/HomeScreen.js
// ─────────────────────────────────────────────
// VIEW LAYER — static landing page.
// No logic, no Firebase, no ViewModel needed here.
// ─────────────────────────────────────────────

import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function HomeScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Image
        source={require("../../../assets/logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.tagline}>Find your next place easily</Text>
      <Text style={styles.subtitle}>
        Browse apartments and find the perfect roommate match.
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("ListingsTab")}
        activeOpacity={0.85}
      >
        <Text style={styles.buttonText}>Browse Listings</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e8edf2",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  logo: {
    width: 200,
    height: 70,
    marginBottom: 32,
  },
  tagline: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1f2933",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: "#7b8794",
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 22,
  },
  button: {
    backgroundColor: "#2c3947",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 10,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});
