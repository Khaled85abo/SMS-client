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
        // This is not being used anymore, the resources are being fetched from the workspaceApi
        setWorkspaceResources: (state, action: PayloadAction<Resource[]>) => {
            const resources = action.payload;
            console.log("resources slice, recieved resources: ", resources);
            // This has a major issue as the last element being deleted from a workspace, the list will not be updated to [] as there is no resource to get the workspaceId from
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