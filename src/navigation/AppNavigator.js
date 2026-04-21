// AppNavigator - main bottom tab navigation
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Image, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "../screens/HomeScreen";
import ListingsStack from "./ListingsStack";
import ProfileScreen from "../screens/ProfileScreen";

const Tab = createBottomTabNavigator();

// Logo component for the header
const HeaderLogo = () => (
  <Image
    source={require("../../assets/logo.png")}
    style={styles.headerLogo}
    resizeMode="contain"
  />
);

const AppNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "ListingsTab") {
            iconName = focused ? "search" : "search-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#2c3947",
        tabBarInactiveTintColor: "#9aa5b1",
        tabBarStyle: {
          backgroundColor: "#ffffff",
          borderTopColor: "#e4e7eb",
          height: 75,
          paddingBottom: 14,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
        },
        headerStyle: { backgroundColor: "#ffffff" },
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
        name="Profile"
        component={ProfileScreen}
        options={{ headerTitle: () => <HeaderLogo /> }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  headerLogo: {
    width: 100,
    height: 32,
  },
});

export default AppNavigator;
