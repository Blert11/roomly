// Home ViewModel (custom hook)
// Handles business logic for the home screen

import { useNavigation } from "@react-navigation/native";

const useHomeViewModel = () => {
  const navigation = useNavigation();

  // Navigate to listings tab
  const onBrowsePress = () => {
    navigation.navigate("ListingsTab");
  };

  return { onBrowsePress };
};

export default useHomeViewModel;
