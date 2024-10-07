import React, { useState, useRef, useEffect } from 'react';
import { useClassifyMutation } from "../redux/features/detect/detectApi";
import { useCreateItemMutation } from "../redux/features/item/itemApi";
import { Box, Workspace } from '../types/workspace';
import { Link } from 'react-router-dom';
import Modal from '../components/Modal'; // You'll need to create this component
import ImageSlider from '../components/ImageSlider'; // You'll need to create this component

type CameraDetectorProps = {
    box: Box;
    workspace: Workspace;
    getSingleBox: (id: number) => void;
}

const ItemsClassifier: React.FC<CameraDetectorProps> = ({ box, workspace, getSingleBox }: CameraDetectorProps) => {
    const [addItem, { isLoading: isAddingItem, isError: isAddingItemError, error: addingItemError }] = useCreateItemMutation();
    const [successAddingItem, setSuccessAddingItem] = useState<string | null>(null);
    const [isCapturing, setIsCapturing] = useState(false);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [classify, { isLoading, isError, error }] = useClassifyMutation();
    const [accumulatedResults, setAccumulatedResults] = useState<{ name: string, imgs: string[] }[]>([]);
    const streamRef = useRef<MediaStream | null>(null);
    const [selectedItem, setSelectedItem] = useState<{ name: string, imgs: string[] } | null>(null);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    useEffect(() => {
        let intervalId: number;

        const startVideo = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: 'environment' }
                });
                streamRef.current = stream;
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    videoRef.current.play();
                }
            } catch (err) {
                console.error("Error accessing camera:", err);
            }
        };

        const stopVideo = () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
                streamRef.current = null;
            }
        };

        const captureAndSend = () => {
            if (videoRef.current && canvasRef.current) {
                const context = canvasRef.current.getContext('2d');
                if (context) {
                    const { videoWidth, videoHeight } = videoRef.current;
                    canvasRef.current.width = videoWidth;
                    canvasRef.current.height = videoHeight;
                    context.drawImage(videoRef.current, 0, 0, videoWidth, videoHeight);
                    const imageDataUrl = canvasRef.current.toDataURL('image/jpeg');
                    setCapturedImage(imageDataUrl);

                    canvasRef.current.toBlob((blob) => {
                        if (blob) {
                            const formData = new FormData();
                            formData.append('file', blob, 'capture.jpg');
                            classify(formData).then((result) => {
                                if ('data' in result && result.data?.items) {
                                    const items = Object.entries(result.data.items).map(([name, values]) => ({ name, imgs: values?.images }));
                                    setAccumulatedResults(prevResults => {
                                        const updatedResults = [...prevResults];
                                        items.forEach(item => {
                                            const existingItemIndex = updatedResults.findIndex(r => r.name === item.name);
                                            if (existingItemIndex !== -1) {
                                                // Item exists, add new images
                                                updatedResults[existingItemIndex].imgs = [
                                                    ...new Set([...updatedResults[existingItemIndex].imgs, ...item.imgs])
                                                ];
                                            } else {
                                                // New item, add to results
                                                updatedResults.push(item);
                                            }
                                        });
                                        return updatedResults;
                                    });
                                }
                            });
                        }
                    }, 'image/jpeg');
                }
            }
        };

        if (isCapturing) {
            startVideo();
            intervalId = setInterval(captureAndSend, 2000);
        } else {
            stopVideo();
        }

        return () => {
            clearInterval(intervalId);
            stopVideo();
        };
    }, [isCapturing, classify]);

    const clearAccumulatedResults = () => {
        setAccumulatedResults([]);
    };

    const createItem = (item: { name: string, description: string }) => {
        addItem({ ...item, box_id: box.id, quantity: 1 }).then((result) => {
            if ('data' in result) {
                setSuccessAddingItem(item.name);
                getSingleBox(box.id);
            }
        })
    }

    const handleItemClick = (item: { name: string, imgs: string[] }) => {
        setSelectedItem(item);
    };

    const handleCloseModal = () => {
        setSelectedItem(null);
        setSelectedImageIndex(0);
    };

    const handleCreateItem = (name: string, description: string) => {
        createItem({ name, description });
        handleCloseModal();
    };

    const handleImageSelect = (index: number) => {
        setSelectedImageIndex(index);
        const imageElement = document.getElementById(`item-image-${index}`);
        if (imageElement) {
            imageElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    };

    return (
        <div className="camera-button-container">
            <div className="button-container">
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-2"
                    onClick={() => {
                        setSuccessAddingItem(null);
                        setIsCapturing(prev => !prev)
                    }}
                >
                    {isCapturing ? 'Stop Scanning' : 'Scan items'}
                </button>
                {accumulatedResults.length > 0 && <button
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    onClick={clearAccumulatedResults}
                >
                    Clear Results
                </button>}
            </div>
            {isCapturing && (
                <div className="camera-feed">
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        style={{ width: '100%', maxWidth: '400px', height: 'auto' }}
                    />
                    <canvas
                        ref={canvasRef}
                        style={{ display: 'none', width: '100%', maxWidth: '400px', height: 'auto' }}
                    />
                </div>
            )}
            {/* {capturedImage && (
                <div className="captured-image mt-4">
                    <h3 className="font-bold">Last Captured Image:</h3>
                    <img src={capturedImage} alt="Captured" style={{ width: '250px', height: '250px' }} />
                </div>
            )} */}
            {accumulatedResults.length > 0 && <div className="ocr-result mt-4">
                <h3 className="font-bold">OCR Results:</h3>
                {accumulatedResults.length > 0 && (
                    <div className="bg-gray-100 p-2 rounded mt-2 overflow-auto max-h-60">
                        {accumulatedResults.map(item => (
                            <div key={item.name} className="flex flex-col mb-4">
                                <div className="flex justify-between items-center mb-2">
                                    <p className="font-bold cursor-pointer" onClick={() => handleItemClick(item)}>{item.name}</p>
                                    {box.items.find(b => b.name === item.name) ?
                                        <Link to={`/workspaces/${workspace.id}/${box.id}/${box.items.find(b => b.name === item.name)?.id}`}>
                                            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Review</button>
                                        </Link>
                                        :
                                        <button onClick={() => handleItemClick(item)} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Add</button>
                                    }
                                </div>
                                <div className="overflow-x-auto whitespace-nowrap">
                                    {item.imgs.map((img, index) => (
                                        <img key={index} src={`data:image/png;base64,${img}`} alt={item.name} className="w-14 h-14 object-cover inline-block mr-2" />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                {successAddingItem && <p>Successfully added {successAddingItem}</p>}
                {isAddingItemError && <p>Error: {(addingItemError as any)?.data?.message || 'An error occurred'}</p>}
                {isAddingItem && <p>Adding box...</p>}
                {isError && <p>Error: {(error as any)?.data?.message || 'An error occurred'}</p>}
                {isLoading && <p>Processing...</p>}
            </div>}
            {selectedItem && (
                <Modal onClose={handleCloseModal}>
                    <div className="bg-white p-6 rounded-lg">
                        <h2 className="text-2xl font-bold mb-4">{selectedItem.name}</h2>
                        <div className="mb-4">
                            <ImageSlider images={selectedItem.imgs} selectedIndex={selectedImageIndex} onImageChange={handleImageSelect} />
                            {selectedItem.imgs.length > 1 && (
                                <div className="flex justify-center mt-2 flex-wrap">
                                    {selectedItem.imgs.map((img, index) => (
                                        <label key={index} className="mx-2">
                                            <input
                                                type="radio"
                                                name="selectedImage"
                                                value={index}
                                                checked={selectedImageIndex === index}
                                                onChange={() => handleImageSelect(index)}
                                                className="mr-1"
                                            />
                                            {/* Image {index + 1} */}
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            const form = e.target as HTMLFormElement;
                            const name = (form.elements.namedItem('name') as HTMLInputElement).value;
                            const description = (form.elements.namedItem('description') as HTMLTextAreaElement).value;
                            handleCreateItem(name, description);
                        }}>
                            <div className="mb-4">
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                                <input type="text" id="name" name="name" defaultValue={selectedItem.name} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" required />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                                <textarea id="description" name="description" rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"></textarea>
                            </div>
                            <button type="submit" className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Add Item</button>
                        </form>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default ItemsClassifier;