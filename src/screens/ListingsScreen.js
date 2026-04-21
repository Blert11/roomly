// ListingsScreen - shows all available apartment listings
import React from "react";
import { View, FlatList, Image, StyleSheet, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import listings from "../data/listings";
import ListingCard from "../components/ListingCard";

const ListingsScreen = () => {
  const navigation = useNavigation();

  // Navigate to details when a card is tapped
  const handlePress = (listing) => {
    navigation.navigate("Details", { listing });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={listings}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <ListingCard listing={item} onPress={() => handlePress(item)} />
        )}
        ListHeaderComponent={
          <View>
            <Text style={styles.header}>Available Listings</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e8edf2",
  },
  list: {
    padding: 16,
    paddingBottom: 24,
  },
  logo: {
    width: 120,
    height: 40,
    marginBottom: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1f2933",
    marginBottom: 16,
  },
});

export default ListingsScreen;
