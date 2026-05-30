// HomeScreen (View)
// Only handles UI rendering - logic comes from the ViewModel
import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import useHomeViewModel from "../viewmodels/useHomeViewModel";

const HomeScreen = () => {
  const { onBrowsePress } = useHomeViewModel();

  return (
    <View style={styles.container}>
      {/* App Logo */}
      <Image
        source={require("../../assets/logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      {/* Tagline */}
      <Text style={styles.tagline}>Find your next place easily</Text>
      <Text style={styles.subtitle}>
        Browse apartments and find the perfect roommate match.
      </Text>

      {/* CTA Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={onBrowsePress}
        activeOpacity={0.85}
      >
        <Text style={styles.buttonText}>Browse Listings</Text>
      </TouchableOpacity>
    </View>
  );
};

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
    fontWeight: "600",
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

export default HomeScreen;
