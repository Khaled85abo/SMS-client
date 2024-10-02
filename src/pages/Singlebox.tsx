import React, { useEffect, useState } from 'react';
import { useCreateItemMutation, useUpdateItemMutation, useRemoveItemMutation } from "../redux/features/item/itemApi";
import { useLazyGetSingleBoxQuery } from "../redux/features/box/boxApi";
import { useLazyGetSingleWorkspaceQuery } from "../redux/features/workspace/workspaceApi";
import { useParams, Link } from 'react-router-dom';

const actionTypes = {
    create: 'create',
    edit: 'edit',
    delete: 'delete',
    setStatus: 'setStatus'
} as const;
type ActionType = typeof actionTypes[keyof typeof actionTypes];

const itemStatus = {
    available: 'available',
    rented: 'rented',
    sold: 'sold',
    lost: 'lost',
    damaged: 'damaged',
    other: 'other'
} as const;
type ItemStatus = typeof itemStatus[keyof typeof itemStatus];

type Item = {
    id: number;
    name: string;
    description: string;
    status: ItemStatus;
    box_id: string;
    iamge: string;
    quantity: number;

}

const SingleBox = () => {
    const { boxId, workspaceId } = useParams();
    const [getSingleBox, { data: singleBox, isLoading, isSuccess }] = useLazyGetSingleBoxQuery({});
    const [getSingleWorkspace, { data: singleWorkspace, isLoading: isWorkspaceLoading, isSuccess: isWorkspaceSuccess }] = useLazyGetSingleWorkspaceQuery({});
    const [createItem, { isLoading: isCreating }] = useCreateItemMutation();
    const [updateItem, { isLoading: isUpdating }] = useUpdateItemMutation();
    const [deleteItem, { isLoading: isDeleting }] = useRemoveItemMutation();
    const [modalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState<ActionType | null>(null);
    const [selectedItem, setSelectedItem] = useState<Item | null>(null);
    const [newItem, setNewItem] = useState({ name: '', description: '', box_id: boxId, quantity: 1 });
    const [modalError, setModalError] = useState<string | null>(null);
    const [modalSuccess, setModalSuccess] = useState<string | null>(null);

    const openModal = (type: ActionType, item: Item | null = null) => {
        setModalType(type);
        setSelectedItem(item);
        setModalOpen(true);
        // Reset the error and success states
        setModalError(null);
        setModalSuccess(null);
        // Reset the newWorkspace state if it's a create action
        if (type === actionTypes.create) {
            setNewItem({ name: '', description: '', box_id: boxId, quantity: 1 });
        } else if (type === actionTypes.edit && item) {
            setNewItem({ name: item.name, description: item.description, box_id: boxId, quantity: item.quantity });
        }
    };

    const closeModal = () => {
        setModalOpen(false);
        setModalType(null);
        setSelectedItem(null);
        setNewItem({ name: '', description: '', box_id: boxId, quantity: 1 });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewItem(prev => ({ ...prev, [name]: value }));
    };

    const submitModal = () => {
        console.log(newItem);
        if (modalType === actionTypes.create) {
            createItem(newItem)
                .unwrap()
                .then(() => {
                    setModalSuccess('Box created successfully!');
                    getSingleBox(boxId);
                })
                .catch((err) => setModalError(`Error: ${err.message}`));
        } else if (modalType === actionTypes.edit && selectedItem) {
            updateItem({ id: selectedItem.id, data: newItem })
                .unwrap()
                .then(() => {
                    setModalSuccess('Box updated successfully!');
                    getSingleBox(boxId);
                })
                .catch((err) => setModalError(`Error: ${err.message}`));
        } else if (modalType === actionTypes.delete && selectedItem) {
            deleteItem(selectedItem.id)
                .unwrap()
                .then(() => {
                    setModalSuccess('Box deleted successfully!');
                    getSingleBox(boxId);
                })
                .catch((err) => setModalError(`Error: ${err.message}`));
        }
    };

    // // Add this function to refetch the workspace data
    // const refetchWorkspace = useCallback(() => {
    //     if (workspaceId) {
    //         getSingleWorkspace(workspaceId);
    //     }
    // }, [workspaceId, getSingleWorkspace]);

    useEffect(() => {
        getSingleBox(boxId);
        getSingleWorkspace(workspaceId);
    }, [boxId, workspaceId]);

    return (
        <div>
            <h3 className='m-4 text-xl font-bold'><Link to="/workspaces" className='text-blue-500'>Workspaces</Link> / <Link to={`/workspaces/${workspaceId}`} className='text-blue-500'>{singleWorkspace?.name}</Link></h3>
            <h1 className='mt-4 ml-4 text-2xl font-semibold '>Items of {singleBox?.name}</h1>
            <div className="flex justify-between items-center p-4 mb-4">
                <h1 className="text-xl font-semibold">Items</h1>
                <button
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    onClick={() => openModal(actionTypes.create)}
                >
                    Add New Item
                </button>
            </div>
            {isLoading && <p>Loading...</p>}
            {isSuccess && singleBox.items.map((item: Item) => (
                <div key={item.id} className="bg-white shadow-md rounded-lg p-4 mb-4">
                    <div className="flex justify-between items-center">
                        <Link to={`/workspaces/${singleWorkspace.id}/${item.id}`}>
                            <h2 className="text-xl font-semibold">{item.name}</h2>
                        </Link>
                        <div>
                            <button
                                className="bg-blue-500 text-white px-3 py-1 rounded mr-2 hover:bg-blue-600"
                                onClick={() => openModal(actionTypes.edit, item)}
                            >
                                Edit
                            </button>
                            <button
                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                onClick={() => openModal(actionTypes.delete, item)}
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
                            {modalType === 'create' ? 'Create New Item' :
                                modalType === 'edit' ? 'Edit Item' : 'Delete Item'}
                        </h3>
                        {modalType !== 'delete' ? (
                            <form>
                                <div className="mt-2">
                                    <label className="block text-sm font-medium text-gray-700">Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={newItem.name}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    />
                                </div>
                                <div className="mt-2">
                                    <label className="block text-sm font-medium text-gray-700">Description</label>
                                    <textarea
                                        name="description"
                                        value={newItem.description}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    />
                                </div>
                            </form>
                        ) : (
                            <p>Are you sure you want to delete: {selectedItem?.name}?</p>
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

export default SingleBox;