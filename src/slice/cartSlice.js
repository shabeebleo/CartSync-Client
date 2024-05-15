import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const getCartItemsFromLocalStorage = () => {
  const userString = localStorage.getItem("user");
  const user = JSON.parse(userString);

  console.log("user:", user); // Log user information for debugging

  // If user exists in localStorage, retrieve cart items from there
  if (user) {
    const newCartItems = localStorage.getItem("cartItems");
    const updatedCartItems = JSON.parse(newCartItems) || []; // Use default empty array

    console.log("newCartItems:", newCartItems); // Log retrieved cart items

    return updatedCartItems; // Return cart items from localStorage
  }

  // If no user or cart items in localStorage, use the initialCartValues function
  return initializeCartValues(); // Call the function to get initial values
};

const initializeCartValues = () => {
  return []; // Return an empty array
};

const initialState = {
  cartItems: getCartItemsFromLocalStorage(),
  totalPrice: 0,
};

// add a new item to cart by user
export const addItemToCart = createAsyncThunk(
  "cart/addItemToCart",
  async ({ productId, quantity, token }, { dispatch }) => {
    console.log(quantity, "quantity in");
    try {
      // Make API call to add item to cart in the database
      const response = await axios.post(
        "http://localhost:5050/users/cart/add",
        { productId, quantity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response, "in cart slice");
      // Dispatch action to update quantity in local state
      dispatch(addToCartSuccess({ productId, quantity }));
      return response.data;
    } catch (error) {
      console.log(error);
      // alert(error.response.data.message)
      console.log(error.response.data.message, "error in addItemToCart");
      throw error;
    }
  }
);

//to update the quantity of a product that is already in the cart by user
export const updateQuantityInCart = createAsyncThunk(
  "cart/updateQuantity",
  async ({ productId, quantity, token }, { dispatch }) => {
    console.log(
      "updateQuantityInCart:",
      productId,
      "productId",
      quantity,
      "quantity",
      token,
      "tokennnnnnn"
    );
    try {
      // Make API call to update quantity of item in cart
      const response = await axios.put(
        `http://localhost:5050/users/cart/${productId}/${quantity}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(
        response,
        "response after updateQuantityInCart",
        productId,
        quantity
      );
      // Dispatch updateQuantity action to update local state

      dispatch(updateQuantity({ productId, quantity }));

      // Return the product ID and quantity to indicate successful update
      return response;
    } catch (error) {
      console.log(error, "errorerror");
      alert(error.response.data.message);
      console.log(error.response.data.message, "error in updateQuantityInCart");
      throw error;
    }
  }
);

export const deleteCartItem = createAsyncThunk(
    "cart/deleteItem",
    async ({ productId, token }, { dispatch }) => {
      try {
        // Make API call to delete the item from the user's cart
        const response = await axios.delete(
          `http://localhost:5050/users/cart/${productId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Include authorization token
            },
          }
        );
  
        // Dispatch action to update local cart state (optional)
        dispatch(removeItemFromCart(productId)); // Replace with your action name
  
        // Return the deleted product ID or any relevant response data
        return response.data; // Adjust based on your API response format
      } catch (error) {
        console.error("Error deleting cart item:", error);
        throw error; // Re-throw the error for handling in your component
      }
    }
  );

//for make changes in the cart of a particular user by admin
export const updateCartInUserCollection = createAsyncThunk(
  "user/updateCart",
  async ({ userId, cartItem }, { dispatch }) => {
    try {
      // Make API call to update cart field in user collection
      const response = await axios.put(
        `http://localhost:5050/users/${userId}/cart`,
        cartItem
      );

      // Dispatch addItemToCart action to update cart slice locally
      dispatch(addItemToCart(cartItem));

      // Return response from API call if needed
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

export const clearUserCart = createAsyncThunk(
  "cart/clearUserCart",
  async (userId) => {
    try {
      // Make API call to clear the cart
      await axios.delete(`http://localhost:5050/users/cart/clear/${userId}`);

      // Return the userId to indicate successful clearing of the cart
      return userId;
    } catch (error) {
      throw error;
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCartSuccess: (state, action) => {
      // Add item to cart in local state
      const { productId, quantity } = action.payload;
      console.log(productId, quantity, "productId, quantity");
      console.log(" state.cartItems:", state.cartItems);
      const item = state.cartItems?.find(
        (item) => item.productId === productId
      );
      if (item) {
        console.log("item in addtocart quantity", item);
        item.quantity = quantity;
      } else {
        console.log("else");
        state.cartItems?.push(action.payload);
      }
    },

    updateQuantity: (state, action) => {
      // Update quantity of an item in cart
      console.log(action.payload, "updateQuantity reducer");
      const { productId, quantity } = action.payload;
      const item = state.cartItems?.find(
        (item) => item.productId === productId
      );
      if (item) {
        console.log("item in update quantity", item);
        state.totalPrice -= item.price * item.quantity; // Subtract old item price
        item.quantity = quantity;
        state.totalPrice += item.price * quantity; // Add new item price
      }
    },

    clearCartItems: (state) => {
      // Clear cart
      state.cartItems = [];
      state.totalPrice = 0;
    },
    initializeCartAfterLogin: (state, action) => {
      console.log("action.payloadaction.payload : ", action.payload);
      //   const { cartItems, totalPrice } = action.payload;
      state.cartItems = action.payload;
      //   state.totalPrice = 0;
    },
    removeItemFromCart: (state, action) => {
        const { productId } = action.payload;
  
        // Find the item to remove
        const itemIndex = state.cartItems?.findIndex(
          (item) => item.productId === productId
        );
  
        // If item found, remove it from the cart
        if (itemIndex !== -1) {
          state.cartItems.splice(itemIndex, 1);
        }
      },
  },
});

export const selectCartItems = (state) => state.cart.cartItems;
export const selectTotalPrice = (state) => state.cart.totalPrice;

export const {
  addToCartSuccess,
  initializeCartAfterLogin,
  updateQuantity,
  clearCartItems,
  removeItemFromCart
} = cartSlice.actions;

export default cartSlice.reducer;
