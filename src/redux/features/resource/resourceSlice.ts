import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Resource } from "../../../types/workspace";
type InitialState = {
    resources: Record<number, Resource[]>;
};
const initialState: InitialState = {
    resources: {},
};

export const resourceSlice = createSlice({
    name: "resources",
    initialState,
    reducers: {
        setWorkspaceResources: (state, action: PayloadAction<Resource[]>) => {
            const resources = action.payload;
            console.log("resources slice, recieved resources: ", resources);
            if (resources.length > 0) {
                console.log("Adding resources to state");
                const workspaceId = resources[0].work_space_id
                state.resources[workspaceId] = resources;
            }
        },

    },
});

export const { setWorkspaceResources } = resourceSlice.actions;
export default resourceSlice.reducer;