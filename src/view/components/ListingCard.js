// src/view/components/ListingCard.js
// ─────────────────────────────────────────────
// VIEW LAYER — reusable listing card with image slider.
// Pure render. Receives props only. No logic, no Firebase.
// ─────────────────────────────────────────────

import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ImageSlider from "./ImageSlider";

const CARD_WIDTH = Dimensions.get("window").width - 32; // 16px padding each side

function formatPrice(price) {
  if (price == null) return "Price TBD";
  return `$${Number(price).toLocaleString()}/mo`;
}

export default function ListingCard({
  listing,
  onPress,
  isFavorite = false,
  onToggleFavorite,
}) {
  const location = listing.city
    ? `${listing.address}, ${listing.city}`
    : listing.address;
  const ownerName = listing.ownerName || "Roomly user";

  return (
    <View style={styles.card}>
      {/* Image slider — shows dots when multiple photos exist */}
      <ImageSlider
        imageURLs={listing.imageURLs || []}
        height={200}
        width={CARD_WIDTH}
        borderRadius={0}
      />

      {onToggleFavorite && (
        <TouchableOpacity
          style={styles.favoriteBtn}
          onPress={() => onToggleFavorite(listing)}
          activeOpacity={0.85}
        >
          <Ionicons
            name={isFavorite ? "heart" : "heart-outline"}
            size={22}
            color={isFavorite ? "#dc3545" : "#ffffff"}
          />
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={styles.info}
        onPress={onPress}
        activeOpacity={0.85}
      >
        <View style={styles.ownerRow}>
          {listing.ownerPhotoURL ? (
            <Image source={{ uri: listing.ownerPhotoURL }} style={styles.ownerAvatar} />
          ) : (
            <View style={[styles.ownerAvatar, styles.ownerAvatarFallback]}>
              <Ionicons name="person" size={15} color="#ffffff" />
            </View>
          )}
          <Text style={styles.ownerName} numberOfLines={1}>
            {ownerName}
          </Text>
        </View>

        <Text style={styles.title} numberOfLines={1}>{listing.title}</Text>
        <Text style={styles.price}>{formatPrice(listing.price)}</Text>
        <Text style={styles.location} numberOfLines={1}>{location}</Text>

        {/* Category badge inline */}
        {listing.category && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{listing.category}</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

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
  info:     { padding: 14 },
  ownerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  ownerAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 8,
  },
  ownerAvatarFallback: {
    backgroundColor: "#2c3947",
    justifyContent: "center",
    alignItems: "center",
  },
  ownerName: {
    flex: 1,
    fontSize: 13,
    fontWeight: "700",
    color: "#52606d",
  },
  favoriteBtn: {
    position: "absolute",
    top: 12,
    left: 12,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(31,41,51,0.62)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 3,
  },
  title:    { fontSize: 17, fontWeight: "600", color: "#1f2933", marginBottom: 4 },
  price:    { fontSize: 15, fontWeight: "700", color: "#2c3947", marginBottom: 4 },
  location: { fontSize: 13, color: "#7b8794", marginBottom: 8 },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: "#e8edf2",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#2c3947",
    textTransform: "capitalize",
  },
});
