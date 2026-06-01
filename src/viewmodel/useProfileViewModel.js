// src/viewmodel/useProfileViewModel.js
// ─────────────────────────────────────────────
// VIEWMODEL LAYER — owns profile photo, listing creation, logout.
// Calls model/services. Exposes clean state to the View.
// No Firebase imports. No JSX. No UI rendering.
// ─────────────────────────────────────────────

import { useState, useEffect } from "react";
import { Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import {
  logOut,
  updateUserProfile,
  getCurrentUser,
} from "../model/services/auth.service";
import {
  createListing,
  deleteListing,
  subscribeToUserListings,
  uploadAvatar,
} from "../model/services/listings.service";
import { GOOGLE_MAPS_API_KEY } from "../model/config/maps.config";

const MAX_IMAGES = 5;
const DEFAULT_MAP_CENTER = { latitude: 44.7866, longitude: 20.4489 };

function buildLocationPickerHtml(selectedLocation, address) {
  const hasApiKey =
    GOOGLE_MAPS_API_KEY &&
    GOOGLE_MAPS_API_KEY !== "YOUR_GOOGLE_MAPS_API_KEY";
  const center = selectedLocation || DEFAULT_MAP_CENTER;
  const initialAddress = (address || "").replace(/\\/g, "\\\\").replace(/"/g, '\\"');

  if (!hasApiKey) {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="initial-scale=1, maximum-scale=1" />
          <style>
            html, body {
              height: 100%;
              margin: 0;
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
              background: #f1f5f9;
              color: #52606d;
            }
            .message {
              height: 100%;
              box-sizing: border-box;
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 18px;
              text-align: center;
              font-size: 14px;
              line-height: 20px;
              font-weight: 600;
            }
          </style>
        </head>
        <body>
          <div class="message">
            Add your Google Maps API key in src/model/config/maps.config.js to enable address suggestions and pin selection.
          </div>
        </body>
      </html>
    `;
  }

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="initial-scale=1, maximum-scale=1" />
        <style>
          html, body {
            width: 100%;
            height: 100%;
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          }
          #map {
            width: 100%;
            height: 100%;
          }
          #search {
            position: absolute;
            top: 12px;
            left: 12px;
            right: 12px;
            z-index: 5;
            height: 42px;
            box-sizing: border-box;
            border: 0;
            border-radius: 10px;
            padding: 0 14px;
            font-size: 15px;
            color: #1f2933;
            background: white;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.22);
            outline: none;
          }
          .pac-container {
            z-index: 9999;
          }
        </style>
      </head>
      <body>
        <input id="search" type="text" placeholder="Search real street address" value="${initialAddress}" />
        <div id="map"></div>
        <script>
          let map;
          let marker = null;
          let geocoder = null;
          const initialLocation = ${selectedLocation ? JSON.stringify(selectedLocation) : "null"};

          function getCity(components) {
            const cityTypes = ["locality", "postal_town", "administrative_area_level_2", "administrative_area_level_1"];
            for (const type of cityTypes) {
              const match = components.find((component) => component.types.includes(type));
              if (match) return match.long_name;
            }
            return "";
          }

          function sendLocation(payload) {
            window.ReactNativeWebView.postMessage(JSON.stringify(payload));
          }

          function setMarker(latitude, longitude, shouldCenter) {
            const position = { lat: latitude, lng: longitude };
            if (marker) {
              marker.setPosition(position);
            } else {
              marker = new google.maps.Marker({
                position,
                map,
                draggable: false
              });
            }
            if (shouldCenter) map.panTo(position);
          }

          function initMap() {
            geocoder = new google.maps.Geocoder();
            const center = { lat: ${center.latitude}, lng: ${center.longitude} };
            map = new google.maps.Map(document.getElementById("map"), {
              center,
              zoom: initialLocation ? 16 : 13,
              mapTypeControl: false,
              streetViewControl: false,
              fullscreenControl: false
            });

            const input = document.getElementById("search");
            const autocomplete = new google.maps.places.Autocomplete(input, {
              fields: ["address_components", "formatted_address", "geometry", "name"],
              types: ["address"]
            });

            autocomplete.bindTo("bounds", map);
            autocomplete.addListener("place_changed", function() {
              const place = autocomplete.getPlace();
              if (!place.geometry || !place.geometry.location) return;

              const latitude = place.geometry.location.lat();
              const longitude = place.geometry.location.lng();
              const formattedAddress = place.formatted_address || input.value;
              const city = getCity(place.address_components || []);

              input.value = formattedAddress;
              setMarker(latitude, longitude, true);
              map.setZoom(16);
              sendLocation({
                latitude,
                longitude,
                address: formattedAddress,
                city
              });
            });

            map.addListener("click", function(event) {
              const latitude = event.latLng.lat();
              const longitude = event.latLng.lng();
              setMarker(latitude, longitude, true);

              geocoder.geocode({ location: event.latLng }, function(results, status) {
                const bestResult = status === "OK" && results && results[0] ? results[0] : null;
                const formattedAddress = bestResult ? bestResult.formatted_address : input.value;
                const city = bestResult ? getCity(bestResult.address_components || []) : "";
                input.value = formattedAddress;
                sendLocation({
                  latitude,
                  longitude,
                  address: formattedAddress,
                  city
                });
              });
            });

            if (initialLocation) {
              setMarker(initialLocation.latitude, initialLocation.longitude, false);
            }
          }
        </script>
        <script
          src="https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&callback=initMap"
          async
          defer
        ></script>
      </body>
    </html>
  `;
}

export function useProfileViewModel() {
  const user = getCurrentUser();

  // Profile
  const [profileImage, setProfileImage] = useState(user?.photoURL || null);

  // Create listing form
  const [title, setTitle]               = useState("");
  const [address, setAddress]           = useState("");
  const [city, setCity]                 = useState("");
  const [price, setPrice]               = useState("");
  const [category, setCategory]         = useState("studio");
  const [description, setDescription]   = useState("");
  const [listingLocation, setListingLocation] = useState(null);

  // Multiple listing images — array of local URIs (max 5)
  const [listingImages, setListingImages] = useState([]);

  // User's own listings (live)
  const [myListings, setMyListings] = useState([]);

  // Async state
  const [submitting, setSubmitting] = useState(false);
  const [deletingListingId, setDeletingListingId] = useState(null);
  const [error, setError]           = useState(null);

  useEffect(() => {
    if (!user) return;
    const unsubscribe = subscribeToUserListings(
      user.uid,
      (data) => setMyListings(data),
      (err) => console.error("[ProfileVM]", err.message)
    );
    return () => unsubscribe();
  }, [user?.uid]);

  // ── Permission ─────────────────────────────────────────────────────────────

  async function requestGalleryPermission() {
    const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!granted) {
      Alert.alert("Permission needed", "Please allow gallery access in Settings.");
    }
    return granted;
  }

  // ── Profile photo ──────────────────────────────────────────────────────────

  async function pickProfileImage() {
    if (!(await requestGalleryPermission())) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (result.canceled) return;

    try {
      const downloadURL = await uploadAvatar(user.uid, result.assets[0].uri);
      await updateUserProfile({ photoURL: downloadURL });
      setProfileImage(downloadURL);
      Alert.alert("Success", "Profile picture updated!");
    } catch (e) {
      Alert.alert("Upload Error", e.message);
    }
  }

  // ── Listing photos — pick multiple (adds to existing selection) ────────────

  async function pickListingImages() {
    if (!(await requestGalleryPermission())) return;

    const remaining = MAX_IMAGES - listingImages.length;
    if (remaining <= 0) {
      Alert.alert(
        "Limit reached",
        `You can add up to ${MAX_IMAGES} photos per listing.`
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      allowsMultipleSelection: true,   // expo-image-picker v14+ supports this
      selectionLimit: remaining,
    });

    if (result.canceled) return;

    const newUris = result.assets.map((a) => a.uri);
    setListingImages((prev) => [...prev, ...newUris].slice(0, MAX_IMAGES));
  }

  // ── Remove one photo by index ──────────────────────────────────────────────

  function removeListingImage(index) {
    setListingImages((prev) => prev.filter((_, i) => i !== index));
  }

  function handleListingLocationMessage(event) {
    try {
      const location = JSON.parse(event.nativeEvent.data);
      if (
        typeof location.latitude === "number" &&
        typeof location.longitude === "number"
      ) {
        if (location.address) setAddress(location.address);
        if (location.city) setCity(location.city);
        setListingLocation({
          latitude: location.latitude,
          longitude: location.longitude,
        });
      }
    } catch (e) {
      console.error("[ProfileVM] map location:", e.message);
    }
  }

  function clearListingLocation() {
    setListingLocation(null);
    setAddress("");
    setCity("");
  }

  // ── Post listing ───────────────────────────────────────────────────────────

  async function handlePostListing() {
    if (!title.trim() || !address.trim() || !price.trim() || !description.trim()) {
      Alert.alert("Missing fields", "Title, Address, Price and Description are required.");
      return;
    }
    if (isNaN(Number(price)) || Number(price) <= 0) {
      Alert.alert("Invalid price", "Price must be a positive number.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      // Pass the full array — service uploads all in parallel
      await createListing(
        {
          title,
          description,
          price,
          address,
          city,
          category,
          ownerId: user.uid,
          ownerName: user.displayName || "Roomly user",
          ownerPhotoURL: user.photoURL || null,
          latitude: listingLocation?.latitude ?? null,
          longitude: listingLocation?.longitude ?? null,
        },
        listingImages
      );

      // Reset form
      setTitle(""); setAddress(""); setCity(""); setPrice("");
      setCategory("studio"); setDescription(""); setListingImages([]);
      setListingLocation(null);

      Alert.alert("Posted!", "Your listing is now live.");
    } catch (e) {
      console.error("[ProfileVM] createListing:", e.message);
      setError(e.message);
      Alert.alert("Error", "Could not post your listing. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  // ── Delete listing ─────────────────────────────────────────────────────────

  function handleDeleteListing(listing) {
    Alert.alert(
      "Delete Listing",
      `Are you sure you want to delete "${listing.title}"? This cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setDeletingListingId(listing.id);
            try {
              await deleteListing(listing.id, listing.imageURLs || []);
              // myListings updates automatically via the real-time listener
            } catch (e) {
              console.error("[ProfileVM] deleteListing:", e.message);
              Alert.alert("Error", "Could not delete listing. Please try again.");
            } finally {
              setDeletingListingId(null);
            }
          },
        },
      ]
    );
  }

  // ── Logout ─────────────────────────────────────────────────────────────────

  function handleLogout() {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try { await logOut(); } catch (e) { Alert.alert("Error", e.message); }
        },
      },
    ]);
  }

  return {
    user, profileImage, myListings,
    title,       setTitle,
    address,     setAddress,
    city,        setCity,
    price,       setPrice,
    category,    setCategory,
    description, setDescription,
    listingLocation,
    locationPickerHtml: buildLocationPickerHtml(listingLocation, address),
    handleListingLocationMessage,
    clearListingLocation,
    // Multi-image
    listingImages,
    pickListingImages,
    removeListingImage,
    maxImages: MAX_IMAGES,
    // Actions
    pickProfileImage,
    handlePostListing,
    handleDeleteListing,
    handleLogout,
    submitting,
    deletingListingId,
    error,
  };
}
