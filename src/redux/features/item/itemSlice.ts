import { createSlice, PayloadAction } from "@reduxjs/toolkit";
type InitialState = {
    items: any[];
};
const initialState: InitialState = {
    items: [],
};

export const itemSlice = createSlice({
    name: "items",
    initialState,
    reducers: {
        setItems: (state, action: PayloadAction<any[]>) => {
            const items = action.payload;
            state.items = items;
        },

    },
});

export const { setItems } = itemSlice.actions;
export default itemSlice.reducer;