import api from "../APIRequest";

export const register_user_api = async (name, email, password) => {
    try {
  
      // Make the POST request using the APIRequest class
      const response = await api.post('/user/create_user', {name, email, password});
  
      // Return the successful response
      return response.data;
    } catch (error) {
      console.error('Error creating user:', error);
      // Re-throw the error for higher-level handling
      throw error;
    }
  };