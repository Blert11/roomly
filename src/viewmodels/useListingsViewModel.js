// Listings ViewModel (custom hook)
// Handles business logic for the listings screen
// The View (screen) only calls this hook and renders the data

import { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import ListingModel from "../models/ListingModel";

const useListingsViewModel = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  // Load listings from the model on mount
  useEffect(() => {
    const data = ListingModel.getAll();
    setListings(data);
    setLoading(false);
  }, []);

  // Handle card press - navigate to details
  const onListingPress = (listing) => {
    navigation.navigate("Details", { listing });
  };

  return { listings, loading, onListingPress };
};

export default useListingsViewModel;
