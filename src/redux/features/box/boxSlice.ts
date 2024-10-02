import { createSlice, PayloadAction } from "@reduxjs/toolkit";
type InitialState = {
    boxes: any[];
};
const initialState: InitialState = {
    boxes: [],
};

export const boxSlice = createSlice({
    name: "workspace",
    initialState,
    reducers: {
        setBoxes: (state, action: PayloadAction<any[]>) => {
            const boxes = action.payload;
            state.boxes = boxes;
        },

    },
});

export const { setBoxes } = boxSlice.actions;
export default boxSlice.reducer;