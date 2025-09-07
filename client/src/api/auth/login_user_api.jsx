import api from "../APIRequest";

export const login_user_api = async (email, password) => {
    try {
  
      // Make the POST request using the APIRequest class
      const response = await api.post('/user/login_user', {email, password});
  
      // Return the successful response
      return response.data;
    } catch (error) {
      console.error('Error login user:', error);
      // Re-throw the error for higher-level handling
      throw error;
    }
  };