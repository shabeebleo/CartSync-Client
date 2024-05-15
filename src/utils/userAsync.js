import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


export const updateCartInUserCollection = createAsyncThunk(
  'user/updateCart',
  async ({ userId, cartItem }) => {
    try {
      // Make API call to update cart field in user collection
      const response = await axios.put(`your_api_endpoint/users/${userId}/cart`, cartItem);
      
      // Dispatch addToCart action to update cart slice locally
      return response.data; // Return response from API call if needed
    } catch (error) {
      throw error;
    }
  }
);
