const { createSlice } = require("@reduxjs/toolkit");

const initialState = [];

const allProfilesSlice = createSlice({
    name: "allProfiles",
    initialState,
    reducers: {
        addProfile: (state, action) => {
            return [...state, action.payload]
        },
        removeProfile: (state, action) => {
            const newProfiles = state?.filter((profile) => profile.uid != action.payload);
            return newProfiles;
        },
        setProfile: (state, action) => {
            return action.payload ;
        }
    }

})

export default allProfilesSlice.reducer;
export const { addProfile, removeProfile, setProfile } = allProfilesSlice.actions;