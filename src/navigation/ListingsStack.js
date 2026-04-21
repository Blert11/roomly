// ListingsStack - stack navigator for Listings tab
// Contains the list view and the detail view
import React from "react";
import { Image, StyleSheet } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ListingsScreen from "../screens/ListingsScreen";
import DetailsScreen from "../screens/DetailsScreen";

const Stack = createNativeStackNavigator();

// Logo component for the header
const HeaderLogo = () => (
  <Image
    source={require("../../assets/logo.png")}
    style={styles.headerLogo}
    resizeMode="contain"
  />
);

const ListingsStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#ffffff" },
        headerTintColor: "#2c3947",
        headerTitleStyle: { fontWeight: "600" },
      }}
    >
      <Stack.Screen
        name="Listings"
        component={ListingsScreen}
        options={{ headerTitle: () => <HeaderLogo /> }}
      />
      <Stack.Screen
        name="Details"
        component={DetailsScreen}
        options={{ title: "Details" }}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  headerLogo: {
    width: 100,
    height: 32,
  },
});

export default ListingsStack;
