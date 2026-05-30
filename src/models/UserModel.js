// User Model
// Defines the structure and mock data for user profile
// In a real app, this would come from authentication / API

const UserModel = {
  // Get the current user's profile
  getProfile: () => {
    return {
      name: "John Doe",
      email: "johndoe@email.com",
    };
  },
};

export default UserModel;
