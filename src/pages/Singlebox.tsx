import React, { useEffect, useState, useRef } from 'react';
import { useCreateItemMutation, useUpdateItemMutation, useRemoveItemMutation } from "../redux/features/item/itemApi";
import { useLazyGetSingleBoxQuery } from "../redux/features/box/boxApi";
import { useLazyGetSingleWorkspaceQuery } from "../redux/features/workspace/workspaceApi";
import { useDetect_boxes_namesMutation } from "../redux/features/detect/detectApi";
import { useParams, Link } from 'react-router-dom';
import ItemsClassifier from '../components/ItemsClassifier';
import appConfig from "../config";
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
    image: string; // Changed from 'iamge' to 'image'
    quantity: number;
    images: { id: number, url: string }[];
}

const SingleBox = () => {

    const TIME_DELAY_BETWEEN_CAPTURES = 500;
    let timeoutId: number | null = null;
    const { boxId, workspaceId } = useParams();
    const [getSingleBox, { data: singleBox, isLoading, isSuccess }] = useLazyGetSingleBoxQuery({});
    const [getSingleWorkspace, { data: singleWorkspace, isLoading: isWorkspaceLoading, isSuccess: isWorkspaceSuccess }] = useLazyGetSingleWorkspaceQuery({});
    const [createItem, { isLoading: isCreating }] = useCreateItemMutation();
    const [updateItem, { isLoading: isUpdating }] = useUpdateItemMutation();
    const [deleteItem, { isLoading: isDeleting }] = useRemoveItemMutation();
    const [modalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState<ActionType | null>(null);
    const [selectedItem, setSelectedItem] = useState<Item | null>(null);
    const [newItem, setNewItem] = useState({ name: '', description: '', box_id: boxId, quantity: 1, image: '', workspace_id: workspaceId });
    const [modalError, setModalError] = useState<string | null>(null);
    const [modalSuccess, setModalSuccess] = useState<string | null>(null);
    const [isLocating, setIsLocating] = useState(false);
    const [locatedBoxImage, setLocatedBoxImage] = useState<string | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [detectBoxesNames] = useDetect_boxes_namesMutation();
    const [showCameraFeed, setShowCameraFeed] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const openModal = (type: ActionType, item: Item | null = null) => {
        setModalType(type);
        setSelectedItem(item);
        setModalOpen(true);
        // Reset the error and success states
        setModalError(null);
        setModalSuccess(null);
        // Reset the newWorkspace state if it's a create action
        if (type === actionTypes.create) {
            setNewItem({ name: '', description: '', box_id: boxId, quantity: 1, image: '', workspace_id: workspaceId });
        } else if (type === actionTypes.edit && item) {
            setNewItem({ name: item.name, description: item.description, box_id: boxId, quantity: item.quantity, image: item.image, workspace_id: workspaceId });
        }
    };

    const closeModal = () => {
        setModalOpen(false);
        setModalType(null);
        setSelectedItem(null);
        setNewItem({ name: '', description: '', box_id: boxId, quantity: 1, image: '', workspace_id: workspaceId });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewItem(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                // Remove the "data:image/jpeg;base64," prefix
                const base64Data = base64String.replace(/^data:image\/\w+;base64,/, '');
                setNewItem(prev => ({ ...prev, image: base64Data }));
            };
            reader.readAsDataURL(file);
        }
    };

    const submitModal = () => {
        console.log(newItem);
        if (modalType === actionTypes.create) {
            createItem({ ...newItem, workspace: singleWorkspace?.name, box: singleBox?.name })
                .unwrap()
                .then(() => {
                    setModalSuccess('Item created successfully!');
                    getSingleBox(boxId);
                    setNewItem({ name: '', description: '', box_id: boxId, quantity: 1, image: '', workspace_id: workspaceId });
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

    const startLocating = () => {
        setIsLocating(true);
        setShowCameraFeed(true);
        navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
            .then(stream => {
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    videoRef.current.play();
                }
            })
            .catch(err => console.error("Error accessing camera:", err));
    };

    const stopLocating = () => {
        setIsLocating(false);
        setShowCameraFeed(false);
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
        if (videoRef.current && videoRef.current.srcObject) {
            const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
            tracks.forEach(track => track.stop());
        }
    };

    const captureAndLocate = async () => {
        if (isProcessing || !isLocating) return;
        setIsProcessing(true);

        if (videoRef.current && canvasRef.current) {
            const context = canvasRef.current.getContext('2d');
            if (context) {
                const { videoWidth, videoHeight } = videoRef.current;
                canvasRef.current.width = videoWidth;
                canvasRef.current.height = videoHeight;
                context.drawImage(videoRef.current, 0, 0, videoWidth, videoHeight);

                canvasRef.current.toBlob(async (blob) => {
                    if (blob) {
                        const formData = new FormData();
                        formData.append('file', blob, 'capture.jpg');
                        try {
                            const result = await detectBoxesNames(formData)
                            if ('data' in result && result.data?.boxes) {
                                const detectedBoxes = result.data.boxes;
                                const matchingBox = detectedBoxes[singleBox?.name];
                                if (matchingBox) {
                                    const [x1, y1] = matchingBox.bbox[0];
                                    const [x2, y2] = matchingBox.bbox[2];
                                    const centerX = (x1 + x2) / 2;
                                    const centerY = (y1 + y2) / 2;
                                    const radius = Math.min(x2 - x1, y2 - y1) / 2;

                                    context.beginPath();
                                    context.arc(centerX, centerY, radius, 0, 2 * Math.PI);
                                    context.strokeStyle = 'yellow';
                                    context.lineWidth = 6;
                                    context.stroke();

                                    if (canvasRef.current) {
                                        setLocatedBoxImage(canvasRef.current.toDataURL('image/jpeg'));
                                        stopLocating();
                                    }
                                }
                            }
                        }
                        catch (error) {
                            console.error("Error detecting boxes:", error);
                        } finally {
                            setIsProcessing(false);
                            if (isLocating) {
                                setTimeout(captureAndLocate, TIME_DELAY_BETWEEN_CAPTURES);
                            }
                        }
                        // .catch((error) => {
                        //     console.error("Error detecting boxes:", error);
                        // })
                        // .finally(() => {
                        //     setIsProcessing(false);
                        //     // Immediately start the next capture if still locating
                        //     if (isLocating) {
                        //         timeoutId = window.setTimeout(captureAndLocate, TIME_DELAY_BETWEEN_CAPTURES); // Adjust the delay as needed
                        //     }
                        // });
                    } else {
                        setIsProcessing(false);
                        if (isLocating) {
                            captureAndLocate();
                        }
                    }
                }, 'image/jpeg');
            } else {
                setIsProcessing(false);
                if (isLocating) {
                    captureAndLocate();
                }
            }
        } else {
            setIsProcessing(false);
            if (isLocating) {
                captureAndLocate();
            }
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        submitModal();
    };

    useEffect(() => {
        if (isLocating && !isProcessing) {
            captureAndLocate();
        }
        return () => {
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [isLocating]);

    useEffect(() => {
        getSingleBox(boxId);
        getSingleWorkspace(workspaceId);
    }, [boxId, workspaceId]);

    return (
        <div>
            <div>

                <h3 className='m-4 text-xl font-bold'>
                    <Link to="/workspaces" className='text-blue-500'>Workspaces</Link> /
                    <Link to={`/workspaces/${workspaceId}`} className='text-blue-500'>{singleWorkspace?.name}</Link> /
                    {singleBox?.name}
                </h3>
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ml-4"
                    onClick={isLocating ? stopLocating : startLocating}
                >
                    {isLocating ? 'Stop Locating' : 'Locate Box'}
                </button>
            </div>
            {isLocating && (
                <div className="camera-feed mt-4">
                    <h3 className="font-bold mb-2">Camera Feed:</h3>
                    <video
                        ref={videoRef}
                        style={{ display: showCameraFeed ? 'block' : 'none' }}
                        width="640"
                        height="480"
                        autoPlay
                        playsInline
                    />
                    <canvas
                        ref={canvasRef}
                        style={{ display: 'none' }}
                        width="640"
                        height="480"
                    />
                </div>
            )}
            {locatedBoxImage && (
                <div className="located-box-image mt-4">
                    <div className='flex  items-center mb-2'> <h3 className="font-bold">Located {singleBox?.name}: </h3> <button onClick={() => setLocatedBoxImage(null)} className='bg-red-500 text-white px-2 py-1 ml-2 rounded hover:bg-red-600'>Remove image</button></div>
                    <img src={locatedBoxImage} alt="Located Box" style={{ maxWidth: '100%', height: 'auto' }} />
                </div>
            )}
            <h1 className='mt-4 ml-4 text-2xl font-semibold '>Items in {singleBox?.name}</h1>
            <div className=" p-4">

                <ItemsClassifier box={singleBox} getSingleBox={getSingleBox} workspace={singleWorkspace} />
            </div>
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
                <div key={item.id} className="bg-white shadow-md rounded-lg p-1 mb-1">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center">
                            <Link to={`/workspaces/${workspaceId}/${singleBox.id}/${item.id}`} className="mx-2">
                                <h2 className="text-lg font-semibold">{item.name}</h2>
                            </Link>
                            {item.images.length > 0 && (
                                <img
                                    src={`${appConfig.BACKEND_URL}/${item.images[0].url}`}
                                    alt={item.name}
                                    className="w-12 h-12 object-contain rounded-md mr-4"
                                />
                            )}
                        </div>
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
                    {item.image && (
                        <img src={item.image} alt={item.name} className="mt-2 max-w-full h-auto" />
                    )}
                    <p className="mt-2 text-gray-600 ml-2">{item.description}</p>
                </div>
            ))}

            {/* Modal */}
            {modalOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <h3 className="text-lg font-semibold">
                            {modalType === 'create' ? 'Create New Item' :
                                modalType === 'edit' ? 'Edit Item' : 'Delete Item'}
                        </h3>
                        {modalType !== 'delete' ? (
                            <form onSubmit={handleSubmit}>
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
                                <div className="mt-2">
                                    <label className="block text-sm font-medium text-gray-700">Image</label>
                                    <input
                                        type="file"
                                        name="image"
                                        accept="image/*"
                                        capture="environment"
                                        onChange={handleFileChange}
                                        className="mt-1 block w-full text-sm text-gray-500
                                            file:mr-4 file:py-2 file:px-4
                                            file:rounded-full file:border-0
                                            file:text-sm file:font-semibold
                                            file:bg-blue-50 file:text-blue-700
                                            hover:file:bg-blue-100"
                                    />
                                </div>
                                {newItem.image && (
                                    <div className="mt-2">
                                        <img src={`data:image/png;base64,${newItem.image}`} alt="Preview" className="max-w-full h-auto" />
                                    </div>
                                )}
                            </form>
                        ) : (
                            <p>Are you sure you want to delete: {selectedItem?.name}?</p>
                        )}
                        <div className="mt-4">
                            <button
                                disabled={isCreating || isUpdating}
                                className={`${modalType === 'delete' ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
                                    } ${isCreating || isUpdating ? 'bg-gray-300 hover:bg-gray-400' : ''} text-white px-4 py-2 rounded mr-2`}
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
