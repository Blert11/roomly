// src/view/screens/ListingsScreen.js
// ─────────────────────────────────────────────
// VIEW LAYER — renders the live listings feed.
// All data logic lives in useListingsViewModel.
// No Firebase imports. No business logic.
// ─────────────────────────────────────────────

import React from "react";
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useListingsViewModel } from "../../viewmodel/useListingsViewModel";
import { useFavoritesViewModel } from "../../viewmodel/useFavoritesViewModel";
import ListingCard from "../components/ListingCard";

function EmptyState() {
  return (
    <View style={styles.empty}>
      <Text style={styles.emptyIcon}>🏠</Text>
      <Text style={styles.emptyTitle}>No listings yet</Text>
      <Text style={styles.emptySubtitle}>
        Be the first to post one from your Profile tab.
      </Text>
    </View>
  );
}

export default function ListingsScreen() {
  const navigation = useNavigation();
  const { listings, loading, error } = useListingsViewModel();
  const { isFavorite, toggleFavorite } = useFavoritesViewModel();

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2c3947" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyIcon}>⚠️</Text>
        <Text style={styles.errorText}>{error}</Text>
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
        ListHeaderComponent={
          <Text style={styles.header}>Available Listings</Text>
        }
        ListEmptyComponent={<EmptyState />}
        renderItem={({ item }) => (
          <ListingCard
            listing={item}
            isFavorite={isFavorite(item.id)}
            onToggleFavorite={toggleFavorite}
            onPress={() => navigation.navigate("Details", { listing: item })}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e8edf2",
  },
  list: {
    padding: 16,
    paddingBottom: 24,
    flexGrow: 1,
  },
  header: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1f2933",
    marginBottom: 16,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e8edf2",
    padding: 24,
  },
  errorText: {
    fontSize: 15,
    color: "#dc3545",
    textAlign: "center",
    marginTop: 8,
  },
  empty:         { alignItems: "center", paddingTop: 80 },
  emptyIcon:     { fontSize: 52, marginBottom: 16 },
  emptyTitle:    { fontSize: 18, fontWeight: "700", color: "#1f2933", marginBottom: 8 },
  emptySubtitle: {
    fontSize: 14,
    color: "#7b8794",
    textAlign: "center",
    paddingHorizontal: 40,
    lineHeight: 20,
  },
});
