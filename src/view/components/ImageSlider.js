// src/view/components/ImageSlider.js
// ─────────────────────────────────────────────
// VIEW LAYER — reusable image slider with dot indicators.
// Used in ListingCard (compact) and DetailsScreen (full-width).
// Pure render. Receives props only. No logic, no Firebase.
// ─────────────────────────────────────────────

import React, { useState, useRef } from "react";
import {
  View,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  Dimensions,
  TouchableOpacity,
} from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function ImageSlider({
  imageURLs = [],
  height = 220,
  width = SCREEN_WIDTH,
  borderRadius = 0,
  showPlaceholder = true,
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef(null);

  // No images — show placeholder
  if (!imageURLs || imageURLs.length === 0) {
    if (!showPlaceholder) return null;
    return (
      <View style={[styles.placeholder, { height, width, borderRadius }]}>
        <Text style={styles.placeholderIcon}>🏠</Text>
      </View>
    );
  }

  // Single image — no slider needed
  if (imageURLs.length === 1) {
    return (
      <Image
        source={{ uri: imageURLs[0] }}
        style={{ width, height, borderRadius }}
        resizeMode="cover"
      />
    );
  }

  // Multiple images — horizontal scroll slider
  function handleScroll(event) {
    const offsetX  = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(offsetX / width);
    if (newIndex !== activeIndex) setActiveIndex(newIndex);
  }

  function goToIndex(index) {
    scrollRef.current?.scrollTo({ x: index * width, animated: true });
    setActiveIndex(index);
  }

  return (
    <View style={{ width, height }}>
      {/* Scrollable images */}
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        nestedScrollEnabled
        directionalLockEnabled
        disableIntervalMomentum
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={{ width, height, borderRadius }}
      >
        {imageURLs.map((uri, index) => (
          <Image
            key={index}
            source={{ uri }}
            style={{ width, height, borderRadius }}
            resizeMode="cover"
          />
        ))}
      </ScrollView>

      {/* Photo count badge — top right */}
      <View style={styles.countBadge}>
        <Text style={styles.countText}>
          {activeIndex + 1} / {imageURLs.length}
        </Text>
      </View>

      {/* Dot indicators — bottom center */}
      <View style={styles.dotsRow}>
        {imageURLs.map((_, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => goToIndex(index)}
            style={[
              styles.dot,
              index === activeIndex ? styles.dotActive : styles.dotInactive,
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  placeholder: {
    backgroundColor: "#f1f5f9",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderIcon: { fontSize: 48 },

  countBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "rgba(0,0,0,0.45)",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  countText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "600",
  },

  dotsRow: {
    position: "absolute",
    bottom: 10,
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginHorizontal: 3,
  },
  dotActive:   { backgroundColor: "#ffffff" },
  dotInactive: { backgroundColor: "rgba(255,255,255,0.45)" },
});
