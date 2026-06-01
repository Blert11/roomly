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
    flexGrow: 1,
    backgroundColor: "#e8edf2",
    alignItems: "center",
    padding: 24,
  },

  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#2c3947",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  avatarText: {
    fontSize: 36,
  },

  profileImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
    marginTop: 40,
  },

  changePhotoText: {
    marginTop: 10,
    marginBottom: 20,
    color: "#2563eb",
    fontWeight: "600",
  },

  name: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1f2933",
  },

  email: {
    fontSize: 14,
    color: "#7b8794",
    marginBottom: 30,
  },

  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    elevation: 4,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 20,
    color: "#1f2933",
  },

  input: {
    backgroundColor: "#f1f5f9",
    padding: 14,
    borderRadius: 10,
    marginBottom: 14,
    fontSize: 15,
  },

  textArea: {
    height: 100,
    textAlignVertical: "top",
  },

  imageButton: {
    backgroundColor: "#2c3947",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 16,
  },

  imageButtonText: {
    color: "#fff",
    fontWeight: "600",
  },

  previewImage: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
  },

  postButton: {
    backgroundColor: "#2563eb",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
  },

  postButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },

  logoutButton: {
    marginTop: 30,
    backgroundColor: "#dc3545",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginBottom: 40,
  },

  logoutText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});

export default ProfileScreen;