// src/navigation/MessagesStack.js
// Stack navigator: Inbox (Conversations) → Chat

import React from "react";
import { Image, StyleSheet } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ConversationsScreen from "../view/screens/ConversationsScreen";
import ChatScreen          from "../view/screens/ChatScreen";

const Stack = createNativeStackNavigator();

const HeaderLogo = () => (
  <Image
    source={require("../../assets/logo.png")}
    style={styles.logo}
    resizeMode="contain"
  />
);

export default function MessagesStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle:      { backgroundColor: "#ffffff" },
        headerTintColor:  "#2c3947",
        headerTitleStyle: { fontWeight: "600" },
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen
        name="Conversations"
        component={ConversationsScreen}
        options={{ headerTitle: () => <HeaderLogo /> }}
      />
      <Stack.Screen
        name="Chat"
        component={ChatScreen}
        options={{ title: "Chat" }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  logo: { width: 120, height: 40 },
});
