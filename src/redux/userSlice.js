const { createSlice } = require('@reduxjs/toolkit');

const initialState = null;

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action) => {
      return action.payload;
    },
    logout: () => {
      return null;
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
