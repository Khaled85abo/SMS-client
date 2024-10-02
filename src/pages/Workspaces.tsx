import React, { useState } from 'react';
import { useGetWorkspacesQuery, useCreateWorkspaceMutation, useUpdateWorkspaceMutation, useRemoveWorkspaceMutation } from "../redux/features/workspace/workspaceApi";

const actionTypes = {
    create: 'create',
    edit: 'edit',
    delete: 'delete'
} as const;
type ActionType = typeof actionTypes[keyof typeof actionTypes];

type Workspace = {
    id: string;
    name: string;
    description: string;

}

const Workspaces = () => {
    const { data, isLoading, isSuccess, isError, error } = useGetWorkspacesQuery({});
    const [createWorkspace, { isLoading: isCreating, isSuccess: isCreateSuccess, isError: isCreateError, error: createError }] = useCreateWorkspaceMutation();
    const [updateWorkspace, { isLoading: isUpdating, isSuccess: isUpdateSuccess, isError: isUpdateError, error: updateError }] = useUpdateWorkspaceMutation();
    const [deleteWorkspace, { isLoading: isDeleting, isSuccess: isDeleteSuccess, isError: isDeleteError, error: deleteError }] = useRemoveWorkspaceMutation();
    const [modalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState<ActionType | null>(null);
    const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(null);
    const [newWorkspace, setNewWorkspace] = useState({ name: '', description: '' });
    const [modalError, setModalError] = useState<string | null>(null);
    const [modalSuccess, setModalSuccess] = useState<string | null>(null);

    const openModal = (type: ActionType, workspace: Workspace | null = null) => {
        setModalType(type);
        setSelectedWorkspace(workspace);
        setModalOpen(true);
        // Reset the error and success states
        setModalError(null);
        setModalSuccess(null);
        // Reset the newWorkspace state if it's a create action
        if (type === actionTypes.create) {
            setNewWorkspace({ name: '', description: '' });
        } else if (type === actionTypes.edit && workspace) {
            setNewWorkspace({ name: workspace.name, description: workspace.description });
        }
    };

    const closeModal = () => {
        setModalOpen(false);
        setModalType(null);
        setSelectedWorkspace(null);
        setNewWorkspace({ name: '', description: '' });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewWorkspace(prev => ({ ...prev, [name]: value }));
    };

    const submitModal = () => {
        if (modalType === actionTypes.create) {
            createWorkspace(newWorkspace)
                .unwrap()
                .then(() => setModalSuccess('Workspace created successfully!'))
                .catch((err) => setModalError(`Error: ${err.message}`));
        } else if (modalType === actionTypes.edit && selectedWorkspace) {
            updateWorkspace({ id: selectedWorkspace.id, data: newWorkspace })
                .unwrap()
                .then(() => setModalSuccess('Workspace updated successfully!'))
                .catch((err) => setModalError(`Error: ${err.message}`));
        } else if (modalType === actionTypes.delete && selectedWorkspace) {
            deleteWorkspace(selectedWorkspace.id)
                .unwrap()
                .then(() => setModalSuccess('Workspace deleted successfully!'))
                .catch((err) => setModalError(`Error: ${err.message}`));
        }
    };
    return (
        <div>
            <h1 className='mt-4 ml-4 text-2xl font-bold'>Workspaces</h1>
            <div className="flex justify-between items-center p-4 mb-4">
                <h1 className="text-xl font-bold">Workspaces</h1>
                <button
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    onClick={() => openModal(actionTypes.create)}
                >
                    Add New Workspace
                </button>
            </div>
            {isLoading && <p>Loading...</p>}
            {isSuccess && data.map((workspace: Workspace) => (
                <div key={workspace.id} className="bg-white shadow-md rounded-lg p-4 mb-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold">{workspace.name}</h2>
                        <div>
                            <button
                                className="bg-blue-500 text-white px-3 py-1 rounded mr-2 hover:bg-blue-600"
                                onClick={() => openModal(actionTypes.edit, workspace)}
                            >
                                Edit
                            </button>
                            <button
                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                onClick={() => openModal(actionTypes.delete, workspace)}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                    {/* <p className="mt-2 text-gray-600">{workspace.description}</p> */}
                </div>
            ))}

            {/* Modal */}
            {modalOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto  h-full w-full">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <h3 className="text-lg font-semibold">
                            {modalType === 'create' ? 'Create New Workspace' :
                                modalType === 'edit' ? 'Edit Workspace' : 'Delete Workspace'}
                        </h3>
                        {modalType !== 'delete' ? (
                            <form>
                                <div className="mt-2">
                                    <label className="block text-sm font-medium text-gray-700">Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={newWorkspace.name}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    />
                                </div>
                                <div className="mt-2">
                                    <label className="block text-sm font-medium text-gray-700">Description</label>
                                    <textarea
                                        name="description"
                                        value={newWorkspace.description}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    />
                                </div>
                            </form>
                        ) : (
                            <p>Are you sure you want to delete: {selectedWorkspace?.name}?</p>
                        )}
                        <div className="mt-4">
                            <button
                                className={`${modalType === 'delete' ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
                                    } text-white px-4 py-2 rounded mr-2`}
                                onClick={submitModal}
                            >
                                {modalType === 'create' ? 'Create' : modalType === 'edit' ? 'Save' : 'Delete'}
                            </button>
                            <button
                                className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
                                onClick={closeModal}
                            >
                                Cancel
                            </button>
                        </div>
                        {/* New div for loading, error, or success messages */}
                        <div className="mt-4">
                            {(isCreating || isUpdating || isDeleting) && (
                                <p className="text-blue-500">Loading...</p>
                            )}
                            {modalError && (
                                <p className="text-red-500">{modalError}</p>
                            )}
                            {modalSuccess && (
                                <p className="text-green-500">{modalSuccess}</p>
                            )}
                        </div>
                    </div>
                </div>
            )}


        </div>
    );
}

export default Workspaces;