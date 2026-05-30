// ListingsScreen (View)
// Only handles UI rendering - logic comes from the ViewModel
import React from "react";
import { View, FlatList, StyleSheet, Text, ActivityIndicator } from "react-native";
import useListingsViewModel from "../viewmodels/useListingsViewModel";
import ListingCard from "../components/ListingCard";

const ListingsScreen = () => {
  const { listings, loading, onListingPress } = useListingsViewModel();

  // Show loading spinner while data is being fetched
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2c3947" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={listings}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <ListingCard listing={item} onPress={() => onListingPress(item)} />
        )}
        ListHeaderComponent={
          <Text style={styles.header}>Available Listings</Text>
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
  loadingContainer: {
    flex: 1,
    backgroundColor: "#e8edf2",
    alignItems: "center",
    justifyContent: "center",
  },
  list: {
    padding: 16,
    paddingBottom: 24,
  },
  header: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1f2933",
    marginBottom: 16,
  },
});

export default ListingsScreen;
