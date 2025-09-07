import api from "../APIRequest";

export const update_user_phone_number_api = async (phone_number) => {
    try {
  
      // Make the POST request using the APIRequest class
      const response = await api.post('/user/update_user_phone_number', {phone_number});
  
      // Return the successful response
      console.log('update_user_phone_number response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error updating user:', error);
      // Re-throw the error for higher-level handling
      throw error;
    }
  };