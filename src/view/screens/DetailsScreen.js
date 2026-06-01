// src/view/screens/DetailsScreen.js
// ─────────────────────────────────────────────
// VIEW LAYER — renders full details for a selected listing.
// Formatting and actions come from useDetailsViewModel.
// No Firebase imports. No business logic.
// ─────────────────────────────────────────────

import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { WebView } from "react-native-webview";
import { useDetailsViewModel } from "../../viewmodel/useDetailsViewModel";
import { useFavoritesViewModel } from "../../viewmodel/useFavoritesViewModel";
import ImageSlider from "../components/ImageSlider";

const SCREEN_WIDTH = Dimensions.get("window").width;
const MAP_WEBVIEW_BASE_URL = "https://roomly.local/";

export default function DetailsScreen({ route }) {
  const { listing } = route.params;
  const {
    formattedPrice,
    formattedLocation,
    mapHtml,
    handleContact,
    handleOpenMap,
  } =
    useDetailsViewModel(listing);
  const { isFavorite, toggleFavorite } = useFavoritesViewModel();
  const listingId = listing.id || listing.listingId;
  const favorite = isFavorite(listingId);
  const ownerName = listing.ownerName || "Roomly user";

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      {/* Full-width image slider — shows all listing photos */}
      <ImageSlider
        imageURLs={listing.imageURLs || []}
        height={300}
        width={SCREEN_WIDTH}
        borderRadius={0}
        showPlaceholder={true}
      />

      <View style={styles.content}>

        {/* Category badge */}
        {listing.category && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {listing.category.toUpperCase()}
            </Text>
          </View>
        )}

        <View style={styles.titleRow}>
          <Text style={styles.title}>{listing.title}</Text>
          <TouchableOpacity
            style={styles.favoriteBtn}
            onPress={() => toggleFavorite({ ...listing, id: listingId })}
            activeOpacity={0.85}
          >
            <Ionicons
              name={favorite ? "heart" : "heart-outline"}
              size={22}
              color={favorite ? "#dc3545" : "#2c3947"}
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.price}>{formattedPrice}</Text>
        <Text style={styles.location}>{formattedLocation}</Text>

        <View style={styles.ownerCard}>
          {listing.ownerPhotoURL ? (
            <Image source={{ uri: listing.ownerPhotoURL }} style={styles.ownerAvatar} />
          ) : (
            <View style={[styles.ownerAvatar, styles.ownerAvatarFallback]}>
              <Ionicons name="person" size={20} color="#ffffff" />
            </View>
          )}
          <View style={styles.ownerInfo}>
            <Text style={styles.ownerLabel}>Posted by</Text>
            <Text style={styles.ownerName} numberOfLines={1}>
              {ownerName}
            </Text>
          </View>
        </View>

        {/* Photo count info */}
        {listing.imageURLs?.length > 1 && (
          <Text style={styles.photoCount}>
            📷 {listing.imageURLs.length} photos — swipe to see all
          </Text>
        )}

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>{listing.description}</Text>

        {mapHtml && (
          <>
            <Text style={styles.sectionTitle}>Location</Text>
            <View style={styles.mapCard}>
              <WebView
                source={{ html: mapHtml, baseUrl: MAP_WEBVIEW_BASE_URL }}
                style={styles.map}
                originWhitelist={["*"]}
                javaScriptEnabled
                domStorageEnabled
                startInLoadingState
                renderLoading={() => (
                  <View style={styles.mapLoading}>
                    <Text style={styles.mapLoadingText}>Loading map...</Text>
                  </View>
                )}
              />
            </View>
            <TouchableOpacity
              style={styles.mapBtn}
              onPress={handleOpenMap}
              activeOpacity={0.85}
            >
              <Ionicons name="map-outline" size={18} color="#2563eb" />
              <Text style={styles.mapBtnText}>Open in Google Maps</Text>
            </TouchableOpacity>
          </>
        )}

        <TouchableOpacity
          style={styles.contactBtn}
          onPress={handleContact}
          activeOpacity={0.85}
        >
          <Text style={styles.contactBtnText}>Contact Owner</Text>
        </TouchableOpacity>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#e8edf2" },
  content:   { padding: 20 },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: "#2c3947",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 10,
    marginTop: 4,
  },
  badgeText: {
    color: "#ffffff",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.8,
  },
  title: {
    flex: 1,
    fontSize: 22,
    fontWeight: "700",
    color: "#1f2933",
    marginRight: 12,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 6,
  },
  favoriteBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
  },
  price: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2563eb",
    marginBottom: 4,
  },
  location:   { fontSize: 14, color: "#7b8794", marginBottom: 4 },
  ownerCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
    marginBottom: 8,
  },
  ownerAvatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    marginRight: 12,
  },
  ownerAvatarFallback: {
    backgroundColor: "#2c3947",
    justifyContent: "center",
    alignItems: "center",
  },
  ownerInfo: {
    flex: 1,
  },
  ownerLabel: {
    fontSize: 11,
    color: "#7b8794",
    fontWeight: "700",
    marginBottom: 2,
    textTransform: "uppercase",
  },
  ownerName: {
    fontSize: 15,
    color: "#1f2933",
    fontWeight: "700",
  },
  photoCount: { fontSize: 13, color: "#9aa5b1", marginBottom: 4 },
  divider:    { height: 1, backgroundColor: "#d1d9e0", marginVertical: 16 },
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
    marginBottom: 18,
  },
  mapCard: {
    height: 220,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#f1f5f9",
    marginBottom: 10,
  },
  map: {
    flex: 1,
  },
  mapLoading: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f1f5f9",
  },
  mapLoadingText: {
    color: "#7b8794",
    fontSize: 13,
    fontWeight: "600",
  },
  mapBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#eff6ff",
    borderRadius: 10,
    paddingVertical: 12,
    marginBottom: 24,
  },
  mapBtnText: {
    color: "#2563eb",
    fontSize: 14,
    fontWeight: "700",
  },
  contactBtn: {
    backgroundColor: "#2c3947",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 32,
  },
  contactBtnText: { color: "#ffffff", fontSize: 16, fontWeight: "600" },
});
