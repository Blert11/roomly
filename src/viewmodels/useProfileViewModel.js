// Profile ViewModel (custom hook)
// Handles business logic for the profile screen

import { useState, useEffect } from "react";
import UserModel from "../models/UserModel";

const useProfileViewModel = () => {
  const [user, setUser] = useState(null);

  // Load user profile from the model on mount
  useEffect(() => {
    const profile = UserModel.getProfile();
    setUser(profile);
  }, []);

  return { user };
};

export default useProfileViewModel;
