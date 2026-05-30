// DetailsScreen (View)
// Only handles UI rendering - logic comes from the ViewModel
import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import useDetailsViewModel from "../viewmodels/useDetailsViewModel";

const DetailsScreen = ({ route }) => {
  const { listing, onContactPress } = useDetailsViewModel(route);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Image source={{ uri: listing.image }} style={styles.image} />

      <View style={styles.content}>
        <Text style={styles.title}>{listing.title}</Text>
        <Text style={styles.price}>{listing.price}</Text>
        <Text style={styles.location}>{listing.location}</Text>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>{listing.description}</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={onContactPress}
          activeOpacity={0.85}
        >
          <Text style={styles.buttonText}>Contact Owner</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e8edf2",
  },
  image: {
    width: "100%",
    height: 260,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1f2933",
    marginBottom: 6,
  },
  price: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2c3947",
    marginBottom: 4,
  },
  location: {
    fontSize: 14,
    color: "#7b8794",
    marginBottom: 8,
  },
  divider: {
    height: 1,
    backgroundColor: "#d1d9e0",
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2933",
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
    color: "#52606d",
    lineHeight: 22,
    marginBottom: 28,
  },
  button: {
    backgroundColor: "#2c3947",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 32,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default DetailsScreen;
