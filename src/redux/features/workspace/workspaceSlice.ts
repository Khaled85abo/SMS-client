import { createSlice, PayloadAction } from "@reduxjs/toolkit";
type InitialState = {
    workspaces: any[];
};
const initialState: InitialState = {
    workspaces: [],
};

export const workspaceSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setWorkspaces: (state, action: PayloadAction<any[]>) => {
            const workspaces = action.payload;
            state.workspaces = workspaces;
        },

    },
});

export const { setWorkspaces } = workspaceSlice.actions;
export default workspaceSlice.reducer;
