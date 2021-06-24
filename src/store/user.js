import { createSlice } from "@reduxjs/toolkit";

const initialUserState = {
    currentUser: null,
};
const userSlice = createSlice({
    name: 'currentUser',
    initialState: initialUserState,
    reducers: {
        setUser(state, action) {
            state.currentUser = action.payload;
        },
    },
});
export const userActions = userSlice.actions;

export default userSlice.reducer;