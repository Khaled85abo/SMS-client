import React, { useState } from 'react';
import { useGetWorkspacesQuery } from "../redux/features/workspace/workspaceApi";

const Workspaces = () => {
    const { data, isLoading, isSuccess, isError, error } = useGetWorkspacesQuery({});
    const [modalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState('');
    const [selectedWorkspace, setSelectedWorkspace] = useState(null);
    const [newWorkspace, setNewWorkspace] = useState({ name: '', description: '' });


    const openModal = (type, workspace = null) => {
        setModalType(type);
        setSelectedWorkspace(workspace);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setModalType('');
        setSelectedWorkspace(null);
        setNewWorkspace({ name: '', description: '' });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewWorkspace(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div>
            <h1 className='mt-4 ml-4 text-2xl font-bold'>Workspaces</h1>
            <div className="flex justify-between items-center p-4 mb-4">
                <h1 className="text-xl font-bold">Workspaces</h1>
                <button
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    onClick={() => openModal('create')}
                >
                    Add New Workspace
                </button>
            </div>
            {isLoading && <p>Loading...</p>}
            {isSuccess && data.map((workspace) => (
                <div key={workspace.id} className="bg-white shadow-md rounded-lg p-4 mb-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold">{workspace.name}</h2>
                        <div>
                            <button
                                className="bg-blue-500 text-white px-3 py-1 rounded mr-2 hover:bg-blue-600"
                                onClick={() => openModal("edit")}
                            >
                                Edit
                            </button>
                            <button
                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                onClick={() => openModal("delete")}
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
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
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
                                        value={modalType === 'create' ? newWorkspace.name : selectedWorkspace?.name}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    />
                                </div>
                                <div className="mt-2">
                                    <label className="block text-sm font-medium text-gray-700">Description</label>
                                    <textarea
                                        name="description"
                                        value={modalType === 'create' ? newWorkspace.description : selectedWorkspace?.description}
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
                                onClick={closeModal}
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
                    </div>
                </div>
            )}


        </div>
    );
}

export default Workspaces;