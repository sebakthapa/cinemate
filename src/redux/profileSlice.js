
const { createSlice } = require("@reduxjs/toolkit");

const initialState = null;

const profileSlice = createSlice({
    name: "profile",
    initialState,
    reducers: {
        loginProfile: (state, action) => {
            return action.payload;
        },
        logoutProfile: (state, action) => {
            return null;
        }
    }

})


export const { loginProfile, logoutProfile } = profileSlice.actions;
export default profileSlice.reducer;