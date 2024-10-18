import React, { useEffect, useState } from 'react';
import { useLazyGetSingleWorkspaceQuery } from "../redux/features/workspace/workspaceApi";
import { useCreateBoxMutation, useUpdateBoxMutation, useRemoveBoxMutation } from "../redux/features/box/boxApi";
import { useParams, Link } from 'react-router-dom';
import CameraDetector from '../components/CameraDetector';
import ResourceForm from '../components/ResourceForm';

const actionTypes = {
    create: 'create',
    edit: 'edit',
    delete: 'delete'
} as const;
type ActionType = typeof actionTypes[keyof typeof actionTypes];

type Box = {
    id: number;
    name: string;
    description: string;
    items: any[];
    work_space_id: string;

}

type Resource = {
    id: number;
    name: string;
    url: string;
};

const SingleWorkspace = () => {
    const { workspaceId } = useParams();
    const [getSingleWorkspace, { data: singleWorkspace, isLoading, isSuccess }] = useLazyGetSingleWorkspaceQuery({});
    const [createBox, { isLoading: isCreating }] = useCreateBoxMutation();
    const [updateBox, { isLoading: isUpdating }] = useUpdateBoxMutation();
    const [deleteBox, { isLoading: isDeleting }] = useRemoveBoxMutation();
    const [modalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState<ActionType | null>(null);
    const [selectedBox, setSelectedBox] = useState<Box | null>(null);
    const [newBox, setNewBox] = useState({ name: '', description: '', work_space_id: workspaceId });
    const [modalError, setModalError] = useState<string | null>(null);
    const [modalSuccess, setModalSuccess] = useState<string | null>(null);
    const [showResources, setShowResources] = useState(false);
    const [resources, setResources] = useState<Resource[]>([]);
    const [newResource, setNewResource] = useState({ name: '', url: '' });
    const [showResourceForm, setShowResourceForm] = useState(false);

    const openModal = (type: ActionType, box: Box | null = null) => {
        setModalType(type);
        setSelectedBox(box);
        setModalOpen(true);
        // Reset the error and success states
        setModalError(null);
        setModalSuccess(null);
        // Reset the newWorkspace state if it's a create action
        if (type === actionTypes.create) {
            setNewBox({ name: '', description: '', work_space_id: workspaceId });
        } else if (type === actionTypes.edit && box) {
            setNewBox({ name: box.name, description: box.description, work_space_id: workspaceId });
        }
    };

    const closeModal = () => {
        setModalOpen(false);
        setModalType(null);
        setSelectedBox(null);
        setNewBox({ name: '', description: '', work_space_id: workspaceId });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewBox(prev => ({ ...prev, [name]: value }));
    };

    const submitModal = (e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        console.log(newBox);
        if (modalType === actionTypes.create) {
            createBox(newBox)
                .unwrap()
                .then(() => {
                    setModalSuccess('Box created successfully!');
                    getSingleWorkspace(workspaceId);
                })
                .catch((err) => setModalError(`Error: ${err.message}`));
        } else if (modalType === actionTypes.edit && selectedBox) {
            updateBox({ id: selectedBox.id, data: newBox })
                .unwrap()
                .then(() => {
                    setModalSuccess('Box updated successfully!');
                    getSingleWorkspace(workspaceId);
                })
                .catch((err) => setModalError(`Error: ${err.message}`));
        } else if (modalType === actionTypes.delete && selectedBox) {
            deleteBox(selectedBox.id)
                .unwrap()
                .then(() => {
                    setModalSuccess('Box deleted successfully!');
                    getSingleWorkspace(workspaceId);
                })
                .catch((err) => setModalError(`Error: ${err.message}`));
        }
    };

    const toggleResources = () => {
        setShowResources(!showResources);
    };

    const handleResourceInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewResource(prev => ({ ...prev, [name]: value }));
    };

    const addResource = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const newId = resources.length > 0 ? Math.max(...resources.map(r => r.id)) + 1 : 1;
        setResources([...resources, { ...newResource, id: newId }]);
        setNewResource({ name: '', url: '' });
    };

    const deleteResource = (id: number) => {
        setResources(resources.filter(resource => resource.id !== id));
    };

    const toggleResourceForm = () => {
        setShowResourceForm(!showResourceForm);
    };

    const handleResourceAdded = () => {
        // Refetch resources or update state as needed
        getSingleWorkspace(workspaceId);
        setShowResourceForm(false);
    };

    // // Add this function to refetch the workspace data
    // const refetchWorkspace = useCallback(() => {
    //     if (workspaceId) {
    //         getSingleWorkspace(workspaceId);
    //     }
    // }, [workspaceId, getSingleWorkspace]);

    useEffect(() => {
        getSingleWorkspace(workspaceId);
    }, [workspaceId]);

    return (
        <div>
            <div>

                <h3 className='m-4 text-xl font-bold'><Link to="/workspaces" className='text-blue-500'>Workspaces</Link> / {singleWorkspace?.name}</h3>
                <button className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ml-4' onClick={toggleResources}>
                    {showResources ? 'Hide Resources' : 'Show Resources'}
                </button>
            </div>
            {/* Resources Section */}
            {showResources && (
                <div className="mt-4 ml-4 p-4 bg-gray-100 rounded-lg">
                    <h2 className="text-xl font-bold mb-4">Resources</h2>
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
                        onClick={toggleResourceForm}
                    >
                        {showResourceForm ? 'Hide Resource Form' : 'Add New Resource'}
                    </button>
                    {showResourceForm && (
                        <ResourceForm onResourceAdded={handleResourceAdded} />
                    )}
                    <ul>
                        {resources.map(resource => (
                            <li key={resource.id} className="flex justify-between items-center mb-2">
                                <a href={resource.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                    {resource.name}
                                </a>
                                <button
                                    onClick={() => deleteResource(resource.id)}
                                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                                >
                                    Delete
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            <h1 className='mt-4 ml-4 text-2xl font-bold'>Boxes in {singleWorkspace?.name}</h1>
            <div className=" p-4">

                <CameraDetector workspace={singleWorkspace} getSingleWorkspace={getSingleWorkspace} />
            </div>
            <div className="flex justify-between items-center p-4 mb-4">
                <h1 className="text-xl font-bold">Boxes</h1>
                <div>
                    <button
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                        onClick={() => openModal(actionTypes.create)}
                    >
                        Add New Box
                    </button>
                </div>
            </div>
            {isLoading && <p>Loading...</p>}
            {isSuccess && singleWorkspace.boxes.map((box: Box) => (
                <div key={box.id} className="bg-white shadow-md rounded-lg p-4 mb-4">
                    <div className="flex justify-between items-center">
                        <Link to={`/workspaces/${singleWorkspace.id}/${box.id}`}>
                            <h2 className="text-xl font-semibold">{box.name}</h2>
                        </Link>
                        <div>
                            <button
                                className="bg-blue-500 text-white px-3 py-1 rounded mr-2 hover:bg-blue-600"
                                onClick={() => openModal(actionTypes.edit, box)}
                            >
                                Edit
                            </button>
                            <button
                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                onClick={() => openModal(actionTypes.delete, box)}
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
                            <form onSubmit={(e) => submitModal(e)}>
                                <div className="mt-2">
                                    <label className="block text-sm font-medium text-gray-700">Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={newBox.name}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    />
                                </div>
                                <div className="mt-2">
                                    <label className="block text-sm font-medium text-gray-700">Description</label>
                                    <textarea
                                        name="description"
                                        value={newBox.description}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    />
                                </div>
                            </form>
                        ) : (
                            <p>Are you sure you want to delete: {selectedBox?.name}?</p>
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

export default SingleWorkspace;
