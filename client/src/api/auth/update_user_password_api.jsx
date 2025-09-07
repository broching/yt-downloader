import api from "../APIRequest";

export const update_user_password_api = async (currentPassword, newPassword) => {
    try {
  
      // Make the POST request using the APIRequest class
      const response = await api.post('/user/update_user_password', {currentPassword, newPassword});
  
      // Return the successful response
      console.log('update_user_password_api response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error updating user:', error);
      // Re-throw the error for higher-level handling
      throw error;
    }
  };