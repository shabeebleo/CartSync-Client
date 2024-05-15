import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
        console.log("action.payload:",action.payload);
      state.user = action.payload;
    },
  },
});

export const selectUser = (state) => state.user.user;

export const { setUser } = userSlice.actions;

export default userSlice.reducer;
