// Details ViewModel (custom hook)
// Handles business logic for the details screen

import { Alert } from "react-native";

const useDetailsViewModel = (route) => {
  // Get the listing data from navigation params
  const listing = route.params?.listing;

  // Handle contact button press
  const onContactPress = () => {
    Alert.alert("Contact Owner", "This feature is coming soon!");
  };

  return { listing, onContactPress };
};

export default useDetailsViewModel;
