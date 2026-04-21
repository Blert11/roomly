// ProfileScreen - simple placeholder for profile tab
import React from "react";
import { View, Text, StyleSheet } from "react-native";

const ProfileScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>👤</Text>
      </View>
      <Text style={styles.name}>John Doe</Text>
      <Text style={styles.email}>johndoe@email.com</Text>
      <Text style={styles.note}>Profile settings coming soon...</Text>
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
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#2c3947",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 36,
  },
  name: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1f2933",
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: "#7b8794",
    marginBottom: 24,
  },
  note: {
    fontSize: 13,
    color: "#9aa5b1",
    fontStyle: "italic",
  },
});

export default ProfileScreen;
