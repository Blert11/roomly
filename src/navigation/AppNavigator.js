// src/navigation/AppNavigator.js
// Reads AuthContext for auth state — no Firebase imports here.
// Routes to AuthScreen (view) or the tab navigator based on user state.

import React from "react";
import { ActivityIndicator, View, StyleSheet, Image } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";

// Views
import HomeScreen     from "../view/screens/HomeScreen";
import AuthScreen     from "../view/screens/AuthScreen";
import ProfileScreen  from "../view/screens/ProfileScreen";
import ListingsStack  from "./ListingsStack";
import FavoritesStack from "./FavoritesStack";

const Tab = createBottomTabNavigator();

const HeaderLogo = () => (
  <Image
    source={require("../../assets/logo.png")}
    style={styles.logo}
    resizeMode="contain"
  />
);

export default function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2c3947" />
      </View>
    );
  }

  if (!user) return <AuthScreen />;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          const icons = {
            Home:        focused ? "home"   : "home-outline",
            ListingsTab: focused ? "search" : "search-outline",
            FavoritesTab: focused ? "heart" : "heart-outline",
            Profile:     focused ? "person" : "person-outline",
          };
          return <Ionicons name={icons[route.name]} size={size} color={color} />;
        },
        tabBarActiveTintColor:   "#2c3947",
        tabBarInactiveTintColor: "#9aa5b1",
        tabBarStyle: {
          backgroundColor: "#ffffff",
          borderTopColor:  "#e4e7eb",
          height:          75,
          paddingBottom:   14,
          paddingTop:      8,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: "600" },
        headerStyle:      { backgroundColor: "#ffffff" },
        headerTitleStyle: { color: "#2c3947", fontWeight: "600" },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerTitle: () => <HeaderLogo /> }}
      />
      <Tab.Screen
        name="ListingsTab"
        component={ListingsStack}
        options={{ headerShown: false, title: "Listings" }}
      />
      <Tab.Screen
        name="FavoritesTab"
        component={FavoritesStack}
        options={{ headerShown: false, title: "Favorites" }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ headerTitle: () => <HeaderLogo /> }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  logo:   { width: 100, height: 32 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
