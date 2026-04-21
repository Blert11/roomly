// ListingCard - reusable card component for displaying a listing
import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

const ListingCard = ({ listing, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <Image source={{ uri: listing.image }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.title}>{listing.title}</Text>
        <Text style={styles.price}>{listing.price}</Text>
        <Text style={styles.location}>{listing.location}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  image: {
    width: "100%",
    height: 180,
  },
  info: {
    padding: 14,
  },
  title: {
    fontSize: 17,
    fontWeight: "600",
    color: "#1f2933",
    marginBottom: 4,
  },
  price: {
    fontSize: 15,
    fontWeight: "700",
    color: "#2c3947",
    marginBottom: 4,
  },
  location: {
    fontSize: 13,
    color: "#7b8794",
  },
});

export default ListingCard;
