// AppNavigator - main bottom tab navigation
import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Image, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import HomeScreen from "../screens/HomeScreen";
import AuthScreen from "../screens/AuthScreen";
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

// Auth listener component that shows AuthScreen if not logged in
function AuthListener({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!user) {
    return <AuthScreen />;
  }

  return children;
}

const AppNavigator = () => {
  return (
    <AuthListener>
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
    </AuthListener>
  );
};

const styles = StyleSheet.create({
  headerLogo: {
    width: 100,
    height: 32,
  },
});

export default AppNavigator;
