// src/view/screens/HomeScreen.js
// ─────────────────────────────────────────────
// VIEW LAYER — primary feed with built-in search, category filter, and sort.
// (Replaces the dedicated Search tab — search now lives here.)
// ─────────────────────────────────────────────

import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useListingsViewModel } from "../../viewmodel/useListingsViewModel";
import { useFavoritesViewModel } from "../../viewmodel/useFavoritesViewModel";
import ListingCard from "../components/ListingCard";

const CATEGORIES = ["all", "studio", "room", "1br", "2br", "house", "other"];

const SORT_OPTIONS = [
  { key: "newest",    label: "Newest",  icon: "time-outline" },
  { key: "priceAsc",  label: "Price ↑", icon: "trending-up-outline" },
  { key: "priceDesc", label: "Price ↓", icon: "trending-down-outline" },
];

function EmptyState({ query, category }) {
  const hasFilter = query || category !== "all";
  return (
    <View style={styles.empty}>
      <Text style={styles.emptyIcon}>{hasFilter ? "🔍" : "🏠"}</Text>
      <Text style={styles.emptyTitle}>
        {hasFilter ? "No matches" : "No listings yet"}
      </Text>
      <Text style={styles.emptySubtitle}>
        {hasFilter
          ? "Try a different search term or category."
          : "Be the first — tap the + button to post one."}
      </Text>
    </View>
  );
}

export default function HomeScreen() {
  const navigation = useNavigation();
  const {
    filteredListings,
    loading,
    error,
    query,        setQuery,
    category,     setCategory,
    sort,         setSort,
    filtersOpen,  setFiltersOpen,
    filtersActive,
    trimmed,
  } = useListingsViewModel();
  const { isFavorite, toggleFavorite, alertConfig: favAlertConfig } = useFavoritesViewModel();

  useEffect(() => {
    if (!favAlertConfig) return;
    Alert.alert(favAlertConfig.title, favAlertConfig.message, favAlertConfig.buttons);
  }, [favAlertConfig?._id]);

  const filtered = filteredListings;

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
      <View style={styles.searchWrap}>
        <View style={styles.searchRow}>
          <View style={styles.searchBox}>
            <Ionicons name="search" size={20} color="#2c3947" />
            <TextInput
              style={styles.searchInput}
              placeholder="Title, city, address…"
              placeholderTextColor="#9aa5b1"
              value={query}
              onChangeText={setQuery}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="search"
            />
            {query.length > 0 && (
              <TouchableOpacity
                onPress={() => setQuery("")}
                hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
                style={styles.clearBtn}
              >
                <Ionicons name="close-circle" size={20} color="#52606d" />
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity
            onPress={() => setFiltersOpen((v) => !v)}
            style={[styles.filterToggle, filtersActive && styles.filterToggleActive]}
            activeOpacity={0.85}
          >
            <Ionicons
              name="options-outline"
              size={20}
              color={filtersActive ? "#ffffff" : "#2c3947"}
            />
            {filtersActive && <View style={styles.filterDot} />}
          </TouchableOpacity>
        </View>

        {filtersOpen && (
          <View style={styles.filtersPanel}>
            <Text style={styles.groupLabel}>Category</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.chipRow}
            >
              {CATEGORIES.map((cat) => {
                const active = category === cat;
                return (
                  <TouchableOpacity
                    key={cat}
                    onPress={() => setCategory(cat)}
                    style={[styles.chip, active && styles.chipActive]}
                    activeOpacity={0.85}
                  >
                    <Text style={[styles.chipText, active && styles.chipTextActive]}>
                      {cat}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <Text style={styles.groupLabel}>Sort by</Text>
            <View style={styles.sortRow}>
              {SORT_OPTIONS.map((opt) => {
                const active = sort === opt.key;
                return (
                  <TouchableOpacity
                    key={opt.key}
                    onPress={() => setSort(opt.key)}
                    style={[styles.sortBtn, active && styles.sortBtnActive]}
                    activeOpacity={0.85}
                  >
                    <Ionicons
                      name={opt.icon}
                      size={14}
                      color={active ? "#ffffff" : "#52606d"}
                    />
                    <Text style={[styles.sortText, active && styles.sortTextActive]}>
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        <Text style={styles.resultCount}>
          {filtered.length} result{filtered.length === 1 ? "" : "s"}
          {trimmed && ` for "${query.trim()}"`}
          {category !== "all" && ` in ${category}`}
        </Text>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        ListEmptyComponent={<EmptyState query={query.trim()} category={category} />}
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
  container: { flex: 1, backgroundColor: "#e8edf2" },

  searchWrap: {
    backgroundColor: "#ffffff",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e4e7eb",
  },

  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  searchBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f5f9",
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 48,
    gap: 10,
    borderWidth: 1,
    borderColor: "#dbe2e8",
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#1f2933",
    paddingVertical: 0,
    fontWeight: "600",
  },
  clearBtn: { padding: 2 },

  filterToggle: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#f1f5f9",
    borderWidth: 1,
    borderColor: "#dbe2e8",
    justifyContent: "center",
    alignItems: "center",
  },
  filterToggleActive: {
    backgroundColor: "#2c3947",
    borderColor: "#2c3947",
  },
  filterDot: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#16a34a",
  },

  filtersPanel: {
    marginTop: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#eef2f5",
  },
  groupLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#7b8794",
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginTop: 4,
    marginBottom: 6,
  },
  chipRow: {
    paddingRight: 16,
    paddingBottom: 4,
    marginBottom: 4,
  },
  chip: {
    minHeight: 34,
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 17,
    backgroundColor: "#f1f5f9",
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#d1d9e0",
    justifyContent: "center",
    alignItems: "center",
  },
  chipActive: { backgroundColor: "#2c3947", borderColor: "#2c3947" },
  chipText: {
    fontSize: 13,
    lineHeight: 18,
    color: "#52606d",
    fontWeight: "600",
    textTransform: "capitalize",
    includeFontPadding: false,
  },
  chipTextActive: { color: "#ffffff" },

  sortRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 6,
  },
  sortBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: "#f1f5f9",
    borderWidth: 1,
    borderColor: "#d1d9e0",
  },
  sortBtnActive: { backgroundColor: "#2563eb", borderColor: "#2563eb" },
  sortText:       { fontSize: 12, fontWeight: "700", color: "#52606d" },
  sortTextActive: { color: "#ffffff" },

  resultCount: {
    marginTop: 8,
    fontSize: 12,
    color: "#7b8794",
    fontWeight: "600",
  },

  list: { padding: 16, paddingBottom: 24, flexGrow: 1 },
  row:  { justifyContent: "space-between", marginBottom: 18 },

  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e8edf2",
    padding: 24,
  },
  errorText: { fontSize: 15, color: "#dc3545", textAlign: "center", marginTop: 8 },

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
